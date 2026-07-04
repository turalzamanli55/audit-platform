/**
 * Full authenticated visual walkthrough — all breakpoints + light/dark.
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
  { name: "1920", width: 1920, height: 1080 },
  { name: "1600", width: 1600, height: 900 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1024", width: 1024, height: 768 },
  { name: "768", width: 768, height: 1024 },
  { name: "390", width: 390, height: 844 },
  { name: "360", width: 360, height: 740 },
];

const themes = ["light", "dark"];
const issues = [];

async function auditPage(page, label) {
  const data = await page.evaluate(() => {
    const doc = document.documentElement;
    const horizontalOverflow = doc.scrollWidth > doc.clientWidth + 2;
    const legacyCards = document.querySelectorAll('[class*="bg-card/80"]').length;
    const placeholderText = [...document.querySelectorAll("p,span,div")]
      .map((el) => el.textContent?.trim() ?? "")
      .filter((t) =>
        /^(lorem ipsum|placeholder|coming soon|todo|tbd|sample data|demo widget)$/i.test(t),
      ).length;
    const brokenImages = [...document.querySelectorAll("img")].filter(
      (img) => img.naturalWidth === 0 && img.src && !img.src.startsWith("data:"),
    ).length;
    const errorAlerts = document.querySelectorAll('[role="alert"]').length;
    const emptyDashed = document.querySelectorAll('[class*="border-dashed"]').length;
    return {
      horizontalOverflow,
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      legacyCards,
      placeholderText,
      brokenImages,
      errorAlerts,
      emptyDashed,
      isDark: doc.classList.contains("dark"),
      title: document.title,
    };
  });
  if (data.horizontalOverflow) issues.push({ label, type: "horizontal-overflow", ...data });
  if (data.legacyCards > 2) issues.push({ label, type: "legacy-cards", count: data.legacyCards });
  if (data.placeholderText > 0) issues.push({ label, type: "placeholder-text", count: data.placeholderText });
  if (data.brokenImages > 0) issues.push({ label, type: "broken-images", count: data.brokenImages });
  return data;
}

async function setTheme(page, theme) {
  await page.evaluate((mode) => {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, theme);
  await page.waitForTimeout(300);
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

const COMPANY_SUFFIXES = [
  "/contacts",
  "/financial",
  "/compliance",
  "/history",
  "/identity",
  "/settings",
  "/settings/general",
  "/settings/contacts",
  "/settings/financial",
  "/settings/reporting",
  "/settings/preferences",
  "/settings/validation",
];

const ENGAGEMENT_SUFFIXES = [
  "",
  "/planning",
  "/planning/checklist",
  "/planning/documents",
  "/planning/history",
  "/planning/team",
  "/planning/timeline",
  "/planning/notes",
  "/planning/objectives",
  "/planning/scope",
  "/planning/risk",
  "/planning/framework",
  "/planning/strategy",
  "/planning/materiality",
  "/planning/settings",
  "/materiality",
  "/materiality/benchmarks",
  "/materiality/calculations",
  "/materiality/overall",
  "/materiality/specific",
  "/materiality/performance",
  "/materiality/comments",
  "/materiality/history",
  "/materiality/settings",
  "/materiality/versions",
  "/risk-assessment",
  "/risk-assessment/matrix",
  "/risk-assessment/heatmap",
  "/risk-assessment/categories",
  "/risk-assessment/scoring",
  "/risk-assessment/comments",
  "/risk-assessment/history",
  "/risk-assessment/settings",
  "/fieldwork",
  "/fieldwork/procedures",
  "/fieldwork/working-papers",
  "/fieldwork/evidence",
  "/fieldwork/findings",
  "/fieldwork/comments",
  "/fieldwork/history",
  "/fieldwork/notes",
  "/fieldwork/review-notes",
  "/fieldwork/program",
  "/fieldwork/settings",
  "/members",
  "/settings",
  "/history",
];

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
  await page.waitForTimeout(1200);
  if (page.url().includes("/login")) {
    console.log("Auth failed");
    await browser.close();
    process.exit(1);
  }

  const routes = new Set(["/en/app/dashboard", "/en/app/companies", "/en/app/engagements"]);

  await page.goto(`${baseUrl}/en/app/companies`, { waitUntil: "networkidle" });
  const companyLinks = await page.$$eval('a[href*="/app/companies/"]', (as) =>
    [...new Set(as.map((a) => a.getAttribute("href")).filter((h) => h && !h.endsWith("/new")))],
  );
  for (const cl of companyLinks.slice(0, 2)) {
    for (const suffix of COMPANY_SUFFIXES) routes.add(`${cl}${suffix}`);
  }

  await page.goto(`${baseUrl}/en/app/engagements`, { waitUntil: "networkidle" });
  const engLinks = await page.$$eval('a[href*="/app/engagements/"]', (as) =>
    [...new Set(as.map((a) => a.getAttribute("href")).filter((h) => h && !h.endsWith("/new")))],
  );
  for (const el of engLinks.slice(0, 1)) {
    for (const suffix of ENGAGEMENT_SUFFIXES) routes.add(`${el}${suffix}`);
  }

  const routeList = [...routes].sort();
  console.log(`Routes: ${routeList.length}, viewports: ${viewports.length}, themes: ${themes.length}`);

  for (const route of routeList) {
    for (const theme of themes) {
      await setTheme(page, theme);
      for (const vp of viewports) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        try {
          const res = await page.goto(`${baseUrl}${route}`, {
            waitUntil: "networkidle",
            timeout: 45000,
          });
          await page.waitForTimeout(500);
          const status = res?.status() ?? 0;
          if (status >= 400) {
            issues.push({ route, theme, vp: vp.name, type: "http-error", status });
            console.log(`${status} ${route} ${theme} ${vp.name}`);
            continue;
          }
          const audit = await auditPage(page, `${route}@${theme}@${vp.name}`);
          if (audit.legacyCards > 0 || audit.horizontalOverflow) {
            console.log(
              `200 ${route} ${theme} ${vp.name} legacy=${audit.legacyCards} overflow=${audit.horizontalOverflow}`,
            );
          }
        } catch (e) {
          issues.push({ route, theme, vp: vp.name, type: "navigation-error", error: String(e) });
          console.log(`FAIL ${route} ${theme} ${vp.name}`);
        }
      }
    }
  }

  fs.writeFileSync(path.join(outDir, "full-issues.json"), JSON.stringify(issues, null, 2));
  console.log(`Done. ${issues.length} issues logged.`);
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
