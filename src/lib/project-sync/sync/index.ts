import { loadAllGovernanceDocuments } from "@/lib/project-sync/documents";
import { parseDocuments } from "@/lib/project-sync/parser";
import { extractDomains } from "@/lib/project-sync/domains";
import { extractModules, inferModuleDependencies } from "@/lib/project-sync/modules";
import { extractCapabilities, extractFeatures } from "@/lib/project-sync/features";
import { extractCapabilityDependencies } from "@/lib/project-sync/dependencies";
import { extractRequirements } from "@/lib/project-sync/requirements";
import { extractArchitectureNotes } from "@/lib/project-sync/architecture";
import { extractImplementationNotes } from "@/lib/project-sync/implementation";
import { extractDesignNotes } from "@/lib/project-sync/design";
import { scanCodebase } from "@/lib/project-sync/scanner";
import { attachEvidence } from "@/lib/project-sync/evidence";
import { diffSynchronization } from "@/lib/project-sync/diff";
import {
  identitiesFromSnapshot,
  ensureIdentity,
} from "@/lib/project-sync/snapshots/identity";
import { loadLatestSnapshot, writeSnapshot } from "@/lib/project-sync/snapshots";
import { appendSyncHistory, buildSyncRunReport } from "@/lib/project-sync/history";
import { validateSynchronization } from "@/lib/project-sync/validation";
import { calculatePlatformHealth } from "@/lib/project-sync/health";
import { analyzeTechnicalDebt } from "@/lib/project-sync/technical-debt";
import { buildSyncRoadmap } from "@/lib/project-sync/roadmap";
import type {
  GovernanceDocumentId,
  SyncRunReport,
  SyncSnapshot,
} from "@/lib/project-sync/types";
import { average, nowIso } from "@/lib/project-sync/utils";

export type SynchronizationResult = {
  snapshot: SyncSnapshot;
  report: SyncRunReport;
  architectureNotes: ReturnType<typeof extractArchitectureNotes>;
  implementationNotes: ReturnType<typeof extractImplementationNotes>;
  designNotes: ReturnType<typeof extractDesignNotes>;
  roadmap: ReturnType<typeof buildSyncRoadmap>;
};

/**
 * Synchronization Engine
 * Documentation → extract → evidence discovery → incremental sync → registries.
 * Never writes documentation. Never invents completion percentages.
 */
export function synchronizeFromProjectBible(input?: {
  cwd?: string;
  persist?: boolean;
}): SynchronizationResult {
  const cwd = input?.cwd ?? process.cwd();
  const persist = input?.persist ?? true;

  const previous = loadLatestSnapshot(cwd);
  const documents = loadAllGovernanceDocuments(cwd);
  const parsed = parseDocuments(documents);

  let identities = identitiesFromSnapshot(previous);
  let domains = extractDomains(parsed);
  domains = domains.map((domain) => {
    const ensured = ensureIdentity(identities, "domain", domain.name, domain.id);
    identities = ensured.identities;
    return { ...domain, id: ensured.id };
  });

  let modules = inferModuleDependencies(extractModules(parsed, domains));
  modules = modules.map((module) => {
    const ensured = ensureIdentity(identities, "module", module.name, module.id);
    identities = ensured.identities;
    return { ...module, id: ensured.id };
  });

  let capabilities = extractCapabilityDependencies(extractCapabilities(parsed, modules), modules);
  capabilities = capabilities.map((capability) => {
    const ensured = ensureIdentity(identities, "capability", capability.name, capability.id);
    identities = ensured.identities;
    return { ...capability, id: ensured.id };
  });

  // Rebuild features after immutable capability IDs are finalized.
  let features = extractFeatures(capabilities, modules);
  features = features.map((feature) => {
    const ensured = ensureIdentity(identities, "feature", feature.name, feature.id);
    identities = ensured.identities;
    return { ...feature, id: ensured.id };
  });

  const featureByCapability = new Map<string, string>();
  for (const feature of features) {
    for (const capabilityId of feature.capabilityIds) {
      featureByCapability.set(capabilityId, feature.id);
    }
  }
  capabilities = capabilities.map((capability) => ({
    ...capability,
    featureId: featureByCapability.get(capability.id) ?? capability.featureId,
  }));
  const requirements = extractRequirements(parsed, capabilities).map((requirement) => {
    const ensured = ensureIdentity(identities, "requirement", requirement.name, requirement.id);
    identities = ensured.identities;
    return { ...requirement, id: ensured.id };
  });

  const evidenceIndex = scanCodebase(cwd);
  const synchronizedCapabilities = attachEvidence(capabilities, evidenceIndex);
  const health = calculatePlatformHealth(synchronizedCapabilities);
  const debt = analyzeTechnicalDebt(evidenceIndex, synchronizedCapabilities);
  const roadmap = buildSyncRoadmap(synchronizedCapabilities);
  const validation = validateSynchronization({
    domains,
    modules,
    features,
    capabilities: synchronizedCapabilities,
  });

  const documentVersions = Object.fromEntries(
    documents.map((document) => [
      document.id,
      { path: document.path, hash: document.hash, bytes: document.bytes },
    ]),
  ) as SyncSnapshot["documentVersions"];

  const snapshotId = `sync_${Date.now()}`;
  const snapshot: SyncSnapshot = {
    id: snapshotId,
    timestamp: nowIso(),
    documentVersions,
    identities,
    domains,
    modules,
    features,
    capabilities: synchronizedCapabilities,
    requirements,
    evidenceIndex,
    platformCompletionPct: average(
      synchronizedCapabilities.map((capability) => capability.completionPct),
    ),
    architectureHealthPct: health.architecture,
    implementationHealthPct: health.implementation,
    documentationCoveragePct: health.documentation,
    testingCoveragePct: health.testing,
    localizationCoveragePct: health.localization,
    securityCoveragePct: health.security,
    performanceCoveragePct: health.performance,
    integrationCoveragePct: health.integration,
    technicalDebtScore: health.technicalDebt,
  };

  const diff = diffSynchronization({
    previous: previous
      ? {
          domains: previous.domains,
          modules: previous.modules,
          features: previous.features,
          capabilities: previous.capabilities,
        }
      : null,
    next: {
      domains,
      modules,
      features,
      capabilities: synchronizedCapabilities,
    },
  });

  const report = buildSyncRunReport({
    snapshot,
    previousSnapshotId: previous?.id ?? null,
    diff,
    validation,
    technicalDebt: {
      todos: debt.todos,
      fixmes: debt.fixmes,
      placeholders: debt.placeholders,
      missingTests: debt.missingTests,
      missingLocalization: debt.missingLocalization,
      missingPermissions: debt.missingPermissions,
      architectureViolations: debt.architectureViolations,
    },
    roadmap: {
      completed: roadmap.lanes.completed.length,
      inProgress: roadmap.lanes.in_progress.length,
      blocked: roadmap.lanes.blocked.length,
      planned: roadmap.lanes.planned.length,
      future: roadmap.lanes.future.length,
    },
  });

  if (persist) {
    writeSnapshot(snapshot, cwd);
    appendSyncHistory(report, cwd);
  }

  return {
    snapshot,
    report,
    architectureNotes: extractArchitectureNotes(parsed),
    implementationNotes: extractImplementationNotes(parsed),
    designNotes: extractDesignNotes(parsed),
    roadmap,
  };
}

export function getDocumentAuthorityOrder(): GovernanceDocumentId[] {
  return [
    "PROJECT_BIBLE",
    "MASTER_PRD",
    "SYSTEM_ARCHITECTURE",
    "IMPLEMENTATION_STANDARD",
    "MASTER_IMPLEMENTATION_TEMPLATE",
    "DESIGN_SYSTEM",
  ];
}

/**
 * Synchronization completion — integrity of the bible→registry sync pipeline.
 * Derived from sync outputs only (never hardcoded).
 */
export function calculateSynchronizationCompletion(input: {
  snapshot: SyncSnapshot;
  report: SyncRunReport;
}): number {
  const checks = [
    input.report.validation.ok,
    input.snapshot.domains.length > 0,
    input.snapshot.modules.length > 0,
    input.snapshot.features.length > 0,
    input.snapshot.capabilities.length > 0,
    input.snapshot.identities.length > 0,
    Boolean(input.snapshot.evidenceIndex.scannedAt),
    Object.keys(input.snapshot.documentVersions).length === 6,
    input.snapshot.capabilities.every((capability) => capability.sourceDocument.length > 0),
    input.snapshot.capabilities.every((capability) => typeof capability.completionPct === "number"),
  ];
  return average(checks.map((check) => (check ? 100 : 0)));
}
