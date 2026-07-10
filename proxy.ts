import { NextResponse, type NextRequest } from "next/server";
import { hasConfiguredAdminAuth } from "./lib/admin-auth";

const excellentPinsHosts = new Set([
  "excellent-pins.resonate.solutions",
  "excellentpins.resonate.solutions",
]);

function unauthorized() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Resonate Admin"'
    }
  });
}

function getHostname(request: NextRequest) {
  return request.headers.get("host")?.split(":")[0]?.toLowerCase() ?? "";
}

function isExcellentPinsHost(request: NextRequest) {
  return excellentPinsHosts.has(getHostname(request));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isExcellentPinsHost(request) && pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/excellent-pins";
    return NextResponse.rewrite(url);
  }

  if (!pathname.startsWith("/admin") && !pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!hasConfiguredAdminAuth()) {
    return new NextResponse("Admin is locked until strong ADMIN_USERNAME and ADMIN_PASSWORD values are configured.", { status: 503 });
  }

  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Basic ")) {
    return unauthorized();
  }

  const encoded = authHeader.replace("Basic ", "");
  const decoded = atob(encoded);
  const separatorIndex = decoded.indexOf(":");
  const submittedUsername = decoded.slice(0, separatorIndex);
  const submittedPassword = decoded.slice(separatorIndex + 1);

  if (submittedUsername !== username || submittedPassword !== password) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets).*)"]
};
