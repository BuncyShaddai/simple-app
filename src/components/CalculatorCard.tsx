import Link from "next/link";
import type { CalculatorDefinition } from "@/lib/calculators/types";
import { accentClasses, domainMap } from "@/lib/calculators/domains";

export function CalculatorCard({ calculator }: { calculator: CalculatorDefinition }) {
  const accent = accentClasses[calculator.domain];
  const domain = domainMap[calculator.domain];
  return (
    <Link
      href={`/calculators/${calculator.slug}`}
      className="group relative flex flex-col gap-2 rounded-2xl border border-black/[.06] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5 dark:border-white/[.08] dark:bg-zinc-900"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden>
          {calculator.icon}
        </span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${accent.chip}`}>
          {domain.name}
        </span>
      </div>
      <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{calculator.title}</h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{calculator.description}</p>
      <span className="mt-2 text-sm font-medium text-zinc-900 group-hover:underline dark:text-zinc-50">
        Open calculator →
      </span>
    </Link>
  );
}
