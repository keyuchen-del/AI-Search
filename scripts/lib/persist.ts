import fs from "node:fs";
import { DATA_DIR, META_PATH, STORE_PATH } from "../../lib/config";
import type { AIItem } from "../../lib/types";

function dedupeKey(url: string): string {
  try {
    const u = new URL(url);
    return `${u.host}${u.pathname}`.replace(/\/+$/, "").toLowerCase();
  } catch {
    return url.trim().toLowerCase();
  }
}

/** Normalized title for cross-source same-story dedupe (strip spaces + punctuation). */
function titleKey(t: string): string {
  return t.toLowerCase().replace(/[\s\p{P}\p{S}]/gu, "");
}

/** Higher = keep. Prefer items with a summary, then selected, then hotter. */
function score(it: AIItem): number {
  return (it.summary ? 2 : 0) + (it.aiSelected ? 0.5 : 0) + (it.heat ?? 0) * 1e-6;
}

/**
 * Dedupe by URL, then collapse near-duplicate titles across sources (keeping the
 * richer entry), then sort newest-first.
 */
export function dedupeAndSort(items: AIItem[]): AIItem[] {
  const byUrl = new Map<string, AIItem>();
  for (const it of items) {
    if (!it.sourceUrl) continue;
    const k = dedupeKey(it.sourceUrl);
    const prev = byUrl.get(k);
    if (!prev || score(it) > score(prev)) byUrl.set(k, it);
  }

  const byTitle = new Map<string, AIItem>();
  for (const it of byUrl.values()) {
    const tk = titleKey(it.title);
    const key = tk.length >= 8 ? `t:${tk}` : `id:${it.id}`; // short titles: don't merge
    const prev = byTitle.get(key);
    if (!prev || score(it) > score(prev)) byTitle.set(key, it);
  }

  return [...byTitle.values()].sort((a, b) => {
    const da = a.publishedAt ?? a.firstSeen ?? "";
    const db = b.publishedAt ?? b.firstSeen ?? "";
    return db.localeCompare(da);
  });
}

export interface PrevInfo {
  firstSeen?: string | null;
  aiNote?: string | null;
}

/** id -> { firstSeen, aiNote } from the previous snapshot (for diff + caching). */
export function loadPrevious(): Map<string, PrevInfo> {
  const map = new Map<string, PrevInfo>();
  try {
    const prev = JSON.parse(fs.readFileSync(STORE_PATH, "utf8")) as AIItem[];
    if (Array.isArray(prev)) {
      for (const it of prev) {
        if (it.id) map.set(it.id, { firstSeen: it.firstSeen ?? null, aiNote: it.aiNote ?? null });
      }
    }
  } catch {
    // no previous snapshot — everything is new.
  }
  return map;
}

/**
 * Stamp firstSeen = the time WE first collected the item (carried forward from the
 * previous snapshot; otherwise now). This is collection time, not publish time —
 * it's what drives NEW / 今日新收录 / the daily digest.
 */
export function applyHistory(items: AIItem[], prev: Map<string, PrevInfo>, nowIso: string): AIItem[] {
  return items.map((it) => {
    const p = prev.get(it.id);
    return {
      ...it,
      firstSeen: it.firstSeen ?? p?.firstSeen ?? nowIso,
      aiNote: it.aiNote ?? p?.aiNote ?? null,
    };
  });
}

export interface SnapshotResult {
  count: number;
  path: string;
}

/** Stamp fetchedAt, write items.json + meta.json. */
export function writeSnapshot(
  items: AIItem[],
  sources: Record<string, number>,
  errors: Record<string, string> = {},
): SnapshotResult {
  const fetchedAt = new Date().toISOString();
  const stamped = items.map((it) => ({ ...it, fetchedAt: it.fetchedAt ?? fetchedAt }));

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(stamped, null, 2) + "\n", "utf8");
  fs.writeFileSync(
    META_PATH,
    JSON.stringify({ fetchedAt, count: stamped.length, sources, errors }, null, 2) + "\n",
    "utf8",
  );
  return { count: stamped.length, path: STORE_PATH };
}
