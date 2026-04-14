'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'pf_watchlist';

function readStorage(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {}
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);

  // Hydrate from localStorage after mount
  useEffect(() => {
    setWatchlist(readStorage());
  }, []);

  const toggle = useCallback((id: string) => {
    setWatchlist((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      writeStorage(next);
      return next;
    });
  }, []);

  const isWatched = useCallback((id: string) => watchlist.includes(id), [watchlist]);

  return { watchlist, toggle, isWatched };
}
