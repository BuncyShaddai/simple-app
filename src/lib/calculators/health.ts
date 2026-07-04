import type { CalculatorDefinition } from "./types";
import { fmtNumber, toNumber } from "./format";

function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

const bmi: CalculatorDefinition = {
  slug: "bmi",
  title: "BMI Calculator",
  shortTitle: "BMI",
  description: "Body mass index from your height and weight.",
  domain: "health",
  icon: "\u{2696}\u{FE0F}",
  fields: [
    { id: "weight", label: "Weight", type: "number", unit: "kg", defaultValue: 70, min: 0 },
    { id: "height", label: "Height", type: "number", unit: "cm", defaultValue: 175, min: 0 },
  ],
  calculate: (v) => {
    const weight = toNumber(v.weight);
    const height = toNumber(v.height);
    if ([weight, height].some((n) => Number.isNaN(n)) || weight <= 0 || height <= 0) {
      return { error: "Enter a positive weight and height." };
    }
    const meters = height / 100;
    const value = weight / (meters * meters);
    return {
      results: [
        { label: "BMI", value: fmtNumber(value, 1), primary: true },
        { label: "Category", value: bmiCategory(value) },
      ],
    };
  },
};

const bmr: CalculatorDefinition = {
  slug: "calorie-needs",
  title: "Daily Calorie Calculator",
  shortTitle: "Calorie Needs",
  description: "Estimate BMR and daily calorie needs (Mifflin-St Jeor).",
  domain: "health",
  icon: "\u{1F525}",
  fields: [
    {
      id: "sex",
      label: "Sex",
      type: "select",
      defaultValue: "female",
      options: [
        { label: "Female", value: "female" },
        { label: "Male", value: "male" },
      ],
    },
    { id: "age", label: "Age", type: "number", unit: "years", defaultValue: 30, min: 1 },
    { id: "weight", label: "Weight", type: "number", unit: "kg", defaultValue: 65, min: 0 },
    { id: "height", label: "Height", type: "number", unit: "cm", defaultValue: 165, min: 0 },
    {
      id: "activity",
      label: "Activity level",
      type: "select",
      defaultValue: "1.375",
      options: [
        { label: "Sedentary (little exercise)", value: "1.2" },
        { label: "Light (1-3 days/week)", value: "1.375" },
        { label: "Moderate (3-5 days/week)", value: "1.55" },
        { label: "Active (6-7 days/week)", value: "1.725" },
        { label: "Very active (athlete)", value: "1.9" },
      ],
    },
  ],
  calculate: (v) => {
    const age = toNumber(v.age);
    const weight = toNumber(v.weight);
    const height = toNumber(v.height);
    const activity = toNumber(v.activity);
    if ([age, weight, height, activity].some((n) => Number.isNaN(n)) || age <= 0 || weight <= 0 || height <= 0) {
      return { error: "Fill in age, weight and height with positive numbers." };
    }
    const base = 10 * weight + 6.25 * height - 5 * age;
    const bmrValue = v.sex === "male" ? base + 5 : base - 161;
    const tdee = bmrValue * activity;
    return {
      results: [
        { label: "Daily calories (TDEE)", value: `${fmtNumber(tdee, 0)}`, unit: "kcal", primary: true },
        { label: "Base metabolic rate (BMR)", value: fmtNumber(bmrValue, 0), unit: "kcal" },
      ],
    };
  },
};

const waterIntake: CalculatorDefinition = {
  slug: "water-intake",
  title: "Water Intake Calculator",
  shortTitle: "Water Intake",
  description: "A quick estimate of daily hydration needs.",
  domain: "health",
  icon: "\u{1F4A7}",
  fields: [
    { id: "weight", label: "Weight", type: "number", unit: "kg", defaultValue: 70, min: 0 },
    {
      id: "activity",
      label: "Exercise per day",
      type: "select",
      defaultValue: "0",
      options: [
        { label: "None", value: "0" },
        { label: "Under 30 minutes", value: "350" },
        { label: "30-60 minutes", value: "700" },
        { label: "Over 60 minutes", value: "1050" },
      ],
    },
  ],
  calculate: (v) => {
    const weight = toNumber(v.weight);
    const extra = toNumber(v.activity);
    if ([weight, extra].some((n) => Number.isNaN(n)) || weight <= 0) {
      return { error: "Enter a positive weight." };
    }
    const baseMl = weight * 33;
    const totalMl = baseMl + extra;
    return {
      results: [
        { label: "Recommended intake", value: fmtNumber(totalMl / 1000, 1), unit: "L / day", primary: true },
        { label: "In ounces", value: fmtNumber((totalMl / 1000) * 33.814, 0), unit: "fl oz" },
      ],
    };
  },
};

export const healthCalculators: CalculatorDefinition[] = [bmi, bmr, waterIntake];
