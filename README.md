# Calc Suite

A calculator suite covering finance, health, math, dates, and science — plus a
Basic/Scientific keypad calculator up front. Built with Next.js (App Router),
TypeScript, and Tailwind CSS. Live at
[simple-app-pi-five.vercel.app](https://simple-app-pi-five.vercel.app).

## Features

- **Hero calculator** — Basic and Scientific modes with keyboard support,
  calculation history, copy-to-clipboard, and shareable URLs.
- **25 domain calculators** across Finance, Health & Fitness, Math, Date &
  Time, and Science — each a self-contained module in
  `src/lib/calculators/`.
- **Favorites & recently used**, **shareable calculator links**, and an
  **explicit dark mode toggle**.
- Search and domain filtering on the homepage.

## Architecture

Every calculator is a `CalculatorDefinition` object (fields + a pure
`calculate()` function) defined in one of the domain files under
`src/lib/calculators/` (`finance.ts`, `health.ts`, `math.ts`, `datetime.ts`,
`science.ts`). They're combined into a single registry
(`src/lib/calculators/registry.ts`), which drives routing, search, static
generation, and the shared form/results UI (`CalculatorForm.tsx`,
`ResultsPanel.tsx`). Adding a new calculator is just appending one object to
a domain file — no other wiring required.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run lint    # eslint
npx tsc --noEmit  # type-check
```

## Deployment

Connected to Vercel — pushes to `main` on
[github.com/BuncyShaddai/simple-app](https://github.com/BuncyShaddai/simple-app)
auto-deploy. To deploy manually:

```bash
npx vercel --prod
```
