import Link from "next/link";

interface Props {
  sort: "heat" | "latest";
  category: string;
  keyword?: string;
  total: number;
}

function href(sort: string, category: string, keyword?: string) {
  const sp = new URLSearchParams();
  if (category && category !== "all") sp.set("category", category);
  sp.set("sort", sort);
  if (keyword) sp.set("keyword", keyword);
  sp.set("page", "1");
  return `/?${sp.toString()}`;
}

export default function SortTabs({ sort, category, keyword, total }: Props) {
  const opts: { key: "heat" | "latest"; label: string }[] = [
    { key: "heat", label: "热度" },
    { key: "latest", label: "最新" },
  ];
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="text-sm text-gray-500">
        共 <span className="text-gray-800 font-medium">{total}</span> 条内容
      </div>
      <div className="flex items-center gap-1 text-sm">
        {opts.map((o) => (
          <Link
            key={o.key}
            href={href(o.key, category, keyword)}
            className={
              "px-3 h-8 inline-flex items-center rounded-md " +
              (sort === o.key
                ? "bg-brand-500 text-white"
                : "text-gray-600 hover:text-brand-600 hover:bg-brand-50")
            }
          >
            {o.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
