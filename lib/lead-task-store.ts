import { getSql } from "@/lib/db";
import type { LeadTask, LeadTaskStage, LeadWorkflowType } from "@/lib/lead-tasks";

type LeadTaskRow = {
  id: string;
  created_at: string;
  updated_at: string;
  intake_id: string | null;
  customer_id: string;
  business_name: string | null;
  contact_name: string | null;
  email: string;
  phone: string | null;
  task_type: LeadWorkflowType;
  stage: LeadTaskStage;
  priority: "normal" | "high";
  title: string;
  summary: string | null;
  checklist: string[] | string | null;
  next_action: string | null;
  assigned_to: string | null;
  due_at: string | null;
  source: string;
};

function parseChecklist(value: LeadTaskRow["checklist"]) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }

  return [];
}

function mapLeadTask(row: LeadTaskRow): LeadTask {
  return {
    id: row.id,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    intakeId: row.intake_id || undefined,
    customerId: row.customer_id,
    businessName: row.business_name || "",
    contactName: row.contact_name || "",
    email: row.email,
    phone: row.phone || undefined,
    taskType: row.task_type,
    stage: row.stage,
    priority: row.priority,
    title: row.title,
    summary: row.summary || "",
    checklist: parseChecklist(row.checklist),
    nextAction: row.next_action || "",
    assignedTo: row.assigned_to || "",
    dueAt: row.due_at ? String(row.due_at) : "",
    source: row.source
  };
}

export async function ensureLeadTasksTable() {
  const sql = await getSql();

  if (!sql) return { ok: false, reason: "database_not_configured" };

  await sql`
    create table if not exists lead_tasks (
      id text primary key,
      created_at timestamptz not null,
      updated_at timestamptz not null default now(),
      intake_id text,
      customer_id text not null,
      business_name text,
      contact_name text,
      email text not null,
      phone text,
      task_type text not null,
      stage text not null default 'new_request',
      priority text not null default 'normal',
      title text not null,
      summary text,
      checklist jsonb not null default '[]'::jsonb,
      next_action text,
      assigned_to text,
      due_at timestamptz,
      source text not null default 'website'
    )
  `;
  await sql`create index if not exists lead_tasks_stage_idx on lead_tasks (stage, due_at)`;
  await sql`create index if not exists lead_tasks_email_idx on lead_tasks (email)`;
  await sql`create index if not exists lead_tasks_customer_idx on lead_tasks (customer_id)`;
  await sql`create index if not exists lead_tasks_type_idx on lead_tasks (task_type)`;

  return { ok: true };
}

export async function getLeadTask(id: string) {
  const sql = await getSql();

  if (!sql) return null;

  await ensureLeadTasksTable();

  const rows = (await sql`
    select
      id,
      created_at,
      updated_at,
      intake_id,
      customer_id,
      business_name,
      contact_name,
      email,
      phone,
      task_type,
      stage,
      priority,
      title,
      summary,
      checklist,
      next_action,
      assigned_to,
      due_at,
      source
    from lead_tasks
    where id = ${id}
    limit 1
  `) as LeadTaskRow[];

  return rows[0] ? mapLeadTask(rows[0]) : null;
}

export async function updateLeadTaskStage(id: string, stage: LeadTaskStage) {
  const sql = await getSql();

  if (!sql) return { ok: false, reason: "database_not_configured" };

  await ensureLeadTasksTable();

  await sql`
    update lead_tasks
    set stage = ${stage}, updated_at = now()
    where id = ${id}
  `;

  return { ok: true };
}

