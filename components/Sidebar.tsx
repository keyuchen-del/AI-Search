import Link from "next/link";
import type { AIItem } from "@/lib/types";
import type { StoreMeta } from "@/lib/localStore";
import { formatBJDate, formatRelative } from "@/lib/timeFormat";

export default function Sidebar({ trending, meta }: { trending: AIItem[]; meta?: StoreMeta | null }) {
  const top = trending.slice(0, 8);
  const sources = meta
    ? Object.entries(meta.sources).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1])
    : [];
  const failed = meta ? Object.keys(meta.errors ?? {}).length : 0;

  return (
    <aside className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-brand-500 rounded-sm" />
          热门榜单
        </h3>
        {top.length === 0 ? (
          <p className="text-sm text-gray-500">暂无数据</p>
        ) : (
          <ol className="space-y-2">
            {top.map((item, idx) => (
              <li key={item.id} className="flex gap-2 text-sm">
                <span
                  className={
                    "shrink-0 w-5 text-center font-mono text-xs leading-5 rounded " +
                    (idx < 3 ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-500")
                  }
                >
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-700 hover:text-brand-600 line-clamp-2 block"
                  >
                    {item.title}
                  </a>
                  <div className="text-[11px] text-gray-400 mt-0.5 truncate">
                    {item.source}
                    {item.publishedAt && <> · {formatRelative(item.publishedAt)}</>}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      {meta && sources.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-brand-500 rounded-sm" />
            数据来源
          </h3>
          <div className="text-[11px] text-gray-400 mb-2">
            {meta.fetchedAt && <>更新于 {formatBJDate(meta.fetchedAt)} · </>}
            {sources.length} 个来源
            {failed > 0 && <span className="text-amber-500"> · {failed} 个未更新</span>}
          </div>
          <ul className="space-y-1 text-xs max-h-56 overflow-y-auto scroll-hide">
            {sources.map(([id, n]) => (
              <li key={id} className="flex items-center justify-between gap-2 text-gray-600">
                <span className="truncate">{id}</span>
                <span className="shrink-0 text-gray-400">{n}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-brand-500 rounded-sm" />
          快速入口
        </h3>
        <ul className="space-y-1.5 text-sm">
          <li>
            <Link href="/daily" className="text-gray-700 hover:text-brand-600">
              · 今日 AI HOT 日报
            </Link>
          </li>
          <li>
            <Link href="/?category=ai-models&since=7d" className="text-gray-700 hover:text-brand-600">
              · 最近一周模型发布
            </Link>
          </li>
          <li>
            <Link href="/?category=paper&since=7d" className="text-gray-700 hover:text-brand-600">
              · 最近一周 AI 论文
            </Link>
          </li>
          <li>
            <Link href="/?keyword=OpenAI" className="text-gray-700 hover:text-brand-600">
              · OpenAI 相关
            </Link>
          </li>
          <li>
            <Link href="/?keyword=Anthropic" className="text-gray-700 hover:text-brand-600">
              · Anthropic 相关
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
