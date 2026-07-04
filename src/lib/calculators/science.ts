import type { CalculatorDefinition } from "./types";
import { fmtNumber, toNumber } from "./format";

const ohmsLaw: CalculatorDefinition = {
  slug: "ohms-law",
  title: "Ohm's Law Calculator",
  shortTitle: "Ohm's Law",
  description: "Find current and power from voltage and resistance.",
  domain: "science",
  icon: "\u{26A1}",
  formula: "Ohm's law: I = V ÷ R. Power: P = V × I.",
  fields: [
    { id: "voltage", label: "Voltage", type: "number", unit: "V", defaultValue: 12, min: 0 },
    { id: "resistance", label: "Resistance", type: "number", unit: "Ω", defaultValue: 100, min: 0 },
  ],
  calculate: (v) => {
    const voltage = toNumber(v.voltage);
    const resistance = toNumber(v.resistance);
    if ([voltage, resistance].some((n) => Number.isNaN(n)) || resistance <= 0) {
      return { error: "Enter a voltage and a resistance greater than 0." };
    }
    const current = voltage / resistance;
    const power = voltage * current;
    return {
      results: [
        { label: "Current", value: fmtNumber(current, 4), unit: "A", primary: true },
        { label: "Power", value: fmtNumber(power, 4), unit: "W" },
      ],
    };
  },
};

const speedDistanceTime: CalculatorDefinition = {
  slug: "speed-distance-time",
  title: "Speed Calculator",
  shortTitle: "Speed",
  description: "Work out average speed from distance and time travelled.",
  domain: "science",
  icon: "\u{1F3CE}\u{FE0F}",
  formula: "Speed = Distance ÷ Time.",
  fields: [
    { id: "distance", label: "Distance", type: "number", unit: "km", defaultValue: 100, min: 0 },
    { id: "time", label: "Time", type: "number", unit: "hours", defaultValue: 1.5, min: 0, step: 0.1 },
  ],
  calculate: (v) => {
    const distance = toNumber(v.distance);
    const time = toNumber(v.time);
    if ([distance, time].some((n) => Number.isNaN(n)) || time <= 0) {
      return { error: "Enter a distance and a time greater than 0." };
    }
    const speed = distance / time;
    return {
      results: [
        { label: "Average speed", value: fmtNumber(speed, 2), unit: "km/h", primary: true },
        { label: "In m/s", value: fmtNumber((speed * 1000) / 3600, 2), unit: "m/s" },
      ],
    };
  },
};

const kineticEnergy: CalculatorDefinition = {
  slug: "kinetic-energy",
  title: "Kinetic Energy Calculator",
  shortTitle: "Kinetic Energy",
  description: "Calculate kinetic energy from mass and velocity.",
  domain: "science",
  icon: "\u{1F680}",
  formula: "KE = ½ × m × v².",
  fields: [
    { id: "mass", label: "Mass", type: "number", unit: "kg", defaultValue: 1000, min: 0 },
    { id: "velocity", label: "Velocity", type: "number", unit: "m/s", defaultValue: 20, min: 0 },
  ],
  calculate: (v) => {
    const mass = toNumber(v.mass);
    const velocity = toNumber(v.velocity);
    if ([mass, velocity].some((n) => Number.isNaN(n)) || mass < 0 || velocity < 0) {
      return { error: "Enter a non-negative mass and velocity." };
    }
    const energy = 0.5 * mass * velocity * velocity;
    return {
      results: [{ label: "Kinetic energy", value: fmtNumber(energy, 2), unit: "J", primary: true }],
    };
  },
};

const freeFall: CalculatorDefinition = {
  slug: "free-fall",
  title: "Free Fall Calculator",
  shortTitle: "Free Fall",
  description: "Find fall time and impact velocity for a dropped object.",
  domain: "science",
  icon: "\u{1FAA8}",
  formula: "Fall time: t = √(2h ÷ g). Impact velocity: v = g × t, with g = 9.81 m/s².",
  fields: [{ id: "height", label: "Drop height", type: "number", unit: "m", defaultValue: 10, min: 0 }],
  calculate: (v) => {
    const height = toNumber(v.height);
    if (Number.isNaN(height) || height < 0) return { error: "Enter a non-negative height." };
    const g = 9.81;
    const time = Math.sqrt((2 * height) / g);
    const velocity = g * time;
    return {
      results: [
        { label: "Fall time", value: fmtNumber(time, 2), unit: "s", primary: true },
        { label: "Impact velocity", value: fmtNumber(velocity, 2), unit: "m/s" },
      ],
    };
  },
};

const pressure: CalculatorDefinition = {
  slug: "pressure",
  title: "Pressure Calculator",
  shortTitle: "Pressure",
  description: "Calculate pressure from an applied force and area.",
  domain: "science",
  icon: "\u{1F4A2}",
  formula: "Pressure = Force ÷ Area (Pascals).",
  fields: [
    { id: "force", label: "Force", type: "number", unit: "N", defaultValue: 500, min: 0 },
    { id: "area", label: "Area", type: "number", unit: "m²", defaultValue: 2, min: 0, step: 0.01 },
  ],
  calculate: (v) => {
    const force = toNumber(v.force);
    const area = toNumber(v.area);
    if ([force, area].some((n) => Number.isNaN(n)) || area <= 0) {
      return { error: "Enter a force and an area greater than 0." };
    }
    const pascals = force / area;
    return {
      results: [
        { label: "Pressure", value: fmtNumber(pascals, 2), unit: "Pa", primary: true },
        { label: "In kilopascals", value: fmtNumber(pascals / 1000, 3), unit: "kPa" },
      ],
    };
  },
};

export const scienceCalculators: CalculatorDefinition[] = [
  ohmsLaw,
  speedDistanceTime,
  kineticEnergy,
  freeFall,
  pressure,
];
