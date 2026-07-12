import { UAIE_PERMISSIONS } from "@/constants/uaie";
import { defineAiSkill, workspaceReadPermission } from "@/lib/ai/skills/shared/define-skill";
import type { AiSkillRegistration } from "@/lib/ai/skills/contracts/types";

export const IMPORT_INTELLIGENCE_AI_SKILLS: readonly AiSkillRegistration[] = [
  defineAiSkill({
    id: "import-intelligence.dictionary_health",
    name: "Dictionary Health",
    moduleId: "import-intelligence",
    description: "Structured dictionary health context for Import Intelligence.",
    category: "validation",
    capabilities: ["status", "analyze"],
    permission: workspaceReadPermission([UAIE_PERMISSIONS.READ]),
    intentHints: ["dictionary health", "import dictionary", "dictionary status"],
    plannerIntents: ["answer", "suggest"],
    priority: 75,
    buildContext: () => ({
      title: "Dictionary Health",
      description: "Dictionary health envelope.",
      structuredContext: {
        focus: "dictionary_health",
        metrics: ["coverage", "aliases", "conflicts", "stale_entries"],
      },
    }),
  }),
  defineAiSkill({
    id: "import-intelligence.learning_status",
    name: "Learning Status",
    moduleId: "import-intelligence",
    description: "Structured learning status context.",
    category: "import",
    capabilities: ["status"],
    permission: workspaceReadPermission([UAIE_PERMISSIONS.READ, UAIE_PERMISSIONS.LEARN]),
    intentHints: ["learning status", "import learning", "learning progress"],
    plannerIntents: ["answer"],
    priority: 70,
    buildContext: () => ({
      title: "Learning Status",
      description: "Learning pipeline status envelope.",
      structuredContext: {
        focus: "learning_status",
        stages: ["pending_review", "accepted", "rejected"],
      },
    }),
  }),
  defineAiSkill({
    id: "import-intelligence.unknown_words",
    name: "Unknown Words",
    moduleId: "import-intelligence",
    description: "Structured unknown words queue context.",
    category: "import",
    capabilities: ["list"],
    permission: workspaceReadPermission([UAIE_PERMISSIONS.READ]),
    intentHints: ["unknown words", "import unknown words"],
    plannerIntents: ["search", "suggest"],
    priority: 78,
    buildContext: () => ({
      title: "Unknown Words",
      severity: "warning",
      description: "Unknown words queue envelope.",
      structuredContext: {
        focus: "import_unknown_words",
        queueFilters: ["unreviewed", "low_confidence"],
      },
    }),
  }),
  defineAiSkill({
    id: "import-intelligence.suggestions",
    name: "Suggestions",
    moduleId: "import-intelligence",
    description: "Structured mapping suggestions context.",
    category: "recommendation",
    capabilities: ["recommend", "list"],
    permission: workspaceReadPermission([UAIE_PERMISSIONS.READ]),
    intentHints: ["import suggestions", "mapping suggestions", "intelligence suggestions"],
    plannerIntents: ["suggest"],
    priority: 80,
    buildContext: () => ({
      title: "Suggestions",
      description: "Suggestion envelope — never auto-applies mappings.",
      structuredContext: {
        focus: "import_suggestions",
        suggestionKinds: ["header_map", "account_map", "erp_profile"],
      },
    }),
  }),
  defineAiSkill({
    id: "import-intelligence.mappings",
    name: "Mappings",
    moduleId: "import-intelligence",
    description: "Structured current mappings context.",
    category: "context",
    capabilities: ["list", "status"],
    permission: workspaceReadPermission([UAIE_PERMISSIONS.READ]),
    intentHints: ["mappings", "import mappings", "show mappings"],
    plannerIntents: ["answer", "search"],
    priority: 72,
    buildContext: () => ({
      title: "Mappings",
      description: "Mappings catalog envelope.",
      structuredContext: {
        focus: "import_mappings",
        mappingKinds: ["header", "account", "dimension"],
      },
    }),
  }),
];
