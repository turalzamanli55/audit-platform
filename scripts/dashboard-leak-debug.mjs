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
for (const loc of ["az", "ru", "tr"]) {
  await page.goto(`http://localhost:3000/${loc}/app/dashboard`, { waitUntil: "networkidle" });
  const text = await page.evaluate(() => document.body?.innerText ?? "");
  const hits = [
    "Command Center",
    "Overview",
    "Continue working",
    "Quick actions",
    "Recent activity",
    "Notifications",
    "Insights",
    "Calendar",
    "Pinned companies",
    "Pinned engagements",
    "Assigned tasks",
    "Unable to load",
    "Something went wrong",
    "Retry",
    "Loading...",
    "Search",
    "No activity",
    "View all",
    "Dashboard",
    "KPI",
    "Continue Working",
    "Quick Actions",
    "Recent Activity",
    "Pinned Companies",
    "Pinned Engagements",
    "Assigned Tasks",
  ];
  console.log(`\n=== ${loc} ===`);
  for (const h of hits) {
    if (text.includes(h)) console.log("LEAK:", h);
  }
}
await browser.close();
