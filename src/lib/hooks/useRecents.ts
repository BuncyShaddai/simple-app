"use client";

import { useCallback } from "react";
import { useLocalStorageList } from "./useLocalStorageList";

const RECENTS_KEY = "calc-recents";
const MAX_RECENTS = 6;

export function useRecents() {
  const { list, add } = useLocalStorageList(RECENTS_KEY);

  const trackRecent = useCallback((slug: string) => add(slug, MAX_RECENTS), [add]);

  return { recents: list, trackRecent };
}
