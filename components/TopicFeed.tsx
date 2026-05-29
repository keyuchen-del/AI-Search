"use client";

import ItemList from "./ItemList";
import { useUserStore } from "@/lib/userStore";
import type { AIItem } from "@/lib/types";

export default function TopicFeed({ items, now }: { items: AIItem[]; now: number }) {
  const { state, toggleBookmark, markRead } = useUserStore();
  return (
    <ItemList
      items={items}
      bookmarks={new Set(state.bookmarks)}
      readSet={new Set(state.read)}
      now={now}
      onToggleBookmark={toggleBookmark}
      onOpen={markRead}
      emptyHint="暂无相关历史资讯。"
    />
  );
}
