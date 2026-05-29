import fs from "node:fs";
import path from "node:path";
import { ARCHIVE_DIR } from "../../lib/config";
import type { AIItem } from "../../lib/types";

const RETAIN_MONTHS = Number(process.env.ARCHIVE_MONTHS || 3);

function monthOf(iso: string | null | undefined): string {
  return (iso || "").slice(0, 7); // YYYY-MM
}

function shardPath(month: string): string {
  return path.join(ARCHIVE_DIR, `${month}.json`);
}

function readShard(month: string): AIItem[] {
  try {
    const arr = JSON.parse(fs.readFileSync(shardPath(month), "utf8"));
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function keepMonths(): Set<string> {
  const keep = new Set<string>();
  const now = new Date();
  for (let i = 0; i < RETAIN_MONTHS; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keep.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return keep;
}

/** Merge this crawl's items into monthly archive shards (dedup by id), prune old shards. */
export function updateArchive(items: AIItem[]): { months: Record<string, number>; total: number } {
  fs.mkdirSync(ARCHIVE_DIR, { recursive: true });

  const byMonth = new Map<string, AIItem[]>();
  for (const it of items) {
    const m = monthOf(it.firstSeen || it.publishedAt);
    if (!/^\d{4}-\d{2}$/.test(m)) continue;
    if (!byMonth.has(m)) byMonth.set(m, []);
    byMonth.get(m)!.push(it);
  }

  const summary: Record<string, number> = {};
  for (const [m, incoming] of byMonth) {
    const map = new Map<string, AIItem>();
    for (const it of readShard(m)) if (it.id) map.set(it.id, it);
    for (const it of incoming) map.set(it.id, { ...map.get(it.id), ...it });
    const merged = [...map.values()];
    fs.writeFileSync(shardPath(m), JSON.stringify(merged, null, 2) + "\n", "utf8");
    summary[m] = merged.length;
  }

  // Prune shards outside the retention window.
  const keep = keepMonths();
  for (const f of fs.readdirSync(ARCHIVE_DIR)) {
    const m = f.replace(/\.json$/, "");
    if (/^\d{4}-\d{2}$/.test(m) && !keep.has(m)) {
      try {
        fs.unlinkSync(path.join(ARCHIVE_DIR, f));
      } catch {
        /* ignore */
      }
    }
  }

  const total = Object.values(summary).reduce((a, b) => a + b, 0);
  return { months: summary, total };
}
