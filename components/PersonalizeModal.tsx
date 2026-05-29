"use client";

import { CATEGORIES } from "@/lib/categories";
import type { CategoryKey } from "@/lib/types";
import type { UserState } from "@/lib/userStore";

export default function PersonalizeModal({
  open,
  sources,
  state,
  onToggleFollowSource,
  onToggleMuteSource,
  onToggleTopic,
  onClear,
  onClose,
}: {
  open: boolean;
  sources: string[];
  state: UserState;
  onToggleFollowSource: (s: string) => void;
  onToggleMuteSource: (s: string) => void;
  onToggleTopic: (c: CategoryKey) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  if (!open) return null;

  const followed = new Set(state.followedSources);
  const muted = new Set(state.mutedSources);
  const topics = new Set(state.followedTopics);

  const miniBtn = (active: boolean, activeCls: string) =>
    "px-2 py-0.5 rounded text-xs border transition " +
    (active ? activeCls : "border-gray-200 text-gray-500 hover:border-gray-300");

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl p-6 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold">个性化设置</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">
            ×
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          关注的来源 / 话题会优先靠前，屏蔽的来源会被隐藏。设置只保存在你的浏览器本地。
        </p>

        <div className="mb-5">
          <div className="text-sm font-medium mb-2">关注话题</div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => onToggleTopic(c.key as CategoryKey)}
                className={
                  "px-3 py-1 rounded-full text-sm border transition " +
                  (topics.has(c.key as CategoryKey)
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-gray-200 text-gray-600 hover:border-brand-500")
                }
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">来源（关注 / 屏蔽）</div>
          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {sources.map((s) => (
              <div key={s} className="flex items-center justify-between gap-2">
                <span className="text-sm text-gray-700 truncate">{s}</span>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => onToggleFollowSource(s)}
                    className={miniBtn(followed.has(s), "border-brand-600 bg-brand-50 text-brand-700")}
                  >
                    关注
                  </button>
                  <button
                    onClick={() => onToggleMuteSource(s)}
                    className={miniBtn(muted.has(s), "border-red-400 bg-red-50 text-red-600")}
                  >
                    屏蔽
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClear}
            className="px-4 py-2 rounded-lg text-sm border border-gray-200 text-gray-600 hover:border-gray-300"
          >
            清空设置
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
}
