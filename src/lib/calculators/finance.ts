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

export const financeCalculators: CalculatorDefinition[] = [loanEmi, compoundInterest, tipSplit];
