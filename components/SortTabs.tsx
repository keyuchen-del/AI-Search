import Link from "next/link";
import type { Mode, CategoryKey } from "@/lib/types";

interface Props {
  mode: Mode;
  since: string;
  category: CategoryKey | "all";
  keyword?: string;
}

function href(params: {
  mode: Mode;
  since: string;
  category: string;
  keyword?: string;
}) {
  const sp = new URLSearchParams();
  if (params.category !== "all") sp.set("category", params.category);
  if (params.mode !== "selected") sp.set("mode", params.mode);
  if (params.since) sp.set("since", params.since);
  if (params.keyword) sp.set("keyword", params.keyword);
  sp.set("page", "1");
  return `/?${sp.toString()}`;
}

const MODE_OPTS: { key: Mode; label: string; hint: string }[] = [
  { key: "selected", label: "精选", hint: "AI HOT 每日精挑细选" },
  { key: "all", label: "全部", hint: "含未精选的次要条目" },
];

const SINCE_OPTS: { key: string; label: string }[] = [
  { key: "24h", label: "24 小时" },
  { key: "3d", label: "3 天" },
  { key: "7d", label: "7 天" },
  { key: "30d", label: "30 天" },
];

export default function SortTabs({ mode, since, category, keyword }: Props) {
  return (
    <div className="flex items-center mb-3 flex-wrap gap-3">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 text-sm">
          <span className="text-xs text-gray-400 mr-1">范围</span>
          {MODE_OPTS.map((o) => (
            <Link
              key={o.key}
              href={href({ mode: o.key, since, category, keyword })}
              title={o.hint}
              className={
                "px-3 h-8 inline-flex items-center rounded-md " +
                (mode === o.key
                  ? "bg-brand-500 text-white"
                  : "text-gray-600 hover:text-brand-600 hover:bg-brand-50")
              }
            >
              {o.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1 text-sm">
          <span className="text-xs text-gray-400 mr-1">时间</span>
          {SINCE_OPTS.map((o) => (
            <Link
              key={o.key}
              href={href({ mode, since: o.key, category, keyword })}
              className={
                "px-3 h-8 inline-flex items-center rounded-md " +
                (since === o.key
                  ? "bg-brand-500 text-white"
                  : "text-gray-600 hover:text-brand-600 hover:bg-brand-50")
              }
            >
              {o.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
