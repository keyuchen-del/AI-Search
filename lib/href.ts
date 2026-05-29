// Build a home URL preserving filters. Page/view/sort are client-side state, not URL.
export function buildHref(p: {
  category?: string;
  mode?: string;
  since?: string;
  keyword?: string;
  source?: string;
}): string {
  const sp = new URLSearchParams();
  if (p.category && p.category !== "all") sp.set("category", p.category);
  if (p.mode && p.mode !== "selected") sp.set("mode", p.mode);
  if (p.since && p.since !== "7d") sp.set("since", p.since);
  if (p.keyword) sp.set("keyword", p.keyword);
  if (p.source) sp.set("source", p.source);
  const q = sp.toString();
  return q ? `/?${q}` : "/";
}
