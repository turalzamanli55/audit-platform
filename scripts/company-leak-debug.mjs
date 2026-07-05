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
await page.goto("http://localhost:3000/en/app/companies", {
  waitUntil: "networkidle",
  timeout: 60000,
});
const links = await page.$$eval('a[href*="/app/companies/"]', (as) =>
  as.map((a) => a.getAttribute("href")).filter(Boolean).slice(0, 10),
);
console.log("links", links);
const slug =
  links.map((h) => h?.match(/\/app\/companies\/([^/]+)/)?.[1]).find((s) => s && s !== "new") ??
  "sunaaz";
console.log("slug", slug);

const checks = [
  ["az", "/contacts"],
  ["tr", "/identity"],
  ["tr", "/settings/validation"],
];
const hits = [
  "Command Center",
  "Overview",
  "Settings",
  "Unable to load",
  "Something went wrong",
  "Retry",
  "Loading...",
  "Identity",
  "Contacts",
  "Financial",
  "Compliance",
  "Validation",
  "Back to companies",
  "Save changes",
  "Cancel",
  "Submit",
  "Archive",
  "Restore",
  "Read-only",
  "Primary contact",
  "Email",
  "Phone",
];
for (const [loc, r] of checks) {
  await page.goto(`http://localhost:3000/${loc}/app/companies/${slug}${r}`, {
    waitUntil: "domcontentloaded",
  });
  const text = await page.evaluate(() => document.body?.innerText ?? "");
  console.log(`\n=== ${loc}${r} ===`);
  for (const h of hits) {
    if (text.includes(h)) console.log("LEAK:", h);
  }
}
await browser.close();
