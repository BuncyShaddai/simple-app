import type { Metadata } from "next";
import { sql } from "@/lib/db";
import { ProgressBar } from "@/components/ProgressBar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Roadmap · Calc Suite",
  description: "Implementation progress across the Calc Suite feature roadmap.",
};

interface RoadmapRow {
  version: number;
  phase_number: number;
  phase_name: string;
  task_code: string;
  task_name: string;
  subtask_code: string;
  subtask_name: string;
  complexity: string;
  value: string;
  status: string;
  sort_order: number;
}

const statusStyle: Record<string, string> = {
  done: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  in_progress: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  planned: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
};

const statusLabel: Record<string, string> = {
  done: "✅ Done",
  in_progress: "🔄 In progress",
  planned: "⬜ Planned",
};

export default async function RoadmapPage() {
  const rows = (await sql`
    SELECT version, phase_number, phase_name, task_code, task_name,
           subtask_code, subtask_name, complexity, value, status, sort_order
    FROM roadmap_tasks
    WHERE version = (SELECT MAX(version) FROM roadmap_tasks)
    ORDER BY sort_order
  `) as RoadmapRow[];

  if (rows.length === 0) {
    return (
      <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-16 text-center text-zinc-500 dark:text-zinc-400">
        No roadmap data found yet.
      </div>
    );
  }

  const version = rows[0].version;
  const totalDone = rows.filter((r) => r.status === "done").length;
  const totalInProgress = rows.filter((r) => r.status === "in_progress").length;
  const overallPct = Math.round((totalDone / rows.length) * 100);

  const phases = new Map<
    number,
    {
      name: string;
      tasks: Map<string, { name: string; complexity: string; value: string; subtasks: RoadmapRow[] }>;
    }
  >();

  for (const row of rows) {
    if (!phases.has(row.phase_number)) {
      phases.set(row.phase_number, { name: row.phase_name, tasks: new Map() });
    }
    const phase = phases.get(row.phase_number)!;
    if (!phase.tasks.has(row.task_code)) {
      phase.tasks.set(row.task_code, {
        name: row.task_name,
        complexity: row.complexity,
        value: row.value,
        subtasks: [],
      });
    }
    phase.tasks.get(row.task_code)!.subtasks.push(row);
  }

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Roadmap <span className="text-base font-normal text-zinc-400">v{version}</span>
      </h1>
      <p className="mt-1 text-zinc-500 dark:text-zinc-400">
        {totalDone} of {rows.length} subtasks complete · {totalInProgress} in progress
      </p>
      <ProgressBar value={overallPct} className="mt-4 h-3" />
      <p className="mt-1 text-right text-sm font-medium text-zinc-500 dark:text-zinc-400">{overallPct}%</p>

      <div className="mt-10 flex flex-col gap-8">
        {[...phases.entries()].map(([phaseNumber, phase]) => {
          const subtaskRows = [...phase.tasks.values()].flatMap((t) => t.subtasks);
          const phaseDone = subtaskRows.filter((r) => r.status === "done").length;
          const phasePct = Math.round((phaseDone / subtaskRows.length) * 100);

          return (
            <section
              key={phaseNumber}
              className="rounded-2xl border border-black/[.06] bg-white p-6 dark:border-white/[.08] dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
                  Phase {phaseNumber} — {phase.name}
                </h2>
                <span className="shrink-0 text-sm text-zinc-500 dark:text-zinc-400">
                  {phaseDone}/{subtaskRows.length}
                </span>
              </div>
              <ProgressBar value={phasePct} className="mt-3" />

              <ul className="mt-5 flex flex-col gap-5">
                {[...phase.tasks.entries()].map(([taskCode, task]) => (
                  <li key={taskCode}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono text-zinc-400">{taskCode}</span>
                      <span className="font-medium text-zinc-800 dark:text-zinc-100">{task.name}</span>
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                        {task.complexity} complexity
                      </span>
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                        {task.value} value
                      </span>
                    </div>
                    <ul className="mt-2 flex flex-col gap-1.5 border-l border-black/[.06] pl-4 dark:border-white/[.08]">
                      {task.subtasks.map((sub) => (
                        <li key={sub.subtask_code} className="flex items-center gap-2 text-sm">
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle[sub.status] ?? statusStyle.planned}`}
                          >
                            {statusLabel[sub.status] ?? sub.status}
                          </span>
                          <span className="text-zinc-600 dark:text-zinc-300">{sub.subtask_name}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
