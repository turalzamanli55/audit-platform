import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

const slug = "fy2026-statutory-audit";
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
const ROUTES = [
  "",
  "/overall",
  "/performance",
  "/specific",
  "/benchmarks",
  "/calculations",
  "/versions",
  "/comments",
  "/history",
  "/settings",
];
const hits = [
  "Unable to load",
  "Something went wrong",
  "Retry",
  "Command Center",
  "Overview",
  "Settings",
  "Benchmarks",
  "Calculations",
  "Materiality",
  "Workflow",
  "Comments",
  "View all",
  "Saved:",
  "Not set",
  "Pending review",
  "Creating...",
  "No benchmarks configured",
  "Add benchmarks",
  "Document the",
  "Select a workspace",
  "You need",
  "Review comment",
  "Internal comment",
  "[[",
];
for (const loc of ["az", "ru", "tr"]) {
  for (const route of ROUTES) {
    await page.goto(`http://localhost:3000/${loc}/app/engagements/${slug}/materiality${route}`, {
      waitUntil: "networkidle",
      timeout: 60000,
    });
    const text = await page.evaluate(() => document.body?.innerText ?? "");
    const found = hits.filter((h) => text.includes(h));
    if (found.length) {
      console.log(`\n=== ${loc}${route || "/"} ===`);
      for (const h of found) console.log("LEAK:", h);
    }
  }
}
await browser.close();
