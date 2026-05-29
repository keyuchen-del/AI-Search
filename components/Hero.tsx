import type { AIItem } from "@/lib/types";
import { CATEGORY_MAP } from "@/lib/categories";

export default function Hero({ item }: { item: AIItem }) {
  if (!item.image) return null;
  const cat = item.category ? CATEGORY_MAP[item.category] : null;
  return (
    <a
      href={item.sourceUrl}
      target="_blank"
      rel="noreferrer"
      className="card block overflow-hidden group mb-5"
    >
      <div className="relative h-56 sm:h-72">
        <img src={item.image} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <div className="flex items-center gap-2 text-xs mb-2">
            <span className="px-2 py-0.5 rounded bg-brand-500/90 font-medium">头条</span>
            {cat && <span className="px-2 py-0.5 rounded bg-white/15 backdrop-blur">{cat.label}</span>}
          </div>
          <h2 className="text-lg sm:text-2xl font-bold leading-snug line-clamp-2 group-hover:underline">
            {item.title}
          </h2>
          <div className="text-xs text-white/70 mt-1.5">{item.source}</div>
        </div>
      </div>
      {item.summary && <p className="p-4 text-sm text-gray-600 line-clamp-2">{item.summary}</p>}
    </a>
  );
}
