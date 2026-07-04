/**
 * Authenticated visual walkthrough via Supabase magic link.
 */
import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseUrl = process.argv[2] ?? "http://localhost:3000";
const email = process.argv[3] ?? "tural.zamanli@gmail.com";
const outDir = path.join(__dirname, "..", ".visual-qa");
fs.mkdirSync(outDir, { recursive: true });

const env = fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf8");
const supabaseUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim();
const serviceKey = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim();
const supabase = createClient(supabaseUrl, serviceKey);

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 1024, height: 768 },
  { name: "mobile", width: 390, height: 844 },
];

const issues = [];

async function auditPage(page, label) {
  const data = await page.evaluate(() => {
    const doc = document.documentElement;
    const horizontalOverflow = doc.scrollWidth > doc.clientWidth + 2;
    const legacyCards = document.querySelectorAll(
      '[class*="bg-card/80"], [class*="rounded-3xl"]',
    ).length;
    const emptyPanels = document.querySelectorAll(
      '[class*="border-dashed"][class*="bg-card/40"]',
    ).length;
    const brokenImages = [...document.querySelectorAll("img")].filter(
      (img) => img.naturalWidth === 0 && img.src,
    ).length;
    return {
      horizontalOverflow,
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      legacyCards,
      emptyPanels,
      brokenImages,
      title: document.title,
    };
  });
  if (data.horizontalOverflow) issues.push({ label, type: "horizontal-overflow", ...data });
  if (data.legacyCards > 3) issues.push({ label, type: "legacy-cards", count: data.legacyCards });
  return data;
}

async function getSession() {
  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  if (linkError) throw linkError;

  const anonKey = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/)?.[1]?.trim();
  const anonClient = createClient(supabaseUrl, anonKey);
  const { data: sessionData, error: verifyError } = await anonClient.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: "email",
  });
  if (verifyError) throw verifyError;
  return sessionData.session;
}

async function main() {
  const session = await getSession();
  const projectRef = new URL(supabaseUrl).hostname.split(".")[0];
  const cookieName = `sb-${projectRef}-auth-token`;

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  await context.addCookies([
    {
      name: cookieName,
      value: JSON.stringify({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at,
        expires_in: session.expires_in,
        token_type: session.token_type,
        user: session.user,
      }),
      domain: "localhost",
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);
  const page = await context.newPage();

  await page.goto(`${baseUrl}/en/app/dashboard`, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1500);
  console.log("Dashboard URL:", page.url());

  if (page.url().includes("/login")) {
    console.log("Auth failed — redirected to login");
    await browser.close();
    process.exit(1);
  }

  const routes = new Set([
    "/en/app/dashboard",
    "/en/app/companies",
    "/en/app/engagements",
  ]);

  await page.goto(`${baseUrl}/en/app/companies`, { waitUntil: "networkidle" });
  const companyLinks = await page.$$eval('a[href*="/app/companies/"]', (as) =>
    [...new Set(as.map((a) => a.getAttribute("href")).filter((h) => h && !h.endsWith("/new")))],
  );
  companyLinks.forEach((l) => routes.add(l));

  for (const cl of companyLinks.slice(0, 2)) {
    for (const suffix of ["/contacts", "/financial", "/compliance", "/history", "/identity", "/settings"]) {
      routes.add(`${cl}${suffix}`);
    }
  }

  await page.goto(`${baseUrl}/en/app/engagements`, { waitUntil: "networkidle" });
  const engLinks = await page.$$eval('a[href*="/app/engagements/"]', (as) =>
    [...new Set(as.map((a) => a.getAttribute("href")).filter((h) => h && !h.endsWith("/new")))],
  );
  engLinks.forEach((l) => routes.add(l));

  for (const el of engLinks.slice(0, 2)) {
    for (const suffix of [
      "",
      "/planning",
      "/planning/checklist",
      "/planning/documents",
      "/planning/history",
      "/planning/team",
      "/planning/timeline",
      "/planning/settings",
      "/materiality",
      "/materiality/benchmarks",
      "/materiality/history",
      "/risk-assessment",
      "/risk-assessment/matrix",
      "/risk-assessment/heatmap",
      "/fieldwork",
      "/fieldwork/procedures",
      "/fieldwork/working-papers",
      "/fieldwork/evidence",
      "/fieldwork/findings",
      "/members",
      "/settings",
      "/history",
    ]) {
      routes.add(`${el}${suffix}`);
    }
  }

  for (const route of routes) {
    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      try {
        const res = await page.goto(`${baseUrl}${route}`, {
          waitUntil: "networkidle",
          timeout: 45000,
        });
        await page.waitForTimeout(600);
        const audit = await auditPage(page, `${route}@${vp.name}`);
        const safe = route.replace(/\//g, "_").slice(0, 100);
        await page.screenshot({
          path: path.join(outDir, `auth-${vp.name}${safe}.png`),
          fullPage: true,
        });
        const status = res?.status() ?? "?";
        console.log(`${status} ${route} ${vp.name} legacy=${audit.legacyCards} overflow=${audit.horizontalOverflow}`);
      } catch (e) {
        issues.push({ route, vp: vp.name, error: String(e) });
        console.log(`FAIL ${route} ${vp.name}`);
      }
    }
  }

  fs.writeFileSync(path.join(outDir, "auth-issues.json"), JSON.stringify(issues, null, 2));
  console.log(`Done. ${issues.length} issues logged.`);
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
