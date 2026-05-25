export type CategoryKey =
  | "industry"
  | "product"
  | "model"
  | "research"
  | "tools"
  | "investment"
  | "policy"
  | "opinion";

export interface Category {
  key: CategoryKey;
  label: string;
  desc: string;
}

export interface AIItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  category: CategoryKey;
  tags: string[];
  publishedAt: string;
  heat: number;
  cover?: string;
}

export interface ItemsQuery {
  category?: CategoryKey | "all";
  page?: number;
  pageSize?: number;
  keyword?: string;
  sort?: "heat" | "latest";
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
