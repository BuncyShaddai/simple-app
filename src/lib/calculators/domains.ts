import type { Domain, DomainId } from "./types";

export const domains: Domain[] = [
  {
    id: "finance",
    name: "Finance",
    description: "Loans, interest, tips & savings",
    icon: "\u{1F4B0}",
  },
  {
    id: "health",
    name: "Health & Fitness",
    description: "Body metrics, calories & hydration",
    icon: "\u{1FAC0}",
  },
  {
    id: "math",
    name: "Math",
    description: "Everyday math & conversions",
    icon: "\u{27A1}\u{FE0F}",
  },
  {
    id: "datetime",
    name: "Date & Time",
    description: "Ages, durations & countdowns",
    icon: "\u{1F5D3}\u{FE0F}",
  },
  {
    id: "science",
    name: "Science",
    description: "Physics formulas for quick checks",
    icon: "\u{1F52C}",
  },
];

export const domainMap: Record<DomainId, Domain> = Object.fromEntries(
  domains.map((d) => [d.id, d])
) as Record<DomainId, Domain>;

export const accentClasses: Record<
  DomainId,
  { chip: string; ring: string; bar: string; glow: string }
> = {
  finance: {
    chip: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    ring: "focus:ring-emerald-500/40 focus:border-emerald-500",
    bar: "bg-emerald-500",
    glow: "from-emerald-500/20",
  },
  health: {
    chip: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    ring: "focus:ring-rose-500/40 focus:border-rose-500",
    bar: "bg-rose-500",
    glow: "from-rose-500/20",
  },
  math: {
    chip: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
    ring: "focus:ring-indigo-500/40 focus:border-indigo-500",
    bar: "bg-indigo-500",
    glow: "from-indigo-500/20",
  },
  datetime: {
    chip: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    ring: "focus:ring-amber-500/40 focus:border-amber-500",
    bar: "bg-amber-500",
    glow: "from-amber-500/20",
  },
  science: {
    chip: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
    ring: "focus:ring-sky-500/40 focus:border-sky-500",
    bar: "bg-sky-500",
    glow: "from-sky-500/20",
  },
};
