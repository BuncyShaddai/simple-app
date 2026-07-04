import type { CalculatorDefinition } from "./types";
import { fmtNumber, parseNumberList, toNumber } from "./format";

const percentageChange: CalculatorDefinition = {
  slug: "percentage-change",
  title: "Percentage Change Calculator",
  shortTitle: "Percentage Change",
  description: "Find the percentage increase or decrease between two values.",
  domain: "math",
  icon: "\u{1F4CA}",
  formula: "% change = (New − Original) ÷ |Original| × 100.",
  fields: [
    { id: "from", label: "Original value", type: "number", defaultValue: 80, },
    { id: "to", label: "New value", type: "number", defaultValue: 100 },
  ],
  calculate: (v) => {
    const from = toNumber(v.from);
    const to = toNumber(v.to);
    if ([from, to].some((n) => Number.isNaN(n)) || from === 0) {
      return { error: "Original value must be a non-zero number." };
    }
    const change = ((to - from) / Math.abs(from)) * 100;
    const label = change >= 0 ? "Increase" : "Decrease";
    return {
      results: [
        { label, value: fmtNumber(Math.abs(change), 2), unit: "%", primary: true },
        { label: "Absolute difference", value: fmtNumber(to - from, 2) },
      ],
    };
  },
};

const quadratic: CalculatorDefinition = {
  slug: "quadratic-solver",
  title: "Quadratic Equation Solver",
  shortTitle: "Quadratic Solver",
  description: "Solve ax² + bx + c = 0 for real or complex roots.",
  domain: "math",
  icon: "\u{1F4D0}",
  formula: "Roots of ax² + bx + c = 0 via x = (−b ± √(b² − 4ac)) ÷ 2a.",
  fields: [
    { id: "a", label: "a", type: "number", defaultValue: 1 },
    { id: "b", label: "b", type: "number", defaultValue: -3 },
    { id: "c", label: "c", type: "number", defaultValue: 2 },
  ],
  calculate: (v) => {
    const a = toNumber(v.a);
    const b = toNumber(v.b);
    const c = toNumber(v.c);
    if ([a, b, c].some((n) => Number.isNaN(n))) {
      return { error: "Enter numeric values for a, b and c." };
    }
    if (a === 0) {
      if (b === 0) return { error: "Not a valid equation (a and b cannot both be 0)." };
      const x = -c / b;
      return { results: [{ label: "Linear root", value: fmtNumber(x, 4), primary: true }] };
    }
    const discriminant = b * b - 4 * a * c;
    if (discriminant > 0) {
      const sqrtD = Math.sqrt(discriminant);
      const x1 = (-b + sqrtD) / (2 * a);
      const x2 = (-b - sqrtD) / (2 * a);
      return {
        results: [
          { label: "x₁", value: fmtNumber(x1, 4), primary: true },
          { label: "x₂", value: fmtNumber(x2, 4) },
          { label: "Discriminant", value: fmtNumber(discriminant, 4) },
        ],
      };
    }
    if (discriminant === 0) {
      const x = -b / (2 * a);
      return {
        results: [
          { label: "x (double root)", value: fmtNumber(x, 4), primary: true },
          { label: "Discriminant", value: "0" },
        ],
      };
    }
    const real = -b / (2 * a);
    const imag = Math.sqrt(-discriminant) / (2 * a);
    return {
      results: [
        { label: "x₁", value: `${fmtNumber(real, 4)} + ${fmtNumber(imag, 4)}i`, primary: true },
        { label: "x₂", value: `${fmtNumber(real, 4)} - ${fmtNumber(imag, 4)}i` },
        { label: "Discriminant", value: fmtNumber(discriminant, 4) },
      ],
    };
  },
};

const temperature: CalculatorDefinition = {
  slug: "temperature-converter",
  title: "Temperature Converter",
  shortTitle: "Temperature",
  description: "Convert between Celsius, Fahrenheit and Kelvin.",
  domain: "math",
  icon: "\u{1F321}\u{FE0F}",
  formula: "°F = °C × 9/5 + 32; K = °C + 273.15 — converted through Celsius as the common base unit.",
  fields: [
    { id: "value", label: "Value", type: "number", defaultValue: 25 },
    {
      id: "from",
      label: "From unit",
      type: "select",
      defaultValue: "celsius",
      options: [
        { label: "Celsius (°C)", value: "celsius" },
        { label: "Fahrenheit (°F)", value: "fahrenheit" },
        { label: "Kelvin (K)", value: "kelvin" },
      ],
    },
  ],
  calculate: (v) => {
    const value = toNumber(v.value);
    if (Number.isNaN(value)) return { error: "Enter a numeric temperature." };
    let celsius: number;
    switch (v.from) {
      case "fahrenheit":
        celsius = (value - 32) * (5 / 9);
        break;
      case "kelvin":
        celsius = value - 273.15;
        break;
      default:
        celsius = value;
    }
    const fahrenheit = celsius * (9 / 5) + 32;
    const kelvin = celsius + 273.15;
    return {
      results: [
        { label: "Celsius", value: fmtNumber(celsius, 2), unit: "°C", primary: v.from !== "celsius" },
        { label: "Fahrenheit", value: fmtNumber(fahrenheit, 2), unit: "°F", primary: v.from === "celsius" },
        { label: "Kelvin", value: fmtNumber(kelvin, 2), unit: "K" },
      ],
    };
  },
};

const averageMedian: CalculatorDefinition = {
  slug: "average-median",
  title: "Average / Median Calculator",
  shortTitle: "Average & Median",
  description: "Get the mean, median, min and max of a list of numbers.",
  domain: "math",
  icon: "\u{1F4CB}",
  formula: "Mean = sum of values ÷ count. Median = middle value of the sorted list (average of the two middle values if the count is even).",
  fields: [
    {
      id: "numbers",
      label: "Numbers",
      type: "textarea",
      defaultValue: "4, 8, 15, 16, 23, 42",
      helpText: "Comma-separated list of numbers",
    },
  ],
  calculate: (v) => {
    const numbers = parseNumberList(v.numbers);
    if (numbers.length === 0 || numbers.some((n) => Number.isNaN(n))) {
      return { error: "Enter a comma-separated list of numbers." };
    }
    const sorted = [...numbers].sort((a, b) => a - b);
    const sum = numbers.reduce((acc, n) => acc + n, 0);
    const mean = sum / numbers.length;
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    return {
      results: [
        { label: "Mean", value: fmtNumber(mean, 2), primary: true },
        { label: "Median", value: fmtNumber(median, 2) },
        { label: "Min", value: fmtNumber(sorted[0], 2) },
        { label: "Max", value: fmtNumber(sorted[sorted.length - 1], 2) },
      ],
    };
  },
};

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    [x, y] = [y, x % y];
  }
  return x;
}

const gcdLcm: CalculatorDefinition = {
  slug: "gcd-lcm",
  title: "GCD & LCM Calculator",
  shortTitle: "GCD & LCM",
  description: "Find the greatest common divisor and least common multiple.",
  domain: "math",
  icon: "\u{1F522}",
  formula: "GCD via the Euclidean algorithm; LCM = |a × b| ÷ GCD(a, b).",
  fields: [
    { id: "a", label: "First integer", type: "number", defaultValue: 12, step: 1 },
    { id: "b", label: "Second integer", type: "number", defaultValue: 18, step: 1 },
  ],
  calculate: (v) => {
    const a = Math.round(toNumber(v.a));
    const b = Math.round(toNumber(v.b));
    if ([a, b].some((n) => Number.isNaN(n)) || (a === 0 && b === 0)) {
      return { error: "Enter two integers, not both zero." };
    }
    const divisor = gcd(a, b);
    const multiple = divisor === 0 ? 0 : Math.abs(a * b) / divisor;
    return {
      results: [
        { label: "GCD", value: fmtNumber(divisor, 0), primary: true },
        { label: "LCM", value: fmtNumber(multiple, 0) },
      ],
    };
  },
};

export const mathCalculators: CalculatorDefinition[] = [
  percentageChange,
  quadratic,
  temperature,
  averageMedian,
  gcdLcm,
];
