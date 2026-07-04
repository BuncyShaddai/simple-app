import type { CalculatorDefinition } from "./types";
import { fmtNumber } from "./format";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function parseDate(value: number | string | undefined): Date | null {
  if (typeof value !== "string" || !value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

const ageCalculator: CalculatorDefinition = {
  slug: "age-calculator",
  title: "Age Calculator",
  shortTitle: "Age",
  description: "Find your exact age and days until your next birthday.",
  domain: "datetime",
  icon: "\u{1F382}",
  fields: [{ id: "birthdate", label: "Date of birth", type: "date" }],
  calculate: (v) => {
    const birth = parseDate(v.birthdate);
    if (!birth) return { error: "Pick a valid date of birth." };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (birth > today) return { error: "Date of birth can't be in the future." };

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();
    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < today) nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    const daysToNext = Math.round((nextBirthday.getTime() - today.getTime()) / MS_PER_DAY);
    const totalDays = Math.round((today.getTime() - birth.getTime()) / MS_PER_DAY);

    return {
      results: [
        { label: "Age", value: `${years}y ${months}m ${days}d`, primary: true },
        { label: "Days until next birthday", value: fmtNumber(daysToNext, 0) },
        { label: "Total days lived", value: fmtNumber(totalDays, 0) },
      ],
    };
  },
};

const dateDifference: CalculatorDefinition = {
  slug: "date-difference",
  title: "Date Difference Calculator",
  shortTitle: "Date Difference",
  description: "Calculate the days, weeks and months between two dates.",
  domain: "datetime",
  icon: "\u{1F4C5}",
  fields: [
    { id: "start", label: "Start date", type: "date" },
    { id: "end", label: "End date", type: "date" },
  ],
  calculate: (v) => {
    const start = parseDate(v.start);
    const end = parseDate(v.end);
    if (!start || !end) return { error: "Pick both a start and end date." };
    const diffDays = Math.round((end.getTime() - start.getTime()) / MS_PER_DAY);
    if (diffDays < 0) return { error: "End date must be after start date." };
    return {
      results: [
        { label: "Total days", value: fmtNumber(diffDays, 0), primary: true },
        { label: "Weeks", value: fmtNumber(diffDays / 7, 1) },
        { label: "Months (approx.)", value: fmtNumber(diffDays / 30.44, 1) },
      ],
    };
  },
};

const countdown: CalculatorDefinition = {
  slug: "countdown",
  title: "Countdown Calculator",
  shortTitle: "Countdown",
  description: "See how many days remain until a target date.",
  domain: "datetime",
  icon: "\u{23F3}",
  fields: [{ id: "target", label: "Target date", type: "date" }],
  calculate: (v) => {
    const target = parseDate(v.target);
    if (!target) return { error: "Pick a target date." };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.round((target.getTime() - today.getTime()) / MS_PER_DAY);
    return {
      results: [
        {
          label: diffDays >= 0 ? "Days remaining" : "Days ago",
          value: fmtNumber(Math.abs(diffDays), 0),
          primary: true,
        },
        { label: "Weeks", value: fmtNumber(Math.abs(diffDays) / 7, 1) },
      ],
    };
  },
};

const workDays: CalculatorDefinition = {
  slug: "work-days",
  title: "Work Days Calculator",
  shortTitle: "Work Days",
  description: "Count business days between two dates, excluding weekends.",
  domain: "datetime",
  icon: "\u{1F4BC}",
  fields: [
    { id: "start", label: "Start date", type: "date" },
    { id: "end", label: "End date", type: "date" },
  ],
  calculate: (v) => {
    const start = parseDate(v.start);
    const end = parseDate(v.end);
    if (!start || !end) return { error: "Pick both a start and end date." };
    if (end < start) return { error: "End date must be on or after the start date." };

    let businessDays = 0;
    const cursor = new Date(start);
    while (cursor <= end) {
      const day = cursor.getDay();
      if (day !== 0 && day !== 6) businessDays += 1;
      cursor.setDate(cursor.getDate() + 1);
    }

    return {
      results: [{ label: "Business days", value: fmtNumber(businessDays, 0), primary: true }],
    };
  },
};

function parseTime(value: number | string | undefined): number | null {
  if (typeof value !== "string" || !value) return null;
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

const timeDuration: CalculatorDefinition = {
  slug: "time-duration",
  title: "Time Duration Calculator",
  shortTitle: "Time Duration",
  description: "Find the elapsed time between a start and end time.",
  domain: "datetime",
  icon: "\u{23F1}\u{FE0F}",
  fields: [
    { id: "start", label: "Start time", type: "time" },
    { id: "end", label: "End time", type: "time" },
  ],
  calculate: (v) => {
    const start = parseTime(v.start);
    const end = parseTime(v.end);
    if (start === null || end === null) return { error: "Pick both a start and end time." };
    const diff = (end - start + 24 * 60) % (24 * 60);
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return {
      results: [{ label: "Elapsed time", value: `${hours}h ${minutes}m`, primary: true }],
    };
  },
};

export const datetimeCalculators: CalculatorDefinition[] = [
  ageCalculator,
  dateDifference,
  countdown,
  workDays,
  timeDuration,
];
