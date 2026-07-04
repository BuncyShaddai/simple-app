import type { CalculatorDefinition } from "./types";
import { fmtNumber, toNumber } from "./format";

const ohmsLaw: CalculatorDefinition = {
  slug: "ohms-law",
  title: "Ohm's Law Calculator",
  shortTitle: "Ohm's Law",
  description: "Find current and power from voltage and resistance.",
  domain: "science",
  icon: "\u{26A1}",
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

export const scienceCalculators: CalculatorDefinition[] = [ohmsLaw, speedDistanceTime, kineticEnergy];
