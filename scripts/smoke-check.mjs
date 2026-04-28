const baseUrl = (process.env.BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

const checks = [
  { path: "/", expect: "text/html" },
  { path: "/menupilot", expect: "text/html" },
  { path: "/pricing", expect: "text/html" },
  { path: "/privacy", expect: "text/html" },
  { path: "/terms", expect: "text/html" },
  { path: "/disclaimer", expect: "text/html" },
  { path: "/m/burger-truck-preview", expect: "text/html" },
  { path: "/m/mellow-moose-burgers", expect: "text/html" },
  { path: "/api/qr/burger-truck-preview", expect: "image/svg+xml" },
  { path: "/api/qr/mellow-moose-burgers", expect: "image/svg+xml" },
  { path: "/api/health", expect: "application/json" }
];

const failures = [];

for (const check of checks) {
  const url = `${baseUrl}${check.path}`;

  try {
    const response = await fetch(url, { redirect: "follow" });
    const contentType = response.headers.get("content-type") || "";

    if (!response.ok) {
      failures.push(`${check.path} returned ${response.status}`);
      continue;
    }

    if (!contentType.includes(check.expect)) {
      failures.push(`${check.path} expected ${check.expect}, got ${contentType || "no content-type"}`);
      continue;
    }

    if (check.expect === "image/svg+xml") {
      const body = await response.text();
      if (!body.includes("<svg")) {
        failures.push(`${check.path} returned SVG content-type without an SVG body`);
        continue;
      }
    }

    if (check.path === "/api/health") {
      const health = await response.json();
      if (health?.ok !== true) {
        failures.push(`${check.path} did not return ok: true`);
        continue;
      }
    }

    console.log(`ok ${check.path}`);
  } catch (error) {
    failures.push(`${check.path} failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (failures.length) {
  console.error("\nSmoke check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`\nSmoke check passed for ${baseUrl}`);
