import type { AIItem, ItemsQuery, PaginatedResult } from "./types";

/** Convert a window token (`24h`, `3d`, `2025-05-01`) to an ISO lower bound. */
export function sinceForWindow(input?: string): string | undefined {
  if (!input) return undefined;
  if (/^\d+d$/.test(input)) {
    const days = Number(input.slice(0, -1));
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  }
  if (/^\d+h$/.test(input)) {
    const hours = Number(input.slice(0, -1));
    return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(input)) return new Date(input).toISOString();
  return undefined;
}

export function paginate<T>(arr: T[], page: number, pageSize: number) {
  const total = arr.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return { items: arr.slice(start, start + pageSize), total, page: safePage, pageSize, totalPages };
}

/** Filter + sort an in-memory item pool (pure; shared by server build and client). */
export function filterItems(pool: AIItem[], q: ItemsQuery): AIItem[] {
  const { mode = "selected", category = "all", source = "", keyword = "", since, sort = "latest" } = q;
  let out = pool;
  if (mode === "selected") out = out.filter((i) => i.aiSelected !== false);
  if (category !== "all") out = out.filter((i) => i.category === category);
  if (source) out = out.filter((i) => i.source === source);
  if (keyword.trim()) {
    const k = keyword.trim().toLowerCase();
    out = out.filter(
      (i) =>
        i.title.toLowerCase().includes(k) ||
        (i.summary ?? "").toLowerCase().includes(k) ||
        i.source.toLowerCase().includes(k) ||
        (i.tags ?? []).some((t) => t.toLowerCase().includes(k)),
    );
  }
  const sinceIso = sinceForWindow(since);
  if (sinceIso) {
    const t = new Date(sinceIso).getTime();
    out = out.filter((i) => i.publishedAt && new Date(i.publishedAt).getTime() >= t);
  }
  return [...out].sort((a, b) => {
    if (sort === "heat") return (b.heat ?? 0) - (a.heat ?? 0);
    // Many RSS items lack publishedAt — fall back to firstSeen so "latest" stays sane.
    const da = a.publishedAt ?? a.firstSeen ?? "";
    const db = b.publishedAt ?? b.firstSeen ?? "";
    return db.localeCompare(da);
  });
}

/** Full query: filter + sort + paginate. `source` is informational. */
export function queryPool(
  pool: AIItem[],
  q: ItemsQuery,
  source: PaginatedResult<AIItem>["source"] = "local",
): PaginatedResult<AIItem> {
  const { page = 1, pageSize = 12 } = q;
  const sorted = filterItems(pool, q);
  return { ...paginate(sorted, page, pageSize), source };
}
