import { CORE_INLINE_CAPABILITIES, defineModuleResolver } from "@/lib/ai/context-resolvers/shared";

export const trialBalanceContextResolver = defineModuleResolver({
  moduleId: "trial-balance",
  displayName: "Trial Balance",
  summary: "Explain accounts, variances, adjustments, and mapping suggestions.",
  capabilities: [
    ...CORE_INLINE_CAPABILITIES,
    {
      id: "explain_account",
      kind: "explain",
      labelId: "explainAccount",
      label: "Explain account",
      utteranceTemplate: "Explain trial balance account {{object}}.",
      requiresSelection: true,
    },
    {
      id: "analyze_variance",
      kind: "analyze",
      labelId: "analyzeVariance",
      label: "Analyze variance",
      utteranceTemplate: "Analyze variance for account {{object}}.",
      requiresSelection: true,
    },
    {
      id: "explain_adjustments",
      kind: "explain",
      labelId: "explainAdjustments",
      label: "Explain adjustments",
      utteranceTemplate: "Explain adjustments affecting {{object}}.",
    },
    {
      id: "suggest_mapping",
      kind: "suggest",
      labelId: "suggestMapping",
      label: "Suggest mapping",
      utteranceTemplate: "Suggest mapping for trial balance account {{object}}.",
      requiresSelection: true,
    },
  ],
  suggestions: [
    "Explain this account.",
    "Analyze variance versus prior period.",
    "Suggest mapping for this account.",
  ],
  relatedObjectTypes: ["tb_account", "adjustment", "mapping"],
});
