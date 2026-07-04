import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-black/[.06] dark:border-white/[.08]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span aria-hidden>🧮</span>
          Calc Suite
        </Link>
        <nav className="text-sm text-zinc-500 dark:text-zinc-400">
          <span>15 calculators · 5 domains</span>
        </nav>
      </div>
    </header>
  );
}
