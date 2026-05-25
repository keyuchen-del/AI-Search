import type { Category, CategoryKey } from "./types";

export const CATEGORIES: Category[] = [
  { key: "ai-models", label: "模型发布/更新", desc: "大模型与基础模型的发布与更新" },
  { key: "ai-products", label: "产品发布/更新", desc: "新产品、新功能、新版本" },
  { key: "industry", label: "行业动态", desc: "AI 行业趋势与重大事件" },
  { key: "paper", label: "论文研究", desc: "论文、技术报告与研究进展" },
  { key: "tip", label: "技巧与观点", desc: "实用技巧与深度观点" },
];

export const CATEGORY_MAP: Record<CategoryKey, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c]),
) as Record<CategoryKey, Category>;

export function isCategoryKey(s: string | undefined | null): s is CategoryKey {
  return !!s && CATEGORIES.some((c) => c.key === s);
}
