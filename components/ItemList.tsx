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
  // 小红书式错落瀑布流：有图卡片高、无图卡片矮，按列自然交错（纯 CSS columns）。
  return (
    <div className="columns-1 sm:columns-2 xl:columns-3 gap-4">
      {items.map((it) => (
        <div key={it.id} className="mb-4 break-inside-avoid">
          <ItemCard
            item={it}
            bookmarked={bookmarks?.has(it.id)}
            read={readSet?.has(it.id)}
            now={now}
            keyword={keyword}
            onToggleBookmark={onToggleBookmark}
            onOpen={onOpen}
          />
        </div>
      ))}
    </div>
  );
}
