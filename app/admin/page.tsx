import { getSql } from "@/lib/db";

type Row = Record<string, unknown>;

async function getRows(query: TemplateStringsArray) {
  const sql = await getSql();

  if (!sql) {
    return null;
  }

  return (await sql(query)) as Row[];
}

function value(row: Row, key: string) {
  const raw = row[key];
  return raw === null || raw === undefined || raw === "" ? "-" : String(raw);
}

function DataTable({ title, rows, columns }: { title: string; rows: Row[] | null; columns: string[] }) {
  return (
    <section className="rounded-[1.75rem] border border-line bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black text-ink">{title}</h2>
      {!rows ? (
        <p className="mt-4 leading-7 text-muted">Database is not connected yet. Add `DATABASE_URL` in Vercel and run `database/schema.sql` in your database.</p>
      ) : rows.length === 0 ? (
        <p className="mt-4 leading-7 text-muted">No records yet.</p>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line text-muted">
                {columns.map((column) => (
                  <th key={column} className="px-3 py-3 font-black capitalize">{column.replaceAll("_", " ")}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className="border-b border-line last:border-0">
                  {columns.map((column) => (
                    <td key={column} className="px-3 py-3 text-ink">{value(row, column)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default async function AdminPage() {
  const [intakes, subscriptions, payments] = await Promise.all([
    getRows`select created_at, business_name, contact_name, email, business_type, city, main_need, package_interest from intake_requests order by created_at desc limit 10`,
    getRows`select customer_email, plan_id, status, current_period_end, updated_at from customer_subscriptions order by updated_at desc limit 10`,
    getRows`select created_at, customer_email, type, status, amount_paid, currency from payment_events order by created_at desc limit 10`
  ]);

  return (
    <main className="mx-auto max-w-7xl px-5 py-16">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Internal dashboard</p>
        <h1 className="mt-3 text-4xl font-black text-ink md:text-6xl">Resonate operations.</h1>
        <p className="mt-5 leading-7 text-muted">
          This is the first internal view for Soundcheck requests, Stripe subscription status, and payment events. Add authentication before sharing this URL publicly.
        </p>
      </div>
      <div className="grid gap-6">
        <DataTable title="Recent Soundcheck requests" rows={intakes} columns={["created_at", "business_name", "contact_name", "email", "business_type", "city", "main_need", "package_interest"]} />
        <DataTable title="Subscription status" rows={subscriptions} columns={["customer_email", "plan_id", "status", "current_period_end", "updated_at"]} />
        <DataTable title="Payment events" rows={payments} columns={["created_at", "customer_email", "type", "status", "amount_paid", "currency"]} />
      </div>
    </main>
  );
}
