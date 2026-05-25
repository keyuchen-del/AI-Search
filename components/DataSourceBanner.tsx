export default function DataSourceBanner({
  source,
  reason,
}: {
  source: "aihot" | "mock";
  reason?: string;
}) {
  if (source === "aihot") return null;
  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2">
        <span className="font-medium">演示数据</span>
        <span className="text-amber-700">
          当前未能联通 aihot.virxact.com（{reason ? `原因：${reason}` : "可能是网络受限"}），
          展示的是示例条目。部署到外网环境后会自动切回真实数据。
        </span>
      </div>
    </div>
  );
}
