import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const [code, status] = process.argv.slice(2);
if (!code || !status) {
  console.error("Usage: node update-roadmap-status.mjs <subtask_code|task_code> <status>");
  process.exit(1);
}

const result = await sql`
  UPDATE roadmap_tasks
  SET status = ${status}
  WHERE version = 1 AND (subtask_code = ${code} OR task_code = ${code})
  RETURNING subtask_code, subtask_name, status
`;

if (result.length === 0) {
  console.error(`No rows matched code "${code}"`);
  process.exit(1);
}

for (const row of result) {
  console.log(`${row.subtask_code} -> ${row.status}: ${row.subtask_name}`);
}
