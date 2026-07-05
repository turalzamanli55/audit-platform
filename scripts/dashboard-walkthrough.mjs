import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

const baseUrl = process.argv[2] ?? "http://localhost:3000";
const env = fs.readFileSync(".env.local", "utf8");
const supabaseUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim();
const serviceKey = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim();
const anonKey = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/)?.[1]?.trim();
const supabase = createClient(supabaseUrl, serviceKey);
const { data: linkData } = await supabase.auth.admin.generateLink({
  type: "magiclink",
  email: "tural.zamanli@gmail.com",
});
const anon = createClient(supabaseUrl, anonKey);
const { data: sessionData } = await anon.auth.verifyOtp({
  token_hash: linkData.properties.hashed_token,
  type: "email",
});
const session = sessionData.session;
const cookieName = `sb-${new URL(supabaseUrl).hostname.split(".")[0]}-auth-token`;

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

const ENGLISH_PATTERNS = [
  /\bCommand Center\b/g,
  /\bOverview\b/g,
  /\bContinue working\b/g,
  /\bQuick actions\b/g,
  /\bRecent activity\b/g,
  /\bNotifications\b/g,
  /\bInsights\b/g,
  /\bCalendar\b/g,
  /\bPinned companies\b/g,
  /\bPinned engagements\b/g,
  /\bAssigned tasks\b/g,
  /\bUnable to load\b/g,
  /\bSomething went wrong\b/g,
  /\bRetry\b/g,
  /\bLoading\.\.\.\b/g,
  /\bSearch\b/g,
  /\bNo activity\b/g,
  /\bView all\b/g,
  /\bDashboard\b/g,
  /\bKPI\b/g,
];

const issues = [];
const pageErrors = [];

async function setTheme(page, theme) {
  await page.evaluate((mode) => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    localStorage.setItem("theme", mode);
  }, theme);
}

function countLeaks(text, locale) {
  if (locale === "en") return 0;
  let n = 0;
  for (const p of ENGLISH_PATTERNS) {
    const m = text.match(p);
    if (m) n += m.length;
  }
  return n;
}

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
page.on("pageerror", (e) => pageErrors.push(e.message));

let checks = 0;
for (const locale of LOCALES) {
  for (const vp of VIEWPORTS) {
    for (const theme of THEMES) {
      checks++;
      await page.setViewportSize({ width: vp.width, height: vp.height });
      let res;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          res = await page.goto(`${baseUrl}/${locale}/app/dashboard`, {
            waitUntil: "domcontentloaded",
            timeout: 60000,
          });
          break;
        } catch (err) {
          if (attempt === 2) {
            issues.push({ type: "timeout", locale, viewport: vp.name, theme });
            console.log(`TIMEOUT ${locale} ${vp.name} ${theme}`);
            res = null;
          } else {
            await page.waitForTimeout(1500);
          }
        }
      }
      if (!res) continue;
      if (res.status() >= 400) {
        issues.push({ type: "http", status: res.status(), locale, viewport: vp.name, theme });
        console.log(`HTTP ${res.status()} ${locale} ${vp.name} ${theme}`);
        continue;
      }
      await setTheme(page, theme);
      await page.waitForTimeout(400);
      const text = await page.evaluate(() => document.body?.innerText ?? "");
      const leaks = countLeaks(text, locale);
      const audit = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
        reactError:
          document.body?.innerText.includes("Application error") ||
          document.body?.innerText.includes("Unhandled Runtime Error"),
      }));
      if (leaks > 0) {
        issues.push({ type: "i18n", leaks, locale, viewport: vp.name, theme });
        console.log(`I18N leaks=${leaks} ${locale} ${vp.name} ${theme}`);
      }
      if (audit.overflow) {
        issues.push({ type: "overflow", locale, viewport: vp.name, theme });
        console.log(`OVERFLOW ${locale} ${vp.name} ${theme}`);
      }
      if (audit.reactError) {
        issues.push({ type: "runtime", locale, viewport: vp.name, theme });
        console.log(`RUNTIME ${locale} ${vp.name} ${theme}`);
      }
    }
  }
}

// Interactive: command palette, search focus
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`${baseUrl}/az/app/dashboard`, { waitUntil: "domcontentloaded" });
try {
  await page.keyboard.press("Control+k");
  await page.waitForTimeout(500);
  const paletteOpen = await page.evaluate(() =>
    Boolean(document.querySelector('[cmdk-root], [data-slot="command"], [role="dialog"]')),
  );
  if (!paletteOpen) issues.push({ type: "command-palette", note: "Ctrl+K did not open palette" });
  await page.keyboard.press("Escape");
} catch (e) {
  issues.push({ type: "command-palette", error: e.message });
}

await browser.close();
console.log(`\nDone: ${checks} checks, ${issues.length} issues, ${pageErrors.length} page errors`);
if (pageErrors.length) console.log("pageErrors:", pageErrors.slice(0, 5));
process.exit(issues.length > 0 || pageErrors.length > 0 ? 1 : 0);
