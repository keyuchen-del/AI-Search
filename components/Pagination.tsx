import Link from "next/link";

interface Props {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}

export default function Pagination({ page, totalPages, buildHref }: Props) {
  if (totalPages <= 1) return null;

  const window = 2;
  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= page - window && i <= page + window)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  const itemBase =
    "min-w-[36px] h-9 px-2 inline-flex items-center justify-center rounded-md text-sm border";

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-6">
      <Link
        href={buildHref(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className={
          itemBase +
          " " +
          (page <= 1
            ? "border-gray-200 text-gray-300 pointer-events-none"
            : "border-gray-200 text-gray-600 hover:border-brand-500 hover:text-brand-600 bg-white")
        }
      >
        上一页
      </Link>
      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={`dot-${idx}`} className="px-1 text-gray-400">…</span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            className={
              itemBase +
              " " +
              (p === page
                ? "border-brand-500 bg-brand-500 text-white"
                : "border-gray-200 text-gray-600 hover:border-brand-500 hover:text-brand-600 bg-white")
            }
          >
            {p}
          </Link>
        ),
      )}
      <Link
        href={buildHref(Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        className={
          itemBase +
          " " +
          (page >= totalPages
            ? "border-gray-200 text-gray-300 pointer-events-none"
            : "border-gray-200 text-gray-600 hover:border-brand-500 hover:text-brand-600 bg-white")
        }
      >
        下一页
      </Link>
    </nav>
  );
}
