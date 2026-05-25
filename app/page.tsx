import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Sidebar from "@/components/Sidebar";
import ItemList from "@/components/ItemList";
import Pagination from "@/components/Pagination";
import SortTabs from "@/components/SortTabs";
import { queryItems } from "@/lib/queryItems";
import type { CategoryKey } from "@/lib/types";

interface PageProps {
  searchParams?: {
    category?: string;
    page?: string;
    keyword?: string;
    sort?: string;
  };
}

const VALID_CATEGORIES: (CategoryKey | "all")[] = [
  "all",
  "industry",
  "product",
  "model",
  "research",
  "tools",
  "investment",
  "policy",
  "opinion",
];

export default function Home({ searchParams = {} }: PageProps) {
  const rawCat = (searchParams.category || "all") as CategoryKey | "all";
  const category = VALID_CATEGORIES.includes(rawCat) ? rawCat : "all";
  const page = Math.max(1, Number(searchParams.page || 1) || 1);
  const keyword = (searchParams.keyword || "").trim();
  const sort = (searchParams.sort === "latest" ? "latest" : "heat") as
    | "heat"
    | "latest";

  const result = queryItems({ category, page, pageSize: 12, keyword, sort });

  function buildHref(targetPage: number) {
    const sp = new URLSearchParams();
    if (category !== "all") sp.set("category", category);
    sp.set("page", String(targetPage));
    if (keyword) sp.set("keyword", keyword);
    if (sort) sp.set("sort", sort);
    return `/?${sp.toString()}`;
  }

  return (
    <>
      <Header defaultKeyword={keyword} />
      <CategoryNav active={category} sort={sort} keyword={keyword} />

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <section>
          {keyword && (
            <div className="mb-4 text-sm text-gray-600">
              搜索关键词：
              <span className="text-brand-600 font-medium">{keyword}</span>
            </div>
          )}
          <SortTabs
            sort={sort}
            category={category}
            keyword={keyword}
            total={result.total}
          />
          <ItemList items={result.items} />
          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            buildHref={buildHref}
          />
        </section>

        <Sidebar />
      </main>

      <footer className="border-t border-gray-200 bg-white mt-10">
        <div className="max-w-7xl mx-auto px-4 py-6 text-xs text-gray-500 flex flex-wrap items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()} AI Search · 仅做 AI 行业资讯聚合与索引
          </span>
          <a
            href="https://github.com/keyuchen-del/AI-Search"
            target="_blank"
            rel="noreferrer"
            className="hover:text-brand-600"
          >
            GitHub: keyuchen-del/AI-Search
          </a>
        </div>
      </footer>
    </>
  );
}
