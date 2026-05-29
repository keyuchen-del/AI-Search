import type { Metadata, Viewport } from "next";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { SITE_DESC, SITE_NAME, SITE_URL } from "@/lib/seo";

const TITLE = "AI Search · AI 行业资讯聚合";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s · AI Search" },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  keywords: ["AI 资讯", "人工智能", "大模型", "LLM", "AI 新闻", "AI 日报", "AI Agent", "机器学习", "AI 工具"],
  authors: [{ name: "keyuchen-del", url: "https://github.com/keyuchen-del" }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: TITLE,
    description: SITE_DESC,
    url: SITE_URL,
    locale: "zh_CN",
  },
  twitter: { card: "summary", title: TITLE, description: SITE_DESC },
};

export const viewport: Viewport = {
  themeColor: "#2453ee",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
