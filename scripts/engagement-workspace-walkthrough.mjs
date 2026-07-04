/**
 * Engagement workspace real-user walkthrough — runtime + i18n + layout.
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
  { name: "1024", width: 1024, height: 768 },
  { name: "768", width: 768, height: 1024 },
  { name: "390", width: 390, height: 844 },
  { name: "360", width: 360, height: 740 },
];
const THEMES = ["light", "dark"];

const ENG_SUFFIXES = [
  "",
  "/members",
  "/history",
  "/settings",
  "/planning",
  "/planning/checklist",
  "/planning/documents",
  "/planning/history",
  "/planning/team",
  "/planning/timeline",
  "/planning/notes",
  "/planning/comments",
  "/planning/settings",
  "/materiality",
  "/materiality/benchmarks",
  "/materiality/calculations",
  "/materiality/comments",
  "/materiality/history",
  "/materiality/settings",
  "/risk-assessment",
  "/risk-assessment/matrix",
  "/risk-assessment/heatmap",
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
  "/fieldwork/settings",
];

const ENGLISH_LEAK_PATTERNS = [
  /\bCommand Center\b/g,
  /\bOverview\b/g,
  /\bSettings\b/g,
  /\bLoading\.\.\.\b/g,
  /\bUnable to load\b/g,
  /\bSomething went wrong\b/g,
  /\bTeam\b/g,
  /\bHistory\b/g,
  /\bWorkflow\b/g,
  /\bTimeline\b/g,
  /\bComments\b/g,
  /\bArchive\b/g,
  /\bRestore\b/g,
  /\bRetry\b/g,
  /\bSave changes\b/g,
  /\bCancel\b/g,
  /\bSubmit\b/g,
  /\bPending review\b/g,
  /\bIn progress\b/g,
  /\bApproved\b/g,
];

const issues = [];
const consoleErrors = [];

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
  await page.evaluate((mode) => {
    const root = document.documentElement;
    if (!root) return;
    if (mode === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", mode);
  }, theme);
}

function countEnglishLeaks(text, locale) {
  if (locale === "en") return 0;
  let count = 0;
  for (const pattern of ENGLISH_LEAK_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) count += matches.length;
  }
  return count;
}

async function auditPage(page, locale) {
  return page.evaluate((loc) => {
    const doc = document.documentElement;
    const bodyText = document.body?.innerText ?? "";
    const horizontalOverflow = doc.scrollWidth > doc.clientWidth + 2;
    const errorBoundary = document.querySelector('[data-error-boundary], [class*="error-boundary"]');
    const reactError = bodyText.includes("Application error") || bodyText.includes("Unhandled Runtime Error");
    const nextError = bodyText.includes("Internal Server Error") || bodyText.includes("500");
    const legacyCards = document.querySelectorAll('[class*="bg-card/60"], [class*="bg-card/80"]').length;
    const brokenButtons = [...document.querySelectorAll("button,a")].filter(
      (el) => el.getAttribute("aria-disabled") === "true" && el.textContent?.trim(),
    ).length;
    return {
      horizontalOverflow,
      errorBoundary: Boolean(errorBoundary),
      reactError,
      nextError,
      legacyCards,
      brokenButtons,
      title: document.title,
      bodySnippet: bodyText.slice(0, 500),
      isDark: doc.classList.contains("dark"),
      leakSample: loc === "en" ? "" : bodyText.slice(0, 2000),
    };
  }, locale);
}

async function discoverEngagementSlug(page) {
  await page.goto(`${baseUrl}/en/app/engagements`, { waitUntil: "networkidle", timeout: 45000 });
  const links = await page.$$eval('a[href*="/app/engagements/"]', (as) =>
    [...new Set(as.map((a) => a.getAttribute("href")).filter((h) => h && !h.endsWith("/new")))],
  );
  if (links.length > 0) {
    const match = links[0].match(/\/engagements\/([^/]+)/);
    return match?.[1] ?? "fy2026-statutory-audit";
  }
  return "fy2026-statutory-audit";
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

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push({ text: msg.text(), url: page.url() });
    }
  });
  page.on("pageerror", (err) => {
    consoleErrors.push({ text: err.message, url: page.url(), type: "pageerror" });
  });

  await page.goto(`${baseUrl}/en/app/dashboard`, { waitUntil: "domcontentloaded", timeout: 30000 });
  if (page.url().includes("/login")) {
    console.log("AUTH_FAIL");
    process.exit(1);
  }

  const slug = await discoverEngagementSlug(page);
  console.log(`Engagement slug: ${slug}`);

  let checks = 0;
  let sessionAt = 0;

  for (const locale of LOCALES) {
    for (const suffix of ENG_SUFFIXES) {
      const route = `/${locale}/app/engagements/${slug}${suffix}`;
      for (const theme of THEMES) {
        for (const vp of VIEWPORTS) {
          checks++;
          if (checks - sessionAt > 35) {
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
            sessionAt = checks;
          }

          await page.setViewportSize({ width: vp.width, height: vp.height });
          await setTheme(page, theme);
          try {
            const res = await page.goto(`${baseUrl}${route}`, {
              waitUntil: "domcontentloaded",
              timeout: 30000,
            });
            await page.waitForTimeout(500);
            const status = res?.status() ?? 0;

            if (page.url().includes("/login")) {
              issues.push({ route, locale, theme, vp: vp.name, type: "auth-expired" });
              console.log(`AUTH ${route}`);
              continue;
            }

            if (status >= 400) {
              issues.push({ route, locale, theme, vp: vp.name, type: "http-error", status });
              console.log(`HTTP ${status} ${route} ${theme} ${vp.name}`);
              continue;
            }

            const audit = await auditPage(page, locale);
            const leaks = countEnglishLeaks(audit.leakSample, locale);

            if (audit.reactError || audit.nextError) {
              issues.push({ route, locale, theme, vp: vp.name, type: "runtime-error", ...audit });
              console.log(`RUNTIME ${route} ${locale} ${theme} ${vp.name}`);
            }
            if (audit.horizontalOverflow) {
              issues.push({ route, locale, theme, vp: vp.name, type: "overflow" });
              console.log(`OVERFLOW ${route} ${vp.name}`);
            }
            if (leaks > 0) {
              issues.push({ route, locale, theme, vp: vp.name, type: "english-leak", count: leaks });
              console.log(`I18N ${leaks} ${route} ${locale}`);
            }
            if (audit.legacyCards > 0) {
              issues.push({ route, locale, theme, vp: vp.name, type: "legacy-ui", count: audit.legacyCards });
            }
          } catch (e) {
            issues.push({ route, locale, theme, vp: vp.name, type: "timeout", error: String(e).slice(0, 100) });
            console.log(`TIMEOUT ${route} ${vp.name}`);
          }
        }
      }
    }
  }

  const report = { issues, consoleErrors: consoleErrors.slice(0, 50), checks, slug };
  fs.writeFileSync(path.join(outDir, "engagement-walkthrough.json"), JSON.stringify(report, null, 2));
  console.log(`Done. ${checks} checks, ${issues.length} issues, ${consoleErrors.length} console errors.`);
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
