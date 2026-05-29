import HomeClient from "@/components/HomeClient";
import { readDigest, readLocalItems, readStoreMeta } from "@/lib/localStore";
import { normalizeItems } from "@/lib/classify";
import { MOCK_ITEMS } from "@/lib/mockData";

// Static export: the snapshot is read at build time and baked into the page;
// all filtering/search/pagination then happens client-side in the browser.
export default function Home() {
  const raw = readLocalItems();
  const items = normalizeItems(raw.length > 0 ? raw : MOCK_ITEMS);
  const meta = readStoreMeta();
  // Computed once at build and serialized into props (stable across SSR + client,
  // so NEW/今日新增 windows don't cause hydration mismatch).
  const now = meta?.fetchedAt ? new Date(meta.fetchedAt).getTime() : Date.now();

  return <HomeClient items={items} meta={meta} now={now} digest={readDigest()} />;
}
