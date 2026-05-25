/**
 * Crawl entry point. Stub for now.
 *
 * Run with: npm run crawl
 *
 * TODO:
 *   1. Define source adapters under scripts/sources/ (one file per site / RSS / API)
 *   2. Normalize results to AIItem
 *   3. Persist to a store (filesystem JSON, SQLite, or Postgres)
 *   4. Replace lib/mockData.ts read with the persistent store
 *   5. Handle anti-bot: rotate UA, respect robots.txt, backoff, headless-only fallback
 */

async function main() {
  console.log("[crawl] starting...");
  console.log("[crawl] no source adapters configured yet.");
  console.log("[crawl] add adapters under scripts/sources/ and wire them here.");
  console.log("[crawl] done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
