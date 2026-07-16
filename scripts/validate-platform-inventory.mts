import { platformInventoryEngine } from "../src/lib/platform-inventory/engine";
import { buildAllInventoryReports } from "../src/lib/platform-inventory/reporting";

const report = platformInventoryEngine.run({
  persist: true,
  preferSnapshot: true,
});
const reports = buildAllInventoryReports(report);

console.log("=== EPIRE Platform Inventory & Readiness ===");
console.log(
  `Overall Platform Readiness (verified implementation): ${report.overallPlatformReadinessPct}%`,
);
console.log(`Readiness: ${report.overallReadiness}`);
console.log(`Certification: ${report.overallCertification}`);
console.log(
  `Enterprise Certified: ${report.enterpriseCertified ? "YES" : "NO"}`,
);
console.log(
  `Sources: EPBSE=${report.sources.epbse} EPAC=${report.sources.epac} ECIE=${report.sources.ecie} EIIE=${report.sources.eiie}`,
);
console.log(
  `Inventory: domains=${report.inventory.domains} modules=${report.inventory.modules} features=${report.inventory.features} capabilities=${report.inventory.capabilities}`,
);
console.log("");
console.log(reports.platformInventory);
console.log("");
console.log(reports.domainReadiness);
console.log("");
console.log(reports.moduleReadiness.split("\n").slice(0, 80).join("\n"));
console.log("");
console.log(reports.capabilityInventory.split("\n").slice(0, 50).join("\n"));
console.log("");
console.log(reports.criticalPath);
console.log("");
console.log(reports.enterpriseReadiness);
console.log("");
console.log("--- Remaining Work (top 20) ---");
for (const [i, item] of report.remainingWork.slice(0, 20).entries()) {
  console.log(`${i + 1}. ${item}`);
}
