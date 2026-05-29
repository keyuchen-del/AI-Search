/** @type {import('next').NextConfig} */

// On GitHub Pages the site is served from https://<user>.github.io/<repo>/,
// so assets need the "/<repo>" prefix. The deploy workflow sets
// NEXT_PUBLIC_BASE_PATH=/AI-Search; local dev leaves it empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export", // fully static -> deployable on GitHub Pages (no server)
  reactStrictMode: true,
  trailingSlash: true, // emit /path/index.html so static hosts resolve cleanly
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true, // no Image Optimization server in a static export
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
