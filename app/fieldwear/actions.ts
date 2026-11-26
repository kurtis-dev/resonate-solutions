"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sendCustomerEmail } from "@/lib/customer-emails";
import { exchangeOwnerLink, isScoutOwner, issueOwnerLink, revokeOwnerSession, scoutDatabase } from "@/lib/fieldwear/owner-access";
import { readScoutEdition } from "@/lib/fieldwear/editions";

export async function requestOwnerLink(form: FormData) {
  const owner = process.env.FIELDWEAR_OWNER_EMAIL?.trim().toLowerCase();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!owner) redirect("/fieldwear?signIn=unavailable");
  if (email === owner) {
    try {
      const token = await issueOwnerLink();
      if (token) {
        const url = new URL("https://www.resonate.solutions/fieldwear");
        url.searchParams.set("access", token);
        await sendCustomerEmail({
          to: owner,
          subject: "Your Fieldwear Scout sign-in link",
          text: `Open this link and choose Continue to Fieldwear. It works once and expires in 10 minutes.\n\n${url}`,
        });
      }
    } catch {
      console.error("Fieldwear owner link could not be issued.");
    }
  }
  redirect("/fieldwear?signIn=requested");
}

export async function redeemOwnerLink(form: FormData) {
  const token = String(form.get("access") ?? "");
  const hasSession = await exchangeOwnerLink(token);
  redirect(hasSession ? "/fieldwear#daily" : "/fieldwear?signIn=expired");
}

export async function signOutScout() {
  await revokeOwnerSession();
  redirect("/fieldwear");
}

export async function decideListing(form: FormData) {
  if (!(await isScoutOwner())) redirect("/fieldwear");
  const source = String(form.get("source") ?? "");
  const externalId = String(form.get("externalId") ?? "");
  const verdict = String(form.get("verdict") ?? "");
  if (!/^[a-z]{1,30}$/.test(source) || !/^[a-z\d-]{1,120}$/i.test(externalId) || !["save", "proof", "pass"].includes(verdict)) return;
  const edition = await readScoutEdition();
  const item = edition?.finds.find((listing) => listing.source === source && listing.externalId === externalId);
  const sql = await scoutDatabase();
  await sql`INSERT INTO fieldwear_decisions (source, external_id, verdict, listing)
    VALUES (${source}, ${externalId}, ${verdict}, ${item ? JSON.stringify(item) : null}::jsonb)
    ON CONFLICT (source, external_id) DO UPDATE SET
      verdict = EXCLUDED.verdict, listing = COALESCE(EXCLUDED.listing, fieldwear_decisions.listing)`;
  revalidatePath("/fieldwear");
}
