import Header from "@/components/Header";
import DataSourceBanner from "@/components/DataSourceBanner";
import DailyView from "@/components/DailyView";
import { getDaily, getDailies } from "@/lib/dailyData";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DailyLatest() {
  const { daily, source, fallbackReason } = await getDaily();
  const { items: archive } = await getDailies(10);

  return (
    <>
      <Header />
      <DataSourceBanner source={source} reason={fallbackReason} />
      <main className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-6">
        <DailyView daily={daily} />
        <aside className="card p-4 h-fit">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-brand-500 rounded-sm" />
            日报存档
          </h3>
          <ul className="space-y-1.5 text-sm">
            {archive.map((d) => (
              <li key={d.date}>
                <Link
                  href={`/daily/${d.date}`}
                  className="flex items-baseline gap-2 text-gray-700 hover:text-brand-600"
                >
                  <span className="font-mono text-xs text-gray-400 shrink-0">
                    {d.date}
                  </span>
                  {d.leadTitle && (
                    <span className="truncate">{d.leadTitle}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </main>
    </>
  );
}
