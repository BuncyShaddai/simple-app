import type { CalculatorDefinition } from "./types";
import { fmtCurrency, toNumber } from "./format";

const loanEmi: CalculatorDefinition = {
  slug: "loan-emi",
  title: "Loan / EMI Calculator",
  shortTitle: "Loan EMI",
  description: "Estimate your monthly loan payment and total interest.",
  domain: "finance",
  icon: "\u{1F3E6}",
  fields: [
    { id: "principal", label: "Loan amount", type: "number", unit: "$", defaultValue: 20000, min: 0 },
    { id: "rate", label: "Annual interest rate", type: "number", unit: "%", defaultValue: 6.5, min: 0, step: 0.1 },
    { id: "years", label: "Loan term", type: "number", unit: "years", defaultValue: 5, min: 0 },
  ],
  calculate: (v) => {
    const principal = toNumber(v.principal);
    const rate = toNumber(v.rate);
    const years = toNumber(v.years);
    if ([principal, rate, years].some((n) => Number.isNaN(n)) || principal <= 0 || years <= 0) {
      return { error: "Enter a positive loan amount and term." };
    }
    const months = years * 12;
    const monthlyRate = rate / 100 / 12;
    const payment =
      monthlyRate === 0
        ? principal / months
        : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
    const total = payment * months;
    const interest = total - principal;
    return {
      results: [
        { label: "Monthly payment", value: fmtCurrency(payment), primary: true },
        { label: "Total paid", value: fmtCurrency(total) },
        { label: "Total interest", value: fmtCurrency(interest) },
      ],
    };
  },
};

const compoundInterest: CalculatorDefinition = {
  slug: "compound-interest",
  title: "Compound Interest Calculator",
  shortTitle: "Compound Interest",
  description: "See how savings grow with compounding over time.",
  domain: "finance",
  icon: "\u{1F4C8}",
  fields: [
    { id: "principal", label: "Starting amount", type: "number", unit: "$", defaultValue: 5000, min: 0 },
    { id: "rate", label: "Annual interest rate", type: "number", unit: "%", defaultValue: 5, min: 0, step: 0.1 },
    {
      id: "frequency",
      label: "Compounded",
      type: "select",
      defaultValue: "12",
      options: [
        { label: "Annually", value: "1" },
        { label: "Quarterly", value: "4" },
        { label: "Monthly", value: "12" },
        { label: "Daily", value: "365" },
      ],
    },
    { id: "years", label: "Time", type: "number", unit: "years", defaultValue: 10, min: 0 },
  ],
  calculate: (v) => {
    const principal = toNumber(v.principal);
    const rate = toNumber(v.rate);
    const n = toNumber(v.frequency);
    const years = toNumber(v.years);
    if ([principal, rate, n, years].some((x) => Number.isNaN(x)) || principal < 0 || years < 0) {
      return { error: "Check that all fields are filled with valid numbers." };
    }
    const futureValue = principal * Math.pow(1 + rate / 100 / n, n * years);
    const interestEarned = futureValue - principal;
    return {
      results: [
        { label: "Future value", value: fmtCurrency(futureValue), primary: true },
        { label: "Interest earned", value: fmtCurrency(interestEarned) },
      ],
    };
  },
};

const tipSplit: CalculatorDefinition = {
  slug: "tip-split",
  title: "Tip & Split Calculator",
  shortTitle: "Tip & Split",
  description: "Work out the tip and split the bill between friends.",
  domain: "finance",
  icon: "\u{1F9FE}",
  fields: [
    { id: "bill", label: "Bill amount", type: "number", unit: "$", defaultValue: 60, min: 0 },
    { id: "tip", label: "Tip", type: "number", unit: "%", defaultValue: 18, min: 0, step: 1 },
    { id: "people", label: "Number of people", type: "number", defaultValue: 2, min: 1, step: 1 },
  ],
  calculate: (v) => {
    const bill = toNumber(v.bill);
    const tip = toNumber(v.tip);
    const people = toNumber(v.people);
    if ([bill, tip, people].some((n) => Number.isNaN(n)) || bill < 0 || people < 1) {
      return { error: "Enter a valid bill amount and at least 1 person." };
    }
    const tipAmount = bill * (tip / 100);
    const total = bill + tipAmount;
    return {
      results: [
        { label: "Per person", value: fmtCurrency(total / people), primary: true },
        { label: "Tip amount", value: fmtCurrency(tipAmount) },
        { label: "Total bill", value: fmtCurrency(total) },
      ],
    };
  },
};

const savingsGoal: CalculatorDefinition = {
  slug: "savings-goal",
  title: "Savings Goal Calculator",
  shortTitle: "Savings Goal",
  description: "Find out how long it takes to hit a savings target.",
  domain: "finance",
  icon: "\u{1F3AF}",
  fields: [
    { id: "target", label: "Savings goal", type: "number", unit: "$", defaultValue: 10000, min: 0 },
    { id: "contribution", label: "Monthly contribution", type: "number", unit: "$", defaultValue: 300, min: 0 },
    { id: "rate", label: "Annual interest rate", type: "number", unit: "%", defaultValue: 4, min: 0, step: 0.1 },
  ],
  calculate: (v) => {
    const target = toNumber(v.target);
    const contribution = toNumber(v.contribution);
    const rate = toNumber(v.rate);
    if ([target, contribution, rate].some((n) => Number.isNaN(n)) || target <= 0 || contribution <= 0) {
      return { error: "Enter a positive goal amount and monthly contribution." };
    }
    const monthlyRate = rate / 100 / 12;
    const months =
      monthlyRate === 0
        ? target / contribution
        : Math.log(1 + (target * monthlyRate) / contribution) / Math.log(1 + monthlyRate);
    if (!Number.isFinite(months) || months < 0) {
      return { error: "Goal isn't reachable with these inputs." };
    }
    return {
      results: [
        { label: "Time to reach goal", value: `${Math.ceil(months)}`, unit: "months", primary: true },
        { label: "In years", value: (months / 12).toFixed(1), unit: "years" },
      ],
    };
  },
};

const discount: CalculatorDefinition = {
  slug: "discount",
  title: "Discount Calculator",
  shortTitle: "Discount",
  description: "Work out the sale price after a discount (and tax).",
  domain: "finance",
  icon: "\u{1F3F7}\u{FE0F}",
  fields: [
    { id: "price", label: "Original price", type: "number", unit: "$", defaultValue: 80, min: 0 },
    { id: "discount", label: "Discount", type: "number", unit: "%", defaultValue: 25, min: 0, max: 100 },
    { id: "tax", label: "Sales tax", type: "number", unit: "%", defaultValue: 0, min: 0 },
  ],
  calculate: (v) => {
    const price = toNumber(v.price);
    const discountPct = toNumber(v.discount);
    const taxPct = toNumber(v.tax);
    if ([price, discountPct, taxPct].some((n) => Number.isNaN(n)) || price < 0) {
      return { error: "Enter a valid price and discount." };
    }
    const discountAmount = price * (discountPct / 100);
    const afterDiscount = price - discountAmount;
    const tax = afterDiscount * (taxPct / 100);
    const finalPrice = afterDiscount + tax;
    return {
      results: [
        { label: "Final price", value: fmtCurrency(finalPrice), primary: true },
        { label: "You save", value: fmtCurrency(discountAmount) },
        { label: "Tax added", value: fmtCurrency(tax) },
      ],
    };
  },
};

export const financeCalculators: CalculatorDefinition[] = [
  loanEmi,
  compoundInterest,
  tipSplit,
  savingsGoal,
  discount,
];
