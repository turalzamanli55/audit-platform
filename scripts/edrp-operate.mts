#!/usr/bin/env npx tsx
/**
 * EDRP single-command operational release.
 * Usage:
 *   npx tsx scripts/edrp-operate.mts
 *   npx tsx scripts/edrp-operate.mts --skip-reset
 *   npx tsx scripts/edrp-operate.mts --no-build
 */
import { devopsEngine } from "../src/lib/devops/engine/index.ts";
import { formatOperationalReport } from "../src/lib/devops/operations/index.ts";
import { formatDashboardSummary } from "../src/lib/devops/dashboard/index.ts";
import { ensureCiCdBlueprints } from "../src/lib/devops/ci/generators.ts";

const args = new Set(process.argv.slice(2));
const skipReset = args.has("--skip-reset");
const noBuild = args.has("--no-build");
const noTests = args.has("--no-tests");

ensureCiCdBlueprints();

const report = devopsEngine.operate({
  skipReset,
  runBuild: !noBuild,
  runUnitTests: !noTests,
  runIntegrationTests: !noTests,
  persist: true,
});

console.log(formatOperationalReport(report));
console.log("");
console.log(formatDashboardSummary(report.dashboard));
console.log("");
console.log(`EDRP module completion: ${devopsEngine.getEdRPCompletion() ?? "n/a"}%`);
console.log(`Platform completion: ${devopsEngine.getPlatformCompletion()}%`);
console.log(`CI/CD blueprints: ${devopsEngine.getCiCdStatus().filter((c) => c.present).length}/4`);

process.exit(report.ok ? 0 : 1);
