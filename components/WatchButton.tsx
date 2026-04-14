'use client';

import { useWatchlist } from '@/hooks/useWatchlist';

export default function WatchButton({ id }: { id: string }) {
  const { toggle, isWatched } = useWatchlist();
  const watched = isWatched(id);

  return (
    <button
      className={`mkt-watch-btn ${watched ? 'mkt-watch-btn-active' : ''}`}
      onClick={() => toggle(id)}
    >
      {watched ? '★ Watching' : '☆ Add to watchlist'}
    </button>
  );
}
