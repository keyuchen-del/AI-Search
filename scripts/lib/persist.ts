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

/** Dedupe by normalized URL (keeps the richer entry), then sort newest-first. */
export function dedupeAndSort(items: AIItem[]): AIItem[] {
  const byKey = new Map<string, AIItem>();
  for (const it of items) {
    if (!it.sourceUrl) continue;
    const key = dedupeKey(it.sourceUrl);
    const prev = byKey.get(key);
    if (!prev || (it.summary && !prev.summary)) byKey.set(key, it);
  }
  return [...byKey.values()].sort((a, b) => {
    const ta = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const tb = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return tb - ta;
  });
}

export interface SnapshotResult {
  count: number;
  path: string;
}

/** Stamp fetchedAt, write items.json + meta.json. */
export function writeSnapshot(items: AIItem[], sources: Record<string, number>): SnapshotResult {
  const fetchedAt = new Date().toISOString();
  const stamped = items.map((it) => ({ ...it, fetchedAt: it.fetchedAt ?? fetchedAt }));

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(stamped, null, 2) + "\n", "utf8");
  fs.writeFileSync(
    META_PATH,
    JSON.stringify({ fetchedAt, count: stamped.length, sources }, null, 2) + "\n",
    "utf8",
  );
  return { count: stamped.length, path: STORE_PATH };
}
