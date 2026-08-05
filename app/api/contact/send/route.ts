import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { reason, context, conversation, details } = await request.json();

  const contextLines = Object.entries((context ?? {}) as Record<string, string>)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#888;font-size:13px;white-space:nowrap">${k}</td><td style="padding:4px 0;font-size:13px;color:#111">${v}</td></tr>`)
    .join("");

  const chatLines = ((conversation ?? []) as { role: string; content: string }[])
    .map(m => {
      const isUser = m.role === "user";
      return `<div style="margin-bottom:12px;text-align:${isUser ? "right" : "left"}">
        <span style="display:inline-block;background:${isUser ? "#111" : "#F0F0F0"};color:${isUser ? "#fff" : "#111"};padding:10px 14px;border-radius:16px;font-size:14px;line-height:1.55;max-width:80%">${m.content}</span>
      </div>`;
    })
    .join("");

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
    await resend.emails.send({
      from: "Milk Contact <noreply@milk.design>",
      to: ["cooper@milk.design", "stecoopbren@gmail.com"],
      replyTo: details?.email,
      subject: `${details?.name ?? "Someone"} reached out — ${reason ?? "inquiry"}`,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
