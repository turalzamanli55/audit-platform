/**
 * npm run bootstrap:platform
 *
 * Provisions and verifies the Enterprise SaaS Platform: the single Platform
 * Owner, platform roles, platform permissions, default plans, default license
 * templates, and default feature flags. Reads the owner password ONLY from
 * BOOTSTRAP_OWNER_PASSWORD in .env.local — never hardcoded, never committed.
 *
 * Bootstrap is disabled in production.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { platformBootstrapEngine } from "../src/lib/platform-bootstrap/engine";

function loadEnvLocal(): void {
  const candidates = [".env.local", ".env"];
  for (const file of candidates) {
    try {
      const contents = readFileSync(resolve(process.cwd(), file), "utf8");
      for (const rawLine of contents.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith("#")) continue;
        const eq = line.indexOf("=");
        if (eq === -1) continue;
        const key = line.slice(0, eq).trim();
        let value = line.slice(eq + 1).trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        if (!(key in process.env)) {
          process.env[key] = value;
        }
      }
    } catch {
      // File missing — rely on the ambient environment.
    }
  }
}

function line(char = "="): string {
  return char.repeat(52);
}

async function main(): Promise<void> {
  loadEnvLocal();

  const environment = process.env.NODE_ENV ?? "development";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const ownerPassword = process.env.BOOTSTRAP_OWNER_PASSWORD;

  console.log(line());
  console.log("ENTERPRISE PLATFORM BOOTSTRAP");
  console.log(line());
  console.log(`Environment: ${environment}`);

  if (environment === "production") {
    console.error("Production bootstrap is disabled. Aborting.");
    process.exit(1);
  }

  if (!url || !serviceRoleKey) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them to .env.local.",
    );
    process.exit(1);
  }

  const client = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const result = await platformBootstrapEngine.run(client, { ownerPassword, environment });

  console.log("");
  console.log("--- Bootstrap Steps ---");
  for (const step of result.steps) {
    console.log(`[${step.status.toUpperCase()}] ${step.label} — ${step.detail}`);
  }

  const report = await platformBootstrapEngine.validate(client);

  console.log("");
  console.log("--- Verification ---");
  for (const check of report.checks) {
    console.log(`${check.passed ? "PASS" : "FAIL"}  ${check.label} — ${check.detail}`);
  }

  console.log("");
  console.log(line());
  console.log(`Platform Owner: ${result.ownerEmail ?? "n/a"}`);
  console.log(`Bootstrap Completed: ${result.bootstrapCompleted ? "YES" : "NO"}`);
  console.log(`Bootstrap Status: ${report.systemReady ? "System Ready" : "Not Ready"}`);
  console.log(line());

  process.exit(report.systemReady ? 0 : 1);
}

void main();
