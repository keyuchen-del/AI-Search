import { MOCK_ITEMS } from "./mockData";
import type { AIItem, ItemsQuery, PaginatedResult } from "./types";

export function queryItems(q: ItemsQuery): PaginatedResult<AIItem> {
  const {
    category = "all",
    page = 1,
    pageSize = 12,
    keyword = "",
    sort = "heat",
  } = q;

  let pool = MOCK_ITEMS;
  if (category && category !== "all") {
    pool = pool.filter((i) => i.category === category);
  }
  if (keyword.trim()) {
    const k = keyword.trim().toLowerCase();
    pool = pool.filter(
      (i) =>
        i.title.toLowerCase().includes(k) ||
        i.summary.toLowerCase().includes(k) ||
        i.tags.some((t) => t.toLowerCase().includes(k)),
    );
  }

  const sorted = [...pool].sort((a, b) => {
    if (sort === "latest") {
      return b.publishedAt.localeCompare(a.publishedAt);
    }
    return b.heat - a.heat;
  });

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const items = sorted.slice(start, start + pageSize);

  return { items, total, page: safePage, pageSize, totalPages };
}
