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
await page.goto("http://localhost:3000/en/app/companies", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
const slug =
  (await page
    .$eval('a[href*="/app/companies/"]', (as) => {
      const hrefs = [...document.querySelectorAll('a[href*="/app/companies/"]')].map((a) =>
        a.getAttribute("href"),
      );
      for (const href of hrefs) {
        const match = href?.match(/\/app\/companies\/([^/]+)/);
        if (match?.[1] && match[1] !== "new") return match[1];
      }
      return null;
    })
    .catch(() => null)) ?? "sunaaz";
console.log("slug", slug);
const routes = [
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
for (const loc of ["en", "az", "ru", "tr"]) {
  for (const r of routes) {
    let res;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        res = await page.goto(`http://localhost:3000/${loc}/app/companies/${slug}${r}`, {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });
        break;
      } catch (err) {
        if (attempt === 2) throw err;
        await page.waitForTimeout(1500);
      }
    }
    const status = res?.status();
    const text =
      loc === "en" ? "" : await page.evaluate(() => document.body?.innerText ?? "");
    const leaks =
      loc === "en"
        ? 0
        : (text.match(
            /\b(Command Center|Overview|Settings|Unable to load|Something went wrong|Retry|Loading\.\.\.|Identity|Contacts|Financial|Compliance|Validation|Back to companies)\b/g,
          ) ?? []).length;
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    );
    console.log(status, loc, r || "/", `leaks=${leaks}`, `overflow=${overflow}`);
  }
}
console.log("pageerrors", errors.length, errors.slice(0, 3));
await browser.close();
