type TokenType = "number" | "ident" | "+" | "-" | "*" | "/" | "^" | "%" | "(" | ")";

interface Token {
  type: TokenType;
  value: string;
}

const FUNCTIONS: Record<string, (x: number) => number> = {
  sin: (x) => Math.sin((x * Math.PI) / 180),
  cos: (x) => Math.cos((x * Math.PI) / 180),
  tan: (x) => Math.tan((x * Math.PI) / 180),
  sqrt: (x) => Math.sqrt(x),
  log: (x) => Math.log10(x),
  ln: (x) => Math.log(x),
};

const CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
};

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    const ch = input[i];
    if (/\s/.test(ch)) {
      i += 1;
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      let j = i + 1;
      while (j < input.length && /[0-9.]/.test(input[j])) j += 1;
      tokens.push({ type: "number", value: input.slice(i, j) });
      i = j;
      continue;
    }
    if (/[a-zA-Z]/.test(ch)) {
      let j = i + 1;
      while (j < input.length && /[a-zA-Z]/.test(input[j])) j += 1;
      tokens.push({ type: "ident", value: input.slice(i, j) });
      i = j;
      continue;
    }
    if ("+-*/^%()".includes(ch)) {
      tokens.push({ type: ch as TokenType, value: ch });
      i += 1;
      continue;
    }
    throw new Error(`Unexpected character "${ch}"`);
  }
  return tokens;
}

class Parser {
  private tokens: Token[];
  private pos = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private consume(type?: TokenType): Token {
    const token = this.tokens[this.pos];
    if (!token || (type && token.type !== type)) {
      throw new Error("Unexpected end of expression");
    }
    this.pos += 1;
    return token;
  }

  parse(): number {
    const value = this.parseExpr();
    if (this.pos !== this.tokens.length) {
      throw new Error(`Unexpected token "${this.peek()?.value}"`);
    }
    return value;
  }

  private parseExpr(): number {
    let value = this.parseTerm();
    while (this.peek()?.type === "+" || this.peek()?.type === "-") {
      const op = this.consume().type;
      const rhs = this.parseTerm();
      value = op === "+" ? value + rhs : value - rhs;
    }
    return value;
  }

  private parseTerm(): number {
    let value = this.parseUnary();
    while (this.peek()?.type === "*" || this.peek()?.type === "/") {
      const op = this.consume().type;
      const rhs = this.parseUnary();
      if (op === "/" && rhs === 0) throw new Error("Division by zero");
      value = op === "*" ? value * rhs : value / rhs;
    }
    return value;
  }

  private parseUnary(): number {
    if (this.peek()?.type === "-") {
      this.consume();
      return -this.parseUnary();
    }
    if (this.peek()?.type === "+") {
      this.consume();
      return this.parseUnary();
    }
    return this.parsePower();
  }

  private parsePower(): number {
    const base = this.parsePostfix();
    if (this.peek()?.type === "^") {
      this.consume();
      const exponent = this.parseUnary();
      return Math.pow(base, exponent);
    }
    return base;
  }

  private parsePostfix(): number {
    let value = this.parsePrimary();
    while (this.peek()?.type === "%") {
      this.consume();
      value = value / 100;
    }
    return value;
  }

  private parsePrimary(): number {
    const token = this.peek();
    if (!token) throw new Error("Unexpected end of expression");

    if (token.type === "number") {
      this.consume();
      return parseFloat(token.value);
    }
    if (token.type === "(") {
      this.consume();
      const value = this.parseExpr();
      this.consume(")");
      return value;
    }
    if (token.type === "ident") {
      this.consume();
      const name = token.value.toLowerCase();
      if (this.peek()?.type === "(") {
        this.consume();
        const arg = this.parseExpr();
        this.consume(")");
        const fn = FUNCTIONS[name];
        if (!fn) throw new Error(`Unknown function "${name}"`);
        return fn(arg);
      }
      if (name in CONSTANTS) return CONSTANTS[name];
      throw new Error(`Unknown identifier "${name}"`);
    }
    throw new Error(`Unexpected token "${token.value}"`);
  }
}

export function evaluateExpression(expr: string): { value: number } | { error: string } {
  if (!expr.trim()) return { error: "" };
  try {
    const tokens = tokenize(expr);
    const value = new Parser(tokens).parse();
    if (!Number.isFinite(value)) return { error: "Invalid calculation" };
    return { value };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Invalid expression" };
  }
}
