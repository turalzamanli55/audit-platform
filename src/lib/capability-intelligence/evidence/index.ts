/**
 * Bridge EPAC evidence resolution into ECIE evidence kinds.
 */
import { auditDocumentation } from "@/lib/platform-audit/documents/audit";
import { runEvidenceEngine } from "@/lib/platform-audit/evidence-engine/engine";
import type { EvidenceEngineReport } from "@/lib/platform-audit/evidence-engine/types";
import type {
  EvidenceKind,
  EvidenceRequirement,
  EvidenceSatisfaction,
} from "@/lib/capability-intelligence/types";

const KIND_MAP: Record<string, EvidenceKind> = {
  migration: "migration",
  database: "database",
  repository: "repository",
  serverAction: "serverAction",
  route: "route",
  workspace: "workspace",
  component: "component",
  localization: "localization",
  test: "tests",
  tests: "tests",
  permission: "permission",
  workflow: "workflow",
  documentation: "documentation",
  ai: "ai",
  history: "history",
  versioning: "versioning",
};

export function loadEvidenceReport(cwd = process.cwd()): EvidenceEngineReport {
  const documentation = auditDocumentation(cwd);
  return runEvidenceEngine({ extraction: documentation.extraction, cwd });
}

export function satisfyEvidenceRequirements(
  capabilityId: string,
  moduleId: string,
  requirements: EvidenceRequirement[],
  evidenceReport: EvidenceEngineReport,
): EvidenceSatisfaction[] {
  const capability = evidenceReport.capabilities.find((c) => c.capabilityId === capabilityId);
  const module = evidenceReport.modules.find((m) => m.moduleId === moduleId);

  const dimMap = new Map<EvidenceKind, { verified: boolean; present: boolean; confidencePct: number; paths: string[] }>();

  const ingest = (
    dimension: string,
    present: boolean,
    confidence: string,
    confidencePct: number,
    paths: string[],
  ) => {
    const kind = KIND_MAP[dimension];
    if (!kind) return;
    const verified = present && (confidence === "verified" || confidence === "strong");
    const prior = dimMap.get(kind);
    if (!prior || confidencePct > prior.confidencePct) {
      dimMap.set(kind, { verified, present: present || verified, confidencePct, paths });
    }
  };

  if (capability) {
    for (const dim of capability.dimensions) {
      ingest(
        dim.dimension,
        dim.present,
        dim.confidence,
        dim.confidencePct,
        dim.items.map((i) => i.path),
      );
    }
  }
  if (module) {
    for (const dim of module.dimensions) {
      ingest(
        dim.dimension,
        dim.present,
        dim.confidence,
        dim.confidencePct,
        dim.items.map((i) => i.path),
      );
    }
    // AI module roots
    if (module.matchedRoots.includes("ai")) {
      const aiPresent = evidenceReport.aiAreas.some((a) => a.present);
      ingest("ai", aiPresent, aiPresent ? "strong" : "missing", aiPresent ? 90 : 0, ["src/lib/ai"]);
    }
  }

  // history/versioning from module evidence item paths
  if (module) {
    const historyPaths = module.evidenceItems
      .filter((i) => /history/i.test(i.path))
      .map((i) => i.path);
    if (historyPaths.length) {
      ingest("history", true, "strong", 90, historyPaths);
    }
    const versionPaths = module.evidenceItems
      .filter((i) => /version/i.test(i.path))
      .map((i) => i.path);
    if (versionPaths.length) {
      ingest("versioning", true, "strong", 90, versionPaths);
    }
  }

  return requirements.map((requirement) => {
    const hit = dimMap.get(requirement.kind);
    if (!hit) {
      return {
        kind: requirement.kind,
        required: requirement.required,
        present: false,
        verified: false,
        confidencePct: 0,
        paths: [],
        reason: `No verified evidence for required kind ${requirement.kind}`,
      };
    }
    return {
      kind: requirement.kind,
      required: requirement.required,
      present: hit.present,
      verified: hit.verified,
      confidencePct: hit.confidencePct,
      paths: hit.paths.slice(0, 20),
      reason: hit.verified
        ? `Verified ${requirement.kind}`
        : hit.present
          ? `Present but not verified ${requirement.kind}`
          : `Missing ${requirement.kind}`,
    };
  });
}
