#!/usr/bin/env npx tsx
import { devopsEngine } from "../src/lib/devops/engine/index";
import { formatDashboardSummary } from "../src/lib/devops/dashboard/index";
import { formatPipelineReport } from "../src/lib/devops/pipeline/index";
import { formatFullDevOpsReport } from "../src/lib/devops/reports/index";

const { ok, dashboard } = devopsEngine.validateRelease();
console.log(formatDashboardSummary(dashboard));
console.log("");
console.log(formatPipelineReport(dashboard.pipeline));
console.log("");
console.log(formatFullDevOpsReport(dashboard));
console.log("");
console.log(`EDRP module completion: ${devopsEngine.getEdRPCompletion() ?? "n/a"}%`);
console.log(`Platform completion: ${devopsEngine.getPlatformCompletion()}%`);
process.exit(ok ? 0 : 1);
