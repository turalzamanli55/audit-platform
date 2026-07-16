import { implementationIntelligenceEngine } from "../src/lib/implementation-intelligence/engine";
import { buildAllImplementationReports } from "../src/lib/implementation-intelligence/reporting";

const report = implementationIntelligenceEngine.run({ persist: true });
const reports = buildAllImplementationReports(report);

console.log("=== EIIE Implementation Intelligence ===");
console.log(`Platform Completion (verified contracts): ${report.platformCompletionPct}%`);
console.log(`Certification: ${report.certification.level}`);
console.log(
  `Contracts certified=${report.metrics.certified}/${report.metrics.contracts} gaps=${report.metrics.gaps} repairs=${report.metrics.repairItems}`,
);
console.log("");
console.log(reports.contracts.split("\n").slice(0, 40).join("\n"));
console.log("");
console.log(reports.gaps.split("\n").slice(0, 35).join("\n"));
console.log("");
console.log(reports.repositories);
console.log("");
console.log(reports.serverActions);
console.log("");
console.log(reports.workflows);
console.log("");
console.log(reports.permissions);
console.log("");
console.log(reports.database);
console.log("");
console.log(reports.testing);
console.log("");
console.log(reports.repairPlan.split("\n").slice(0, 45).join("\n"));
console.log("");
console.log(reports.certification);
console.log("");
console.log(reports.aiReadiness);
console.log("");
console.log("--- Remaining Work (repair queue top 20) ---");
for (const item of report.repairPlan.items.slice(0, 20)) {
  console.log(`- ${item.order}. [${item.businessValue}] ${item.capabilityId}.${item.clause}`);
}
