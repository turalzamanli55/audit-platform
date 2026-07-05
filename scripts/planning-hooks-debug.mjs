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
for (const r of ROUTES) {
  const errors = [];
  const handler = (e) => errors.push(e.message);
  page.on("pageerror", handler);
  await page.goto(`http://localhost:3000/en/app/engagements/${slug}/planning${r}`, {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.waitForTimeout(500);
  page.off("pageerror", handler);
  if (errors.length) console.log(r || "/", errors);
}
await browser.close();
