"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="flex items-center gap-1.5 rounded-full border border-black/[.08] bg-white px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:border-black/20 print:hidden dark:border-white/[.1] dark:bg-zinc-900 dark:text-zinc-300"
    >
      <span aria-hidden>🖨️</span> Print
    </button>
  );
}
