/**
 * EPIRE Engine — executive inventory & readiness from EPBSE+EPAC+ECIE+EIIE.
 */
import { resolveEpireInputs, type ResolveInputsOptions } from "@/lib/platform-inventory/resolver";
import { buildInventoryCounts } from "@/lib/platform-inventory/inventory";
import { buildDomainInventory } from "@/lib/platform-inventory/domains";
import { buildModuleInventory } from "@/lib/platform-inventory/modules";
import { buildFeatureInventory } from "@/lib/platform-inventory/features";
import { buildCapabilityInventory } from "@/lib/platform-inventory/capabilities";
import { buildPlatformHealth } from "@/lib/platform-inventory/health";
import { buildDependencyView } from "@/lib/platform-inventory/graph";
import { overallPlatformCompletionFromVerifiedImplementation } from "@/lib/platform-inventory/completion";
import {
  classifyOverallReadiness,
  countModulesByReadiness,
} from "@/lib/platform-inventory/readiness";
import {
  scoreCapabilityBuckets,
  scoreFeatureBuckets,
} from "@/lib/platform-inventory/scoring";
import { buildAllInventoryReports } from "@/lib/platform-inventory/reporting";
import type { PlatformInventoryReport } from "@/lib/platform-inventory/types";
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type RunEpireOptions = ResolveInputsOptions & {
  persist?: boolean;
};

export function runPlatformInventory(options: RunEpireOptions = {}): PlatformInventoryReport {
  const cwd = options.cwd ?? process.cwd();
  const inputs = resolveEpireInputs({
    cwd,
    preferSnapshot: options.preferSnapshot,
    forceLive: options.forceLive,
    persistUpstream: options.persistUpstream,
  });

  const inventory = buildInventoryCounts(inputs);
  const modules = buildModuleInventory(inputs);
  const domains = buildDomainInventory(inputs, modules);
  const features = buildFeatureInventory(inputs);
  const capabilities = buildCapabilityInventory(inputs);
  const health = buildPlatformHealth(inputs);
  const dependency = buildDependencyView(inputs, modules);

  const overallPlatformReadinessPct =
    overallPlatformCompletionFromVerifiedImplementation(inputs);
  const enterpriseCertified =
    inputs.eiie.certification.enterpriseCertified &&
    inputs.ecie.certification.enterpriseCertified;
  const overallReadiness = classifyOverallReadiness(
    overallPlatformReadinessPct,
    enterpriseCertified,
  );
  const overallCertification = inputs.eiie.certification.level;

  const remainingWork = [
    ...inputs.eiie.repairPlan.items
      .slice(0, 40)
      .map((i) => `[${i.businessValue}] ${i.capabilityId}.${i.clause}`),
    ...inputs.ecie.roadmap.recommendedSprint
      .slice(0, 10)
      .map((r) => `[sprint] ${r.kind}:${r.id} — ${r.reason}`),
  ];

  const report: PlatformInventoryReport = {
    generatedAt: new Date().toISOString(),
    sources: inputs.sources,
    inventory,
    domains,
    modules,
    features,
    capabilities,
    health,
    dependency,
    overallPlatformReadinessPct,
    overallReadiness,
    overallCertification,
    enterpriseCertified,
    metrics: {
      ...countModulesByReadiness(modules),
      ...scoreCapabilityBuckets(capabilities),
      ...scoreFeatureBuckets(features),
      criticalPathLength: dependency.criticalPath.length,
    },
    remainingWork,
  };

  if (options.persist !== false) {
    persistPlatformInventoryReport(report, cwd);
  }

  return report;
}

export function persistPlatformInventoryReport(
  report: PlatformInventoryReport,
  cwd = process.cwd(),
) {
  const root = join(cwd, "src", "lib", "platform-inventory", "data");
  const snapshots = join(root, "snapshots");
  const reports = join(root, "reports");
  mkdirSync(snapshots, { recursive: true });
  mkdirSync(reports, { recursive: true });

  writeFileSync(join(snapshots, "latest.json"), JSON.stringify(report, null, 2), "utf8");

  const formatted = buildAllInventoryReports(report);
  writeFileSync(join(reports, "platform-inventory.md"), formatted.platformInventory, "utf8");
  writeFileSync(join(reports, "domain-readiness.md"), formatted.domainReadiness, "utf8");
  writeFileSync(join(reports, "module-readiness.md"), formatted.moduleReadiness, "utf8");
  writeFileSync(join(reports, "capability-inventory.md"), formatted.capabilityInventory, "utf8");
  writeFileSync(join(reports, "critical-path.md"), formatted.criticalPath, "utf8");
  writeFileSync(join(reports, "enterprise-readiness.md"), formatted.enterpriseReadiness, "utf8");
  writeFileSync(join(reports, "ai.md"), formatted.ai, "utf8");
  writeFileSync(join(reports, "database.md"), formatted.database, "utf8");
  writeFileSync(join(reports, "security.md"), formatted.security, "utf8");
  writeFileSync(join(reports, "devops.md"), formatted.devops, "utf8");
  writeFileSync(join(reports, "testing.md"), formatted.testing, "utf8");
  writeFileSync(join(reports, "localization.md"), formatted.localization, "utf8");
  writeFileSync(join(reports, "release-readiness.md"), formatted.releaseReadiness, "utf8");
}

export function loadLatestPlatformInventoryReport(
  cwd = process.cwd(),
): PlatformInventoryReport | null {
  const path = join(cwd, "src", "lib", "platform-inventory", "data", "snapshots", "latest.json");
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8")) as PlatformInventoryReport;
}

export class PlatformInventoryEngine {
  run(options: RunEpireOptions = {}) {
    return runPlatformInventory(options);
  }

  getDashboard(options: RunEpireOptions & { preferSnapshot?: boolean } = {}) {
    const cwd = options.cwd ?? process.cwd();
    if (options.preferSnapshot !== false) {
      const existing = loadLatestPlatformInventoryReport(cwd);
      if (existing) {
        return {
          generatedAt: existing.generatedAt,
          source: "snapshot" as const,
          report: existing,
        };
      }
    }
    const report = this.run({ ...options, persist: options.persist ?? true });
    return { generatedAt: report.generatedAt, source: "live" as const, report };
  }
}

export const platformInventoryEngine = new PlatformInventoryEngine();
