/**
 * False positive detection — incorrect missing/duplicate/mismatch reports.
 */
import type {
  AiAreaResolution,
  CapabilityEvidenceResolution,
  FalsePositiveFinding,
  ModuleEvidenceResolution,
} from "@/lib/platform-audit/evidence-engine/types";
import { isTrusted } from "@/lib/platform-audit/evidence-engine/scoring";

export function detectFalsePositives(input: {
  modules: ModuleEvidenceResolution[];
  capabilities: CapabilityEvidenceResolution[];
  aiAreas: AiAreaResolution[];
  priorMissingModuleIds?: string[];
}): FalsePositiveFinding[] {
  const findings: FalsePositiveFinding[] = [];

  for (const evidenceModule of input.modules) {
    const trustedDims = evidenceModule.dimensions.filter(
      (d) => d.present && isTrusted(d.confidence),
    );
    if (evidenceModule.matchedRoots.length > 0 && trustedDims.length >= 2) {
      // Would have been "missing" under filename-only matching
      if (
        evidenceModule.moduleId.startsWith("mod_") &&
        evidenceModule.verifiedCompletionPct > 0
      ) {
        findings.push({
          code: "corrected_module_mismatch",
          severity: "medium",
          message: `Module ${evidenceModule.moduleId} resolved via aliases ${evidenceModule.matchedRoots.join(", ")}`,
          rootCause:
            "v1 filename/token matching falsely treated bible module IDs as missing implementation",
          entityId: evidenceModule.moduleId,
          correctedBy: `aliases→${evidenceModule.matchedRoots.join("|")}`,
        });
      }
    }

    // False "duplicate" risk: same root claimed by multiple modules is OK if aliases overlap intentionally
    if (evidenceModule.falsePositiveRisk) {
      findings.push({
        code: "ambiguous_module_root",
        severity: "low",
        message: `Module ${evidenceModule.moduleId} shares roots ambiguously`,
        rootCause: "Multiple bible modules resolve to overlapping filesystem roots",
        entityId: evidenceModule.moduleId,
      });
    }
  }

  for (const capability of input.capabilities) {
    const trusted = capability.dimensions.filter((d) => d.present && isTrusted(d.confidence));
    if (trusted.length >= 3 && capability.verifiedCompletionPct >= 50) {
      findings.push({
        code: "corrected_capability_false_missing",
        severity: "informational",
        message: `Capability ${capability.capabilityId} has trusted evidence after semantic resolution`,
        rootCause: "v1 token matching under-counted repository/action/route evidence",
        entityId: capability.capabilityId,
        correctedBy: trusted.map((d) => d.dimension).join(","),
      });
    }

    // Incorrect duplicate: same evidence path listed many times — already deduped; flag if still huge
    const paths = capability.evidenceItems.map((i) => i.path);
    if (paths.length !== new Set(paths).size) {
      findings.push({
        code: "duplicate_evidence_paths",
        severity: "low",
        message: `Capability ${capability.capabilityId} had duplicate evidence paths before collapse`,
        rootCause: "Overlapping resolvers emitted the same path",
        entityId: capability.capabilityId,
      });
    }
  }

  for (const area of input.aiAreas) {
    if (area.present && area.confidence !== "missing") {
      const folderExact = area.aliases[0];
      if (folderExact && area.evidencePaths.some((p) => !p.includes(folderExact))) {
        findings.push({
          code: "corrected_ai_folder_false_missing",
          severity: "medium",
          message: `AI area ${area.areaId} resolved via aliases [${area.aliases.join(", ")}]`,
          rootCause: "v1 required exact folder names (e.g. context-engine) which do not exist",
          entityId: area.areaId,
          correctedBy: area.evidencePaths.slice(0, 3).join(","),
        });
      }
    }
  }

  return findings;
}
