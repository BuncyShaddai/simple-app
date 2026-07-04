"use client";

import { useCallback, useSyncExternalStore } from "react";

export interface HistoryEntry {
  expr: string;
  result: string;
}

const KEY = "calc-hero-history";
const MAX_HISTORY = 5;
const empty: HistoryEntry[] = [];

let cache: HistoryEntry[] = [];
let initialized = false;
const listeners = new Set<() => void>();

function read(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function ensureInitialized() {
  if (!initialized) {
    cache = read();
    initialized = true;
  }
}

function write(next: HistoryEntry[]) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable (quota exceeded, private mode) — state stays in-memory only.
  }
  listeners.forEach((notify) => notify());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  ensureInitialized();
  return cache;
}

function getServerSnapshot() {
  return empty;
}

export function useCalculatorHistory() {
  const history = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addEntry = useCallback((entry: HistoryEntry) => {
    ensureInitialized();
    write([entry, ...cache].slice(0, MAX_HISTORY));
  }, []);

  return { history, addEntry };
}
