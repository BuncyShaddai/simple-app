import { Suspense } from "react";
import { CalculatorExplorer } from "@/components/CalculatorExplorer";
import { HeroCalculator } from "@/components/HeroCalculator";
import { calculators } from "@/lib/calculators/registry";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-black/[.06] bg-gradient-to-b from-zinc-50 to-transparent dark:border-white/[.08] dark:from-zinc-950">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
              One calculator suite. <br className="hidden sm:block" />
              Every domain covered.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-500 dark:text-zinc-400 lg:mx-0">
              A full keypad calculator up front, plus {calculators.length} focused calculators for
              finance, health, math, dates and science — all instant, all running in your browser.
            </p>
          </div>
          <Suspense fallback={<div className="mx-auto h-[520px] w-full max-w-sm animate-pulse rounded-3xl bg-zinc-100 dark:bg-zinc-900" />}>
            <HeroCalculator />
          </Suspense>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <CalculatorExplorer />
      </section>
    </div>
  );
}
