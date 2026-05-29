import type { AIItem } from "./types";
import type { UserState } from "./userStore";

/**
 * Apply browser-local personalization on top of the already-sorted pool:
 *   1. drop items from muted sources
 *   2. float followed sources / followed topics to the top (stable within groups,
 *      so the underlying sort — latest / heat — is preserved inside each group)
 */
export function personalize(items: AIItem[], user: UserState): AIItem[] {
  const muted = new Set(user.mutedSources);
  const followedSrc = new Set(user.followedSources);
  const followedTopic = new Set(user.followedTopics);

  const visible = muted.size ? items.filter((i) => !muted.has(i.source)) : items;

  if (followedSrc.size === 0 && followedTopic.size === 0) return visible;

  const preferred: AIItem[] = [];
  const rest: AIItem[] = [];
  for (const it of visible) {
    if (followedSrc.has(it.source) || (it.category && followedTopic.has(it.category))) {
      preferred.push(it);
    } else {
      rest.push(it);
    }
  }
  return [...preferred, ...rest];
}

/** Distinct source names + counts, sorted by frequency. */
export function sourceCounts(items: AIItem[]): [string, number][] {
  const count = new Map<string, number>();
  for (const it of items) count.set(it.source, (count.get(it.source) ?? 0) + 1);
  return [...count.entries()].sort((a, b) => b[1] - a[1]);
}

/** Distinct sources present in the dataset, sorted by frequency (for the settings UI). */
export function sourcesFromItems(items: AIItem[]): string[] {
  return sourceCounts(items).map(([s]) => s);
}
