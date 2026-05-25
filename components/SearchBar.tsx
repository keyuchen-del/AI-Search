"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(defaultValue);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const sp = new URLSearchParams(params?.toString() || "");
    if (value.trim()) sp.set("keyword", value.trim());
    else sp.delete("keyword");
    sp.set("page", "1");
    router.push(`/?${sp.toString()}`);
  }

  return (
    <form onSubmit={submit} className="relative">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="搜索 AI 资讯、模型、工具..."
        className="w-full h-9 pl-9 pr-3 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:bg-white"
      />
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    </form>
  );
}
