import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllSlugs, getCalculatorBySlug } from "@/lib/calculators/registry";
import { domainMap, accentClasses } from "@/lib/calculators/domains";
import { CalculatorForm } from "@/components/CalculatorForm";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const calculator = getCalculatorBySlug(slug);
  if (!calculator) return { title: "Calculator not found · Calc Suite" };
  return {
    title: `${calculator.title} · Calc Suite`,
    description: calculator.description,
  };
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const calculator = getCalculatorBySlug(slug);
  if (!calculator) notFound();

  const domain = domainMap[calculator.domain];
  const accent = accentClasses[calculator.domain];

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <Link href="/" className="text-sm text-zinc-500 hover:underline dark:text-zinc-400">
        ← All calculators
      </Link>

      <div className="mt-4 flex items-start gap-4">
        <span className="text-4xl" aria-hidden>
          {calculator.icon}
        </span>
        <div>
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${accent.chip}`}>
            {domain.name}
          </span>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {calculator.title}
          </h1>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">{calculator.description}</p>
        </div>
      </div>

      <div className="mt-8">
        <CalculatorForm slug={calculator.slug} />
      </div>
    </div>
  );
}
