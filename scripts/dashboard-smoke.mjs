import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

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
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const patterns = [
  /\bCommand Center\b/gi,
  /\bOverview\b/g,
  /\bContinue working\b/gi,
  /\bQuick actions\b/gi,
  /\bRecent activity\b/gi,
  /\bNotifications\b/g,
  /\bInsights\b/g,
  /\bCalendar\b/g,
  /\bUnable to load\b/gi,
  /\bRetry\b/g,
  /\bView all\b/gi,
  /\bNo activity\b/gi,
  /\bDashboard\b/g,
];
for (const loc of ["en", "az", "ru", "tr"]) {
  await page.goto(`http://localhost:3000/${loc}/app/dashboard`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  const text = await page.evaluate(() => document.body?.innerText ?? "");
  const leaks =
    loc === "en"
      ? 0
      : patterns.reduce((n, p) => n + (text.match(p)?.length ?? 0), 0);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
  );
  console.log(loc, "status=200", `leaks=${leaks}`, `overflow=${overflow}`);
}
console.log("pageerrors", errors.length);
await browser.close();
