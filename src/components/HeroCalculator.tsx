"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { evaluateExpression } from "@/lib/calculators/expression";
import { fmtNumber } from "@/lib/calculators/format";
import { CopyButton } from "./CopyButton";

interface ButtonSpec {
  label: string;
  insert?: string;
  action?: "clear" | "delete";
  variant?: "num" | "op" | "fn";
}

const basicRows: ButtonSpec[][] = [
  [
    { label: "C", action: "clear", variant: "fn" },
    { label: "(", insert: "(", variant: "fn" },
    { label: ")", insert: ")", variant: "fn" },
    { label: "⌫", action: "delete", variant: "fn" },
  ],
  [
    { label: "7", insert: "7", variant: "num" },
    { label: "8", insert: "8", variant: "num" },
    { label: "9", insert: "9", variant: "num" },
    { label: "÷", insert: "/", variant: "op" },
  ],
  [
    { label: "4", insert: "4", variant: "num" },
    { label: "5", insert: "5", variant: "num" },
    { label: "6", insert: "6", variant: "num" },
    { label: "×", insert: "*", variant: "op" },
  ],
  [
    { label: "1", insert: "1", variant: "num" },
    { label: "2", insert: "2", variant: "num" },
    { label: "3", insert: "3", variant: "num" },
    { label: "−", insert: "-", variant: "op" },
  ],
  [
    { label: "0", insert: "0", variant: "num" },
    { label: ".", insert: ".", variant: "num" },
    { label: "%", insert: "%", variant: "op" },
    { label: "+", insert: "+", variant: "op" },
  ],
];

const scientificRows: ButtonSpec[][] = [
  [
    { label: "sin", insert: "sin(", variant: "fn" },
    { label: "cos", insert: "cos(", variant: "fn" },
    { label: "tan", insert: "tan(", variant: "fn" },
    { label: "^", insert: "^", variant: "op" },
  ],
  [
    { label: "√", insert: "sqrt(", variant: "fn" },
    { label: "log", insert: "log(", variant: "fn" },
    { label: "ln", insert: "ln(", variant: "fn" },
    { label: "π", insert: "pi", variant: "fn" },
  ],
];

export function HeroCalculator() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<"basic" | "scientific">("basic");
  const [expression, setExpression] = useState(() => searchParams.get("calc") ?? "");
  const [history, setHistory] = useState<{ expr: string; result: string }[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (expression) params.set("calc", expression);
    else params.delete("calc");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    // Intentionally omit `searchParams`: this effect should only re-run when the user
    // changes the expression, not when our own router.replace call above updates the URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expression, pathname, router]);

  const outcome = useMemo(() => evaluateExpression(expression), [expression]);

  const display = useMemo(() => {
    if (expression.trim() === "") return { text: "0", isError: false };
    if ("value" in outcome) return { text: fmtNumber(outcome.value, 8), isError: false };
    return { text: outcome.error || "Error", isError: true };
  }, [expression, outcome]);

  const insert = useCallback((text: string) => {
    setExpression((prev) => prev + text);
  }, []);

  const backspace = useCallback(() => {
    setExpression((prev) => prev.slice(0, -1));
  }, []);

  const clearAll = useCallback(() => {
    setExpression("");
  }, []);

  const commit = useCallback(() => {
    setExpression((prev) => {
      if (!prev.trim()) return prev;
      const result = evaluateExpression(prev);
      if ("value" in result) {
        setHistory((h) => [{ expr: prev, result: fmtNumber(result.value, 8) }, ...h].slice(0, 5));
        return String(result.value);
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (/^[0-9.+\-*/^%()]$/.test(e.key)) {
        e.preventDefault();
        insert(e.key);
      } else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        commit();
      } else if (e.key === "Backspace") {
        e.preventDefault();
        backspace();
      } else if (e.key === "Escape") {
        e.preventDefault();
        clearAll();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [insert, backspace, clearAll, commit]);

  function handlePress(button: ButtonSpec) {
    if (button.action === "clear") clearAll();
    else if (button.action === "delete") backspace();
    else if (button.insert) insert(button.insert);
  }

  const variantClasses: Record<NonNullable<ButtonSpec["variant"]>, string> = {
    num: "bg-white text-zinc-900 hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700",
    op: "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200",
    fn: "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800/60 dark:text-zinc-300 dark:hover:bg-zinc-700",
  };

  return (
    <div className="mx-auto w-full max-w-sm rounded-3xl border border-black/[.06] bg-white p-5 shadow-xl shadow-black/5 dark:border-white/[.08] dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex rounded-full bg-zinc-100 p-1 text-xs font-medium dark:bg-zinc-800">
          <button
            type="button"
            onClick={() => setMode("basic")}
            className={`rounded-full px-3 py-1 transition ${
              mode === "basic" ? "bg-white shadow dark:bg-zinc-950" : "text-zinc-500"
            }`}
          >
            Basic
          </button>
          <button
            type="button"
            onClick={() => setMode("scientific")}
            className={`rounded-full px-3 py-1 transition ${
              mode === "scientific" ? "bg-white shadow dark:bg-zinc-950" : "text-zinc-500"
            }`}
          >
            Scientific
          </button>
        </div>
        <CopyButton value={display.text} />
      </div>

      <div className="mb-4 rounded-2xl bg-zinc-50 p-4 text-right dark:bg-zinc-950">
        <p className="min-h-5 truncate text-sm text-zinc-400">{expression || " "}</p>
        <p
          className={`truncate text-3xl font-semibold tracking-tight ${
            display.isError ? "text-red-500" : "text-zinc-900 dark:text-zinc-50"
          }`}
        >
          {display.text}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {mode === "scientific" &&
          scientificRows.map((row, i) => (
            <div key={`sci-${i}`} className="grid grid-cols-4 gap-2">
              {row.map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  onClick={() => handlePress(btn)}
                  className={`rounded-xl py-2.5 text-sm font-medium transition ${variantClasses[btn.variant ?? "fn"]}`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          ))}

        {basicRows.map((row, i) => (
          <div key={`basic-${i}`} className="grid grid-cols-4 gap-2">
            {row.map((btn) => (
              <button
                key={btn.label}
                type="button"
                onClick={() => handlePress(btn)}
                className={`rounded-xl py-2.5 text-base font-medium transition ${variantClasses[btn.variant ?? "num"]}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        ))}

        <button
          type="button"
          onClick={commit}
          className="mt-1 w-full rounded-xl bg-emerald-500 py-3 text-base font-semibold text-white transition hover:bg-emerald-600"
        >
          =
        </button>
      </div>

      {history.length > 0 && (
        <div className="mt-4 border-t border-black/[.06] pt-3 dark:border-white/[.08]">
          <p className="mb-1 text-xs font-medium text-zinc-400">History</p>
          <ul className="flex flex-col gap-1 text-xs text-zinc-500 dark:text-zinc-400">
            {history.map((h, i) => (
              <li key={i} className="flex justify-between gap-2 truncate">
                <span className="truncate">{h.expr}</span>
                <span className="shrink-0 font-medium text-zinc-700 dark:text-zinc-200">{h.result}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
