import Link from "next/link";
import type { AIItem } from "@/lib/types";
import type { StoreMeta } from "@/lib/localStore";
import type { ViewState } from "./HomeClient";
import { buildHref } from "@/lib/href";
import { CATEGORY_MAP } from "@/lib/categories";
import { formatBJDate } from "@/lib/timeFormat";

export default function Sidebar({
  trending,
  meta,
  state,
  sources,
  topics,
  trendSummary,
  recommend,
}: {
  trending: AIItem[];
  meta?: StoreMeta | null;
  state: ViewState;
  sources: [string, number][];
  topics?: { slug: string; name: string; count: number }[];
  trendSummary?: string | null;
  recommend?: AIItem[];
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
        <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
          <span className="w-1 h-4 bg-brand-500 rounded-sm" />
          本周最热
        </h3>
        <p className="text-[11px] text-gray-400 mb-3">按 GitHub Star / Hacker News 讨论热度排序</p>
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
                      {typeof item.heat === "number" && item.heat > 0 && (
                        <span className="text-amber-600 font-medium shrink-0">
                          ·{" "}
                          {item.origin === "github"
                            ? `★ ${item.heat.toLocaleString()}`
                            : item.origin === "hackernews"
                              ? `HN ${item.heat.toLocaleString()} 赞`
                              : item.heat.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ol>
        )}
        {trendSummary && (
          <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 leading-relaxed">
            <span className="text-brand-600 font-medium">AI 总结 · </span>
            {trendSummary}
          </div>
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

      {/* 推荐阅读 */}
      {recommend && recommend.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
            <span className="w-1 h-4 bg-brand-500 rounded-sm" />
            推荐阅读
          </h3>
          <p className="text-[11px] text-gray-400 mb-3">各方向精选，换个角度看 AI</p>
          <ul className="space-y-2.5">
            {recommend.map((it) => {
              const cat = it.category ? CATEGORY_MAP[it.category] : null;
              return (
                <li key={it.id} className="text-sm leading-snug">
                  <a href={it.sourceUrl} target="_blank" rel="noreferrer" className="group">
                    {cat && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-50 text-brand-600 mr-1.5 align-middle">
                        {cat.label}
                      </span>
                    )}
                    <span className="text-gray-700 group-hover:text-brand-600">{it.title}</span>
                  </a>
                </li>
              );
            })}
          </ul>
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
            <Link href="/topic/agent" className="text-gray-700 hover:text-brand-600">
              · AI Agent 话题
            </Link>
          </li>
          <li>
            <Link href="/topic/opensource" className="text-gray-700 hover:text-brand-600">
              · 开源模型话题
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
