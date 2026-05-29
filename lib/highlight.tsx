import React from "react";

/** Wrap case-insensitive keyword matches in <mark>. Returns React nodes (no innerHTML). */
export function highlight(text: string, keyword?: string): React.ReactNode {
  const k = (keyword ?? "").trim();
  if (!k) return text;
  const esc = k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${esc})`, "ig"));
  return parts.map((p, i) =>
    p.toLowerCase() === k.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 rounded px-0.5">
        {p}
      </mark>
    ) : (
      <React.Fragment key={i}>{p}</React.Fragment>
    ),
  );
}
