import fs from "node:fs";
import { DIGEST_PATH, META_PATH, STORE_PATH, storeMaxAgeMs } from "./config";
import type { AIItem, Digest } from "./types";

export interface StoreMeta {
  fetchedAt: string | null;
  count: number;
  sources: Record<string, number>;
  errors: Record<string, string>;
}

interface ItemsCache {
  mtimeMs: number;
  items: AIItem[];
}

let itemsCache: ItemsCache | null = null;

/** Read the crawled snapshot. Returns `[]` if the file is missing or invalid. */
export function readLocalItems(): AIItem[] {
  let stat: fs.Stats;
  try {
    stat = fs.statSync(STORE_PATH);
  } catch {
    return [];
  }
  if (itemsCache && itemsCache.mtimeMs === stat.mtimeMs) {
    return itemsCache.items;
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    const items: AIItem[] = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.items)
        ? parsed.items
        : [];
    itemsCache = { mtimeMs: stat.mtimeMs, items };
    return items;
  } catch {
    return [];
  }
}

/** Read crawl metadata, falling back to values derived from the snapshot. */
export function readStoreMeta(): StoreMeta | null {
  try {
    const raw = fs.readFileSync(META_PATH, "utf8");
    const m = JSON.parse(raw);
    return {
      fetchedAt: m.fetchedAt ?? null,
      count: Number(m.count ?? 0),
      sources: m.sources ?? {},
      errors: m.errors ?? {},
    };
  } catch {
    const items = readLocalItems();
    if (items.length === 0) return null;
    return { fetchedAt: null, count: items.length, sources: {}, errors: {} };
  }
}

/** Read the "AI 每日必读" digest, or null when absent/empty. */
export function readDigest(): Digest | null {
  try {
    const d = JSON.parse(fs.readFileSync(DIGEST_PATH, "utf8")) as Digest;
    return d && Array.isArray(d.picks) && d.picks.length > 0 ? d : null;
  } catch {
    return null;
  }
}

/** Whether the snapshot exists, has items, and is within the freshness window. */
export function hasFreshLocalData(): boolean {
  const items = readLocalItems();
  if (items.length === 0) return false;
  const maxAge = storeMaxAgeMs();
  if (maxAge === 0) return true;
  const meta = readStoreMeta();
  if (!meta?.fetchedAt) return true; // no timestamp -> trust it
  const age = Date.now() - new Date(meta.fetchedAt).getTime();
  return age <= maxAge;
}
