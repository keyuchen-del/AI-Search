import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import type { CategoryKey, Mode } from "@/lib/types";

interface Props {
  active: CategoryKey | "all";
  mode: Mode;
  since?: string;
  keyword?: string;
}

function buildHref(opts: {
  category: string;
  mode: Mode;
  since?: string;
  keyword?: string;
}) {
  const sp = new URLSearchParams();
  if (opts.category !== "all") sp.set("category", opts.category);
  if (opts.mode !== "selected") sp.set("mode", opts.mode);
  if (opts.since) sp.set("since", opts.since);
  if (opts.keyword) sp.set("keyword", opts.keyword);
  sp.set("page", "1");
  return `/?${sp.toString()}`;
}

export default function CategoryNav({ active, mode, since, keyword }: Props) {
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
              href={buildHref({ category: t.key, mode, since, keyword })}
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
