import { NextRequest, NextResponse } from "next/server";
import { queryItems } from "@/lib/queryItems";
import type { CategoryKey } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = (searchParams.get("category") || "all") as
    | CategoryKey
    | "all";
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 12);
  const keyword = searchParams.get("keyword") || "";
  const sort = (searchParams.get("sort") || "heat") as "heat" | "latest";

  const result = queryItems({ category, page, pageSize, keyword, sort });
  return NextResponse.json(result);
}
