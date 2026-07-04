export function fmtNumber(value: number, maxDecimals = 2): string {
  if (!Number.isFinite(value)) return "—";
  return value.toLocaleString(undefined, {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: 0,
  });
}

export function fmtCurrency(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return value.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

export function toNumber(value: number | string | undefined): number {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") return Number(value);
  return NaN;
}

export function parseNumberList(value: number | string | undefined): number[] {
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part !== "")
    .map(Number);
}
