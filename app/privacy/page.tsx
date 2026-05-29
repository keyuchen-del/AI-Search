import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import { abs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "隐私政策",
  description: "AI Search 的隐私政策：无账号、无服务器端个人数据，偏好与收藏仅存于你的浏览器本地。",
  alternates: { canonical: abs("/privacy") },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-brand-600">
          ← 返回首页
        </Link>
        <h1 className="text-2xl font-bold mt-3 mb-6">隐私政策</h1>

        <section className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <p>
            AI Search 是纯静态网站，<strong>没有账号体系、没有后端、没有数据库</strong>，
            因此我们不会在服务器端收集或存储任何属于你的个人信息。
          </p>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-1.5">本地存储</h2>
            <p>
              你的<strong>收藏、已读、关注 / 屏蔽来源、关注话题</strong>等偏好，
              仅以浏览器的 <code className="px-1 bg-gray-100 rounded">localStorage</code> 形式保存在<strong>你自己的设备上</strong>，
              不会上传、不会与他人共享、本站也无法读取。清除浏览器数据即可删除这些信息。
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-1.5">Cookie 与追踪</h2>
            <p>本站默认不设置追踪型 Cookie。若未来接入隐私友好的访问统计（如 Plausible / Umami），将在此处更新说明。</p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-1.5">第三方链接</h2>
            <p>
              站内每条资讯均链接至第三方原始来源；离开本站后，第三方网站的隐私实践由其自行负责，建议你查阅对应站点的隐私政策。
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-1.5">托管</h2>
            <p>本站托管于 GitHub Pages，其访问日志由 GitHub 按其隐私政策处理，本站无法访问。</p>
          </div>

          <p className="text-gray-500">
            另见 <Link href="/about" className="text-brand-600 hover:underline">关于 / 免责声明</Link>。
          </p>
        </section>
      </main>
    </>
  );
}
