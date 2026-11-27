import { NextRequest, NextResponse } from "next/server";
import { legacyOwnerPath, ownerCatalogPath, ownerSessionCookie } from "@/lib/fieldwear/owner-routes";
import { seamsPath } from "@/lib/seams/paths";

export function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams;
  const owner = query.has("access") || query.has("signIn") || query.get("owner") === "1";
  const url = request.nextUrl.clone();
  url.pathname = owner ? ownerCatalogPath : seamsPath;
  if (!owner) url.search = "";
  else url.searchParams.delete("owner");
  url.hash = owner ? "" : "fresh";
  const response = NextResponse.redirect(url);
  const oldSession = request.cookies.get(ownerSessionCookie)?.value;
  if (oldSession && /^[a-f0-9]{64}$/.test(oldSession) && !query.has("access")) {
    const options = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const };
    response.cookies.set(ownerSessionCookie, oldSession, { ...options, path: ownerCatalogPath, maxAge: 30 * 86_400 });
    response.cookies.set(ownerSessionCookie, "", { ...options, path: legacyOwnerPath, maxAge: 0 });
  }
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
