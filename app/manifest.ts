import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AI Search · AI 行业资讯聚合",
    short_name: "AI Search",
    description: "每天自动聚合 AI 行业资讯，带个性化、收藏与 AI 点评。纯静态、零成本。",
    start_url: `${base}/`,
    scope: `${base}/`,
    display: "standalone",
    background_color: "#f6f7fb",
    theme_color: "#2453ee",
    icons: [{ src: `${base}/favicon.svg`, sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
