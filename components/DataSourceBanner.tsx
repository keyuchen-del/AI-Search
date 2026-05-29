import type { DataOrigin } from "@/lib/types";

export default function DataSourceBanner({
  source,
  reason,
}: {
  source: DataOrigin;
  reason?: string;
}) {
  // local & aihot are real data — no banner. Only warn on the mock fallback.
  if (source !== "mock") return null;
  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2">
        <span className="font-medium">演示数据</span>
        <span className="text-amber-700">
          当前展示的是本地示例条目（{reason ? `原因：${reason}` : "尚未抓取真实数据"}）。
          运行 <code className="px-1 bg-amber-100 rounded">npm run crawl</code> 抓取真实资讯后会自动切换。
        </span>
      </div>
    </div>
  );
}
