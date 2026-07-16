import { platformAuditEngine } from "../src/lib/platform-audit/engine";
import { buildAllReports } from "../src/lib/platform-audit/reporting";

const report = platformAuditEngine.run({ persist: true });
const reports = buildAllReports(report);

console.log("=== EPAC Platform Audit v2 ===");
console.log(`Overall Completion (verified): ${report.overallCompletionPct}%`);
console.log(`Verified Completion: ${report.verifiedCompletionPct}%`);
console.log(`Evidence Confidence: ${report.evidenceConfidencePct}%`);
console.log(`Certification: ${report.certification}`);
console.log(`Enterprise Certified: ${report.enterpriseCertified}`);
console.log(
  `Evidence scan: files=${report.evidenceResolution.filesScanned} symbols=${report.evidenceResolution.symbolsScanned} imports=${report.evidenceResolution.importEdges}`,
);
console.log(`False positives corrected: ${report.falsePositives.length}`);
console.log("");
console.log(reports.evidenceResolution);
console.log("");
console.log("--- Module Resolution (sample) ---");
for (const line of reports.moduleResolution.split("\n").slice(0, 25)) {
  console.log(line);
}
console.log("");
console.log("--- AI Resolution ---");
console.log(reports.aiResolution);
console.log("");
console.log("--- Certification ---");
console.log(reports.certification);
console.log("");
console.log("--- Remaining Work (first 25) ---");
for (const item of report.remainingWork.slice(0, 25)) {
  console.log(`- ${item}`);
}
