import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import process from "node:process";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");
const port = Number(process.env.LINK_AUDIT_PORT || 3210);
const baseUrl = `http://127.0.0.1:${port}`;

const publicRoutes = [
  "/",
  "/menupilot",
  "/menupilot/examples",
  "/pricing",
  "/billing",
  "/checkout",
  "/portal",
  "/privacy",
  "/terms",
  "/disclaimer"
];

const intentionalExceptions = ["/m/", "/excellent-pins", "/admin", "/dashboard", "/api/"];
const requiredGlobalLinks = [
  ["Home", "/"],
  ["Solutions", "/#solutions"],
  ["Our Work", "/#work"],
  ["MenuPilot", "/menupilot"],
  ["Owner Portal", "/portal"],
  ["Pricing", "/pricing"],
  ["About", "/#about"],
  ["Start a Project", "/checkout?plan=review"]
];
const requiredPrimaryLinks = requiredGlobalLinks.filter(([label]) => label !== "Start a Project");
const expectedMenuPilotLinks = [
  ["Overview", "/menupilot"],
  ["Examples", "/menupilot/examples"],
  ["Owner Portal", "/portal"],
  ["How Updates Work", "/menupilot#owner-portal"],
  ["Pricing", "/pricing"]
];

const failures = [];
const incoming = new Map(publicRoutes.map((route) => [route, new Set()]));
const visited = new Set();
const discovered = new Set(["/"]);
const htmlByRoute = new Map();

function startServer() {
  return spawn(process.execPath, [nextBin, "start", "-p", String(port)], {
    cwd: process.cwd(),
    env: process.env,
    stdio: "inherit"
  });
}

async function waitForServer() {
  const deadline = Date.now() + 45_000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl, { redirect: "follow" });
      if (response.ok) return;
    } catch {
      // The production server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  throw new Error(`Production server did not start at ${baseUrl}`);
}

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function stripTags(value) {
  return decodeHtml(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function extractLinks(html) {
  return [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].flatMap((match) => {
    const href = match[1].match(/\bhref="([^"]*)"/i)?.[1];
    if (!href) return [];
    return [{ href: decodeHtml(href), label: stripTags(match[2]) }];
  });
}

function extractNavigation(html, ariaLabel) {
  const escaped = ariaLabel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = html.match(new RegExp(`<nav\\b[^>]*aria-label="${escaped}"[^>]*>([\\s\\S]*?)<\\/nav>`, "i"));
  return match ? extractLinks(match[1]) : [];
}

function canonicalRoute(href) {
  const url = new URL(href, baseUrl);
  return url.pathname;
}

function isIntentionalException(pathname) {
  return intentionalExceptions.some((prefix) => pathname.startsWith(prefix));
}

function assertNavigationLinks(route, kind, links, requiredLinks = requiredGlobalLinks) {
  for (const [label, href] of requiredLinks) {
    if (!links.some((link) => link.label === label && link.href === href)) {
      failures.push(`${route} ${kind} navigation is missing ${label} (${href})`);
    }
  }
}

function auditPageMarkup(route, html) {
  const primaryCount = (html.match(/aria-label="Primary navigation"/g) || []).length;
  const footerCount = (html.match(/aria-label="Footer navigation"/g) || []).length;
  const primaryLinks = extractNavigation(html, "Primary navigation");
  const mobileLinks = extractNavigation(html, "Mobile navigation");
  const footerLinks = extractNavigation(html, "Footer navigation");
  const allLinks = extractLinks(html);

  if (primaryCount !== 1) failures.push(`${route} has ${primaryCount} primary navigation bars`);
  if (footerCount !== 1) failures.push(`${route} has ${footerCount} footer navigation bars`);
  if (!html.includes('aria-controls="mobile-site-nav"')) failures.push(`${route} is missing the mobile navigation control`);

  assertNavigationLinks(route, "desktop", primaryLinks, requiredPrimaryLinks);
  assertNavigationLinks(route, "mobile", mobileLinks);
  assertNavigationLinks(route, "footer", footerLinks);

  if (!allLinks.some((link) => link.label === "Start a Project" && link.href === "/checkout?plan=review")) {
    failures.push(`${route} is missing Start a Project (/checkout?plan=review)`);
  }

  if (html.includes("—") || /&mdash;|&#8212;|&#x2014;/i.test(html)) {
    failures.push(`${route} contains an em dash`);
  }
}

async function fetchPage(routeWithQuery) {
  const response = await fetch(`${baseUrl}${routeWithQuery}`, { redirect: "follow" });
  const contentType = response.headers.get("content-type") || "";

  if (!response.ok) {
    failures.push(`${routeWithQuery} returned ${response.status}`);
    return "";
  }

  if (!contentType.includes("text/html")) {
    failures.push(`${routeWithQuery} returned ${contentType || "no content type"}`);
    return "";
  }

  return response.text();
}

async function crawl() {
  const queue = ["/"];

  while (queue.length) {
    const routeWithQuery = queue.shift();
    const route = canonicalRoute(routeWithQuery);
    if (visited.has(route)) continue;
    visited.add(route);

    const html = await fetchPage(routeWithQuery);
    if (!html) continue;
    htmlByRoute.set(route, html);

    for (const link of extractLinks(html)) {
      if (/^(mailto:|tel:|https?:\/\/)/i.test(link.href) && !link.href.startsWith(baseUrl)) continue;

      const url = new URL(link.href, baseUrl);
      if (url.origin !== baseUrl || isIntentionalException(url.pathname)) continue;

      const target = url.pathname;
      if (incoming.has(target)) incoming.get(target).add(route);

      if (url.pathname === "/checkout" && url.searchParams.has("plan")) {
        discovered.add(`${url.pathname}?plan=${url.searchParams.get("plan")}`);
      } else {
        discovered.add(url.pathname);
      }

      if (!visited.has(target)) queue.push(`${url.pathname}${url.search}`);
    }
  }
}

async function auditAnchorsAndPlans(validPlanIds) {
  for (const [sourceRoute, html] of htmlByRoute) {
    for (const link of extractLinks(html)) {
      const url = new URL(link.href, baseUrl);
      if (url.origin !== baseUrl) continue;

      if (url.pathname === "/checkout" && url.searchParams.has("plan")) {
        const plan = url.searchParams.get("plan");
        if (!validPlanIds.has(plan)) failures.push(`${sourceRoute} links to unknown checkout plan ${plan}`);
      }

      if (!url.hash || isIntentionalException(url.pathname)) continue;
      const targetHtml = htmlByRoute.get(url.pathname) || await fetchPage(url.pathname);
      const id = decodeURIComponent(url.hash.slice(1));
      const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (!new RegExp(`\\bid="${escapedId}"`).test(targetHtml)) {
        failures.push(`${sourceRoute} links to missing anchor ${url.pathname}${url.hash}`);
      }
    }
  }
}

function auditMenuPilotSubnav() {
  const snapshots = ["/menupilot", "/menupilot/examples"].map((route) => ({
    route,
    links: extractNavigation(htmlByRoute.get(route) || "", "MenuPilot navigation")
  }));

  for (const snapshot of snapshots) {
    for (const [label, href] of expectedMenuPilotLinks) {
      if (!snapshot.links.some((link) => link.label === label && link.href === href)) {
        failures.push(`${snapshot.route} MenuPilot navigation is missing ${label} (${href})`);
      }
    }
  }

  if (JSON.stringify(snapshots[0].links) !== JSON.stringify(snapshots[1].links)) {
    failures.push("MenuPilot overview and examples do not use identical product navigation");
  }
}

async function main() {
  const server = startServer();

  try {
    await waitForServer();
    await crawl();

    for (const route of publicRoutes) {
      if (!visited.has(route)) failures.push(`${route} was not reachable from the homepage crawl`);
      if (route !== "/" && (incoming.get(route)?.size || 0) === 0) failures.push(`${route} is orphaned`);
      const html = htmlByRoute.get(route);
      if (html) auditPageMarkup(route, html);
    }

    const plansSource = await readFile(new URL("../lib/plans.ts", import.meta.url), "utf8");
    const validPlanIds = new Set([...plansSource.matchAll(/\bid:\s*"([^"]+)"/g)].map((match) => match[1]));

    await auditAnchorsAndPlans(validPlanIds);
    auditMenuPilotSubnav();

    if (failures.length) {
      console.error("\nNavigation audit failed:");
      failures.forEach((failure) => console.error(`- ${failure}`));
      process.exitCode = 1;
      return;
    }

    console.log(`\nDesktop navigation passed on ${publicRoutes.length} public routes.`);
    console.log(`Mobile navigation passed on ${publicRoutes.length} public routes.`);
    console.log(`Crawled ${visited.size} public routes with no dead ends, orphan routes, missing anchors, invalid plan IDs, duplicate navigation bars, or em dashes.`);
  } finally {
    server.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
