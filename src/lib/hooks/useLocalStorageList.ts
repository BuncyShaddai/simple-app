"use client";

import { useCallback, useSyncExternalStore } from "react";

function readList(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

interface ListStore {
  subscribe: (callback: () => void) => () => void;
  getSnapshot: () => string[];
  getServerSnapshot: () => string[];
  add: (value: string, max?: number) => void;
  toggle: (value: string) => void;
}

function createListStore(key: string): ListStore {
  let cache: string[] = [];
  let initialized = false;
  const listeners = new Set<() => void>();
  const empty: string[] = [];

  function ensureInitialized() {
    if (!initialized) {
      cache = readList(key);
      initialized = true;
    }
  }

  function write(next: string[]) {
    cache = next;
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Storage unavailable (quota exceeded, private mode) — state stays in-memory only.
    }
    listeners.forEach((notify) => notify());
  }

  return {
    subscribe(callback) {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    getSnapshot() {
      ensureInitialized();
      return cache;
    },
    getServerSnapshot() {
      return empty;
    },
    add(value, max) {
      ensureInitialized();
      const next = [value, ...cache.filter((v) => v !== value)];
      write(max ? next.slice(0, max) : next);
    },
    toggle(value) {
      ensureInitialized();
      const next = cache.includes(value) ? cache.filter((v) => v !== value) : [...cache, value];
      write(next);
    },
  };
}

const stores = new Map<string, ListStore>();

function getStore(key: string): ListStore {
  let store = stores.get(key);
  if (!store) {
    store = createListStore(key);
    stores.set(key, store);
  }
  return store;
}

export function useLocalStorageList(key: string) {
  const store = getStore(key);
  const list = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const add = useCallback((value: string, max?: number) => store.add(value, max), [store]);
  const toggle = useCallback((value: string) => store.toggle(value), [store]);
  return { list, add, toggle };
}
