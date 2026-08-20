import Anthropic from "@anthropic-ai/sdk";
import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";

async function generateSuggestedReply(
  reason: string,
  context: Record<string, string>,
  conversation: { role: string; content: string }[],
  details: { name?: string; email?: string; company?: string }
): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) return "";
  try {
    const client = new Anthropic();
    const contextStr = Object.entries(context ?? {}).map(([k, v]) => `${k}: ${v}`).join(", ");
    const chatStr = conversation.map(m => `${m.role === "user" ? details.name ?? "Them" : "You"}: ${m.content}`).join("\n");

    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [{
        role: "user",
        content: `You ARE Steven Cooper (Coop), a design leader in Costa Rica who runs Milk Design Studio. Draft a short, warm, personal reply email to ${details.name ?? "this person"} (${details.email}) who reached out about: ${reason}. Context: ${contextStr}. Conversation: ${chatStr}. Write 2-3 sentences max, in first person, no em dashes, no corporate language. Just the reply body — no subject line, no greeting prefix, no sign-off. Sound like you typed it yourself.`,
      }],
    });
    return msg.content[0].type === "text" ? msg.content[0].text.trim() : "";
  } catch {
    return "";
  }
}

export async function POST(request: NextRequest) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return NextResponse.json({ ok: false, error: "Email not configured" }, { status: 503 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const { reason, context, conversation, details } = await request.json();

  const [suggestedReply, contextLines, chatLines] = await Promise.all([
    generateSuggestedReply(
      reason ?? "",
      context ?? {},
      conversation ?? [],
      details ?? {}
    ),
    Promise.resolve(
      Object.entries((context ?? {}) as Record<string, string>)
        .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#888;font-size:13px;white-space:nowrap">${k}</td><td style="padding:4px 0;font-size:13px;color:#111">${v}</td></tr>`)
        .join("")
    ),
    Promise.resolve(
      ((conversation ?? []) as { role: string; content: string }[])
        .map(m => {
          const isUser = m.role === "user";
          return `<div style="margin-bottom:12px;text-align:${isUser ? "right" : "left"}">
            <span style="display:inline-block;background:${isUser ? "#111" : "#F0F0F0"};color:${isUser ? "#fff" : "#111"};padding:10px 14px;border-radius:16px;font-size:14px;line-height:1.55;max-width:80%">${m.content}</span>
          </div>`;
        })
        .join("")
    ),
  ]);

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'DM Sans',sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#FAFAFA;color:#111">
      <p style="font-size:22px;font-weight:600;margin:0 0 4px">New inquiry via milk.design</p>
      <p style="font-size:14px;color:#888;margin:0 0 28px">${new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}</p>

      <table style="margin-bottom:28px;border-collapse:collapse">
        <tr><td style="padding:4px 12px 4px 0;color:#888;font-size:13px;white-space:nowrap">Name</td><td style="padding:4px 0;font-size:13px;color:#111">${details?.name ?? "—"}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#888;font-size:13px;white-space:nowrap">Email</td><td style="padding:4px 0;font-size:13px;color:#111"><a href="mailto:${details?.email}" style="color:#111">${details?.email ?? "—"}</a></td></tr>
        ${details?.phone ? `<tr><td style="padding:4px 12px 4px 0;color:#888;font-size:13px;white-space:nowrap">Phone</td><td style="padding:4px 0;font-size:13px;color:#111">${details.phone}</td></tr>` : ""}
        ${details?.company ? `<tr><td style="padding:4px 12px 4px 0;color:#888;font-size:13px;white-space:nowrap">Company</td><td style="padding:4px 0;font-size:13px;color:#111">${details.company}</td></tr>` : ""}
        <tr><td style="padding:4px 12px 4px 0;color:#888;font-size:13px;white-space:nowrap">Reason</td><td style="padding:4px 0;font-size:13px;color:#111">${reason ?? "—"}</td></tr>
        ${contextLines}
      </table>

      ${suggestedReply ? `
        <p style="font-size:12px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;color:#888;margin:0 0 12px">Suggested reply</p>
        <div style="background:#111;border-radius:16px;padding:20px;margin-bottom:28px">
          <p style="font-size:14px;line-height:1.65;color:#fff;margin:0;white-space:pre-wrap">${suggestedReply}</p>
        </div>
      ` : ""}

      ${chatLines ? `
        <p style="font-size:12px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;color:#888;margin:0 0 12px">Conversation</p>
        <div style="background:white;border-radius:16px;padding:20px;margin-bottom:28px;border:1px solid #E8E8E8">
          ${chatLines}
        </div>
      ` : ""}

      <p style="font-size:12px;color:#bbb;margin:0">Sent from the contact form at milk.design</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Milk Contact" <${process.env.GMAIL_USER}>`,
      to: ["cooper@milk.design", "stecoopbren@gmail.com"],
      replyTo: details?.email,
      subject: `${details?.name ?? "Someone"} reached out — ${reason ?? "inquiry"}`,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Nodemailer error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
