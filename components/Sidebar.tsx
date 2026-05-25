import Link from "next/link";
import { MOCK_ITEMS } from "@/lib/mockData";

export default function Sidebar() {
  const trending = [...MOCK_ITEMS]
    .sort((a, b) => b.heat - a.heat)
    .slice(0, 8);

  const tags = Array.from(
    new Set(MOCK_ITEMS.flatMap((i) => i.tags)),
  ).slice(0, 16);

  return (
    <aside className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-brand-500 rounded-sm" />
          热门榜单
        </h3>
        <ol className="space-y-2">
          {trending.map((item, idx) => (
            <li key={item.id} className="flex gap-2 text-sm">
              <span
                className={
                  "shrink-0 w-5 text-center font-mono text-xs leading-5 rounded " +
                  (idx < 3
                    ? "bg-brand-500 text-white"
                    : "bg-gray-100 text-gray-500")
                }
              >
                {idx + 1}
              </span>
              <Link
                href={item.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-gray-700 hover:text-brand-600 line-clamp-2"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ol>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-brand-500 rounded-sm" />
          热门标签
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <Link
              key={t}
              href={`/?keyword=${encodeURIComponent(t)}`}
              className="text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-brand-50 hover:text-brand-600"
            >
              #{t}
            </Link>
          ))}
        </div>
      </div>

      <div className="card p-4 text-xs text-gray-500 leading-relaxed">
        <p className="font-medium text-gray-700 mb-1">关于本站</p>
        <p>
          AI Search 聚合 AI 行业的资讯、模型、工具与研究进展。当前为骨架版本，数据为示例数据，爬虫接入与持久化将在后续版本完成。
        </p>
      </div>
    </aside>
  );
}
