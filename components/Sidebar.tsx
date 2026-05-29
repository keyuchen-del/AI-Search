import Link from "next/link";
import type { AIItem } from "@/lib/types";
import { formatRelative } from "@/lib/timeFormat";

export default function Sidebar({ trending }: { trending: AIItem[] }) {
  const top = trending.slice(0, 8);

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
                    (idx < 3
                      ? "bg-brand-500 text-white"
                      : "bg-gray-100 text-gray-500")
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
            <Link
              href="/?category=ai-models&since=7d"
              className="text-gray-700 hover:text-brand-600"
            >
              · 最近一周模型发布
            </Link>
          </li>
          <li>
            <Link
              href="/?category=paper&since=7d"
              className="text-gray-700 hover:text-brand-600"
            >
              · 最近一周 AI 论文
            </Link>
          </li>
          <li>
            <Link
              href="/?keyword=OpenAI"
              className="text-gray-700 hover:text-brand-600"
            >
              · OpenAI 相关
            </Link>
          </li>
          <li>
            <Link
              href="/?keyword=Anthropic"
              className="text-gray-700 hover:text-brand-600"
            >
              · Anthropic 相关
            </Link>
          </li>
        </ul>
      </div>

      <div className="card p-4 text-xs text-gray-500 leading-relaxed">
        <p className="font-medium text-gray-700 mb-1">关于本站</p>
        <p>
          AI Search 聚合 AI 行业公开资讯，每日由 GitHub Actions 自动抓取并重新构建。
          数据来自 OpenAI、Google DeepMind、HuggingFace、arXiv、GitHub、Hacker News、
          量子位、36氪、The Verge、TechCrunch 等公开来源，每条均保留原文链接。
        </p>
      </div>
    </aside>
  );
}
