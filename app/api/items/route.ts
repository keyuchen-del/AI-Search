import { NextRequest, NextResponse } from "next/server";
import { queryItems } from "@/lib/queryItems";
import { isCategoryKey } from "@/lib/categories";
import type { CategoryKey, Mode } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("category");
  const category: CategoryKey | "all" = isCategoryKey(cat) ? cat : "all";
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 12);
  const keyword = searchParams.get("keyword") || "";
  const mode: Mode = searchParams.get("mode") === "all" ? "all" : "selected";
  const since = searchParams.get("since") || undefined;

  const result = await queryItems({
    category,
    page,
    pageSize,
    keyword,
    mode,
    since,
    sort: "latest",
  });
  return NextResponse.json(result);
}
