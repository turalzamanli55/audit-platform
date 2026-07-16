/**
 * ECIE Engine — understand capability intent, score required verified evidence only.
 */
import { parseCapabilitiesFromBible } from "@/lib/capability-intelligence/parser";
import { classifyCapability, primaryClass } from "@/lib/capability-intelligence/classification";
import { assignImplementationPhase } from "@/lib/capability-intelligence/phases";
import { assignBusinessWeight, weightNumeric } from "@/lib/capability-intelligence/weights";
import { defineRequiredEvidence } from "@/lib/capability-intelligence/requirements";
import {
  loadEvidenceReport,
  satisfyEvidenceRequirements,
} from "@/lib/capability-intelligence/evidence";
import {
  scoreRequiredCompletion,
  countsTowardCompletion,
  blocksCertification,
} from "@/lib/capability-intelligence/scoring";
import { deriveLifecycle } from "@/lib/capability-intelligence/lifecycle";
import { buildDependencyIntelligence } from "@/lib/capability-intelligence/dependencies";
import { detectFalsePenalties } from "@/lib/capability-intelligence/optionality";
import { buildIntelligentModules } from "@/lib/capability-intelligence/modules";
import { buildIntelligentDomains } from "@/lib/capability-intelligence/domains";
import { buildRoadmapIntelligence } from "@/lib/capability-intelligence/roadmap";
import { buildCertificationIntelligence } from "@/lib/capability-intelligence/certification";
import { buildCapabilityGraph } from "@/lib/capability-intelligence/graph";
import { validateIntelligenceReport } from "@/lib/capability-intelligence/validation";
import { explainRule } from "@/lib/capability-intelligence/rules";
import type {
  CapabilityIntelligenceReport,
  IntelligentCapability,
} from "@/lib/capability-intelligence/types";
import { averageWeighted } from "@/lib/capability-intelligence/types";
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { buildAllIntelligenceReports } from "@/lib/capability-intelligence/reporting";

export type RunEcieOptions = {
  cwd?: string;
  persist?: boolean;
};

export function runCapabilityIntelligence(
  options: RunEcieOptions = {},
): CapabilityIntelligenceReport {
  const cwd = options.cwd ?? process.cwd();
  const parsed = parseCapabilitiesFromBible(cwd);
  const evidenceReport = loadEvidenceReport(cwd);

  // First pass: classify + requirements + evidence (without blocking)
  let capabilities: IntelligentCapability[] = parsed.capabilities.map((capability) => {
    const classes = classifyCapability(capability);
    const phase = assignImplementationPhase(capability, classes);
    const weight = assignBusinessWeight(capability, classes);
    const requiredEvidence = defineRequiredEvidence(capability, classes, phase);
    const evidence = satisfyEvidenceRequirements(
      capability.id,
      capability.moduleId,
      requiredEvidence,
      evidenceReport,
    );
    const requiredCompletionPct = scoreRequiredCompletion(evidence);
    const counts = countsTowardCompletion({
      classes,
      phase,
      blocked: false,
    });
    const lifecycle = deriveLifecycle({
      phase,
      requiredEvidence: evidence,
      blocked: false,
    });

    return {
      id: capability.id,
      name: capability.name,
      description: capability.description,
      purpose: capability.purpose,
      moduleId: capability.moduleId,
      domainId: capability.domainId,
      featureId: capability.featureId,
      classes,
      primaryClass: primaryClass(classes),
      phase,
      weight,
      weightNumeric: weightNumeric(weight),
      lifecycle,
      dependencies: capability.dependencies,
      blockedBy: [],
      requiredEvidence,
      evidence,
      requiredCompletionPct,
      countsTowardCompletion: counts,
      blocksCertification: blocksCertification({
        classes,
        phase,
        countsTowardCompletion: counts,
      }),
      falsePenalty: false,
      falsePenaltyReason: null,
      explainability: [
        explainRule("sourceOfTruth"),
        `classes=${classes.join(",")}`,
        `phase=${phase}`,
        `weight=${weight}`,
        `requiredEvidence=${requiredEvidence.map((r) => r.kind).join(",")}`,
        `requiredCompletion=${requiredCompletionPct}%`,
      ],
    };
  });

  // Dependency pass
  const dependencies = buildDependencyIntelligence(parsed.capabilities, capabilities);
  capabilities = capabilities.map((capability) => {
    const blockedBy = dependencies.blockingReasons[capability.id] ?? [];
    const blocked = blockedBy.length > 0;
    const counts = countsTowardCompletion({
      classes: capability.classes,
      phase: capability.phase,
      blocked,
    });
    const lifecycle = deriveLifecycle({
      phase: capability.phase,
      requiredEvidence: capability.evidence,
      blocked,
    });
    return {
      ...capability,
      blockedBy,
      lifecycle,
      countsTowardCompletion: counts,
      blocksCertification: blocksCertification({
        classes: capability.classes,
        phase: capability.phase,
        countsTowardCompletion: counts,
      }),
      falsePenalty: blocked || capability.phase === "future" || capability.classes.includes("optional"),
      falsePenaltyReason: blocked
        ? `Blocked by: ${blockedBy.join("; ")}`
        : capability.phase === "future"
          ? "Future-scoped"
          : capability.classes.includes("optional")
            ? "Optional-scoped"
            : null,
      explainability: [
        ...capability.explainability,
        blocked ? `blockedBy=${blockedBy.join("|")}` : "unblocked",
      ],
    };
  });

  const falsePenalties = detectFalsePenalties(capabilities);
  const modules = buildIntelligentModules(parsed.modules, capabilities);
  const domains = buildIntelligentDomains(parsed.domains, modules);
  const roadmap = buildRoadmapIntelligence(modules, capabilities, dependencies);
  const certification = buildCertificationIntelligence(capabilities);
  const graph = buildCapabilityGraph({ domains, modules, capabilities, certification });

  const counted = capabilities.filter((c) => c.countsTowardCompletion);
  const platformCompletionPct =
    counted.length === 0
      ? 100
      : averageWeighted(
          counted.map((c) => ({
            value: c.requiredCompletionPct,
            weight: c.weightNumeric,
          })),
        );

  const report: CapabilityIntelligenceReport = {
    generatedAt: new Date().toISOString(),
    capabilities,
    modules,
    domains,
    dependencies,
    roadmap,
    falsePenalties,
    certification,
    graph,
    platformCompletionPct,
    metrics: {
      total: capabilities.length,
      required: capabilities.filter((c) => c.classes.includes("required")).length,
      optional: capabilities.filter((c) => c.classes.includes("optional")).length,
      future: capabilities.filter((c) => c.phase === "future").length,
      blocked: capabilities.filter((c) => c.lifecycle === "blocked").length,
      certified: capabilities.filter((c) => c.lifecycle === "certified").length,
      verified: capabilities.filter((c) => c.lifecycle === "verified").length,
      inProgress: capabilities.filter((c) => c.lifecycle === "in_progress").length,
      notStarted: capabilities.filter((c) => c.lifecycle === "not_started").length,
    },
  };

  const validation = validateIntelligenceReport(report);
  if (!validation.ok) {
    throw new Error(`ECIE validation failed: ${validation.errors.join("; ")}`);
  }

  if (options.persist !== false) {
    persistIntelligenceReport(report, cwd);
  }

  return report;
}

export function persistIntelligenceReport(
  report: CapabilityIntelligenceReport,
  cwd = process.cwd(),
) {
  const root = join(cwd, "src", "lib", "capability-intelligence", "data");
  const snapshots = join(root, "snapshots");
  const reports = join(root, "reports");
  mkdirSync(snapshots, { recursive: true });
  mkdirSync(reports, { recursive: true });

  writeFileSync(join(snapshots, "latest.json"), JSON.stringify(report, null, 2), "utf8");
  const formatted = buildAllIntelligenceReports(report);
  writeFileSync(join(reports, "capability-intelligence.md"), formatted.intelligence, "utf8");
  writeFileSync(join(reports, "classification.md"), formatted.classification, "utf8");
  writeFileSync(join(reports, "dependencies.md"), formatted.dependencies, "utf8");
  writeFileSync(join(reports, "roadmap.md"), formatted.roadmap, "utf8");
  writeFileSync(join(reports, "certification.md"), formatted.certification, "utf8");
}

export function loadLatestIntelligenceReport(
  cwd = process.cwd(),
): CapabilityIntelligenceReport | null {
  const path = join(
    cwd,
    "src",
    "lib",
    "capability-intelligence",
    "data",
    "snapshots",
    "latest.json",
  );
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8")) as CapabilityIntelligenceReport;
}

export class CapabilityIntelligenceEngine {
  run(options: RunEcieOptions = {}) {
    return runCapabilityIntelligence(options);
  }

  getDashboard(options: RunEcieOptions & { preferSnapshot?: boolean } = {}) {
    const cwd = options.cwd ?? process.cwd();
    if (options.preferSnapshot !== false) {
      const existing = loadLatestIntelligenceReport(cwd);
      if (existing) {
        return { generatedAt: existing.generatedAt, source: "snapshot" as const, report: existing };
      }
    }
    const report = this.run({ ...options, persist: options.persist ?? true });
    return { generatedAt: report.generatedAt, source: "live" as const, report };
  }
}

export const capabilityIntelligenceEngine = new CapabilityIntelligenceEngine();
