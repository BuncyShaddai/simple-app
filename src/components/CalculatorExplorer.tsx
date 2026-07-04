"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { DomainId } from "@/lib/calculators/types";
import { calculators } from "@/lib/calculators/registry";
import { domains } from "@/lib/calculators/domains";
import { CalculatorCard } from "./CalculatorCard";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { useRecents } from "@/lib/hooks/useRecents";

type DomainFilter = DomainId | "all" | "favorites";

export function CalculatorExplorer() {
  const [query, setQuery] = useState("");
  const [activeDomain, setActiveDomain] = useState<DomainFilter>("all");
  const { favorites } = useFavorites();
  const { recents } = useRecents();

  const recentCalculators = useMemo(
    () => recents.map((slug) => calculators.find((c) => c.slug === slug)).filter((c) => c !== undefined),
    [recents],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return calculators.filter((c) => {
      const matchesDomain =
        activeDomain === "all"
          ? true
          : activeDomain === "favorites"
            ? favorites.includes(c.slug)
            : c.domain === activeDomain;
      const matchesQuery =
        q === "" || c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
      return matchesDomain && matchesQuery;
    });
  }, [query, activeDomain, favorites]);

  return (
    <div className="flex flex-col gap-6">
      {recentCalculators.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium text-zinc-400">Recently used</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {recentCalculators.map((c) => (
              <Link
                key={c.slug}
                href={`/calculators/${c.slug}`}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-black/[.08] bg-white px-3 py-1.5 text-sm text-zinc-600 transition hover:border-black/20 dark:border-white/[.1] dark:bg-zinc-900 dark:text-zinc-300"
              >
                <span aria-hidden>{c.icon}</span> {c.shortTitle ?? c.title}
              </Link>
            ))}
          </div>
        </div>
      )}

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
          <FilterChip active={activeDomain === "favorites"} onClick={() => setActiveDomain("favorites")}>
            <span aria-hidden>★</span> Favorites{favorites.length > 0 ? ` (${favorites.length})` : ""}
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
          {activeDomain === "favorites"
            ? "No favorites yet — star a calculator to pin it here."
            : `No calculators match "${query}".`}
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
