/**
 * Per-capability required evidence — only relevant evidence contributes.
 */
import type {
  CapabilityClass,
  EvidenceKind,
  EvidenceRequirement,
  ImplementationPhase,
  ParsedCapability,
} from "@/lib/capability-intelligence/types";

function req(kind: EvidenceKind, reason: string): EvidenceRequirement {
  return { kind, required: true, reason };
}

export function defineRequiredEvidence(
  capability: ParsedCapability,
  classes: CapabilityClass[],
  phase: ImplementationPhase,
): EvidenceRequirement[] {
  if (phase === "future" || classes.includes("future") || classes.includes("experimental")) {
    return [req("documentation", "Future/experimental — documentation only until scheduled")];
  }

  const requirements: EvidenceRequirement[] = [
    req("documentation", "PROJECT_BIBLE definition"),
  ];

  const text = `${capability.name} ${capability.description} ${capability.moduleId}`.toLowerCase();

  if (classes.includes("database") || classes.includes("infrastructure") || /migration|schema|table|repository/.test(text)) {
    requirements.push(req("migration", "Database capability requires migration evidence"));
    requirements.push(req("database", "Schema/types evidence"));
    requirements.push(req("repository", "Data-access repository"));
  }

  if (classes.includes("security") || /permission|auth|rls|rbac/.test(text)) {
    requirements.push(req("permission", "Security capability requires permission evidence"));
    requirements.push(req("tests", "Security capabilities require tests"));
  }

  if (classes.includes("workflow") || /workflow|pipeline|engine|approval/.test(text)) {
    requirements.push(req("workflow", "Workflow/engine implementation"));
    requirements.push(req("serverAction", "Mutating workflow entrypoints"));
  }

  if (classes.includes("ui") || /workspace|dashboard|page|route/.test(text)) {
    requirements.push(req("route", "UI route surface"));
    requirements.push(req("component", "UI component evidence"));
    requirements.push(req("localization", "UI requires localization"));
  }

  if (classes.includes("ai") || /\bai\b|llm|prompt|orchestrat/.test(text)) {
    requirements.push(req("ai", "AI implementation surface"));
    requirements.push(req("workflow", "AI orchestration/pipeline"));
  }

  if (classes.includes("compliance") || /ifrs|isa|reporting|note/.test(text)) {
    requirements.push(req("repository", "Compliance data access"));
    requirements.push(req("tests", "Compliance verification tests"));
    requirements.push(req("localization", "Multi-locale compliance surfaces"));
  }

  // Default required platform capability needs a minimal backend+test set
  if (classes.includes("required") && requirements.length <= 1) {
    requirements.push(req("repository", "Default required capability needs repository"));
    requirements.push(req("serverAction", "Default required capability needs server action"));
    requirements.push(req("tests", "Default required capability needs tests"));
  }

  // History/versioning only when explicitly indicated
  if (/history|audit.?trail|version/.test(text)) {
    requirements.push(req("history", "History/audit trail indicated"));
  }
  if (/versioning|version.?control|immutable/.test(text)) {
    requirements.push(req("versioning", "Versioning indicated"));
  }
  if (/workspace/.test(text) && !requirements.some((r) => r.kind === "workspace")) {
    requirements.push(req("workspace", "Workspace shell indicated"));
  }

  // Deduplicate by kind
  const map = new Map<EvidenceKind, EvidenceRequirement>();
  for (const item of requirements) {
    if (!map.has(item.kind)) map.set(item.kind, item);
  }
  return [...map.values()];
}
