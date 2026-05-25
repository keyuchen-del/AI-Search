import { fetchDaily, fetchDailies } from "./aihot";
import type { DailyIndexItem, DailyReport } from "./types";
import { MOCK_ITEMS } from "./mockData";
import { CATEGORIES } from "./categories";

type DataSource = "aihot" | "mock" | "auto";

function getDataSource(): DataSource {
  const v = (process.env.DATA_SOURCE || "auto").toLowerCase();
  if (v === "aihot" || v === "mock") return v;
  return "auto";
}

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
      leadParagraph: "当前为本地演示数据。部署到外网后将自动展示 aihot.virxact.com 的真实日报。",
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

export interface DailyResult {
  daily: DailyReport;
  source: "aihot" | "mock";
  fallbackReason?: string;
}

export async function getDaily(date?: string): Promise<DailyResult> {
  const ds = getDataSource();
  if (ds === "mock") return { daily: mockDaily(date), source: "mock" };
  if (ds === "aihot") {
    const daily = await fetchDaily(date);
    return { daily, source: "aihot" };
  }
  try {
    const daily = await fetchDaily(date);
    return { daily, source: "aihot" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      daily: mockDaily(date),
      source: "mock",
      fallbackReason: msg.slice(0, 200),
    };
  }
}

export interface DailiesResult {
  count: number;
  items: DailyIndexItem[];
  source: "aihot" | "mock";
  fallbackReason?: string;
}

export async function getDailies(take = 14): Promise<DailiesResult> {
  const ds = getDataSource();
  if (ds === "mock") {
    const r = mockDailies(take);
    return { ...r, source: "mock" };
  }
  if (ds === "aihot") {
    const r = await fetchDailies(take);
    return { ...r, source: "aihot" };
  }
  try {
    const r = await fetchDailies(take);
    return { ...r, source: "aihot" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const r = mockDailies(take);
    return { ...r, source: "mock", fallbackReason: msg.slice(0, 200) };
  }
}
