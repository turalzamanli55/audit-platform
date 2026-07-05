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

const PATTERNS = [
  /\bCommand Center\b/gi,
  /\bOverview\b/g,
  /\bStrategy\b/g,
  /\bObjectives\b/g,
  /\bScope\b/g,
  /\bFramework\b/g,
  /\bMateriality\b/g,
  /\bTimeline\b/g,
  /\bChecklist\b/g,
  /\bDocuments\b/g,
  /\bSettings\b/g,
  /\bWorkflow\b/g,
  /\bComments\b/g,
  /\bUnable to load\b/gi,
  /\bSomething went wrong\b/gi,
  /\bRetry\b/g,
  /\bLoading\.\.\.\b/g,
  /\bSave changes\b/gi,
  /\bCancel\b/g,
  /\bSubmit\b/g,
  /\bPending review\b/gi,
  /\bIn progress\b/gi,
  /\bApproved\b/g,
  /\bView all\b/gi,
  /\bNo activity\b/gi,
  /\bTeam\b/g,
  /\bHistory\b/g,
];

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

let issues = 0;
for (const loc of ["en", "az", "ru", "tr"]) {
  for (const r of ROUTES) {
    let res;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        res = await page.goto(`${baseUrl}/${loc}/app/engagements/${slug}/planning${r}`, {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });
        break;
      } catch {
        if (attempt === 2) throw new Error(`timeout ${loc}${r}`);
        await page.waitForTimeout(1500);
      }
    }
    const status = res?.status() ?? 0;
    const text = loc === "en" ? "" : await page.evaluate(() => document.body?.innerText ?? "");
    const leaks =
      loc === "en" ? 0 : PATTERNS.reduce((n, p) => n + (text.match(p)?.length ?? 0), 0);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    );
    const legacy = await page.evaluate(
      () => document.querySelectorAll('[class*="bg-card/60"], [class*="bg-card/80"]').length,
    );
    if (status >= 400) {
      issues++;
      console.log("HTTP", status, loc, r || "/");
    } else if (leaks > 0) {
      issues++;
      console.log("I18N", `leaks=${leaks}`, loc, r || "/");
    } else if (overflow) {
      issues++;
      console.log("OVERFLOW", loc, r || "/");
    } else {
      console.log("OK", loc, r || "/", legacy > 5 ? `legacyCards=${legacy}` : "");
    }
  }
}
console.log(`\nissues=${issues} pageErrors=${pageErrors.length}`);
if (pageErrors.length) console.log(pageErrors.slice(0, 3));
await browser.close();
process.exit(issues > 0 || pageErrors.length > 0 ? 1 : 0);
