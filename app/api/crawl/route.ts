import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Stub endpoint for triggering crawl jobs.
 *
 * Real implementation will:
 *   - dispatch a background job (queue / cron / workflow)
 *   - persist crawled items into a data store
 *   - return job id for polling
 *
 * For now it just acknowledges the request so the frontend wiring
 * can be tested end-to-end without a live crawler.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const sources: string[] = Array.isArray(body?.sources) ? body.sources : [];
  return NextResponse.json({
    ok: true,
    queued: sources.length || "default",
    jobId: `job-${Date.now()}`,
    note: "crawl pipeline not yet wired; this is a stub.",
  });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "POST to this endpoint to enqueue a crawl job.",
  });
}
