/**
 * Final sprint walkthrough — all locales, modules, light/dark, key breakpoints.
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

const LOCALES = ["en", "az", "ru", "tr"];
const VIEWPORTS = [
  { name: "1920", width: 1920, height: 1080 },
  { name: "1600", width: 1600, height: 900 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1024", width: 1024, height: 768 },
  { name: "768", width: 768, height: 1024 },
  { name: "390", width: 390, height: 844 },
  { name: "360", width: 360, height: 740 },
];
const THEMES = ["light", "dark"];

const COMPANY_SUFFIXES = [
  "",
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

const issues = [];

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

async function setTheme(page, theme) {
  try {
    await page.evaluate((mode) => {
      const root = document.documentElement;
      if (!root) return;
      if (mode === "dark") root.classList.add("dark");
      else root.classList.remove("dark");
      localStorage.setItem("theme", mode);
    }, theme);
    await page.waitForTimeout(200);
  } catch {
    // navigation in progress
  }
}

async function auditPage(page, locale) {
  return page.evaluate((loc) => {
    const doc = document.documentElement;
    const bodyText = document.body?.innerText ?? "";
    const legacyCards = document.querySelectorAll('[class*="bg-card/80"]').length;
    const legacyShadows = document.querySelectorAll('[class*="shadow-xs"]').length;
    const oldRounded3xl = document.querySelectorAll('[class*="rounded-3xl"]').length;
    const horizontalOverflow = doc.scrollWidth > doc.clientWidth + 2;
    const untranslated =
      loc !== "en"
        ? (bodyText.match(/\b(Command Center|Overview|Settings|Dashboard|Loading\.\.\.)\b/g) ?? []).length
        : 0;
    const placeholders = [...document.querySelectorAll("p,span,h1,h2,h3")]
      .map((el) => el.textContent?.trim() ?? "")
      .filter((t) => /^(lorem ipsum|placeholder|coming soon|todo|tbd|sample data)$/i.test(t)).length;
    return {
      legacyCards,
      legacyShadows,
      oldRounded3xl,
      horizontalOverflow,
      untranslated,
      placeholders,
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      isDark: doc.classList.contains("dark"),
    };
  }, locale);
}

function toLocaleRoute(enRoute, locale) {
  return enRoute.replace(/^\/en\//, `/${locale}/`);
}

async function discoverRoutes(page) {
  const routes = new Set([
    "/en/app/dashboard",
    "/en/app/companies",
    "/en/app/engagements",
  ]);

  await page.goto(`${baseUrl}/en/app/companies`, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(800);
  let companyLinks = await page.$$eval('a[href*="/app/companies/"]', (as) =>
    [...new Set(as.map((a) => a.getAttribute("href")).filter((h) => h && !h.endsWith("/new")))],
  );
  if (companyLinks.length === 0) {
    companyLinks = ["/en/app/companies/audit-test-co", "/en/app/companies/sunaaz"];
  }
  for (const cl of companyLinks.slice(0, 2)) {
    for (const suffix of COMPANY_SUFFIXES) routes.add(`${cl}${suffix}`);
  }

  await page.goto(`${baseUrl}/en/app/engagements`, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(800);
  let engLinks = await page.$$eval('a[href*="/app/engagements/"]', (as) =>
    [...new Set(as.map((a) => a.getAttribute("href")).filter((h) => h && !h.endsWith("/new")))],
  );
  if (engLinks.length === 0) {
    engLinks = ["/en/app/engagements/fy2026-statutory-audit"];
  }
  for (const el of engLinks.slice(0, 1)) {
    for (const suffix of ENGAGEMENT_SUFFIXES) routes.add(`${el}${suffix}`);
  }

  return [...routes].sort();
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

  await page.goto(`${baseUrl}/en/app/dashboard`, { waitUntil: "domcontentloaded", timeout: 30000 });
  if (page.url().includes("/login")) {
    console.log("AUTH_FAIL");
    await browser.close();
    process.exit(1);
  }

  const enRoutes = await discoverRoutes(page);
  console.log(`Routes: ${enRoutes.length}, locales: ${LOCALES.length}`);

  let checks = 0;
  let sessionRefreshAt = 0;
  for (const locale of LOCALES) {
    for (const enRoute of enRoutes) {
      const route = toLocaleRoute(enRoute, locale);
      for (const theme of THEMES) {
        for (const vp of VIEWPORTS) {
          checks++;
          if (checks - sessionRefreshAt > 40) {
            const fresh = await getSession();
            await context.addCookies([
              {
                name: cookieName,
                value: JSON.stringify({
                  access_token: fresh.access_token,
                  refresh_token: fresh.refresh_token,
                  expires_at: fresh.expires_at,
                  expires_in: fresh.expires_in,
                  token_type: fresh.token_type,
                  user: fresh.user,
                }),
                domain: "localhost",
                path: "/",
                httpOnly: false,
                secure: false,
                sameSite: "Lax",
              },
            ]);
            sessionRefreshAt = checks;
          }
          await page.setViewportSize({ width: vp.width, height: vp.height });
          await setTheme(page, theme);
          try {
            const res = await page.goto(`${baseUrl}${route}`, {
              waitUntil: "domcontentloaded",
              timeout: 25000,
            });
            await page.waitForTimeout(400);
            const status = res?.status() ?? 0;
            if (status >= 400) {
              issues.push({ route, locale, theme, vp: vp.name, type: "http-error", status });
              console.log(`ERR ${status} ${route} ${theme} ${vp.name}`);
              continue;
            }
            if (page.url().includes("/login")) {
              issues.push({ route, locale, theme, vp: vp.name, type: "auth-expired" });
              console.log(`AUTH ${route}`);
              continue;
            }
            const audit = await auditPage(page, locale);
            const label = `${route}@${locale}@${theme}@${vp.name}`;
            if (audit.horizontalOverflow) {
              issues.push({ label, type: "overflow", ...audit });
              console.log(`OVERFLOW ${route} ${theme} ${vp.name}`);
            }
            if (audit.legacyCards > 0) {
              issues.push({ label, type: "legacy-cards", count: audit.legacyCards, ...audit });
              console.log(`LEGACY ${audit.legacyCards} ${route} ${theme} ${vp.name}`);
            }
            if (audit.untranslated > 2) {
              issues.push({ label, type: "untranslated", count: audit.untranslated });
              console.log(`I18N ${audit.untranslated} ${route} ${locale}`);
            }
            if (audit.placeholders > 0) {
              issues.push({ label, type: "placeholder", count: audit.placeholders });
              console.log(`PLACEHOLDER ${route}`);
            }
          } catch (e) {
            issues.push({ route, locale, theme, vp: vp.name, type: "timeout", error: String(e).slice(0, 120) });
            console.log(`TIMEOUT ${route} ${vp.name}`);
          }
        }
      }
    }
  }

  fs.writeFileSync(path.join(outDir, "sprint-issues.json"), JSON.stringify(issues, null, 2));
  console.log(`Done. ${checks} checks, ${issues.length} issues.`);
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
