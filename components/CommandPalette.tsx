"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import { buildHref } from "@/lib/href";
import type { AIItem } from "@/lib/types";

interface Cmd {
  id: string;
  label: string;
  hint?: string;
  run: () => void;
}

export const OPEN_CMDK_EVENT = "open-cmdk";

export default function CommandPalette({ items, sources }: { items: AIItem[]; sources: string[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [engine, setEngine] = useState<{ search: (q: string) => { id: string }[] } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const byId = useMemo(() => {
    const m = new Map<string, AIItem>();
    for (const it of items) m.set(it.id, it);
    return m;
  }, [items]);

  // Lazy-load MiniSearch on first open; build a fuzzy full-text index over items.
  useEffect(() => {
    if (!open || engine) return;
    let alive = true;
    import("minisearch").then(({ default: MiniSearch }) => {
      if (!alive) return;
      const ms = new MiniSearch({
        fields: ["title", "summary", "source"],
        storeFields: ["id"],
        idField: "id",
        searchOptions: { prefix: true, fuzzy: 0.2, boost: { title: 2 } },
      });
      ms.addAll(items.map((it) => ({ id: it.id, title: it.title, summary: it.summary ?? "", source: it.source })));
      setEngine(ms as unknown as { search: (q: string) => { id: string }[] });
    });
    return () => {
      alive = false;
    };
  }, [open, engine, items]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_CMDK_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_CMDK_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const close = () => setOpen(false);
  const go = (href: string) => {
    router.push(href);
    close();
  };
  const openUrl = (url: string) => {
    window.open(url, "_blank", "noreferrer");
    close();
  };

  const cmds = useMemo<Cmd[]>(() => {
    const q = query.trim().toLowerCase();
    const out: Cmd[] = [];

    for (const c of CATEGORIES) {
      if (!q || c.label.toLowerCase().includes(q))
        out.push({ id: `cat-${c.key}`, label: c.label, hint: "分类", run: () => go(buildHref({ category: c.key })) });
    }
    if (!q || "日报".includes(q) || "daily".includes(q))
      out.push({ id: "daily", label: "今日 AI 资讯日报", hint: "页面", run: () => go("/daily") });

    const srcPool = q ? sources.filter((s) => s.toLowerCase().includes(q)) : sources.slice(0, 6);
    for (const s of srcPool.slice(0, 8))
      out.push({ id: `src-${s}`, label: s, hint: "来源", run: () => go(buildHref({ source: s })) });

    if (q) {
      let hits: AIItem[];
      if (engine) {
        hits = engine
          .search(q)
          .slice(0, 8)
          .map((r) => byId.get(r.id))
          .filter((x): x is AIItem => !!x);
      } else {
        hits = items
          .filter(
            (i) =>
              i.title.toLowerCase().includes(q) ||
              (i.summary ?? "").toLowerCase().includes(q) ||
              i.source.toLowerCase().includes(q),
          )
          .slice(0, 8);
      }
      for (const it of hits) out.push({ id: it.id, label: it.title, hint: it.source, run: () => openUrl(it.sourceUrl) });
    }
    return out.slice(0, 14);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, items, sources, engine, byId]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 pt-[12vh] px-4" onClick={close}>
      <div
        className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, cmds.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              cmds[active]?.run();
            }
          }}
          placeholder="搜索资讯 / 跳分类 · 来源 · 日报…"
          className="w-full px-4 py-3.5 text-sm outline-none border-b border-gray-100"
        />
        <ul className="max-h-[50vh] overflow-y-auto py-1">
          {cmds.length === 0 ? (
            <li className="px-4 py-6 text-center text-sm text-gray-400">没有匹配项</li>
          ) : (
            cmds.map((c, i) => (
              <li key={c.id}>
                <button
                  onMouseEnter={() => setActive(i)}
                  onClick={() => c.run()}
                  className={
                    "w-full flex items-center justify-between gap-3 px-4 py-2 text-left text-sm " +
                    (i === active ? "bg-brand-50 text-brand-700" : "text-gray-700 hover:bg-gray-50")
                  }
                >
                  <span className="truncate">{c.label}</span>
                  {c.hint && <span className="shrink-0 text-xs text-gray-400">{c.hint}</span>}
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="px-4 py-2 border-t border-gray-100 text-[11px] text-gray-400 flex gap-3">
          <span>↑↓ 选择</span>
          <span>↵ 打开</span>
          <span>Esc 关闭</span>
        </div>
      </div>
    </div>
  );
}
