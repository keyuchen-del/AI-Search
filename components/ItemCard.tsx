"use client";

import type { AIItem } from "@/lib/types";
import { CATEGORY_MAP } from "@/lib/categories";
import { formatItemTime } from "@/lib/timeFormat";
import { highlight } from "@/lib/highlight";
import { cleanText } from "@/lib/text";

const NEW_WINDOW_MS = 48 * 60 * 60 * 1000;

export default function ItemCard({
  item,
  bookmarked = false,
  read = false,
  now,
  keyword,
  onToggleBookmark,
  onOpen,
}: {
  item: AIItem;
  bookmarked?: boolean;
  read?: boolean;
  now?: number;
  keyword?: string;
  onToggleBookmark?: (id: string) => void;
  onOpen?: (id: string) => void;
}) {
  const cat = item.category ? CATEGORY_MAP[item.category] : null;
  const timeText = formatItemTime(item.publishedAt);
  const isNew =
    !!item.firstSeen && !!now && now - new Date(item.firstSeen).getTime() < NEW_WINDOW_MS;

  return (
    <article className={"card p-4 flex flex-col gap-3" + (read ? " opacity-60" : "")}>
      {item.image && (
        <img
          src={item.image}
          alt=""
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
          className="w-full h-40 object-cover rounded-lg bg-gray-100"
        />
      )}
      <div className="flex items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {cat ? (
            <span className="px-2 py-0.5 rounded-md bg-brand-50 text-brand-600 font-medium shrink-0">
              {cat.label}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 shrink-0">未分类</span>
          )}
          {isNew && (
            <span className="px-1.5 py-0.5 rounded bg-red-500 text-white font-medium shrink-0">NEW</span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {read && <span className="text-gray-400">已读</span>}
          {timeText && <span className="text-gray-400">{timeText}</span>}
          {onToggleBookmark && (
            <button
              type="button"
              onClick={() => onToggleBookmark(item.id)}
              aria-label={bookmarked ? "取消收藏" : "收藏"}
              title={bookmarked ? "取消收藏" : "收藏"}
              className={"transition " + (bookmarked ? "text-amber-500" : "text-gray-300 hover:text-amber-500")}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="m12 17.3-6.18 3.7 1.64-7.03L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-5.46 4.73L18.18 21z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <a
        href={item.sourceUrl}
        target="_blank"
        rel="noreferrer"
        onClick={() => onOpen?.(item.id)}
        className="text-base font-semibold leading-snug hover:text-brand-600 line-clamp-2"
      >
        {highlight(item.title, keyword)}
      </a>

      {item.summary && (
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {highlight(cleanText(item.summary), keyword)}
        </p>
      )}

      {item.aiNote && (
        <p className="text-xs text-brand-700 bg-brand-50 rounded-md px-2 py-1.5 leading-relaxed">
          <span className="font-medium">AI 点评 · </span>
          {item.aiNote}
        </p>
      )}

      <div className="flex items-center justify-between pt-2 mt-auto border-t border-gray-100 text-xs text-gray-500">
        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => onOpen?.(item.id)}
          className="truncate hover:text-brand-600"
          title={item.source}
        >
          来源：{item.source}
        </a>
        {typeof item.heat === "number" && item.heat > 0 && (
          <span className="flex items-center gap-1 shrink-0">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.5 1c1 3 .5 5-1 7C11 10 9 12 9 15a5 5 0 0 0 10 0c0-1.5-.5-3-1.5-4 .5 1 .5 2 0 3a3 3 0 0 1-5.5-2c0-2 1-3 2-5 1-2 1-4-.5-6Z" />
            </svg>
            {item.heat.toLocaleString()}
          </span>
        )}
      </div>
    </article>
  );
}
