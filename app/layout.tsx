import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Search - AI 行业资讯聚合",
  description:
    "聚合 AI 行业动态、产品发布、模型进展、学术研究、AI 工具、投融资、政策监管与观点解读。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
