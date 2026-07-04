import type { CalculatorDefinition, DomainId } from "./types";
import { financeCalculators } from "./finance";
import { healthCalculators } from "./health";
import { mathCalculators } from "./math";
import { datetimeCalculators } from "./datetime";
import { scienceCalculators } from "./science";

export const calculators: CalculatorDefinition[] = [
  ...financeCalculators,
  ...healthCalculators,
  ...mathCalculators,
  ...datetimeCalculators,
  ...scienceCalculators,
];

export function getCalculatorBySlug(slug: string): CalculatorDefinition | undefined {
  return calculators.find((c) => c.slug === slug);
}

export function getCalculatorsByDomain(domain: DomainId): CalculatorDefinition[] {
  return calculators.filter((c) => c.domain === domain);
}

export function getAllSlugs(): string[] {
  return calculators.map((c) => c.slug);
}
