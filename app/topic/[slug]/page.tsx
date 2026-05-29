import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import TopicFeed from "@/components/TopicFeed";
import { readArchive } from "@/lib/archive";
import { readLocalItems } from "@/lib/localStore";
import { ENTITIES, ENTITY_MAP, entitiesOf, entityCounts } from "@/lib/entities";

export const dynamic = "force-static";

function pool() {
  const arch = readArchive();
  return arch.length > 0 ? arch : readLocalItems();
}

export function generateStaticParams() {
  const counts = entityCounts(pool());
  return ENTITIES.filter((e) => (counts[e.slug] ?? 0) >= 5).map((e) => ({ slug: e.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const e = ENTITY_MAP[params.slug];
  return { title: e ? `${e.name} · AI Search` : "话题 · AI Search" };
}

export default function TopicPage({ params }: { params: { slug: string } }) {
  const ent = ENTITY_MAP[params.slug];
  if (!ent) notFound();
  const items = pool()
    .filter((it) => entitiesOf(it).includes(params.slug))
    .sort((a, b) => (b.publishedAt ?? b.firstSeen ?? "").localeCompare(a.publishedAt ?? a.firstSeen ?? ""));
  const now = Date.now();

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="mb-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-brand-600">
            ← 返回首页
          </Link>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs px-2 py-0.5 rounded bg-brand-50 text-brand-600 font-medium">话题</span>
          <h1 className="text-2xl font-bold">{ent.name}</h1>
        </div>
        <p className="text-sm text-gray-500 mb-5">共 {items.length} 条相关资讯 · 来自历史归档</p>
        <TopicFeed items={items} now={now} />
      </main>
    </>
  );
}
