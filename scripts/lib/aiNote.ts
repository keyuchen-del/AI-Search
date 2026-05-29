import type { AIItem } from "../../lib/types";

// One-sentence AI commentary, generated at build time and cached in the snapshot.
// Only NEW items (no cached note) are sent to the LLM, capped per run, so daily
// cost stays bounded. No API key -> feature is skipped and the site works as-is.

const API = "https://api.deepseek.com/chat/completions";
const KEY = process.env.DEEPSEEK_API_KEY || "";
const MODEL = process.env.LLM_MODEL || "deepseek-chat";
const MAX = Number(process.env.AI_NOTE_MAX || 30);
const CONCURRENCY = Number(process.env.AI_NOTE_CONCURRENCY || 4);
const TIMEOUT = Number(process.env.AI_NOTE_TIMEOUT_MS || 20000);

const SYSTEM =
  "你是资深 AI 行业编辑。给定一条资讯的标题和摘要，用不超过 40 个汉字写一句中文点评，" +
  "说明它为什么值得关注或它的看点，不要复述标题、不加引号、不加前缀。";

function clean(s: string): string {
  return s.replace(/^["“”'']+|["“”'']+$/g, "").replace(/\s+/g, " ").trim().slice(0, 50);
}

async function noteFor(item: AIItem): Promise<string | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT);
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      signal: ctrl.signal,
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.7,
        max_tokens: 80,
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: `标题：${item.title}\n摘要：${item.summary ?? "（无）"}`,
          },
        ],
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = data.choices?.[0]?.message?.content ?? "";
    const out = clean(text);
    return out || null;
  } catch {
    return null; // one failure never blocks the build
  } finally {
    clearTimeout(timer);
  }
}

/** Fill aiNote for up to MAX new items (those lacking a cached note). */
export async function addAiNotes(items: AIItem[]): Promise<AIItem[]> {
  if (!KEY) {
    console.log("[ai-note] no DEEPSEEK_API_KEY — skipping AI notes.");
    return items;
  }
  const targets = items.filter((i) => !i.aiNote).slice(0, MAX);
  if (targets.length === 0) {
    console.log("[ai-note] all items already have notes.");
    return items;
  }

  const notes = new Map<string, string>();
  let done = 0;
  const queue = [...targets];
  async function worker() {
    for (;;) {
      const item = queue.shift();
      if (!item) return;
      const n = await noteFor(item);
      if (n) notes.set(item.id, n);
      done++;
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, targets.length) }, worker));
  console.log(`[ai-note] generated ${notes.size}/${targets.length} notes (model: ${MODEL}).`);

  return items.map((it) => (notes.has(it.id) ? { ...it, aiNote: notes.get(it.id)! } : it));
}
