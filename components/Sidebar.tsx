import Link from "next/link";
import type { AIItem } from "@/lib/types";
import type { StoreMeta } from "@/lib/localStore";
import type { ViewState } from "./HomeClient";
import { buildHref } from "@/lib/href";
import { formatBJDate, formatRelative } from "@/lib/timeFormat";

function Flame() {
  return (
    <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 1c1 3 .5 5-1 7C11 10 9 12 9 15a5 5 0 0 0 10 0c0-1.5-.5-3-1.5-4 .5 1 .5 2 0 3a3 3 0 0 1-5.5-2c0-2 1-3 2-5 1-2 1-4-.5-6Z" />
    </svg>
  );
}

export default function Sidebar({
  trending,
  meta,
  state,
  sources,
  topics,
}: {
  trending: AIItem[];
  meta?: StoreMeta | null;
  state: ViewState;
  sources: [string, number][];
  topics?: { slug: string; name: string; count: number }[];
}) {
  const top = trending.slice(0, 8);
  const failed = meta ? Object.keys(meta.errors ?? {}).length : 0;
  const topSources = sources.slice(0, 14);

  const sourceHref = (name: string) =>
    buildHref({
      category: state.category,
      mode: state.mode,
      since: state.since,
      keyword: state.keyword,
      source: state.source === name ? undefined : name,
    });

  return (
    <aside className="space-y-4">
      {/* 热门榜单 */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-brand-500 rounded-sm" />
          热门榜单
        </h3>
        {top.length === 0 ? (
          <p className="text-sm text-gray-500">暂无数据</p>
        ) : (
          <ol className="space-y-1">
            {top.map((item, idx) => (
              <li key={item.id}>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex gap-2.5 -mx-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition"
                >
                  <span
                    className={
                      "shrink-0 w-5 h-5 grid place-items-center rounded-md font-mono text-xs font-semibold " +
                      (idx < 3
                        ? "bg-gradient-to-br from-brand-500 to-brand-700 text-white"
                        : "bg-gray-100 text-gray-400")
                    }
                  >
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="text-sm text-gray-700 group-hover:text-brand-600 line-clamp-2 leading-snug">
                      {item.title}
                    </span>
                    <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1.5 truncate">
                      <span className="truncate">{item.source}</span>
                      {item.publishedAt && <span>· {formatRelative(item.publishedAt)}</span>}
                      {typeof item.heat === "number" && item.heat > 0 && (
                        <span className="flex items-center gap-0.5 text-amber-500">
                          · <Flame />
                          {item.heat.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* 数据来源（可点筛选） */}
      {sources.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
            <span className="w-1 h-4 bg-brand-500 rounded-sm" />
            数据来源
          </h3>
          <div className="text-[11px] text-gray-400 mb-2.5">
            {meta?.fetchedAt && <>更新于 {formatBJDate(meta.fetchedAt)} · </>}
            {sources.length} 个来源
            {failed > 0 && <span className="text-amber-500"> · {failed} 个未更新</span>}
            <span className="text-gray-400"> · 点击筛选</span>
          </div>
          <ul className="space-y-0.5 max-h-72 overflow-y-auto scroll-hide -mx-1">
            {topSources.map(([name, n]) => {
              const active = state.source === name;
              return (
                <li key={name}>
                  <Link
                    href={sourceHref(name)}
                    className={
                      "flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition " +
                      (active ? "bg-brand-50 text-brand-700 font-medium" : "text-gray-600 hover:bg-gray-50")
                    }
                  >
                    <span
                      className={
                        "w-1.5 h-1.5 rounded-full shrink-0 " + (active ? "bg-brand-500" : "bg-emerald-400")
                      }
                    />
                    <span className="truncate flex-1">{name}</span>
                    <span
                      className={
                        "shrink-0 text-xs tabular-nums " + (active ? "text-brand-500" : "text-gray-400")
                      }
                    >
                      {n}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          {state.source && (
            <Link
              href={buildHref({ category: state.category, mode: state.mode, since: state.since, keyword: state.keyword })}
              className="mt-2 inline-block text-xs text-brand-600 hover:underline"
            >
              ← 清除来源筛选
            </Link>
          )}
        </div>
      )}

      {/* 热门话题 */}
      {topics && topics.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-brand-500 rounded-sm" />
            热门话题
          </h3>
          <div className="flex flex-wrap gap-2">
            {topics.map((t) => (
              <Link
                key={t.slug}
                href={`/topic/${t.slug}`}
                className="px-2.5 py-1 rounded-full text-xs border border-gray-200 text-gray-600 hover:border-brand-500 hover:text-brand-600 transition"
              >
                {t.name}
                <span className="ml-1 text-gray-400">{t.count}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 快速入口 */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-brand-500 rounded-sm" />
          快速入口
        </h3>
        <ul className="space-y-1.5 text-sm">
          <li>
            <Link href="/daily" className="text-gray-700 hover:text-brand-600">
              · 今日 AI 资讯日报
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
        </ul>
      </div>
    </aside>
  );
}
