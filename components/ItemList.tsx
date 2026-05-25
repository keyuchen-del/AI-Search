import type { AIItem } from "@/lib/types";
import ItemCard from "./ItemCard";

export default function ItemList({ items }: { items: AIItem[] }) {
  if (items.length === 0) {
    return (
      <div className="card p-10 text-center text-gray-500">
        没有匹配的内容，换个关键词或分类试试。
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {items.map((it) => (
        <ItemCard key={it.id} item={it} />
      ))}
    </div>
  );
}
