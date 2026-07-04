import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const VERSION = 1;

const phases = [
  {
    number: 1,
    name: "Ship paused v2 work + fastest wins",
    tasks: [
      {
        code: "1.1",
        name: "Copy-result + shareable URL for every calculator",
        complexity: "Low",
        value: "High",
        subtasks: [
          "Add copy-to-clipboard button to ResultsPanel primary result",
          "Sync CalculatorForm field values to the URL query string on change",
          "Read initial values from the URL on mount, falling back to defaults",
          "Wrap CalculatorForm usage in <Suspense> on the calculator detail page",
        ],
      },
      {
        code: "1.2",
        name: "Favorites & recently used",
        complexity: "Low",
        value: "High",
        subtasks: [
          "Build useFavorites localStorage hook",
          "Build useRecents localStorage hook",
          "Add star toggle button to CalculatorCard and calculator detail header",
          "Add a Favorites filter chip and Recently Used row to the homepage explorer",
        ],
      },
      {
        code: "1.3",
        name: "Persist hero calculator history",
        complexity: "Low",
        value: "High",
        subtasks: [
          "Persist calculation history array to localStorage on change",
          "Rehydrate history from localStorage on mount",
        ],
      },
      {
        code: "1.4",
        name: '"How this is calculated" formula notes',
        complexity: "Low",
        value: "High",
        subtasks: [
          "Add an optional formula field to CalculatorDefinition",
          "Write a formula/explanation string for all 25 calculators",
          "Render it as an expandable section on the calculator detail page",
        ],
      },
      {
        code: "1.5",
        name: "SEO basics",
        complexity: "Low",
        value: "Medium-High",
        subtasks: [
          "Add a generated sitemap.xml covering all calculator routes",
          "Add robots.txt",
          "Add JSON-LD structured data to each calculator page",
        ],
      },
      {
        code: "1.6",
        name: "Print / save result",
        complexity: "Low",
        value: "Medium",
        subtasks: ["Add a print stylesheet for the calculator detail page", 'Add a "Print result" button'],
      },
    ],
  },
  {
    number: 2,
    name: "Visual redesign + content breadth",
    tasks: [
      {
        code: "2.1",
        name: "Visual redesign pass",
        complexity: "Low-Medium",
        value: "Medium",
        subtasks: [
          "CalculatorCard icon bubble + gradient wash",
          "Animated value transition in ResultsPanel",
          "Homepage hero restyle with per-domain calculator counts",
          '"More in this domain" strip on the calculator detail page',
        ],
      },
      {
        code: "2.2",
        name: "Full unit converter suite",
        complexity: "Low-Medium",
        value: "High",
        subtasks: [
          "Define conversion factor tables for length, weight, volume, area, speed",
          "Build a category + from-unit + to-unit selector UI",
          "Register the new unit converter calculator(s) in the domain files",
        ],
      },
    ],
  },
  {
    number: 3,
    name: "History & data-driven features",
    tasks: [
      {
        code: "3.1",
        name: "Full calculation history log across all calculators",
        complexity: "Medium",
        value: "High",
        subtasks: [
          "Build a shared useCalculationHistory localStorage hook",
          "Log an entry every time any calculator produces a result",
          "Build a /history page with filtering, search, and clear-all",
        ],
      },
      {
        code: "3.2",
        name: "Graphing & visualization",
        complexity: "Medium",
        value: "High",
        subtasks: [
          "Build a small dependency-free SVG chart component",
          "Plot the parabola on the quadratic solver",
          "Plot the growth curve on compound interest and savings goal",
        ],
      },
      {
        code: "3.3",
        name: "Step-by-step solution breakdowns",
        complexity: "Medium",
        value: "Medium",
        subtasks: [
          "Add an optional steps() function to CalculatorDefinition",
          "Render the steps list in ResultsPanel",
          "Implement steps for quadratic-solver, loan-emi, and compound-interest as a pilot",
        ],
      },
    ],
  },
  {
    number: 4,
    name: "External data & platform",
    tasks: [
      {
        code: "4.1",
        name: "Currency converter",
        complexity: "Medium",
        value: "High",
        subtasks: [
          "Choose a free exchange-rate API and a caching/revalidation strategy",
          "Build a server-side route to fetch and cache exchange rates",
          "Build the currency converter calculator UI",
        ],
      },
      {
        code: "4.2",
        name: "PWA / installable + offline",
        complexity: "Medium",
        value: "Medium-High",
        subtasks: [
          "Add manifest.json and app icons",
          "Add a service worker to cache calculator pages for offline use",
          "Verify the install prompt on mobile and desktop",
        ],
      },
      {
        code: "4.3",
        name: "Embeddable widgets",
        complexity: "Medium-High",
        value: "Low-Medium",
        subtasks: [
          "Build a stripped-down /embed/[slug] route",
          "Configure headers to allow iframe embedding",
          'Add an "Embed this calculator" snippet generator',
        ],
      },
    ],
  },
  {
    number: 5,
    name: "Scale, accounts & comparison",
    tasks: [
      {
        code: "5.1",
        name: "Comparison mode",
        complexity: "Medium-High",
        value: "Medium",
        subtasks: [
          "Design a side-by-side multi-scenario input pattern",
          "Implement comparison mode for loan-emi and savings-goal as a pilot",
        ],
      },
      {
        code: "5.2",
        name: "Multi-language / i18n",
        complexity: "High",
        value: "Medium",
        subtasks: [
          "Set up routing/config for internationalization",
          "Translate UI strings",
          "Translate calculator labels and result text",
        ],
      },
      {
        code: "5.3",
        name: "User accounts + cross-device sync",
        complexity: "High",
        value: "High long-term",
        subtasks: [
          "Add authentication",
          "Design a DB schema for users, favorites, and history",
          "Migrate localStorage favorites/history to DB-backed sync",
          "Build an account settings page",
        ],
      },
    ],
  },
];

await sql`
  CREATE TABLE IF NOT EXISTS roadmap_tasks (
    id SERIAL PRIMARY KEY,
    version INT NOT NULL,
    phase_number INT NOT NULL,
    phase_name TEXT NOT NULL,
    task_code TEXT NOT NULL,
    task_name TEXT NOT NULL,
    subtask_code TEXT NOT NULL,
    subtask_name TEXT NOT NULL,
    complexity TEXT NOT NULL,
    value TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'planned',
    sort_order INT NOT NULL
  )
`;

await sql`DELETE FROM roadmap_tasks WHERE version = ${VERSION}`;

let sortOrder = 0;
const rows = [];
for (const phase of phases) {
  for (const task of phase.tasks) {
    task.subtasks.forEach((subtaskName, i) => {
      sortOrder += 1;
      rows.push({
        version: VERSION,
        phase_number: phase.number,
        phase_name: phase.name,
        task_code: task.code,
        task_name: task.name,
        subtask_code: `${task.code}.${i + 1}`,
        subtask_name: subtaskName,
        complexity: task.complexity,
        value: task.value,
        sort_order: sortOrder,
      });
    });
  }
}

for (const row of rows) {
  await sql`
    INSERT INTO roadmap_tasks
      (version, phase_number, phase_name, task_code, task_name, subtask_code, subtask_name, complexity, value, sort_order)
    VALUES
      (${row.version}, ${row.phase_number}, ${row.phase_name}, ${row.task_code}, ${row.task_name}, ${row.subtask_code}, ${row.subtask_name}, ${row.complexity}, ${row.value}, ${row.sort_order})
  `;
}

console.log(`Seeded ${rows.length} rows into roadmap_tasks (version ${VERSION}).`);
