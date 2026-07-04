import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllSlugs, getCalculatorBySlug } from "@/lib/calculators/registry";
import { domainMap, accentClasses } from "@/lib/calculators/domains";
import { CalculatorForm } from "@/components/CalculatorForm";
import { FavoriteButton } from "@/components/FavoriteButton";
import { PrintButton } from "@/components/PrintButton";
import { RecentTracker } from "@/components/RecentTracker";
import { SITE_URL } from "@/lib/site";

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: calculator.title,
    description: calculator.description,
    url: `${SITE_URL}/calculators/${calculator.slug}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RecentTracker slug={calculator.slug} />
      <Link href="/" className="text-sm text-zinc-500 hover:underline print:hidden dark:text-zinc-400">
        ← All calculators
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
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
        <div className="flex shrink-0 items-center gap-2">
          <PrintButton />
          <FavoriteButton slug={calculator.slug} />
        </div>
      </div>

      <div className="mt-8">
        <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900" />}>
          <CalculatorForm slug={calculator.slug} />
        </Suspense>
      </div>

      {calculator.formula && (
        <details className="group mt-6 rounded-2xl border border-black/[.06] bg-white p-5 dark:border-white/[.08] dark:bg-zinc-900">
          <summary className="cursor-pointer text-sm font-medium text-zinc-700 marker:content-none dark:text-zinc-300">
            <span className="mr-1 inline-block transition group-open:rotate-90">▸</span>
            How this is calculated
          </summary>
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">{calculator.formula}</p>
        </details>
      )}
    </div>
  );
}
