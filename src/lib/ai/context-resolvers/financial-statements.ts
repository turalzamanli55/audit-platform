import { CORE_INLINE_CAPABILITIES, defineModuleResolver } from "@/lib/ai/context-resolvers/shared";

export const financialStatementsContextResolver = defineModuleResolver({
  moduleId: "financial-statements",
  displayName: "Financial Statements",
  summary: "Explain balances, analyze statements, and explain movements.",
  capabilities: [
    ...CORE_INLINE_CAPABILITIES,
    {
      id: "explain_balances",
      kind: "explain",
      labelId: "explainBalances",
      label: "Explain balances",
      utteranceTemplate: "Explain balances for {{object}} in the financial statements.",
    },
    {
      id: "analyze_statements",
      kind: "analyze",
      labelId: "analyzeStatements",
      label: "Analyze statements",
      utteranceTemplate: "Analyze financial statements focusing on {{object}}.",
    },
    {
      id: "explain_movements",
      kind: "explain",
      labelId: "explainMovements",
      label: "Explain movements",
      utteranceTemplate: "Explain movements related to {{object}}.",
    },
  ],
  suggestions: [
    "Explain these balances.",
    "Analyze statement movements.",
    "Summarize key financial statement risks.",
  ],
  relatedObjectTypes: ["statement_section", "balance", "movement"],
});
