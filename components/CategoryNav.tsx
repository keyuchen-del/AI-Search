import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import type { CategoryKey } from "@/lib/types";

interface Props {
  active: CategoryKey | "all";
  sort: "heat" | "latest";
  keyword?: string;
}

function buildHref(category: string, sort: string, keyword?: string) {
  const sp = new URLSearchParams();
  if (category !== "all") sp.set("category", category);
  if (sort) sp.set("sort", sort);
  if (keyword) sp.set("keyword", keyword);
  sp.set("page", "1");
  return `/?${sp.toString()}`;
}

export default function CategoryNav({ active, sort, keyword }: Props) {
  const tabs: { key: CategoryKey | "all"; label: string }[] = [
    { key: "all", label: "全部" },
    ...CATEGORIES.map((c) => ({ key: c.key, label: c.label })),
  ];

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto scroll-hide">
        {tabs.map((t) => {
          const isActive = active === t.key;
          return (
            <Link
              key={t.key}
              href={buildHref(t.key, sort, keyword)}
              className={
                "shrink-0 px-3 h-11 flex items-center text-sm border-b-2 transition-colors " +
                (isActive
                  ? "border-brand-500 text-brand-600 font-medium"
                  : "border-transparent text-gray-600 hover:text-brand-600")
              }
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
