import { CORE_INLINE_CAPABILITIES, defineModuleResolver } from "@/lib/ai/context-resolvers/shared";

export const riskContextResolver = defineModuleResolver({
  moduleId: "risk-assessment",
  displayName: "Risk Assessment",
  summary: "Explain risks, controls, duplicates, gaps, and prior-year comparison.",
  capabilities: [
    ...CORE_INLINE_CAPABILITIES,
    {
      id: "suggest_controls",
      kind: "suggest",
      labelId: "suggestControls",
      label: "Suggest controls",
      utteranceTemplate: "Suggest controls related to risk {{object}}.",
      requiresSelection: true,
    },
    {
      id: "detect_duplicates",
      kind: "analyze",
      labelId: "detectDuplicates",
      label: "Detect duplicates",
      utteranceTemplate: "Detect duplicate or overlapping risks around {{object}}.",
    },
    {
      id: "find_missing_risks",
      kind: "review",
      labelId: "findMissingRisks",
      label: "Find missing risks",
      utteranceTemplate: "Find missing risks for the current risk assessment context.",
    },
    {
      id: "compare_previous_audit",
      kind: "compare",
      labelId: "comparePreviousAudit",
      label: "Compare previous audit",
      utteranceTemplate: "Compare current risks with the previous audit for {{object}}.",
    },
  ],
  suggestions: [
    "Explain this risk and related assertions.",
    "Suggest controls for the selected risk.",
    "Find missing risks in this assessment.",
  ],
  relatedObjectTypes: ["risk", "control", "assertion"],
  knowledgeHints: ["inherent risk", "control risk", "significant risk"],
});
