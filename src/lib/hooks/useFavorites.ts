"use client";

import { useCallback } from "react";
import { useLocalStorageList } from "./useLocalStorageList";

const FAVORITES_KEY = "calc-favorites";

export function useFavorites() {
  const { list, toggle } = useLocalStorageList(FAVORITES_KEY);

  const isFavorite = useCallback((slug: string) => list.includes(slug), [list]);
  const toggleFavorite = useCallback((slug: string) => toggle(slug), [toggle]);

  return { favorites: list, isFavorite, toggleFavorite };
}
