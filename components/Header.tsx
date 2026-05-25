import Link from "next/link";
import SearchBar from "./SearchBar";

export default function Header({ defaultKeyword = "" }: { defaultKeyword?: string }) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-7 h-7 rounded-md bg-brand-500 text-white grid place-items-center font-bold">
            A
          </span>
          <span className="text-lg font-semibold tracking-tight">AI Search</span>
          <span className="hidden sm:inline text-xs text-gray-500 ml-1">
            AI 行业资讯聚合
          </span>
        </Link>

        <div className="flex-1 max-w-xl">
          <SearchBar defaultValue={defaultKeyword} />
        </div>

        <nav className="hidden md:flex items-center gap-4 text-sm text-gray-600">
          <Link href="/" className="hover:text-brand-600">首页</Link>
          <Link href="/?sort=latest" className="hover:text-brand-600">最新</Link>
          <a
            href="https://github.com/keyuchen-del/AI-Search"
            target="_blank"
            rel="noreferrer"
            className="hover:text-brand-600"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
