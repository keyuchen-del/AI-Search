"use client";

import type { AIItem } from "@/lib/types";
import ItemCard from "./ItemCard";

export default function ItemList({
  items,
  bookmarks,
  readSet,
  now,
  keyword,
  onToggleBookmark,
  onOpen,
  emptyHint = "没有匹配的内容，换个关键词或分类试试。",
}: {
  items: AIItem[];
  bookmarks?: Set<string>;
  readSet?: Set<string>;
  now?: number;
  keyword?: string;
  onToggleBookmark?: (id: string) => void;
  onOpen?: (id: string) => void;
  emptyHint?: string;
}) {
  if (items.length === 0) {
    return <div className="card p-10 text-center text-gray-500">{emptyHint}</div>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {items.map((it) => (
        <ItemCard
          key={it.id}
          item={it}
          bookmarked={bookmarks?.has(it.id)}
          read={readSet?.has(it.id)}
          now={now}
          keyword={keyword}
          onToggleBookmark={onToggleBookmark}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}
