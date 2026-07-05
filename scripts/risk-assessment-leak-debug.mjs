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
  "/inherent-risks",
  "/control-risks",
  "/detection-risks",
  "/fraud-risks",
  "/it-risks",
  "/compliance-risks",
  "/financial-statement-risks",
  "/assertion-risks",
  "/significant-risks",
  "/categories",
  "/scoring",
  "/heatmap",
  "/matrix",
  "/responses",
  "/procedures",
  "/owners",
  "/review-notes",
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
  "Risk Assessment",
  "Workflow",
  "Comments",
  "View all",
  "Not set",
  "Pending review",
  "Creating...",
  "Inherent Risks",
  "Control Risks",
  "Detection Risks",
  "Fraud Risks",
  "IT Risks",
  "Compliance Risks",
  "Financial Statement",
  "Assertion Risks",
  "Significant Risks",
  "Heatmap",
  "Matrix",
  "Review Notes",
  "You need",
  "Select a workspace",
  "Document the",
  "No risks",
  "[[",
];
for (const loc of ["az", "ru", "tr"]) {
  for (const route of ROUTES) {
    await page.goto(`http://localhost:3000/${loc}/app/engagements/${slug}/risk-assessment${route}`, {
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
