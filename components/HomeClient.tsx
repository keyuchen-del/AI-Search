"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "./Header";
import CategoryNav from "./CategoryNav";
import Sidebar from "./Sidebar";
import ItemList from "./ItemList";
import Pagination from "./Pagination";
import SortTabs from "./SortTabs";
import { filterItems, queryPool } from "@/lib/filter";
import { isCategoryKey } from "@/lib/categories";
import { formatBJDate } from "@/lib/timeFormat";
import type { AIItem, CategoryKey, Mode } from "@/lib/types";

const ALLOWED_SINCE = ["24h", "3d", "7d", "30d"] as const;
const PAGE_SIZE = 12;

interface ViewState {
  category: CategoryKey | "all";
  page: number;
  keyword: string;
  mode: Mode;
  since: string;
}

const DEFAULT_STATE: ViewState = {
  category: "all",
  page: 1,
  keyword: "",
  mode: "selected",
  since: "7d",
};

/** Pure layout — no hooks — so it renders identically on the server (for the
 *  static fallback / first paint) and on the client (URL-driven). */
function HomeLayout({
  items,
  updatedAt,
  state,
}: {
  items: AIItem[];
  updatedAt: string | null;
  state: ViewState;
}) {
  const { category, page, keyword, mode, since } = state;

  const result = queryPool(items, {
    mode,
    category,
    page,
    pageSize: PAGE_SIZE,
    keyword,
    since,
    sort: "latest",
  });
  const trending = filterItems(items, { mode: "selected", since: "7d", sort: "heat" }).slice(0, 8);

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
      <CategoryNav active={category} mode={mode} since={since} keyword={keyword} />

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <section>
          {keyword && (
            <div className="mb-4 text-sm text-gray-600">
              搜索关键词：<span className="text-brand-600 font-medium">{keyword}</span>
            </div>
          )}
          <SortTabs mode={mode} since={since} category={category} keyword={keyword} total={result.total} />
          <ItemList items={result.items} />
          <Pagination page={result.page} totalPages={result.totalPages} buildHref={buildHref} />
        </section>

        <Sidebar trending={trending} />
      </main>

      <footer className="border-t border-gray-200 bg-white mt-10">
        <div className="max-w-7xl mx-auto px-4 py-6 text-xs text-gray-500 flex flex-wrap items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()} AI Search · 共 {items.length} 条
            {updatedAt && <> · 数据更新于 {formatBJDate(updatedAt)}</>}
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

function HomeInner({ items, updatedAt }: { items: AIItem[]; updatedAt: string | null }) {
  const params = useSearchParams();
  const state: ViewState = {
    category: isCategoryKey(params.get("category") || undefined)
      ? (params.get("category") as CategoryKey)
      : "all",
    page: Math.max(1, Number(params.get("page") || 1) || 1),
    keyword: (params.get("keyword") || "").trim(),
    mode: params.get("mode") === "all" ? "all" : "selected",
    since: (ALLOWED_SINCE as readonly string[]).includes(params.get("since") || "")
      ? (params.get("since") as string)
      : "7d",
  };
  return <HomeLayout items={items} updatedAt={updatedAt} state={state} />;
}

export default function HomeClient({ items, updatedAt }: { items: AIItem[]; updatedAt: string | null }) {
  // useSearchParams needs a Suspense boundary under static export. The fallback
  // renders the default view on the server, so the static HTML ships real content.
  return (
    <Suspense fallback={<HomeLayout items={items} updatedAt={updatedAt} state={DEFAULT_STATE} />}>
      <HomeInner items={items} updatedAt={updatedAt} />
    </Suspense>
  );
}
