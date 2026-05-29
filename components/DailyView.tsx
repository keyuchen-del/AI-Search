"use client";

import Link from "next/link";
import type { DailyReport } from "@/lib/types";
import { CATEGORY_MAP } from "@/lib/categories";
import { formatBJDate, formatRelative } from "@/lib/timeFormat";
import { useUserStore } from "@/lib/userStore";
import { cleanText } from "@/lib/text";

function countItems(d: DailyReport): number {
  return d.sections.reduce((sum, s) => sum + s.items.length, 0);
}

function Star({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={on ? "取消收藏" : "收藏"}
      title={on ? "取消收藏" : "收藏"}
      className={"shrink-0 transition " + (on ? "text-amber-500" : "text-gray-300 hover:text-amber-500")}
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="m12 17.3-6.18 3.7 1.64-7.03L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-5.46 4.73L18.18 21z" />
      </svg>
    </button>
  );
}

export default function DailyView({
  daily,
  prevDate,
  nextDate,
}: {
  daily: DailyReport;
  prevDate?: string | null;
  nextDate?: string | null;
}) {
  const { state, toggleBookmark, markRead } = useUserStore();
  const bookmarks = new Set(state.bookmarks);
  const readSet = new Set(state.read);
  const total = countItems(daily);
  let counter = 0;

  return (
    <article className="space-y-6">
      <header className="card p-5">
        <div className="text-xs text-gray-500 mb-2">AI 资讯日报 · {daily.date} · 今日新收录 {total} 条</div>
        <h1 className="text-xl font-semibold leading-snug mb-2">{daily.date} · AI 资讯日报</h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          {daily.lead?.leadParagraph ?? `今日新收录 ${total} 条公开资讯。`}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          本日报由系统根据当天新收录的公开资讯自动汇编、按方向归类，非 AI 生成；点击任意条目可溯源原文。
        </p>
      </header>

      {daily.featured && daily.featured.length > 0 && (
        <section className="card p-5">
          <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-brand-500 rounded-sm" />
            今日精选
            <span className="text-xs text-gray-400 font-normal">{daily.featured.length} 条</span>
          </h2>
          <ol className="space-y-4">
            {daily.featured.map((it, idx) => {
              const read = !!it.id && readSet.has(it.id);
              const cat = it.category ? CATEGORY_MAP[it.category] : null;
              return (
                <li key={`f-${idx}`} className={"text-sm" + (read ? " opacity-60" : "")}>
                  <div className="flex gap-2">
                    <span className="shrink-0 w-6 text-right text-brand-500 font-mono text-xs leading-6 font-semibold">
                      {idx + 1}.
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-2">
                        <div className="min-w-0 flex-1">
                          {cat && (
                            <span className="inline-block mr-2 px-1.5 py-0.5 rounded bg-brand-50 text-brand-600 text-[11px] align-middle">
                              {cat.label}
                            </span>
                          )}
                          <a
                            href={it.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => it.id && markRead(it.id)}
                            className="font-medium text-gray-900 hover:text-brand-600 leading-snug"
                          >
                            {it.title}
                          </a>
                          <span className="text-gray-400 ml-2">— {it.sourceName}</span>
                        </div>
                        {it.id && <Star on={bookmarks.has(it.id)} onClick={() => toggleBookmark(it.id!)} />}
                      </div>
                      {it.summary && <p className="text-gray-600 leading-relaxed mt-1">{it.summary}</p>}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {daily.sections.map((sec) => {
        if (sec.items.length === 0) return null;
        return (
          <section key={sec.label} className="card p-5">
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-brand-500 rounded-sm" />
              {sec.label}
              <span className="text-xs text-gray-400 font-normal">{sec.items.length} 条</span>
            </h2>
            <ol className="space-y-4">
              {sec.items.map((it) => {
                counter += 1;
                const read = !!it.id && readSet.has(it.id);
                return (
                  <li key={`${sec.label}-${counter}`} className={"text-sm" + (read ? " opacity-60" : "")}>
                    <div className="flex gap-2">
                      <span className="shrink-0 w-6 text-right text-gray-400 font-mono text-xs leading-6">
                        {counter}.
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-2">
                          <div className="min-w-0 flex-1">
                            <a
                              href={it.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => it.id && markRead(it.id)}
                              className="font-medium text-gray-900 hover:text-brand-600 leading-snug"
                            >
                              {it.title}
                            </a>
                            <span className="text-gray-400 ml-2">— {it.sourceName}</span>
                          </div>
                          {it.id && <Star on={bookmarks.has(it.id)} onClick={() => toggleBookmark(it.id!)} />}
                        </div>
                        {(it.aiNote || it.summary) && (
                          <p className="text-gray-600 leading-relaxed mt-1">
                            {it.aiNote ? (
                              <>
                                <span className="text-brand-600 font-medium">AI 导读 · </span>
                                {it.aiNote}
                              </>
                            ) : (
                              cleanText(it.summary)
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}

      {daily.flashes && daily.flashes.length > 0 && (
        <section className="card p-5">
          <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-brand-500 rounded-sm" />
            快讯
          </h2>
          <ul className="space-y-2 text-sm">
            {daily.flashes.map((f, idx) => (
              <li key={`${f.sourceUrl}-${idx}`} className="flex gap-2">
                <span className="text-gray-400 shrink-0">·</span>
                <div className="min-w-0 flex-1">
                  <a href={f.sourceUrl} target="_blank" rel="noreferrer" className="text-gray-800 hover:text-brand-600">
                    {f.title}
                  </a>
                  <span className="text-gray-400 ml-2 text-xs">
                    — {f.sourceName} · {formatRelative(f.publishedAt)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="text-xs text-gray-400 text-center">日报生成时间：{formatBJDate(daily.generatedAt)}</div>

      <DailyNav prevDate={prevDate} nextDate={nextDate} />
    </article>
  );
}

function DailyNav({ prevDate, nextDate }: { prevDate?: string | null; nextDate?: string | null }) {
  return (
    <div className="flex items-center justify-between text-sm">
      {prevDate ? (
        <Link href={`/daily/${prevDate}`} className="text-gray-600 hover:text-brand-600">
          ← {prevDate}
        </Link>
      ) : (
        <span className="text-gray-300">← 没有更早</span>
      )}
      <Link href="/daily" className="text-gray-600 hover:text-brand-600">
        最新日报
      </Link>
      {nextDate ? (
        <Link href={`/daily/${nextDate}`} className="text-gray-600 hover:text-brand-600">
          {nextDate} →
        </Link>
      ) : (
        <span className="text-gray-300">没有更新 →</span>
      )}
    </div>
  );
}
