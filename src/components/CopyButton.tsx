"use client";

import { useState } from "react";

export function CopyButton({ value, className = "" }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — silently ignore.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1 rounded-full border border-black/[.08] bg-white px-2.5 py-1 text-xs font-medium text-zinc-600 transition hover:border-black/20 dark:border-white/[.1] dark:bg-zinc-900 dark:text-zinc-300 ${className}`}
    >
      {copied ? "Copied" : "Copy"} <span aria-hidden>{copied ? "✅" : "📋"}</span>
    </button>
  );
}
