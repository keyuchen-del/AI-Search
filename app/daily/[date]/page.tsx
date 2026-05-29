import Header from "@/components/Header";
import DataSourceBanner from "@/components/DataSourceBanner";
import DailyView from "@/components/DailyView";
import { getDaily, listDailyDates } from "@/lib/dailyData";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { abs } from "@/lib/seo";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Pre-render one page per date present in the crawled snapshot.
export function generateStaticParams() {
  return listDailyDates().map((date) => ({ date }));
}
export const dynamicParams = false;

export function generateMetadata({ params }: { params: { date: string } }): Metadata {
  return {
    title: `${params.date} AI 资讯日报`,
    description: `${params.date} 当天新收录的 AI 资讯自动汇编：今日精选、分板块重点与快讯。`,
    alternates: { canonical: abs(`/daily/${params.date}`) },
  };
}

interface Props {
  params: { date: string };
}

export default async function DailyByDate({ params }: Props) {
  if (!DATE_RE.test(params.date)) notFound();

  const dates = listDailyDates(); // newest-first
  const i = dates.indexOf(params.date);
  const newer = i > 0 ? dates[i - 1] : null; // a later date
  const older = i >= 0 && i < dates.length - 1 ? dates[i + 1] : null; // an earlier date

  const res = await getDaily(params.date);

  return (
    <>
      <Header />
      <DataSourceBanner source={res.source} reason={res.fallbackReason} />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <DailyView daily={res.daily} prevDate={older} nextDate={newer} />
      </main>
    </>
  );
}
