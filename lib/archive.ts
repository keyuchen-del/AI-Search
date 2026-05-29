import fs from "node:fs";
import path from "node:path";
import { ARCHIVE_DIR } from "./config";
import type { AIItem } from "./types";

/** Read all archived items across monthly shards (for topic pages, history). */
export function readArchive(): AIItem[] {
  const out: AIItem[] = [];
  let files: string[] = [];
  try {
    files = fs.readdirSync(ARCHIVE_DIR);
  } catch {
    return out;
  }
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    try {
      const arr = JSON.parse(fs.readFileSync(path.join(ARCHIVE_DIR, f), "utf8"));
      if (Array.isArray(arr)) out.push(...arr);
    } catch {
      /* skip bad shard */
    }
  }
  return out;
}
