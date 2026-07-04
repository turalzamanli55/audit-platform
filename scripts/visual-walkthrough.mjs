/**
 * Visual walkthrough — captures layout issues across the platform.
 * Usage: node scripts/visual-walkthrough.mjs [baseUrl] [email] [password]
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseUrl = process.argv[2] ?? "http://localhost:3000";
const email = process.argv[3];
const password = process.argv[4];
const outDir = path.join(__dirname, "..", ".visual-qa");
fs.mkdirSync(outDir, { recursive: true });

const viewports = [
  { name: "desktop-1920", width: 1920, height: 1080 },
  { name: "tablet-1024", width: 1024, height: 768 },
  { name: "mobile-390", width: 390, height: 844 },
];

const publicRoutes = ["/en", "/en/login", "/en/register"];
const appRoutes = [
  "/en/app/dashboard",
  "/en/app/companies",
  "/en/app/engagements",
];

const issues = [];

async function checkPage(page, name) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    const hasH = doc.scrollWidth > doc.clientWidth + 2;
    const hasV = doc.scrollHeight > doc.clientHeight + 2;
    const broken = [...document.querySelectorAll("*")].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > window.innerWidth + 4 && el.children.length > 0;
    }).length;
    return { hasH, scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, broken };
  });
  if (overflow.hasH || overflow.broken > 0) {
    issues.push({ page: name, type: "overflow", ...overflow });
  }
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  return consoleErrors;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  for (const route of publicRoutes) {
    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const url = `${baseUrl}${route}`;
      try {
        const res = await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
        await page.waitForTimeout(500);
        const shot = path.join(outDir, `${vp.name}${route.replace(/\//g, "_")}.png`);
        await page.screenshot({ path: shot, fullPage: true });
        await checkPage(page, `${route}@${vp.name}`);
        console.log(`OK ${res?.status()} ${route} ${vp.name}`);
      } catch (e) {
        issues.push({ page: route, type: "navigation", error: String(e) });
        console.log(`FAIL ${route} ${vp.name}: ${e.message}`);
      }
    }
  }

  if (email && password) {
    await page.goto(`${baseUrl}/en/login`, { waitUntil: "networkidle" });
    await page.fill('input[name="email"], input[type="email"]', email);
    await page.fill('input[name="password"], input[type="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    const authed = !page.url().includes("/login");
    console.log(`Login: ${authed ? "success" : "failed"} -> ${page.url()}`);

    if (authed) {
      const companies = await page.goto(`${baseUrl}/en/app/companies`, { waitUntil: "networkidle" });
      const links = await page.$$eval('a[href*="/app/companies/"]', (as) =>
        [...new Set(as.map((a) => a.getAttribute("href")).filter(Boolean))].slice(0, 3),
      );
      const engagements = await page.goto(`${baseUrl}/en/app/engagements`, { waitUntil: "networkidle" });
      const engLinks = await page.$$eval('a[href*="/app/engagements/"]', (as) =>
        [...new Set(as.map((a) => a.getAttribute("href")).filter(Boolean))].slice(0, 2),
      );

      const walkRoutes = [...appRoutes, ...links, ...engLinks];
      const workspaceSuffixes = [
        "/planning",
        "/planning/checklist",
        "/planning/documents",
        "/planning/history",
        "/materiality",
        "/risk-assessment",
        "/fieldwork",
        "/members",
        "/settings",
      ];

      for (const eng of engLinks) {
        for (const suffix of workspaceSuffixes) {
          walkRoutes.push(`${eng}${suffix}`);
        }
      }

      for (const route of [...new Set(walkRoutes)]) {
        for (const vp of viewports.slice(0, 2)) {
          await page.setViewportSize({ width: vp.width, height: vp.height });
          try {
            await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle", timeout: 45000 });
            await page.waitForTimeout(400);
            const safe = route.replace(/\//g, "_").slice(0, 80);
            await page.screenshot({
              path: path.join(outDir, `${vp.name}${safe}.png`),
              fullPage: true,
            });
            await checkPage(page, `${route}@${vp.name}`);
            console.log(`WALK OK ${route} ${vp.name}`);
          } catch (e) {
            issues.push({ page: route, type: "walk", error: String(e) });
          }
        }
      }
    }
  }

  fs.writeFileSync(path.join(outDir, "issues.json"), JSON.stringify(issues, null, 2));
  console.log(`Issues: ${issues.length} — see ${outDir}/issues.json`);
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
