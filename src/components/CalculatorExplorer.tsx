"use client";

import { useMemo, useState } from "react";
import type { DomainId } from "@/lib/calculators/types";
import { calculators } from "@/lib/calculators/registry";
import { domains } from "@/lib/calculators/domains";
import { CalculatorCard } from "./CalculatorCard";

export function CalculatorExplorer() {
  const [query, setQuery] = useState("");
  const [activeDomain, setActiveDomain] = useState<DomainId | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return calculators.filter((c) => {
      const matchesDomain = activeDomain === "all" || c.domain === activeDomain;
      const matchesQuery =
        q === "" || c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
      return matchesDomain && matchesQuery;
    });
  }, [calculators, query, activeDomain]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search calculators…"
          className="w-full rounded-xl border border-black/[.08] bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20 dark:border-white/[.1] dark:bg-zinc-900 dark:focus:ring-white/20 sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          <FilterChip active={activeDomain === "all"} onClick={() => setActiveDomain("all")}>
            All
          </FilterChip>
          {domains.map((d) => (
            <FilterChip key={d.id} active={activeDomain === d.id} onClick={() => setActiveDomain(d.id)}>
              <span aria-hidden>{d.icon}</span> {d.name}
            </FilterChip>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-black/10 p-8 text-center text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">
          No calculators match &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CalculatorCard key={c.slug} calculator={c} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
        active
          ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
          : "border-black/[.08] bg-white text-zinc-600 hover:border-black/20 dark:border-white/[.1] dark:bg-zinc-900 dark:text-zinc-300"
      }`}
    >
      {children}
    </button>
  );
}
