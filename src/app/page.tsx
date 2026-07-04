import { CalculatorExplorer } from "@/components/CalculatorExplorer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-black/[.06] bg-gradient-to-b from-zinc-50 to-transparent dark:border-white/[.08] dark:from-zinc-950">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center sm:py-20">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            One calculator suite. <br className="hidden sm:block" />
            Every domain covered.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-500 dark:text-zinc-400">
            Finance, health, math, dates and science — fifteen focused calculators, all instant and
            all running in your browser.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <CalculatorExplorer />
      </section>
    </div>
  );
}
