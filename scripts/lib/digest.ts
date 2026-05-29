import fs from "node:fs";
import { DIGEST_PATH } from "../../lib/config";
import type { AIItem, Digest, DigestPick } from "../../lib/types";

// "AI 每日必读": once per day, ask DeepSeek to pick a few must-reads from the
// day's pool + a one-line reason. Cached by date (no repeat cost on same-day
// pushes). No DEEPSEEK_API_KEY -> previous digest kept (or empty), card hidden.

const API = "https://api.deepseek.com/chat/completions";
const KEY = process.env.DEEPSEEK_API_KEY || "";
const MODEL = process.env.LLM_MODEL || "deepseek-chat";
const PICK = Number(process.env.DIGEST_PICKS || 5);
const POOL = 18;
const WINDOW_MS = 72 * 60 * 60 * 1000;

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function bjDate(d = new Date()): string {
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const bj = new Date(utc + 8 * 3600000);
  return `${bj.getFullYear()}-${pad(bj.getMonth() + 1)}-${pad(bj.getDate())}`;
}

function readPrev(): Digest | null {
  try {
    return JSON.parse(fs.readFileSync(DIGEST_PATH, "utf8")) as Digest;
  } catch {
    return null;
  }
}

function write(d: Digest): void {
  fs.writeFileSync(DIGEST_PATH, JSON.stringify(d, null, 2) + "\n", "utf8");
}

function candidates(items: AIItem[]): AIItem[] {
  const now = Date.now();
  const recent = items.filter((i) => {
    if (i.aiSelected === false) return false;
    const t = Date.parse(i.publishedAt ?? i.firstSeen ?? "");
    return Number.isFinite(t) && now - t < WINDOW_MS;
  });
  const pool = (recent.length >= PICK ? recent : items.slice())
    .sort((a, b) => (b.heat ?? 0) - (a.heat ?? 0))
    .slice(0, POOL);
  return pool;
}

async function pickWithLLM(pool: AIItem[]): Promise<DigestPick[]> {
  const listing = pool
    .map((it, i) => `${i + 1}. 【${it.source}】${it.title}${it.summary ? ` — ${it.summary.slice(0, 80)}` : ""}`)
    .join("\n");
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 30000);
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      signal: ctrl.signal,
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.5,
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content:
              "你是资深 AI 资讯主编。从候选列表里挑出今天最值得一读的条目，" +
              `挑 ${Math.min(PICK, 5)} 条，按重要性排序。只返回 JSON 数组，每项形如 ` +
              '{"n": 编号, "reason": "不超过30字的中文推荐理由"}，不要其它文字。',
          },
          { role: "user", content: listing },
        ],
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const raw = (data.choices?.[0]?.message?.content ?? "").replace(/```json|```/g, "").trim();
    const arr = JSON.parse(raw) as { n: number; reason: string }[];
    const picks: DigestPick[] = [];
    for (const { n, reason } of arr) {
      const it = pool[n - 1];
      if (it && reason) picks.push({ title: it.title, sourceUrl: it.sourceUrl, source: it.source, reason: String(reason).slice(0, 40) });
    }
    return picks.slice(0, PICK);
  } finally {
    clearTimeout(timer);
  }
}

/** Build (or reuse) today's digest and write data/digest.json. */
async function summarizeTrend(items: AIItem[]): Promise<string> {
  const top = [...items].sort((a, b) => (b.heat ?? 0) - (a.heat ?? 0)).slice(0, 10);
  if (top.length === 0) return "";
  const listing = top.map((it, i) => `${i + 1}. ${it.title}`).join("\n");
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 30000);
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      signal: ctrl.signal,
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.6,
        max_tokens: 160,
        messages: [
          {
            role: "system",
            content:
              "你是 AI 资讯主编。根据给定的本周最热条目，用 50 字以内中文概括本周 AI 圈的热点趋势，口吻自然连贯，不分点、不加引号、不复述标题。",
          },
          { role: "user", content: listing },
        ],
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return (data.choices?.[0]?.message?.content ?? "").replace(/\s+/g, " ").trim().slice(0, 100);
  } catch {
    return "";
  } finally {
    clearTimeout(timer);
  }
}

export async function buildDigest(items: AIItem[]): Promise<void> {
  const today = bjDate();
  const prev = readPrev();
  if (prev && prev.date === today && prev.picks.length > 0 && prev.trendSummary) {
    console.log("[digest] today's digest already complete — skipping.");
    return;
  }
  if (!KEY) {
    console.log("[digest] no DEEPSEEK_API_KEY — skipping digest.");
    if (!prev) write({ date: today, generatedAt: new Date().toISOString(), picks: [] });
    return;
  }
  try {
    const pool = candidates(items);
    if (pool.length < 3) {
      console.log("[digest] not enough candidates.");
      return;
    }
    const picks = await pickWithLLM(pool);
    const trendSummary = await summarizeTrend(items);
    write({ date: today, generatedAt: new Date().toISOString(), picks, trendSummary });
    console.log(`[digest] ${picks.length} picks + trend summary for ${today}.`);
  } catch (e) {
    console.log(`[digest] failed: ${e instanceof Error ? e.message : e}`);
  }
}
