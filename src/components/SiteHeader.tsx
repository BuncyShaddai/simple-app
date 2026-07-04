import Link from "next/link";
import { calculators } from "@/lib/calculators/registry";
import { domains } from "@/lib/calculators/domains";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return (
    <header className="border-b border-black/[.06] print:hidden dark:border-white/[.08]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span aria-hidden>🧮</span>
          Calc Suite
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden text-sm text-zinc-500 dark:text-zinc-400 sm:block">
            <span>
              {calculators.length} calculators · {domains.length} domains
            </span>
          </nav>
          <Link
            href="/roadmap"
            className="text-sm font-medium text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Roadmap
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
