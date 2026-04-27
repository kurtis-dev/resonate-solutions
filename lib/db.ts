type SqlClient = (strings: TemplateStringsArray, ...values: unknown[]) => Promise<unknown[]>;

let sqlClient: SqlClient | null = null;

export async function getSql() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (!sqlClient) {
    const { neon } = await import("@neondatabase/serverless");
    sqlClient = neon(process.env.DATABASE_URL) as SqlClient;
  }

  return sqlClient;
}
