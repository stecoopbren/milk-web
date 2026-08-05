import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';

const client = new Anthropic();

export async function POST(request: NextRequest) {
  const { messages, reason, context, isInitial } = await request.json();

  const contextStr = Object.entries((context ?? {}) as Record<string, string>)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ');

  const system = `You ARE Steven Cooper (Coop) — a design leader based in Costa Rica who runs Milk Design Studio. You help teams navigate uncertainty and build what gets them there. You are writing personally, in first person, as yourself. Never refer to yourself in the third person or mention "Milk Design Studio" as if it's separate from you.

Someone is reaching out about: "${reason}"${contextStr ? `\nQuick context they shared: ${contextStr}` : ''}

Your voice:
- Warm, direct, a little informal — like a thoughtful message from a real person, not a bot
- Use "I" not "we". Write like you're genuinely curious about this specific person
- Short sentences. No fluff. No corporate language.
- Never use em dashes (—). Use a comma, period, or rewrite the sentence instead.
- This is a 2-turn conversation maximum. No more.
- Turn 1 (isInitial): one warm sentence + one focused question.
- Turn 2 (first user reply): acknowledge what they said in 1–2 sentences, then close warmly. ALWAYS end turn 2 with ✓ READY_TO_SEND — no exceptions, no follow-up questions.
- If somehow a turn 3 occurs: immediately close with ✓ READY_TO_SEND, no new questions.

${isInitial ? 'This is turn 1: one short warm sentence acknowledging their context, then one focused question. Sound like you typed it yourself.' : 'This is turn 2 or later: acknowledge what they said briefly, wrap up warmly, then append ✓ READY_TO_SEND on a new line. Do not ask another question.'}

IMPORTANT — after every reply that does NOT include ✓ READY_TO_SEND, append a new line with exactly 3 short (3–6 words each) quick-reply suggestions in this format:
[CHIPS: "option one" | "option two" | "option three"]
The chips are what the USER would type back to you in response to your question. They must be direct, specific answers to whatever you just asked — written in first person as the user ("I need help with X", "We're building Y", "Not sure yet"). Never write chips from the assistant's perspective. Do NOT include [CHIPS:...] when you append ✓ READY_TO_SEND.`;

  const apiMessages = isInitial
    ? [{ role: 'user' as const, content: '[start]' }]
    : (messages as { role: 'user' | 'assistant'; content: string }[]);

  const stream = await client.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    system,
    messages: apiMessages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        console.error('Stream error:', err);
        controller.error(err);
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
