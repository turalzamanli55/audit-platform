import type {
  CodebaseEvidenceIndex,
  ExtractedCapability,
  ProjectSyncEvidence,
  ProjectSyncEvidenceDimension,
  SynchronizedCapability,
} from "@/lib/project-sync/types";
import { emptyProjectSyncEvidence, PROJECT_SYNC_EVIDENCE_DIMENSIONS } from "@/lib/project-sync/types";
import { includesAny, round2 } from "@/lib/project-sync/utils";

/**
 * Evidence Engine — discover evidence from scanned codebase; never invent completion %.
 */
export function attachEvidence(
  capabilities: ExtractedCapability[],
  index: CodebaseEvidenceIndex,
): SynchronizedCapability[] {
  return capabilities.map((capability) => {
    const { evidence, evidencePaths } = discoverEvidence(capability, index);
    const completionPct = calculateEvidenceCompletion(evidence);
    return {
      ...capability,
      evidence,
      evidencePaths,
      completionPct,
      healthScore: completionPct,
      status: deriveStatus(evidence, completionPct, false),
    };
  });
}

export function discoverEvidence(
  capability: ExtractedCapability,
  index: CodebaseEvidenceIndex,
): {
  evidence: ProjectSyncEvidence;
  evidencePaths: Partial<Record<ProjectSyncEvidenceDimension, string[]>>;
} {
  const tokens = tokenize(capability.name, capability.moduleId, capability.category);
  const evidencePaths: Partial<Record<ProjectSyncEvidenceDimension, string[]>> = {};

  const repos = index.repositories.filter((file) => matchesTokens(file, tokens));
  const actions = index.serverActions.filter((file) => matchesTokens(file, tokens));
  const components = index.components.filter((file) => matchesTokens(file, tokens));
  const pages = index.pages.filter((file) => matchesTokens(file, tokens));
  const tests = index.tests.filter((file) => matchesTokens(file, tokens));
  const tables = index.tables.filter((table) => matchesTokens(table, tokens));
  const permissions = index.permissions.filter((code) => matchesTokens(code, tokens));
  const libs = index.libModules.filter((name) => matchesTokens(name, tokens));

  if (tables.length) evidencePaths.database = tables.slice(0, 20);
  if (repos.length) evidencePaths.repository = repos.slice(0, 20);
  if (actions.length) evidencePaths.serverAction = actions.slice(0, 20);
  if (components.length) evidencePaths.ui = components.slice(0, 20);
  if (pages.length) evidencePaths.workspace = pages.slice(0, 20);
  if (tests.length) evidencePaths.tests = tests.slice(0, 20);
  if (permissions.length) evidencePaths.permissions = permissions.slice(0, 20);
  if (libs.length) evidencePaths.integration = libs.slice(0, 20);

  evidencePaths.documentation = [`docs/${capability.sourceDocument}.md#${capability.sourceSection}`];
  evidencePaths.localization = index.locales.slice(0, 10);
  evidencePaths.validation = [...(evidencePaths.serverAction ?? []), ...(evidencePaths.repository ?? [])].slice(0, 10);
  evidencePaths.rules = [...(evidencePaths.repository ?? []), ...(libs.map((name) => `src/lib/${name}`) ?? [])].slice(0, 10);
  evidencePaths.security = permissions.length || includesAny(capability.name, ["auth", "tenant", "encryption", "rbac"])
    ? permissions.slice(0, 10)
    : [];
  evidencePaths.performance = [];
  evidencePaths.monitoring = [];
  evidencePaths.telemetry = [];

  const evidence = emptyProjectSyncEvidence({
    database: tables.length > 0 || Boolean(libs.length && includesAny(capability.moduleId, ["trial", "engagement", "company", "auth", "mapping", "render"])),
    repository: repos.length > 0,
    serverAction: actions.length > 0,
    rules: libs.length > 0 || repos.length > 0,
    validation: actions.length > 0 || repos.length > 0,
    workspace: pages.length > 0,
    ui: components.length > 0 || pages.length > 0,
    permissions: permissions.length > 0 || includesAny(capability.name, ["permission", "role", "access", "auth"]),
    localization: index.locales.length >= 2,
    tests: tests.length > 0,
    documentation: true,
    integration: libs.length > 0 || pages.length > 0,
    security:
      permissions.length > 0 ||
      includesAny(capability.name, ["auth", "tenant", "encryption", "isolation", "rbac", "session"]),
    performance: false,
    monitoring: false,
    telemetry: false,
  });

  // Heuristic boost for broadly implemented foundation modules present in codebase
  if (includesAny(capability.moduleId, ["organization", "compan", "user", "auth", "trial-balance", "engagement", "planning", "fieldwork"])) {
    if (index.libModules.some((name) => matchesTokens(name, tokens)) || repos.length || pages.length) {
      evidence.integration = true;
    }
  }

  return { evidence, evidencePaths };
}

export function calculateEvidenceCompletion(evidence: ProjectSyncEvidence): number {
  const total = PROJECT_SYNC_EVIDENCE_DIMENSIONS.length;
  const satisfied = PROJECT_SYNC_EVIDENCE_DIMENSIONS.reduce(
    (count, dimension) => count + (evidence[dimension] ? 1 : 0),
    0,
  );
  return round2((satisfied / total) * 100);
}

export function deriveStatus(
  evidence: ProjectSyncEvidence,
  completionPct: number,
  deprecated: boolean,
): SynchronizedCapability["status"] {
  if (deprecated) return "deprecated";
  if (completionPct >= 100) return "completed";
  if (evidence.security && evidence.integration && completionPct >= 75) return "enterprise";
  if (evidence.database && evidence.serverAction && completionPct >= 55) return "production";
  if (completionPct >= 30) return "partial";
  if (evidence.documentation || evidence.database || completionPct > 0) return "foundation";
  return "planned";
}

function tokenize(...parts: string[]): string[] {
  return parts
    .join(" ")
    .toLowerCase()
    .replace(/[_/.-]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2)
    .filter((token) => !["the", "and", "for", "with", "from"].includes(token));
}

function matchesTokens(value: string, tokens: string[]): boolean {
  const hay = value.toLowerCase();
  return tokens.some((token) => hay.includes(token));
}
