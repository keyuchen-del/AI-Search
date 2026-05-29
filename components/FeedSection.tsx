"use client";

import { useEffect, useMemo, useState } from "react";
import ItemList from "./ItemList";
import PersonalizeModal from "./PersonalizeModal";
import { filterItems } from "@/lib/filter";
import { personalize, sourcesFromItems } from "@/lib/personalize";
import { hasPersonalization, useUserStore } from "@/lib/userStore";
import type { AIItem, CategoryKey, Mode } from "@/lib/types";

const PAGE_SIZE = 12;
const TODAY_WINDOW_MS = 24 * 60 * 60 * 1000;
type ViewKey = "all" | "today" | "bookmarks" | "unread";

export interface FeedQuery {
  mode: Mode;
  category: CategoryKey | "all";
  since: string;
  keyword: string;
}

export default function FeedSection({
  items,
  query,
  now,
}: {
  items: AIItem[];
  query: FeedQuery;
  now: number;
}) {
  const { state, hydrated, toggleBookmark, markRead, toggleFollowSource, toggleMuteSource, toggleTopic, clearAll } =
    useUserStore();
  const [view, setView] = useState<ViewKey>("all");
  const [page, setPage] = useState(1);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  function exportBookmarks() {
    const md = items
      .filter((i) => state.bookmarks.includes(i.id))
      .map((i) => `- [${i.title}](${i.sourceUrl}) — ${i.source}`)
      .join("\n");
    if (!md || typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  useEffect(() => {
    setPage(1);
  }, [query.mode, query.category, query.since, query.keyword, view]);

  const base = useMemo(() => filterItems(items, { ...query, sort: "latest" }), [items, query]);
  const personalized = useMemo(
    () => (hydrated ? personalize(base, state) : base),
    [base, hydrated, state],
  );
  const bookmarks = useMemo(() => new Set(state.bookmarks), [state.bookmarks]);
  const readSet = useMemo(() => new Set(state.read), [state.read]);

  const todayCount = useMemo(
    () => base.filter((i) => i.firstSeen && now - new Date(i.firstSeen).getTime() < TODAY_WINDOW_MS).length,
    [base, now],
  );

  const viewed = useMemo(() => {
    if (view === "today")
      return personalized.filter((i) => i.firstSeen && now - new Date(i.firstSeen).getTime() < TODAY_WINDOW_MS);
    if (view === "bookmarks") return personalized.filter((i) => bookmarks.has(i.id));
    if (view === "unread") return personalized.filter((i) => !readSet.has(i.id));
    return personalized;
  }, [personalized, view, bookmarks, readSet, now]);

  const sources = useMemo(() => sourcesFromItems(items), [items]);

  const totalPages = Math.max(1, Math.ceil(viewed.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = viewed.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const views: { key: ViewKey; label: string }[] = [
    { key: "all", label: "全部" },
    { key: "today", label: todayCount ? `今日新增 ${todayCount}` : "今日新增" },
    { key: "bookmarks", label: hydrated && state.bookmarks.length ? `收藏 ${state.bookmarks.length}` : "收藏" },
    { key: "unread", label: "未读" },
  ];

  const tab = (active: boolean) =>
    "px-3 h-8 inline-flex items-center rounded-md text-sm transition " +
    (active ? "bg-brand-500 text-white" : "text-gray-600 hover:text-brand-600 hover:bg-brand-50");

  return (
    <>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div className="text-sm text-gray-500">
          显示 <span className="text-gray-800 font-medium">{viewed.length}</span> 条
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 flex-wrap">
            {views.map((v) => (
              <button key={v.key} onClick={() => setView(v.key)} className={tab(view === v.key)}>
                {v.label}
              </button>
            ))}
          </div>
          {hydrated && state.bookmarks.length > 0 && (
            <button
              onClick={exportBookmarks}
              className="px-3 h-8 inline-flex items-center rounded-md text-sm border border-gray-200 text-gray-600 hover:border-brand-500 transition"
            >
              {copied ? "已复制 ✓" : "导出收藏"}
            </button>
          )}
          <button
            onClick={() => setSettingsOpen(true)}
            className={
              "px-3 h-8 inline-flex items-center rounded-md text-sm border transition " +
              (hydrated && hasPersonalization(state)
                ? "border-brand-600 bg-brand-50 text-brand-700"
                : "border-gray-200 text-gray-600 hover:border-brand-500")
            }
          >
            个性化{hydrated && hasPersonalization(state) ? " ·" : ""}
          </button>
        </div>
      </div>

      <ItemList
        items={pageItems}
        bookmarks={bookmarks}
        readSet={readSet}
        now={now}
        keyword={query.keyword}
        onToggleBookmark={toggleBookmark}
        onOpen={markRead}
        emptyHint={
          view === "bookmarks"
            ? "还没有收藏。点卡片右上角的 ★ 收藏感兴趣的内容。"
            : view === "today"
              ? "今天还没有新增内容。"
              : view === "unread"
                ? "没有未读内容了。"
                : "没有匹配的内容，换个关键词或分类试试。"
        }
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(safePage - 1)}
            disabled={safePage <= 1}
            className="min-w-[36px] h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm hover:border-brand-500 disabled:opacity-40"
          >
            上一页
          </button>
          <span className="text-sm text-gray-500 px-2">
            {safePage} / {totalPages}
          </span>
          <button
            onClick={() => {
              setPage(safePage + 1);
              if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            disabled={safePage >= totalPages}
            className="min-w-[36px] h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm hover:border-brand-500 disabled:opacity-40"
          >
            下一页
          </button>
        </div>
      )}

      <PersonalizeModal
        open={settingsOpen}
        sources={sources}
        state={state}
        onToggleFollowSource={toggleFollowSource}
        onToggleMuteSource={toggleMuteSource}
        onToggleTopic={toggleTopic}
        onClear={clearAll}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
