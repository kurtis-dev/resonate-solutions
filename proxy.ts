import { NextResponse, type NextRequest } from "next/server";

function unauthorized() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Resonate Admin"'
    }
  });
}

export function proxy(request: NextRequest) {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    return new NextResponse("Admin is locked until ADMIN_USERNAME and ADMIN_PASSWORD are configured.", { status: 503 });
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
  matcher: ["/admin/:path*", "/dashboard/:path*"]
};
