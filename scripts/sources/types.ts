import type { AIItem } from "../../lib/types";

export interface SourceAdapter {
  /** Stable adapter id, e.g. "hf-papers", "github", "rss:36kr". */
  id: string;
  /** Human-readable label for logs. */
  label: string;
  /** Fetch and normalize this source's items. Throwing fails only this source. */
  fetch(): Promise<AIItem[]>;
}
