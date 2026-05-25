export type CategoryKey =
  | "ai-models"
  | "ai-products"
  | "industry"
  | "paper"
  | "tip";

export type Mode = "selected" | "all";

export interface Category {
  key: CategoryKey;
  label: string;
  desc: string;
}

export interface AIItem {
  id: string;
  title: string;
  titleEn?: string | null;
  summary: string | null;
  source: string;
  sourceUrl: string;
  category: CategoryKey | null;
  publishedAt: string | null;
  tags?: string[];
  heat?: number;
  aiSelected?: boolean;
}

export interface ItemsQuery {
  mode?: Mode;
  category?: CategoryKey | "all";
  page?: number;
  pageSize?: number;
  keyword?: string;
  since?: string;
  sort?: "heat" | "latest";
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  source: "aihot" | "mock";
  fallbackReason?: string;
}

export interface DailyReport {
  date: string;
  generatedAt: string;
  windowStart: string;
  windowEnd: string;
  lead: { title: string; leadParagraph: string } | null;
  sections: {
    label: string;
    items: {
      title: string;
      summary: string | null;
      sourceUrl: string;
      sourceName: string;
    }[];
  }[];
  flashes?: {
    title: string;
    sourceName: string;
    sourceUrl: string;
    publishedAt: string;
  }[];
}

export interface DailyIndexItem {
  date: string;
  generatedAt: string;
  leadTitle: string | null;
}
