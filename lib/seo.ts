// Site-level constants for SEO (canonical URLs, sitemap, structured data).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://keyuchen-del.github.io/AI-Search").replace(/\/$/, "");
export const SITE_NAME = "AI Search";
export const SITE_DESC =
  "每天自动聚合 AI 行业资讯，带 AI 点评、个性化、全文检索的知识库。纯静态、零成本、Fork 即用。";

/** Absolute URL for a path (path should start with "/", relative to the site root). */
export function abs(path = ""): string {
  return `${SITE_URL}${path}`;
}
