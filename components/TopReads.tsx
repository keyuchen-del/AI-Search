import type { Digest } from "@/lib/types";

export default function TopReads({ digest }: { digest: Digest | null }) {
  if (!digest || digest.picks.length === 0) return null;
  return (
    <div className="card p-5 mb-5">
      <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
        <span className="w-1 h-4 bg-brand-500 rounded-sm" />
        AI 每日必读
        <span className="text-xs text-gray-400 font-normal">由 AI 从今日内容精选</span>
      </h2>
      <ol className="space-y-3">
        {digest.picks.map((p, i) => (
          <li key={i} className="flex gap-2.5 text-sm">
            <span className="shrink-0 w-5 h-5 grid place-items-center rounded bg-brand-500 text-white text-xs font-mono">
              {i + 1}
            </span>
            <div className="min-w-0">
              <a
                href={p.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium hover:text-brand-600 leading-snug"
              >
                {p.title}
              </a>
              <span className="text-gray-400 text-xs ml-2">— {p.source}</span>
              <p className="text-gray-600 text-xs mt-0.5 leading-relaxed">{p.reason}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
