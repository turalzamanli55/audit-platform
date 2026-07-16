/**
 * EPAC parser — extract domains/modules/features/capabilities/rules from PROJECT_BIBLE.
 * Reuses EPBSE extraction when available; supplements with rule-section scans.
 */
import { projectSyncEngine } from "@/lib/project-sync/engine";
import { loadEpacDocuments } from "@/lib/platform-audit/documents";
import type { DocumentExtraction } from "@/lib/platform-audit/types";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function extractRuleBlocks(
  content: string,
  patterns: Array<{ idPrefix: string; sectionPattern: RegExp; linePattern: RegExp }>,
): Array<{ id: string; text: string; section: string }> {
  const rules: Array<{ id: string; text: string; section: string }> = [];
  for (const pattern of patterns) {
    const sectionMatch = content.match(pattern.sectionPattern);
    const section = sectionMatch?.[0]?.slice(0, 120) ?? pattern.idPrefix;
    const body = sectionMatch?.[1] ?? content;
    let index = 0;
    for (const line of body.split("\n")) {
      const match = line.match(pattern.linePattern);
      if (!match) continue;
      const text = (match[1] ?? match[0]).trim();
      if (text.length < 8) continue;
      index += 1;
      rules.push({
        id: `${pattern.idPrefix}-${index}-${slugify(text).slice(0, 40)}`,
        text,
        section,
      });
    }
  }
  return rules;
}

/**
 * Parse governance documents into structured extraction.
 * Domains/modules/features/capabilities come from EPBSE (PROJECT_BIBLE authority).
 */
export function parseDocumentation(cwd = process.cwd()): DocumentExtraction {
  const sync = projectSyncEngine.synchronize({ cwd, persist: false });
  const docs = loadEpacDocuments(cwd);
  const bible = docs.find((doc) => doc.id === "PROJECT_BIBLE");
  const content = bible?.content ?? "";

  const businessRules = extractRuleBlocks(content, [
    {
      idPrefix: "business-rule",
      sectionPattern: /##[^\n]*Business[^\n]*\n([\s\S]*?)(?=\n## |\n# |$)/i,
      linePattern: /^[-*]\s+(.+)$/,
    },
  ]);

  const architectureRules = extractRuleBlocks(content, [
    {
      idPrefix: "architecture-rule",
      sectionPattern: /##[^\n]*Architecture[^\n]*\n([\s\S]*?)(?=\n## |\n# |$)/i,
      linePattern: /^[-*]\s+(.+)$/,
    },
  ]);

  const workflowRules = extractRuleBlocks(content, [
    {
      idPrefix: "workflow-rule",
      sectionPattern: /##[^\n]*Workflow[^\n]*\n([\s\S]*?)(?=\n## |\n# |$)/i,
      linePattern: /^[-*]\s+(.+)$/,
    },
  ]);

  const securityRules = extractRuleBlocks(content, [
    {
      idPrefix: "security-rule",
      sectionPattern: /##[^\n]*Security[^\n]*\n([\s\S]*?)(?=\n## |\n# |$)/i,
      linePattern: /^[-*]\s+(.+)$/,
    },
  ]);

  const localizationRules = extractRuleBlocks(content, [
    {
      idPrefix: "localization-rule",
      sectionPattern: /##[^\n]*Localization[^\n]*\n([\s\S]*?)(?=\n## |\n# |$)/i,
      linePattern: /^[-*]\s+(.+)$/,
    },
  ]);

  const requirements = sync.snapshot.requirements.map((requirement) => ({
    id: requirement.id,
    text: requirement.name ?? requirement.id,
    section: requirement.sourceSection,
  }));

  const documentHashes: Record<string, string> = {};
  for (const doc of docs) {
    documentHashes[doc.id] = doc.hash;
  }

  return {
    domains: sync.snapshot.domains.map((domain) => ({
      id: domain.id,
      name: domain.name,
      section: domain.sourceSection,
    })),
    modules: sync.snapshot.modules.map((module) => ({
      id: module.id,
      name: module.name,
      domainId: module.domainId,
      section: module.sourceSection,
    })),
    features: sync.snapshot.features.map((feature) => ({
      id: feature.id,
      name: feature.name,
      moduleId: feature.moduleId,
      section: feature.sourceSection,
    })),
    capabilities: sync.snapshot.capabilities.map((capability) => ({
      id: capability.id,
      name: capability.name,
      moduleId: capability.moduleId,
      featureId: capability.featureId,
      section: capability.sourceSection,
    })),
    requirements,
    businessRules,
    architectureRules,
    workflowRules,
    securityRules,
    localizationRules,
    documentHashes,
  };
}
