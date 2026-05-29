// Legacy adapter for the aihot.virxact.com public API. The upstream now returns
// 403 site-wide, so this is kept only as a fallback in the `auto` chain
// (local snapshot -> aihot -> mock). Real data comes from the crawler; see
// lib/localStore.ts and scripts/crawl.ts.
import type {
  AIItem,
  CategoryKey,
  DailyIndexItem,
  DailyReport,
  Mode,
} from "./types";

const BASE = process.env.AIHOT_BASE_URL || "https://aihot.virxact.com";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const TIMEOUT_MS = Number(process.env.AIHOT_TIMEOUT_MS || 6000);
const CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheEntry<T> {
  at: number;
  data: T;
}

const cache = new Map<string, CacheEntry<unknown>>();

function cacheGet<T>(key: string): T | null {
  const e = cache.get(key) as CacheEntry<T> | undefined;
  if (!e) return null;
  if (Date.now() - e.at > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return e.data;
}

function cacheSet<T>(key: string, data: T) {
  cache.set(key, { at: Date.now(), data });
}

async function getJson<T>(path: string): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      signal: ctrl.signal,
      cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`aihot ${path} -> HTTP ${res.status}: ${body.slice(0, 200)}`);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export interface AihotItemsResponse {
  count: number;
  hasNext: boolean;
  nextCursor: string | null;
  items: {
    id: string;
    title: string;
    title_en?: string | null;
    url: string;
    source: string;
    publishedAt?: string | null;
    summary?: string | null;
    category?: CategoryKey | null;
  }[];
}

export interface FetchItemsInput {
  mode?: Mode;
  category?: CategoryKey;
  since?: string;
  take?: number;
  cursor?: string;
  q?: string;
}

function buildItemsQuery(input: FetchItemsInput): string {
  const sp = new URLSearchParams();
  if (input.mode) sp.set("mode", input.mode);
  if (input.category) sp.set("category", input.category);
  if (input.since) sp.set("since", input.since);
  if (input.take) sp.set("take", String(Math.min(100, Math.max(1, input.take))));
  if (input.cursor) sp.set("cursor", input.cursor);
  if (input.q) sp.set("q", input.q.slice(0, 200));
  return sp.toString();
}

export async function fetchItems(input: FetchItemsInput = {}): Promise<AihotItemsResponse> {
  const qs = buildItemsQuery(input);
  const key = `items?${qs}`;
  const cached = cacheGet<AihotItemsResponse>(key);
  if (cached) return cached;
  const data = await getJson<AihotItemsResponse>(`/api/public/items?${qs}`);
  cacheSet(key, data);
  return data;
}

export async function fetchDaily(date?: string): Promise<DailyReport> {
  const key = date ? `daily/${date}` : `daily/latest`;
  const cached = cacheGet<DailyReport>(key);
  if (cached) return cached;
  const path = date ? `/api/public/daily/${date}` : `/api/public/daily`;
  const data = await getJson<DailyReport>(path);
  cacheSet(key, data);
  return data;
}

export async function fetchDailies(take = 14): Promise<{
  count: number;
  items: DailyIndexItem[];
}> {
  const key = `dailies?take=${take}`;
  const cached = cacheGet<{ count: number; items: DailyIndexItem[] }>(key);
  if (cached) return cached;
  const data = await getJson<{ count: number; items: DailyIndexItem[] }>(
    `/api/public/dailies?take=${take}`,
  );
  cacheSet(key, data);
  return data;
}

export function normalizeAihotItem(raw: AihotItemsResponse["items"][number]): AIItem {
  return {
    id: raw.id,
    title: raw.title,
    titleEn: raw.title_en ?? null,
    summary: raw.summary ?? null,
    source: raw.source,
    sourceUrl: raw.url,
    category: raw.category ?? null,
    publishedAt: raw.publishedAt ?? null,
    aiSelected: true,
  };
}
