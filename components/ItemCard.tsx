import type { AIItem } from "@/lib/types";
import { CATEGORY_MAP } from "@/lib/categories";
import { formatItemTime } from "@/lib/timeFormat";

export default function ItemCard({ item }: { item: AIItem }) {
  const cat = item.category ? CATEGORY_MAP[item.category] : null;
  const timeText = formatItemTime(item.publishedAt);

  return (
    <article className="card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs gap-2">
        {cat ? (
          <span className="px-2 py-0.5 rounded-md bg-brand-50 text-brand-600 font-medium shrink-0">
            {cat.label}
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 shrink-0">未分类</span>
        )}
        {timeText && <span className="text-gray-400 shrink-0">{timeText}</span>}
      </div>

      <a
        href={item.sourceUrl}
        target="_blank"
        rel="noreferrer"
        className="text-base font-semibold leading-snug hover:text-brand-600 line-clamp-2"
      >
        {item.title}
      </a>

      {item.summary && (
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {item.summary}
        </p>
      )}

      <div className="flex items-center justify-between pt-2 mt-auto border-t border-gray-100 text-xs text-gray-500">
        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="truncate hover:text-brand-600"
          title={item.source}
        >
          来源：{item.source}
        </a>
        {typeof item.heat === "number" && (
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
