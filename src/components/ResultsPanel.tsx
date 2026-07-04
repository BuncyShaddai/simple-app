import type { CalculatorResult, DomainId } from "@/lib/calculators/types";
import { accentClasses } from "@/lib/calculators/domains";

export function ResultsPanel({
  domain,
  results,
  error,
}: {
  domain: DomainId;
  results: CalculatorResult[];
  error?: string;
}) {
  const accent = accentClasses[domain];

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 text-sm text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  const primary = results.find((r) => r.primary) ?? results[0];
  const rest = results.filter((r) => r !== primary);

  return (
    <div className="flex flex-col gap-3">
      {primary && (
        <div
          className={`relative overflow-hidden rounded-2xl border border-black/[.06] bg-gradient-to-br ${accent.glow} to-transparent p-6 dark:border-white/[.08]`}
        >
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{primary.label}</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {primary.value}
            {primary.unit ? <span className="ml-1 text-lg text-zinc-500 dark:text-zinc-400">{primary.unit}</span> : null}
          </p>
        </div>
      )}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {rest.map((r) => (
            <div
              key={r.label}
              className="rounded-xl border border-black/[.06] bg-white p-4 dark:border-white/[.08] dark:bg-zinc-900"
            >
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{r.label}</p>
              <p className="mt-1 text-lg font-medium text-zinc-900 dark:text-zinc-50">
                {r.value}
                {r.unit ? <span className="ml-1 text-sm text-zinc-500 dark:text-zinc-400">{r.unit}</span> : null}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
