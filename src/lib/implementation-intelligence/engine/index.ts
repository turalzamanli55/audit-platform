/**
 * EIIE Engine — Implementation Contracts from PROJECT_BIBLE, verified against code.
 */
import { parseImplementationIntents } from "@/lib/implementation-intelligence/parser";
import { generateAllContracts } from "@/lib/implementation-intelligence/contracts-engine";
import { buildBlockedMap } from "@/lib/implementation-intelligence/dependency";
import { analyzeImplementationGaps } from "@/lib/implementation-intelligence/gap-analysis";
import { buildRepairPlan } from "@/lib/implementation-intelligence/repair-plan";
import {
  analyzeRepositories,
  analyzeServerActions,
  analyzeWorkflows,
  analyzePermissions,
  analyzeDatabase,
  analyzeTesting,
} from "@/lib/implementation-intelligence/analyzers";
import { scorePlatformFromContracts } from "@/lib/implementation-intelligence/scoring";
import { certifyImplementations } from "@/lib/implementation-intelligence/certification";
import { buildImplementationGraph } from "@/lib/implementation-intelligence/graph";
import { loadEvidenceReport } from "@/lib/capability-intelligence/evidence";
import type {
  AiReadinessPackage,
  ImplementationIntelligenceReport,
} from "@/lib/implementation-intelligence/types";
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { buildAllImplementationReports } from "@/lib/implementation-intelligence/reporting";

export type RunEiieOptions = {
  cwd?: string;
  persist?: boolean;
};

export function runImplementationIntelligence(
  options: RunEiieOptions = {},
): ImplementationIntelligenceReport {
  const cwd = options.cwd ?? process.cwd();
  const { intents } = parseImplementationIntents(cwd);
  const evidence = loadEvidenceReport(cwd);

  // Pass 1 — contracts without blocking
  let contracts = generateAllContracts(intents, cwd, {}, evidence);
  const blockedMap = buildBlockedMap(intents, contracts);

  // Pass 2 — re-verify with blocked status
  if (Object.keys(blockedMap).length > 0) {
    contracts = generateAllContracts(intents, cwd, blockedMap, evidence);
  }

  const gaps = analyzeImplementationGaps(contracts);
  const repairPlan = buildRepairPlan(contracts, gaps);
  const repository = analyzeRepositories(cwd, contracts);
  const serverActions = analyzeServerActions(cwd, contracts);
  const workflow = analyzeWorkflows(cwd, contracts);
  const permissions = analyzePermissions(cwd, contracts);
  const database = analyzeDatabase(cwd, contracts);
  const testing = analyzeTesting(cwd, contracts);
  const certification = certifyImplementations(contracts);
  const graph = buildImplementationGraph({ contracts, gaps, repairPlan });
  const platformCompletionPct = scorePlatformFromContracts(contracts);

  const aiReadiness: AiReadinessPackage = {
    schema: "eiie.ai-readiness.v1",
    generatedAt: new Date().toISOString(),
    contracts: contracts.map((c) => c.agentPayload),
    repairPlan,
    notes: [
      "Machine-readable implementation contracts for Enterprise Multi-Agent System",
      "Agents must execute repairSteps without manually interpreting PROJECT_BIBLE",
      "Acceptance criteria are embedded per clause",
      "Partial contracts are never certified",
    ],
  };

  const report: ImplementationIntelligenceReport = {
    generatedAt: new Date().toISOString(),
    contracts,
    gaps,
    repairPlan,
    repository,
    serverActions,
    workflow,
    permissions,
    database,
    testing,
    certification,
    aiReadiness,
    graph,
    platformCompletionPct,
    metrics: {
      contracts: contracts.length,
      satisfied: contracts.filter((c) => c.contractSatisfied).length,
      certified: contracts.filter((c) => c.certified).length,
      gaps: gaps.length,
      repairItems: repairPlan.items.length,
      blocked: contracts.filter((c) => c.blocked).length,
    },
  };

  if (options.persist !== false) {
    persistImplementationReport(report, cwd);
  }

  return report;
}

export function persistImplementationReport(
  report: ImplementationIntelligenceReport,
  cwd = process.cwd(),
) {
  const root = join(cwd, "src", "lib", "implementation-intelligence", "data");
  const snapshots = join(root, "snapshots");
  const reports = join(root, "reports");
  mkdirSync(snapshots, { recursive: true });
  mkdirSync(reports, { recursive: true });

  writeFileSync(join(snapshots, "latest.json"), JSON.stringify(report, null, 2), "utf8");
  writeFileSync(
    join(snapshots, "ai-readiness.json"),
    JSON.stringify(report.aiReadiness, null, 2),
    "utf8",
  );

  const formatted = buildAllImplementationReports(report);
  writeFileSync(join(reports, "implementation-contracts.md"), formatted.contracts, "utf8");
  writeFileSync(join(reports, "implementation-gaps.md"), formatted.gaps, "utf8");
  writeFileSync(join(reports, "repositories.md"), formatted.repositories, "utf8");
  writeFileSync(join(reports, "server-actions.md"), formatted.serverActions, "utf8");
  writeFileSync(join(reports, "workflows.md"), formatted.workflows, "utf8");
  writeFileSync(join(reports, "permissions.md"), formatted.permissions, "utf8");
  writeFileSync(join(reports, "database.md"), formatted.database, "utf8");
  writeFileSync(join(reports, "testing.md"), formatted.testing, "utf8");
  writeFileSync(join(reports, "repair-plan.md"), formatted.repairPlan, "utf8");
  writeFileSync(join(reports, "certification.md"), formatted.certification, "utf8");
  writeFileSync(join(reports, "ai-readiness.md"), formatted.aiReadiness, "utf8");
}

export function loadLatestImplementationReport(
  cwd = process.cwd(),
): ImplementationIntelligenceReport | null {
  const path = join(
    cwd,
    "src",
    "lib",
    "implementation-intelligence",
    "data",
    "snapshots",
    "latest.json",
  );
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8")) as ImplementationIntelligenceReport;
}

export class ImplementationIntelligenceEngine {
  run(options: RunEiieOptions = {}) {
    return runImplementationIntelligence(options);
  }

  getDashboard(options: RunEiieOptions & { preferSnapshot?: boolean } = {}) {
    const cwd = options.cwd ?? process.cwd();
    if (options.preferSnapshot !== false) {
      const existing = loadLatestImplementationReport(cwd);
      if (existing) {
        return { generatedAt: existing.generatedAt, source: "snapshot" as const, report: existing };
      }
    }
    const report = this.run({ ...options, persist: options.persist ?? true });
    return { generatedAt: report.generatedAt, source: "live" as const, report };
  }
}

export const implementationIntelligenceEngine = new ImplementationIntelligenceEngine();
