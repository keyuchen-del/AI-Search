import { MOCK_ITEMS } from "./mockData";
import { fetchItems, normalizeAihotItem } from "./aihot";
import type { AIItem, ItemsQuery, PaginatedResult } from "./types";

type DataSource = "aihot" | "mock" | "auto";

function getDataSource(): DataSource {
  const v = (process.env.DATA_SOURCE || "auto").toLowerCase();
  if (v === "aihot" || v === "mock") return v;
  return "auto";
}

function sinceForWindow(input?: string): string | undefined {
  if (!input) return undefined;
  if (/^\d+d$/.test(input)) {
    const days = Number(input.slice(0, -1));
    const d = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return d.toISOString();
  }
  if (/^\d+h$/.test(input)) {
    const hours = Number(input.slice(0, -1));
    const d = new Date(Date.now() - hours * 60 * 60 * 1000);
    return d.toISOString();
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(input)) return new Date(input).toISOString();
  return undefined;
}

function paginate<T>(arr: T[], page: number, pageSize: number) {
  const total = arr.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: arr.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

function queryMock(q: ItemsQuery): PaginatedResult<AIItem> {
  const {
    mode = "selected",
    category = "all",
    page = 1,
    pageSize = 12,
    keyword = "",
    since,
    sort = "latest",
  } = q;

  let pool = MOCK_ITEMS;
  if (mode === "selected") pool = pool.filter((i) => i.aiSelected !== false);
  if (category && category !== "all") pool = pool.filter((i) => i.category === category);
  if (keyword.trim()) {
    const k = keyword.trim().toLowerCase();
    pool = pool.filter(
      (i) =>
        i.title.toLowerCase().includes(k) ||
        (i.summary ?? "").toLowerCase().includes(k) ||
        (i.tags ?? []).some((t) => t.toLowerCase().includes(k)),
    );
  }
  const sinceIso = sinceForWindow(since);
  if (sinceIso) {
    const t = new Date(sinceIso).getTime();
    pool = pool.filter((i) => i.publishedAt && new Date(i.publishedAt).getTime() >= t);
  }
  const sorted = [...pool].sort((a, b) => {
    if (sort === "heat") return (b.heat ?? 0) - (a.heat ?? 0);
    return (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "");
  });
  const p = paginate(sorted, page, pageSize);
  return { ...p, source: "mock" };
}

async function queryAihot(q: ItemsQuery): Promise<PaginatedResult<AIItem>> {
  const {
    mode = "selected",
    category = "all",
    page = 1,
    pageSize = 12,
    keyword = "",
    since,
  } = q;

  const take = Math.min(100, pageSize * 4);
  const sinceIso = sinceForWindow(since);
  const resp = await fetchItems({
    mode,
    category: category === "all" ? undefined : category,
    since: sinceIso,
    take,
    q: keyword.trim() || undefined,
  });
  const all = resp.items.map(normalizeAihotItem);
  const p = paginate(all, page, pageSize);
  return { ...p, source: "aihot" };
}

export async function queryItems(q: ItemsQuery): Promise<PaginatedResult<AIItem>> {
  const ds = getDataSource();
  if (ds === "mock") return queryMock(q);
  if (ds === "aihot") return queryAihot(q);

  try {
    return await queryAihot(q);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const fallback = queryMock(q);
    return { ...fallback, fallbackReason: msg.slice(0, 200) };
  }
}
