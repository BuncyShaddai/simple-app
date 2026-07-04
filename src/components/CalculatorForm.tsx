"use client";

import { useMemo, useState } from "react";
import { getCalculatorBySlug } from "@/lib/calculators/registry";
import { accentClasses } from "@/lib/calculators/domains";
import type { CalculatorValues } from "@/lib/calculators/types";
import { ResultsPanel } from "./ResultsPanel";

export function CalculatorForm({ slug }: { slug: string }) {
  const calculator = getCalculatorBySlug(slug);

  const initialValues = useMemo<CalculatorValues>(() => {
    if (!calculator) return {};
    const values: CalculatorValues = {};
    for (const field of calculator.fields) {
      if (field.defaultValue !== undefined) values[field.id] = field.defaultValue;
    }
    return values;
  }, [calculator]);

  const [values, setValues] = useState<CalculatorValues>(initialValues);

  const output = useMemo(() => calculator?.calculate(values), [calculator, values]);

  if (!calculator) return null;

  const accent = accentClasses[calculator.domain];

  function update(id: string, value: string) {
    setValues((prev) => ({ ...prev, [id]: value }));
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <form className="flex flex-col gap-4 rounded-2xl border border-black/[.06] bg-white p-6 dark:border-white/[.08] dark:bg-zinc-900">
        {calculator.fields.map((field) => (
          <label key={field.id} className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {field.label}
              {field.unit ? <span className="text-zinc-400"> ({field.unit})</span> : null}
            </span>
            {field.type === "select" ? (
              <select
                value={String(values[field.id] ?? "")}
                onChange={(e) => update(field.id, e.target.value)}
                className={`rounded-lg border border-black/[.1] bg-white px-3 py-2 outline-none focus:ring-2 dark:border-white/[.1] dark:bg-zinc-950 ${accent.ring}`}
              >
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                value={String(values[field.id] ?? "")}
                onChange={(e) => update(field.id, e.target.value)}
                placeholder={field.placeholder}
                min={field.min}
                max={field.max}
                step={field.step ?? "any"}
                className={`rounded-lg border border-black/[.1] bg-white px-3 py-2 outline-none focus:ring-2 dark:border-white/[.1] dark:bg-zinc-950 ${accent.ring}`}
              />
            )}
            {field.helpText && <span className="text-xs text-zinc-400">{field.helpText}</span>}
          </label>
        ))}
      </form>

      <div>
        {output && "error" in output ? (
          <ResultsPanel domain={calculator.domain} results={[]} error={output.error} />
        ) : (
          <ResultsPanel domain={calculator.domain} results={output?.results ?? []} />
        )}
      </div>
    </div>
  );
}
