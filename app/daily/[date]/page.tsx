import Header from "@/components/Header";
import DataSourceBanner from "@/components/DataSourceBanner";
import DailyView from "@/components/DailyView";
import { getDaily } from "@/lib/dailyData";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface Props {
  params: { date: string };
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export default async function DailyByDate({ params }: Props) {
  if (!DATE_RE.test(params.date)) notFound();

  let res;
  try {
    res = await getDaily(params.date);
  } catch {
    notFound();
  }

  if (!res) notFound();

  return (
    <>
      <Header />
      <DataSourceBanner source={res.source} reason={res.fallbackReason} />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <DailyView daily={res.daily} />
      </main>
    </>
  );
}
