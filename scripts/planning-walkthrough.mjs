import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

const baseUrl = process.argv[2] ?? "http://localhost:3000";
const slug = process.argv[3] ?? "fy2026-statutory-audit";
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

const ROUTES = [
  "",
  "/strategy",
  "/objectives",
  "/scope",
  "/framework",
  "/materiality",
  "/risk",
  "/team",
  "/timeline",
  "/notes",
  "/checklist",
  "/documents",
  "/history",
  "/settings",
];
const VIEWPORTS = [
  { name: "1920", width: 1920, height: 1080 },
  { name: "1600", width: 1600, height: 900 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1024", width: 1024, height: 768 },
  { name: "768", width: 768, height: 1024 },
  { name: "390", width: 390, height: 844 },
  { name: "360", width: 360, height: 740 },
];
const LOCALES = ["en", "az", "ru", "tr"];
const THEMES = ["light", "dark"];

const PATTERNS = [
  /\bUnable to load\b/gi,
  /\bSomething went wrong\b/gi,
  /\bRetry\b/g,
  /\bCommand Center\b/gi,
  /\bOverview\b/g,
  /\bSettings\b/g,
  /\bWorkflow\b/g,
  /\bComments\b/g,
  /\bView all\b/gi,
  /\[\[/,
];

let issues = 0;
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
const pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(e.message));

for (const locale of LOCALES) {
  for (const route of ROUTES) {
    for (const vp of VIEWPORTS) {
      for (const theme of THEMES) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(`${baseUrl}/${locale}/app/engagements/${slug}/planning${route}`, {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });
        await page.evaluate((t) => {
          document.documentElement.classList.toggle("dark", t === "dark");
        }, theme);
        const text = locale === "en" ? "" : await page.evaluate(() => document.body?.innerText ?? "");
        const leaks =
          locale === "en" ? 0 : PATTERNS.reduce((n, p) => n + (text.match(p)?.length ?? 0), 0);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
        );
        if (leaks > 0 || overflow) {
          issues++;
          console.log("ISSUE", locale, route || "/", vp.name, theme, `leaks=${leaks}`, overflow);
        }
      }
    }
  }
}

console.log(`issues=${issues} pageErrors=${pageErrors.length}`);
await browser.close();
process.exit(issues > 0 || pageErrors.length > 0 ? 1 : 0);
