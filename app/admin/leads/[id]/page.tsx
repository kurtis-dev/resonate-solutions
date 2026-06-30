import Link from "next/link";
import { notFound } from "next/navigation";
import { updateLeadTaskStageAction } from "@/app/admin/leads/actions";
import { followUpTemplateFor, formatLeadLabel, leadTaskStages } from "@/lib/lead-tasks";
import { getLeadTask } from "@/lib/lead-task-store";

type LeadPageProps = {
  params: Promise<{ id: string }>;
};

function mailtoHref(email: string, subject: string, body: string) {
  const params = new URLSearchParams({ subject, body });
  return `mailto:${email}?${params.toString()}`;
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-xs font-black uppercase tracking-[0.16em] text-muted">{label}</dt>
      <dd className="mt-1 text-sm font-bold text-ink">{value || "-"}</dd>
    </div>
  );
}

export default async function LeadDetailPage({ params }: LeadPageProps) {
  const { id } = await params;
  const task = await getLeadTask(id);

  if (!task) {
    notFound();
  }

  const followUp = followUpTemplateFor(task.taskType, task.businessName, task.contactName);
  const subject = `Next steps for ${task.businessName || "your Resonate request"}`;

  return (
    <main className="min-h-screen bg-[#101513] px-5 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin" className="text-sm font-black text-[#f6a06f] hover:text-white">
          Back to admin
        </Link>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-[1.75rem] border border-white/10 bg-white p-6 text-ink shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-brand">Lead task</p>
            <h1 className="mt-3 text-4xl font-black">{task.businessName || task.email}</h1>
            <p className="mt-3 max-w-3xl leading-7 text-muted">{task.summary || "No summary provided yet."}</p>

            <dl className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Contact" value={task.contactName} />
              <Field label="Email" value={task.email} />
              <Field label="Phone" value={task.phone} />
              <Field label="Stage" value={formatLeadLabel(task.stage)} />
              <Field label="Workflow" value={formatLeadLabel(task.taskType)} />
              <Field label="Due" value={task.dueAt} />
            </dl>

            <div className="mt-8 rounded-2xl border border-line bg-[#fff8f4] p-5">
              <h2 className="text-xl font-black">Next best action</h2>
              <p className="mt-3 leading-7 text-muted">{task.nextAction}</p>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-black">Review checklist</h2>
              <ul className="mt-4 grid gap-3">
                {task.checklist.map((item) => (
                  <li key={item} className="rounded-2xl border border-line bg-white px-4 py-3 text-sm font-bold text-ink">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <aside className="grid gap-6">
            <section className="rounded-[1.75rem] border border-white/10 bg-white p-6 text-ink shadow-sm">
              <h2 className="text-xl font-black">Move stage</h2>
              <form action={updateLeadTaskStageAction} className="mt-4 grid gap-3">
                <input type="hidden" name="id" value={task.id} />
                <label className="grid gap-2 text-sm font-black text-muted">
                  Stage
                  <select name="stage" defaultValue={task.stage} className="rounded-2xl border border-line bg-white px-4 py-3 text-ink">
                    {leadTaskStages.map((stage) => (
                      <option key={stage} value={stage}>
                        {formatLeadLabel(stage)}
                      </option>
                    ))}
                  </select>
                </label>
                <button className="rounded-full bg-brand px-5 py-3 font-black text-white shadow-soft hover:bg-brandDark">
                  Save stage
                </button>
              </form>
            </section>

            <section className="rounded-[1.75rem] border border-white/10 bg-white p-6 text-ink shadow-sm">
              <h2 className="text-xl font-black">Focused follow-up</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Review this before sending. It is designed to ask only what this lead type needs.
              </p>
              <textarea
                readOnly
                value={followUp}
                className="mt-4 min-h-[360px] w-full rounded-2xl border border-line bg-[#fffaf6] p-4 text-sm leading-6 text-ink"
              />
              <a
                href={mailtoHref(task.email, subject, followUp)}
                className="mt-4 inline-flex w-full justify-center rounded-full bg-[#3a2318] px-5 py-3 text-center font-black text-white hover:bg-[#1f1510]"
              >
                Open email draft
              </a>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

