import { initializeSeams, seamsSql } from "./members";

export async function readSeamsActivity() {
  await initializeSeams();
  const sql = await seamsSql();
  return await sql`SELECT event, kind, source, SUM(total)::int AS total FROM seams_activity
    WHERE day >= current_date - 6 GROUP BY event, kind, source ORDER BY total DESC` as { event: string; kind: string; source: string; total: number }[];
}
