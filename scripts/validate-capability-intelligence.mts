import { capabilityIntelligenceEngine } from "../src/lib/capability-intelligence/engine";
import { buildAllIntelligenceReports } from "../src/lib/capability-intelligence/reporting";

const report = capabilityIntelligenceEngine.run({ persist: true });
const reports = buildAllIntelligenceReports(report);

console.log("=== ECIE Capability Intelligence ===");
console.log(`Platform Completion (required verified): ${report.platformCompletionPct}%`);
console.log(`Certification: ${report.certification.level}`);
console.log(`Enterprise Certified: ${report.certification.enterpriseCertified}`);
console.log(
  `Metrics: total=${report.metrics.total} required=${report.metrics.required} optional=${report.metrics.optional} future=${report.metrics.future} blocked=${report.metrics.blocked}`,
);
console.log("");
console.log(reports.intelligence);
console.log("");
console.log(reports.classification.split("\n").slice(0, 40).join("\n"));
console.log("");
console.log(reports.dependencies.split("\n").slice(0, 40).join("\n"));
console.log("");
console.log(reports.roadmap.split("\n").slice(0, 50).join("\n"));
console.log("");
console.log(reports.certification);
console.log("");
console.log("--- Remaining Work (recommended sprint) ---");
for (const item of report.roadmap.recommendedSprint.slice(0, 20)) {
  console.log(`- [${item.weight}] ${item.id}: ${item.reason}`);
}
