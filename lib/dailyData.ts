import { fetchDaily, fetchDailies } from "./aihot";
import { CATEGORIES } from "./categories";
import { getDataSourceMode } from "./config";
import { hasFreshLocalData, readLocalItems, readStoreMeta } from "./localStore";
import { MOCK_ITEMS } from "./mockData";
import type { AIItem, DailyIndexItem, DailyReport, DataOrigin } from "./types";

const ITEMS_PER_SECTION = 8;
const FLASH_COUNT = 6;
/** Each report is a rolling digest ending at the target day (sources have
 *  heterogeneous timestamps, so a strict single calendar day is too sparse). */
const DAILY_WINDOW_HOURS = Number(process.env.DAILY_WINDOW_HOURS || 72);

function dayOf(iso: string | null | undefined): string | null {
  if (!iso) return null;
  return iso.slice(0, 10);
}

function distinctDatesDesc(items: AIItem[]): string[] {
  const set = new Set<string>();
  for (const i of items) {
    const d = dayOf(i.publishedAt);
    if (d) set.add(d);
  }
  return [...set].sort((a, b) => b.localeCompare(a));
}

/** Headline for a digest: newest item that has a summary (real lead paragraph),
 *  falling back to the newest item. Avoids GitHub repos (no summary, huge heat)
 *  dominating the lead purely by star count. */
function pickLead(items: AIItem[]): AIItem | null {
  if (items.length === 0) return null;
  const byTime = [...items].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
  return byTime.find((i) => i.summary) ?? byTime[0];
}

// ---- local store -> DailyReport ------------------------------------------

function buildLocalDaily(
  date: string,
  dayItems: AIItem[],
  generatedAt: string,
  windowStart: string,
  windowEnd: string,
): DailyReport {
  const sections = CATEGORIES.map((c) => {
    const pool = dayItems
      .filter((i) => i.category === c.key)
      .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
      .slice(0, ITEMS_PER_SECTION);
    return {
      label: c.label,
      items: pool.map((i) => ({
        title: i.title,
        summary: i.summary,
        sourceUrl: i.sourceUrl,
        sourceName: i.source,
      })),
    };
  });

  const lead = pickLead(dayItems);
  const leadParagraph = lead
    ? lead.summary ||
      `${date} 共收录 ${dayItems.length} 条 AI 资讯，涵盖模型、产品、行业、论文与观点等方向。`
    : "";

  const flashes = [...dayItems]
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
    .slice(0, FLASH_COUNT)
    .map((i) => ({
      title: i.title,
      sourceName: i.source,
      sourceUrl: i.sourceUrl,
      publishedAt: i.publishedAt ?? "",
    }));

  return {
    date,
    generatedAt,
    windowStart,
    windowEnd,
    lead: lead ? { title: lead.title, leadParagraph } : null,
    sections,
    flashes,
  };
}

function localDaily(date?: string): DailyReport | null {
  const items = readLocalItems();
  if (items.length === 0) return null;
  const target = date || new Date().toISOString().slice(0, 10);
  const endMs = Date.parse(`${target}T23:59:59.999Z`);
  const startMs = endMs - DAILY_WINDOW_HOURS * 60 * 60 * 1000;
  const dayItems = items.filter((i) => {
    if (!i.publishedAt) return false;
    const t = Date.parse(i.publishedAt);
    return Number.isFinite(t) && t >= startMs && t <= endMs;
  });
  const generatedAt = readStoreMeta()?.fetchedAt || new Date().toISOString();
  return buildLocalDaily(
    target,
    dayItems,
    generatedAt,
    new Date(startMs).toISOString(),
    new Date(endMs).toISOString(),
  );
}

/** Distinct dates (newest first) present in the local snapshot — drives static
 *  generation of /daily/[date] pages and prev/next navigation. */
export function listDailyDates(): string[] {
  return distinctDatesDesc(readLocalItems());
}

function localDailies(take: number): { count: number; items: DailyIndexItem[] } | null {
  const items = readLocalItems();
  if (items.length === 0) return null;
  const generatedAt = readStoreMeta()?.fetchedAt || new Date().toISOString();
  const out: DailyIndexItem[] = distinctDatesDesc(items)
    .slice(0, take)
    .map((date) => {
      const lead = pickLead(items.filter((i) => dayOf(i.publishedAt) === date));
      return { date, generatedAt, leadTitle: lead?.title ?? null };
    });
  return { count: out.length, items: out };
}

// ---- mock fallback --------------------------------------------------------

function mockDaily(date?: string): DailyReport {
  const today = date || new Date().toISOString().slice(0, 10);
  const start = new Date(today);
  const end = new Date(start.getTime() + 24 * 3600 * 1000);
  const sections = CATEGORIES.map((c) => {
    const pool = MOCK_ITEMS.filter((i) => i.category === c.key).slice(0, 4);
    return {
      label: c.label,
      items: pool.map((i) => ({
        title: i.title,
        summary: i.summary,
        sourceUrl: i.sourceUrl,
        sourceName: i.source,
      })),
    };
  });
  return {
    date: today,
    generatedAt: new Date().toISOString(),
    windowStart: start.toISOString(),
    windowEnd: end.toISOString(),
    lead: {
      title: "演示版 AI 日报",
      leadParagraph: "当前为本地演示数据。运行 npm run crawl 抓取真实数据后将展示由真实条目生成的日报。",
    },
    sections,
    flashes: [],
  };
}

function mockDailies(take: number): { count: number; items: DailyIndexItem[] } {
  const items: DailyIndexItem[] = [];
  for (let i = 0; i < take; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    items.push({
      date: d.toISOString().slice(0, 10),
      generatedAt: d.toISOString(),
      leadTitle: i === 0 ? "演示版 AI 日报" : `演示日报 ${i}`,
    });
  }
  return { count: items.length, items };
}

// ---- public API -----------------------------------------------------------

export interface DailyResult {
  daily: DailyReport;
  source: DataOrigin;
  fallbackReason?: string;
}

export async function getDaily(date?: string): Promise<DailyResult> {
  const mode = getDataSourceMode();
  if (mode === "mock") return { daily: mockDaily(date), source: "mock" };
  if (mode === "local") {
    const daily = localDaily(date);
    return daily
      ? { daily, source: "local" }
      : { daily: mockDaily(date), source: "mock", fallbackReason: "本地快照为空，请先运行 npm run crawl" };
  }
  if (mode === "aihot") return { daily: await fetchDaily(date), source: "aihot" };

  // auto
  if (hasFreshLocalData()) {
    const daily = localDaily(date);
    if (daily) return { daily, source: "local" };
  }
  try {
    return { daily: await fetchDaily(date), source: "aihot" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { daily: mockDaily(date), source: "mock", fallbackReason: msg.slice(0, 200) };
  }
}

export interface DailiesResult {
  count: number;
  items: DailyIndexItem[];
  source: DataOrigin;
  fallbackReason?: string;
}

export async function getDailies(take = 14): Promise<DailiesResult> {
  const mode = getDataSourceMode();
  if (mode === "mock") return { ...mockDailies(take), source: "mock" };
  if (mode === "local") {
    const r = localDailies(take);
    return r ? { ...r, source: "local" } : { ...mockDailies(take), source: "mock" };
  }
  if (mode === "aihot") return { ...(await fetchDailies(take)), source: "aihot" };

  // auto
  if (hasFreshLocalData()) {
    const r = localDailies(take);
    if (r) return { ...r, source: "local" };
  }
  try {
    return { ...(await fetchDailies(take)), source: "aihot" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ...mockDailies(take), source: "mock", fallbackReason: msg.slice(0, 200) };
  }
}
