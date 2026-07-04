"use client";

import { useFavorites } from "@/lib/hooks/useFavorites";

export function FavoriteButton({ slug }: { slug: string }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(slug);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(slug)}
      aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={favorite}
      className="flex items-center gap-1.5 rounded-full border border-black/[.08] bg-white px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:border-black/20 print:hidden dark:border-white/[.1] dark:bg-zinc-900 dark:text-zinc-300"
    >
      <span aria-hidden className={favorite ? "text-amber-400" : "text-zinc-300 dark:text-zinc-600"}>
        {favorite ? "★" : "☆"}
      </span>
      {favorite ? "Favorited" : "Favorite"}
    </button>
  );
}
