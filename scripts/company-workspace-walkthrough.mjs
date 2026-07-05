/**
 * Company workspace real-user walkthrough — runtime + i18n + layout.
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

const COMPANY_SUFFIXES = [
  "",
  "/identity",
  "/contacts",
  "/financial",
  "/compliance",
  "/history",
  "/settings",
  "/settings/general",
  "/settings/contacts",
  "/settings/financial",
  "/settings/reporting",
  "/settings/preferences",
  "/settings/validation",
];

const ENGLISH_LEAK_PATTERNS = [
  /\bCommand Center\b/g,
  /\bOverview\b/g,
  /\bSettings\b/g,
  /\bLoading\.\.\.\b/g,
  /\bUnable to load\b/g,
  /\bSomething went wrong\b/g,
  /\bIdentity\b/g,
  /\bContacts\b/g,
  /\bFinancial\b/g,
  /\bCompliance\b/g,
  /\bHistory\b/g,
  /\bValidation\b/g,
  /\bArchive\b/g,
  /\bRestore\b/g,
  /\bRetry\b/g,
  /\bSave changes\b/g,
  /\bCancel\b/g,
  /\bSubmit\b/g,
  /\bRead-only\b/g,
  /\bCompany workspace\b/g,
  /\bBack to companies\b/g,
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
  return page.evaluate(() => {
    const doc = document.documentElement;
    const bodyText = document.body?.innerText ?? "";
    const horizontalOverflow = doc.scrollWidth > doc.clientWidth + 2;
    const reactError =
      bodyText.includes("Application error") || bodyText.includes("Unhandled Runtime Error");
    const nextError = bodyText.includes("Internal Server Error");
    const legacyCards = document.querySelectorAll('[class*="bg-card/60"], [class*="bg-card/80"]').length;
    return {
      horizontalOverflow,
      reactError,
      nextError,
      legacyCards,
      title: document.title,
      bodyLength: bodyText.length,
    };
  });
}

async function waitForServer(maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(`${baseUrl}/en/login`);
      if (res.ok || res.status === 307 || res.status === 308) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error(`Server not ready at ${baseUrl}`);
}

async function main() {
  await waitForServer();

  let session = await getSession();
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
    },
  ]);

  const page = await context.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(err.message));

  await page.goto(`${baseUrl}/en/app/companies`, { waitUntil: "domcontentloaded", timeout: 60000 });
  const companySlug = await page
    .$eval('a[href*="/app/companies/"]', (a) => {
      const match = a.getAttribute("href")?.match(/\/app\/companies\/([^/]+)/);
      return match?.[1] ?? null;
    })
    .catch(() => null);

  if (!companySlug || companySlug === "new") {
    throw new Error("No company slug found on /app/companies");
  }

  console.log(`Company slug: ${companySlug}`);

  let checks = 0;
  for (const locale of LOCALES) {
    for (const suffix of COMPANY_SUFFIXES) {
      for (const vp of VIEWPORTS) {
        for (const theme of THEMES) {
          checks++;
          if (checks % 35 === 0) {
            session = await getSession();
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
              },
            ]);
          }

          const path = `/${locale}/app/companies/${companySlug}${suffix}`;
          await page.setViewportSize({ width: vp.width, height: vp.height });

          let status = 0;
          try {
            const res = await page.goto(`${baseUrl}${path}`, {
              waitUntil: "domcontentloaded",
              timeout: 45000,
            });
            status = res?.status() ?? 0;
            await setTheme(page, theme);
            await page.waitForTimeout(300);
          } catch (err) {
            issues.push({
              type: "timeout",
              path,
              viewport: vp.name,
              theme,
              error: err.message,
            });
            console.log(`TIMEOUT ${path} ${theme} ${vp.name}`);
            continue;
          }

          if (status >= 400) {
            issues.push({ type: "http", status, path, viewport: vp.name, theme });
            console.log(`HTTP ${status} ${path} ${theme} ${vp.name}`);
            continue;
          }

          const bodyText = await page.evaluate(() => document.body?.innerText ?? "");
          const leaks = countEnglishLeaks(bodyText, locale);
          const audit = await auditPage(page, locale);

          if (leaks > 0 && locale !== "en") {
            issues.push({ type: "i18n", leaks, path, locale, viewport: vp.name, theme });
            console.log(`I18N leaks=${leaks} ${locale} ${suffix || "/"} ${theme} ${vp.name}`);
          }
          if (audit.horizontalOverflow) {
            issues.push({ type: "overflow", path, viewport: vp.name, theme });
            console.log(`OVERFLOW ${path} ${theme} ${vp.name}`);
          }
          if (audit.reactError || audit.nextError) {
            issues.push({ type: "runtime", path, viewport: vp.name, theme, ...audit });
            console.log(`RUNTIME ${path} ${theme} ${vp.name}`);
          }
        }
      }
    }
  }

  await browser.close();

  const report = {
    companySlug,
    checks,
    issueCount: issues.length,
    consoleErrorCount: consoleErrors.length,
    issues: issues.slice(0, 200),
    consoleErrors: consoleErrors.slice(0, 50),
  };

  fs.writeFileSync(
    path.join(outDir, "company-walkthrough.json"),
    JSON.stringify(report, null, 2),
  );

  console.log(`\nDone: ${checks} checks, ${issues.length} issues, ${consoleErrors.length} console errors`);
  process.exit(issues.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
