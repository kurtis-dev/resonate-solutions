import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { getSql } from "@/lib/db";
import { defaultScoutPreferences, type ScoutPreferences } from "./preferences";

export const sessionCookie = "resonate_fieldwear_session";
export const sessionSeconds = 30 * 86400;
const tokenPattern = /^[a-f0-9]{64}$/;

function digest(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function scoutDatabase() {
  const sql = await getSql();
  if (!sql) throw new Error("Fieldwear database is unavailable.");
  return sql;
}

let initialized: Promise<void> | undefined;
export function initializeScoutDatabase() {
  initialized ??= (async () => {
    const sql = await scoutDatabase();
    await sql`CREATE TABLE IF NOT EXISTS fieldwear_owner_access (
      token_hash text PRIMARY KEY,
      kind text NOT NULL,
      issued_at timestamptz NOT NULL DEFAULT now(),
      expires_at timestamptz NOT NULL
    )`;
    await sql`CREATE TABLE IF NOT EXISTS fieldwear_decisions (
      source text NOT NULL,
      external_id text NOT NULL,
      verdict text NOT NULL CHECK (verdict IN ('save', 'proof', 'pass')),
      listing jsonb,
      PRIMARY KEY (source, external_id)
    )`;
    await sql`CREATE TABLE IF NOT EXISTS fieldwear_preferences (
      profile text PRIMARY KEY,
      settings jsonb NOT NULL
    )`;
    await sql`CREATE TABLE IF NOT EXISTS fieldwear_live_search (
      profile text PRIMARY KEY,
      settings jsonb NOT NULL,
      searched_at timestamptz NOT NULL,
      result jsonb NOT NULL
    )`;
  })().catch((error) => {
    initialized = undefined;
    throw error;
  });
  return initialized;
}

export async function readScoutPreferences(): Promise<ScoutPreferences> {
  const sql = await scoutDatabase();
  const [row] = await sql`SELECT settings FROM fieldwear_preferences WHERE profile = 'owner'` as { settings: Partial<ScoutPreferences> }[];
  return { ...defaultScoutPreferences, ...row?.settings };
}

export async function issueOwnerLink() {
  await initializeScoutDatabase();
  const sql = await scoutDatabase();
  await sql`DELETE FROM fieldwear_owner_access WHERE expires_at <= now()`;
  const token = randomBytes(32).toString("hex");
  // A single time-bucket row limits mail across all Vercel instances.
  const [issued] = await sql`INSERT INTO fieldwear_owner_access (token_hash, kind, expires_at)
    VALUES (
      'email:' || floor(extract(epoch from now()) / 300)::text, ${digest(token)}, now() + interval '10 minutes'
    ) ON CONFLICT DO NOTHING RETURNING token_hash`;
  return issued ? token : null;
}

export async function exchangeOwnerLink(token: string) {
  if (!tokenPattern.test(token)) return false;
  await initializeScoutDatabase();
  const sql = await scoutDatabase();
  const session = randomBytes(32).toString("hex");
  const [created] = await sql`WITH consumed AS (
    UPDATE fieldwear_owner_access SET kind = 'consumed'
    WHERE kind = ${digest(token)} AND left(token_hash, 6) = 'email:' AND expires_at > now()
    RETURNING 1
  )
  INSERT INTO fieldwear_owner_access (token_hash, kind, expires_at)
  SELECT ${digest(session)}, 'session', now() + interval '30 days' FROM consumed
  RETURNING token_hash`;
  if (!created) return false;
  (await cookies()).set(sessionCookie, session, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax",
    maxAge: sessionSeconds, path: "/fieldwear",
  });
  return true;
}

export async function isScoutOwner() {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token || !tokenPattern.test(token)) return false;
  await initializeScoutDatabase();
  const sql = await scoutDatabase();
  const [session] = await sql`SELECT 1 FROM fieldwear_owner_access
    WHERE token_hash = ${digest(token)} AND kind = 'session' AND expires_at > now()`;
  return Boolean(session);
}

export async function revokeOwnerSession() {
  const jar = await cookies();
  const token = jar.get(sessionCookie)?.value;
  if (token && tokenPattern.test(token)) {
    const sql = await scoutDatabase();
    await sql`DELETE FROM fieldwear_owner_access WHERE token_hash = ${digest(token)} AND kind = 'session'`;
  }
  jar.set(sessionCookie, "", { path: "/fieldwear", maxAge: 0 });
}
