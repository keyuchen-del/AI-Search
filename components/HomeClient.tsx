"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "./Header";
import CategoryNav from "./CategoryNav";
import Sidebar from "./Sidebar";
import SortTabs from "./SortTabs";
import FeedSection from "./FeedSection";
import TopReads from "./TopReads";
import { filterItems } from "@/lib/filter";
import { sourceCounts } from "@/lib/personalize";
import { isCategoryKey } from "@/lib/categories";
import { formatBJDate } from "@/lib/timeFormat";
import type { StoreMeta } from "@/lib/localStore";
import type { AIItem, CategoryKey, Digest, Mode } from "@/lib/types";

const ALLOWED_SINCE = ["24h", "3d", "7d", "30d"] as const;

export interface ViewState {
  category: CategoryKey | "all";
  keyword: string;
  mode: Mode;
  since: string;
  source: string;
}

const DEFAULT_STATE: ViewState = {
  category: "all",
  keyword: "",
  mode: "selected",
  since: "7d",
  source: "",
};

function HomeLayout({
  items,
  meta,
  now,
  digest,
  state,
}: {
  items: AIItem[];
  meta: StoreMeta | null;
  now: number;
  digest: Digest | null;
  state: ViewState;
}) {
  const { category, keyword, mode, since, source } = state;
  const trending = filterItems(items, { mode: "selected", since: "7d", sort: "heat" }).slice(0, 8);
  // 每日必读 only on the default landing view (no active filter/search).
  const showDigest = !keyword && category === "all" && !source;

  return (
    <>
      <Header defaultKeyword={keyword} />
      <CategoryNav active={category} mode={mode} since={since} keyword={keyword} />

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <section>
          {showDigest && <TopReads digest={digest} />}
          {keyword && (
            <div className="mb-4 text-sm text-gray-600">
              搜索关键词：<span className="text-brand-600 font-medium">{keyword}</span>
            </div>
          )}
          <SortTabs mode={mode} since={since} category={category} keyword={keyword} />
          <FeedSection items={items} query={{ mode, category, since, keyword, source }} now={now} />
        </section>

        <Sidebar trending={trending} meta={meta} state={state} sources={sourceCounts(items)} />
      </main>

      <footer className="border-t border-gray-200 bg-white mt-10">
        <div className="max-w-7xl mx-auto px-4 py-6 text-xs text-gray-500 flex flex-wrap items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()} AI Search · 共 {items.length} 条
            {meta?.fetchedAt && <> · 数据更新于 {formatBJDate(meta.fetchedAt)}</>}
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

function HomeInner({
  items,
  meta,
  now,
  digest,
}: {
  items: AIItem[];
  meta: StoreMeta | null;
  now: number;
  digest: Digest | null;
}) {
  const params = useSearchParams();
  const state: ViewState = {
    category: isCategoryKey(params.get("category") || undefined)
      ? (params.get("category") as CategoryKey)
      : "all",
    keyword: (params.get("keyword") || "").trim(),
    mode: params.get("mode") === "all" ? "all" : "selected",
    since: (ALLOWED_SINCE as readonly string[]).includes(params.get("since") || "")
      ? (params.get("since") as string)
      : "7d",
    source: (params.get("source") || "").trim(),
  };
  return <HomeLayout items={items} meta={meta} now={now} digest={digest} state={state} />;
}

export default function HomeClient({
  items,
  meta,
  now,
  digest,
}: {
  items: AIItem[];
  meta: StoreMeta | null;
  now: number;
  digest: Digest | null;
}) {
  return (
    <Suspense
      fallback={<HomeLayout items={items} meta={meta} now={now} digest={digest} state={DEFAULT_STATE} />}
    >
      <HomeInner items={items} meta={meta} now={now} digest={digest} />
    </Suspense>
  );
}
