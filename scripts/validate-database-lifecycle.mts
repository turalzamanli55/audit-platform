#!/usr/bin/env npx tsx
import {
  buildDatabaseLifecycleReport,
  formatDatabaseLifecycleReport,
} from "../src/lib/database-governance/continuous-validation";
import {
  formatGovernanceSummary,
  formatHealthReport,
} from "../src/lib/database-governance/reporting";

const report = buildDatabaseLifecycleReport();
console.log(formatDatabaseLifecycleReport(report));
console.log("");
console.log(formatGovernanceSummary(report.continuousValidation.governance));
console.log("");
console.log(formatHealthReport(report.continuousValidation.governance.health));
process.exit(report.acceptanceCriteria.ok ? 0 : 1);
