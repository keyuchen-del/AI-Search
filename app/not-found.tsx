import Link from "next/link";
import Header from "@/components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content" className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl font-bold text-brand-600 mb-3">404</div>
        <h1 className="text-lg font-semibold mb-2">页面不存在</h1>
        <p className="text-sm text-gray-500 mb-6">你访问的内容可能已更新、归档或从未存在。</p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700">
            返回首页
          </Link>
          <Link href="/daily" className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:border-brand-500">
            看今日日报
          </Link>
        </div>
      </main>
    </>
  );
}
