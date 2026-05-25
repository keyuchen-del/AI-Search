import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Sidebar from "@/components/Sidebar";
import ItemList from "@/components/ItemList";
import Pagination from "@/components/Pagination";
import SortTabs from "@/components/SortTabs";
import DataSourceBanner from "@/components/DataSourceBanner";
import { queryItems } from "@/lib/queryItems";
import type { CategoryKey, Mode } from "@/lib/types";
import { isCategoryKey } from "@/lib/categories";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams?: {
    category?: string;
    page?: string;
    keyword?: string;
    mode?: string;
    since?: string;
  };
}

const ALLOWED_SINCE = ["24h", "3d", "7d"] as const;

export default async function Home({ searchParams = {} }: PageProps) {
  const category: CategoryKey | "all" = isCategoryKey(searchParams.category)
    ? searchParams.category
    : "all";
  const page = Math.max(1, Number(searchParams.page || 1) || 1);
  const keyword = (searchParams.keyword || "").trim();
  const mode: Mode = searchParams.mode === "all" ? "all" : "selected";
  const since = ALLOWED_SINCE.includes(searchParams.since as (typeof ALLOWED_SINCE)[number])
    ? (searchParams.since as string)
    : "7d";

  const result = await queryItems({
    mode,
    category,
    page,
    pageSize: 12,
    keyword,
    since,
    sort: "latest",
  });

  const trending = await queryItems({
    mode: "selected",
    pageSize: 8,
    page: 1,
    sort: "latest",
    since: "7d",
  });

  function buildHref(targetPage: number) {
    const sp = new URLSearchParams();
    if (category !== "all") sp.set("category", category);
    if (mode !== "selected") sp.set("mode", mode);
    if (since !== "7d") sp.set("since", since);
    if (keyword) sp.set("keyword", keyword);
    sp.set("page", String(targetPage));
    return `/?${sp.toString()}`;
  }

  return (
    <>
      <Header defaultKeyword={keyword} />
      <DataSourceBanner source={result.source} reason={result.fallbackReason} />
      <CategoryNav active={category} mode={mode} since={since} keyword={keyword} />

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <section>
          {keyword && (
            <div className="mb-4 text-sm text-gray-600">
              搜索关键词：
              <span className="text-brand-600 font-medium">{keyword}</span>
            </div>
          )}
          <SortTabs
            mode={mode}
            since={since}
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

        <Sidebar trending={trending.items} />
      </main>

      <footer className="border-t border-gray-200 bg-white mt-10">
        <div className="max-w-7xl mx-auto px-4 py-6 text-xs text-gray-500 flex flex-wrap items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()} AI Search · 数据来自{" "}
            <a
              href="https://aihot.virxact.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand-600"
            >
              aihot.virxact.com
            </a>
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
