export type DomainId = "finance" | "health" | "math" | "datetime" | "science";

export interface Domain {
  id: DomainId;
  name: string;
  description: string;
  icon: string;
}

export type FieldType = "number" | "select" | "date" | "time" | "textarea";

export interface SelectOption {
  label: string;
  value: string;
}

export interface CalculatorField {
  id: string;
  label: string;
  type: FieldType;
  unit?: string;
  placeholder?: string;
  defaultValue?: number | string;
  options?: SelectOption[];
  min?: number;
  max?: number;
  step?: number;
  helpText?: string;
}

export type CalculatorValues = Record<string, number | string>;

export interface CalculatorResult {
  label: string;
  value: string;
  unit?: string;
  primary?: boolean;
}

export type CalculateOutput = { results: CalculatorResult[] } | { error: string };

export interface CalculatorDefinition {
  slug: string;
  title: string;
  shortTitle?: string;
  description: string;
  domain: DomainId;
  icon: string;
  fields: CalculatorField[];
  calculate: (values: CalculatorValues) => CalculateOutput;
}
