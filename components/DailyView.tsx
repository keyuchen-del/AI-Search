import Link from "next/link";
import type { DailyReport } from "@/lib/types";
import { formatBJDate, formatRelative } from "@/lib/timeFormat";

function countItems(d: DailyReport): number {
  return d.sections.reduce((sum, s) => sum + s.items.length, 0);
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
  const total = countItems(daily);
  let counter = 0;

  return (
    <article className="space-y-6">
      <header className="card p-5">
        <div className="text-xs text-gray-500 mb-2">
          AI HOT 日报 · {daily.date} · 共 {total} 条
        </div>
        {daily.lead ? (
          <>
            <h1 className="text-xl font-semibold leading-snug mb-2">
              {daily.lead.title}
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              {daily.lead.leadParagraph}
            </p>
          </>
        ) : (
          <h1 className="text-xl font-semibold">AI HOT 日报 · {daily.date}</h1>
        )}
      </header>

      {daily.sections.map((sec) => {
        if (sec.items.length === 0) return null;
        return (
          <section key={sec.label} className="card p-5">
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-brand-500 rounded-sm" />
              {sec.label}
              <span className="text-xs text-gray-400 font-normal">
                {sec.items.length} 条
              </span>
            </h2>
            <ol className="space-y-4">
              {sec.items.map((it) => {
                counter += 1;
                return (
                  <li key={`${sec.label}-${counter}`} className="text-sm">
                    <div className="flex gap-2">
                      <span className="shrink-0 w-6 text-right text-gray-400 font-mono text-xs leading-6">
                        {counter}.
                      </span>
                      <div className="min-w-0 flex-1">
                        <a
                          href={it.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-gray-900 hover:text-brand-600 leading-snug"
                        >
                          {it.title}
                        </a>
                        <span className="text-gray-400 ml-2">— {it.sourceName}</span>
                        {it.summary && (
                          <p className="text-gray-600 leading-relaxed mt-1">
                            {it.summary}
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
                  <a
                    href={f.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-800 hover:text-brand-600"
                  >
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

      <div className="text-xs text-gray-400 text-center">
        日报生成时间：{formatBJDate(daily.generatedAt)}
      </div>

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
