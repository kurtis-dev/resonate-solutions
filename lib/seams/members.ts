import { createHash, randomBytes, randomUUID } from "node:crypto";
import { cookies, headers } from "next/headers";
import { getSql } from "@/lib/db";

import { seamsPath } from "./paths";
export { seamsPath, seamsUrl } from "./paths";
const sessionCookie = "resonate_seams_session";
const sessionSeconds = 30 * 86_400;
const tokenPattern = /^[a-f0-9]{64}$/;
const hash = (value: string) => createHash("sha256").update(value).digest("hex");

export type MemberSettings = {
  department: "any" | "men" | "women";
  topSizes: string[];
  bottomSizes: string[];
  budget: number | null;
  interests: string[];
};
export type Member = { id: string; email: string; settings: MemberSettings | null; first_dibs: boolean };
export const defaultMemberSettings: MemberSettings = { department: "any", topSizes: [], bottomSizes: [], budget: null, interests: [] };

export async function seamsSql() {
  const sql = await getSql();
  if (!sql) throw new Error("Seams Familiar database unavailable");
  return sql;
}

let ready: Promise<void> | undefined;
export function initializeSeams() {
  ready ??= (async () => {
    const sql = await seamsSql();
    await sql`CREATE TABLE IF NOT EXISTS seams_members (
      id uuid PRIMARY KEY, email text NOT NULL UNIQUE, settings jsonb, first_dibs boolean NOT NULL DEFAULT false,
      unsubscribe_token text NOT NULL UNIQUE, created_at timestamptz NOT NULL DEFAULT now()
    )`;
    await sql`CREATE TABLE IF NOT EXISTS seams_links (
      token_hash text PRIMARY KEY, email text NOT NULL, expires_at timestamptz NOT NULL
    )`;
    await sql`CREATE TABLE IF NOT EXISTS seams_sessions (
      token_hash text PRIMARY KEY, member_id uuid NOT NULL REFERENCES seams_members(id) ON DELETE CASCADE,
      expires_at timestamptz NOT NULL
    )`;
    await sql`CREATE TABLE IF NOT EXISTS seams_rate_limits (
      key text PRIMARY KEY, attempts integer NOT NULL DEFAULT 1, expires_at timestamptz NOT NULL
    )`;
    await sql`CREATE TABLE IF NOT EXISTS seams_catalog (
      department text PRIMARY KEY, listings jsonb NOT NULL DEFAULT '[]', checked_at timestamptz, lease_until timestamptz
    )`;
    await sql`CREATE TABLE IF NOT EXISTS seams_activity (
      day date NOT NULL, event text NOT NULL, kind text NOT NULL, source text NOT NULL,
      total bigint NOT NULL, PRIMARY KEY (day, event, kind, source)
    )`;
    await sql`CREATE TABLE IF NOT EXISTS seams_digests (
      member_id uuid NOT NULL REFERENCES seams_members(id) ON DELETE CASCADE, day date NOT NULL,
      body text NOT NULL, listing_keys text[] NOT NULL, sent_at timestamptz, PRIMARY KEY (member_id, day)
    )`;
  })().catch((error) => { ready = undefined; throw error; });
  return ready;
}

export function normalizeEmail(value: unknown) {
  const email = String(value ?? "").trim().toLowerCase();
  return email.length <= 254 && /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(email) ? email : null;
}

export async function issueSeamsLink(email: string) {
  await initializeSeams();
  const sql = await seamsSql();
  const forwarded = (await headers()).get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  const ip = hash(forwarded || "unknown");
  const rate = async (key: string, duration: number, cap: number) => {
    const bucket = Math.floor(Date.now() / duration);
    const [row] = await sql`INSERT INTO seams_rate_limits (key, expires_at)
      VALUES (${key + ":" + bucket}, ${new Date((bucket + 1) * duration).toISOString()}::timestamptz)
      ON CONFLICT (key) DO UPDATE SET attempts = seams_rate_limits.attempts + 1
      WHERE seams_rate_limits.attempts < ${cap} RETURNING attempts`;
    return Boolean(row);
  };
  if (!(await rate("email:" + hash(email), 600_000, 1))) return null;
  if (!(await rate("ip:" + ip, 900_000, 8))) return null;
  if (!(await rate("global", 3_600_000, 60))) return null;
  const token = randomBytes(32).toString("hex");
  await sql`INSERT INTO seams_links (token_hash, email, expires_at)
    VALUES (${hash(token)}, ${email}, now() + interval '15 minutes')`;
  return token;
}

export async function redeemSeamsLink(token: string) {
  if (!tokenPattern.test(token)) return false;
  await initializeSeams();
  const sql = await seamsSql();
  const session = randomBytes(32).toString("hex");
  const [created] = await sql`WITH consumed AS (
    DELETE FROM seams_links WHERE token_hash = ${hash(token)} AND expires_at > now() RETURNING email
  ), member AS (
    INSERT INTO seams_members (id, email, unsubscribe_token)
    SELECT ${randomUUID()}::uuid, email, ${randomBytes(32).toString("hex")} FROM consumed
    ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email RETURNING id
  )
  INSERT INTO seams_sessions (token_hash, member_id, expires_at)
  SELECT ${hash(session)}, id, now() + interval '30 days' FROM member RETURNING token_hash`;
  if (!created) return false;
  (await cookies()).set(sessionCookie, session, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: sessionSeconds, path: seamsPath,
  });
  return true;
}

export async function readMember() {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token || !tokenPattern.test(token)) return null;
  await initializeSeams();
  const sql = await seamsSql();
  const [member] = await sql`SELECT m.id, m.email, m.settings, m.first_dibs FROM seams_sessions s
    JOIN seams_members m ON m.id = s.member_id WHERE s.token_hash = ${hash(token)} AND s.expires_at > now()` as Member[];
  return member ?? null;
}

export async function revokeSeamsSession() {
  const jar = await cookies();
  const token = jar.get(sessionCookie)?.value;
  if (token && tokenPattern.test(token)) {
    const sql = await seamsSql();
    await sql`DELETE FROM seams_sessions WHERE token_hash = ${hash(token)}`;
  }
  jar.set(sessionCookie, "", { path: seamsPath, maxAge: 0 });
}

export async function unsubscribeSeams(token: string) {
  if (!tokenPattern.test(token)) return;
  await initializeSeams();
  const sql = await seamsSql();
  await sql`UPDATE seams_members SET first_dibs = false WHERE unsubscribe_token = ${token}`;
}
