"use client";

import { useCallback, useEffect, useState } from "react";
import type { CategoryKey } from "./types";

export interface UserState {
  bookmarks: string[];
  read: string[];
  followedSources: string[];
  mutedSources: string[];
  followedTopics: CategoryKey[];
}

const KEY = "ai-search:user:v1";
const EVENT = "ai-search:user-change";

export const EMPTY_USER: UserState = {
  bookmarks: [],
  read: [],
  followedSources: [],
  mutedSources: [],
  followedTopics: [],
};

function readState(): UserState {
  if (typeof window === "undefined") return EMPTY_USER;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY_USER;
    const p = JSON.parse(raw);
    return {
      bookmarks: Array.isArray(p.bookmarks) ? p.bookmarks : [],
      read: Array.isArray(p.read) ? p.read : [],
      followedSources: Array.isArray(p.followedSources) ? p.followedSources : [],
      mutedSources: Array.isArray(p.mutedSources) ? p.mutedSources : [],
      followedTopics: Array.isArray(p.followedTopics) ? p.followedTopics : [],
    };
  } catch {
    return EMPTY_USER;
  }
}

function writeState(s: UserState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // storage disabled — changes just won't persist.
  }
}

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export function hasPersonalization(s: UserState): boolean {
  return s.followedSources.length > 0 || s.mutedSources.length > 0 || s.followedTopics.length > 0;
}

/**
 * Subscribe to the browser-local user state. `hydrated` is false during SSR and
 * the first client render (both see EMPTY_USER) — so initial markup matches and
 * personalization/bookmarks apply only after mount (no hydration mismatch).
 */
export function useUserStore() {
  const [state, setState] = useState<UserState>(EMPTY_USER);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(readState());
    setHydrated(true);
    const sync = () => setState(readState());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = useCallback((patch: Partial<UserState>) => {
    const next = { ...readState(), ...patch };
    writeState(next);
    setState(next);
  }, []);

  const toggleBookmark = useCallback(
    (id: string) => update({ bookmarks: toggle(readState().bookmarks, id) }),
    [update],
  );
  const markRead = useCallback((id: string) => {
    const cur = readState();
    if (cur.read.includes(id)) return;
    update({ read: [...cur.read, id] });
  }, [update]);
  const toggleFollowSource = useCallback(
    (s: string) => update({ followedSources: toggle(readState().followedSources, s) }),
    [update],
  );
  const toggleMuteSource = useCallback(
    (s: string) => update({ mutedSources: toggle(readState().mutedSources, s) }),
    [update],
  );
  const toggleTopic = useCallback(
    (c: CategoryKey) => update({ followedTopics: toggle(readState().followedTopics, c) }),
    [update],
  );
  const clearAll = useCallback(() => update(EMPTY_USER), [update]);

  return {
    state,
    hydrated,
    toggleBookmark,
    markRead,
    toggleFollowSource,
    toggleMuteSource,
    toggleTopic,
    clearAll,
  };
}
