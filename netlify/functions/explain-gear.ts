import type { Handler, HandlerEvent } from "@netlify/functions";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let body: {
    itemA: { name: string; stats: Record<string, number>; source?: string; slot?: string };
    itemB: { name: string; stats: Record<string, number>; source?: string; slot?: string };
    job: string;
    mode: string;
    diffs: Array<{ stat: string; a: number; b: number; delta: number }>;
  };

  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const { itemA, itemB, job, mode, diffs } = body;
  if (!itemA || !itemB || !job || !diffs) {
    return { statusCode: 400, body: "Missing required fields" };
  }

  // Build a readable diff table
  const diffLines = diffs
    .map(d => {
      const winner = d.delta > 0 ? itemB.name : d.delta < 0 ? itemA.name : "tied";
      return `  ${d.stat}: ${itemA.name}=${d.a >= 0 ? "+" : ""}${d.a}, ${itemB.name}=${d.b >= 0 ? "+" : ""}${d.b} (${winner} wins by ${Math.abs(d.delta)})`;
    })
    .join("\n");

  const prompt = `You are an expert FFXI (Final Fantasy XI) gear advisor. A player is comparing two gear pieces for their ${job} in "${mode}" mode.

Item A: ${itemA.name}${itemA.source ? ` (${itemA.source})` : ""}
Item B: ${itemB.name}${itemB.source ? ` (${itemB.source})` : ""}
Slot: ${itemA.slot ?? "unknown"}

Stat comparison (positive delta = Item B is better for that stat):
${diffLines}

In 2–4 sentences, explain which item is better for ${mode} on a ${job}, and WHY specific stats matter for that job/mode. Be concrete — reference actual stat names and numbers. If it's situational, say so. Do not hedge excessively.`;

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 512,
      thinking: { type: "adaptive" },
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content
      .filter(b => b.type === "text")
      .map(b => (b as Anthropic.TextBlock).text)
      .join("");

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ explanation: text }),
    };
  } catch (err) {
    console.error("Claude API error:", err);
    return { statusCode: 500, body: "Failed to generate explanation" };
  }
};
