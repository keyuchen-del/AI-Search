"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="max-w-xl mx-auto px-4 py-24 text-center">
      <h1 className="text-lg font-semibold mb-2">页面加载出错了</h1>
      <p className="text-sm text-gray-500 mb-6">遇到了一点问题。可以重试，或返回首页。</p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700"
        >
          重试
        </button>
        <Link href="/" className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:border-brand-500">
          返回首页
        </Link>
      </div>
    </main>
  );
}
