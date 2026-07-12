import type {
  AiOrchestratorIntent,
  AiOrchestratorIntentKind,
  AiOrchestratorStrategyId,
} from "@/lib/ai/orchestrator/types";

export type AiOrchestratorStrategyProfile = {
  id: AiOrchestratorStrategyId;
  description: string;
  pipelineMode: "sequential" | "parallel" | "conditional";
  maxKnowledgeLimit: number;
  maxToolLimit: number;
  maxSkillLimit: number;
  includeModuleSweep: boolean;
  moduleSweep: readonly string[];
};

const AUDIT_SWEEP = [
  "engagements",
  "planning",
  "materiality",
  "risk-assessment",
  "review",
  "completion",
  "reporting",
] as const;

const ACCOUNTING_SWEEP = ["trial-balance", "financial-statements", "uaie"] as const;

const STRATEGY_PROFILES: Record<AiOrchestratorStrategyId, AiOrchestratorStrategyProfile> = {
  simple: {
    id: "simple",
    description: "Minimal resolve path — skill, knowledge, tools, prompt.",
    pipelineMode: "sequential",
    maxKnowledgeLimit: 8,
    maxToolLimit: 3,
    maxSkillLimit: 3,
    includeModuleSweep: false,
    moduleSweep: [],
  },
  fast: {
    id: "fast",
    description: "Parallel resolve of skill/knowledge/tools with shallow limits.",
    pipelineMode: "parallel",
    maxKnowledgeLimit: 6,
    maxToolLimit: 3,
    maxSkillLimit: 2,
    includeModuleSweep: false,
    moduleSweep: [],
  },
  deep: {
    id: "deep",
    description: "Deep multi-module context merge before prompt assembly.",
    pipelineMode: "sequential",
    maxKnowledgeLimit: 16,
    maxToolLimit: 5,
    maxSkillLimit: 5,
    includeModuleSweep: true,
    moduleSweep: AUDIT_SWEEP,
  },
  audit: {
    id: "audit",
    description: "Audit engagement analysis sweep across core audit modules.",
    pipelineMode: "sequential",
    maxKnowledgeLimit: 14,
    maxToolLimit: 5,
    maxSkillLimit: 5,
    includeModuleSweep: true,
    moduleSweep: AUDIT_SWEEP,
  },
  accounting: {
    id: "accounting",
    description: "Accounting-focused context resolution.",
    pipelineMode: "sequential",
    maxKnowledgeLimit: 12,
    maxToolLimit: 4,
    maxSkillLimit: 4,
    includeModuleSweep: true,
    moduleSweep: ACCOUNTING_SWEEP,
  },
  import: {
    id: "import",
    description: "Import intelligence oriented resolve path.",
    pipelineMode: "conditional",
    maxKnowledgeLimit: 10,
    maxToolLimit: 4,
    maxSkillLimit: 3,
    includeModuleSweep: true,
    moduleSweep: ["import-intelligence", "trial-balance"],
  },
  validation: {
    id: "validation",
    description: "Validation-first resolve with conditional tool resolution.",
    pipelineMode: "conditional",
    maxKnowledgeLimit: 10,
    maxToolLimit: 4,
    maxSkillLimit: 4,
    includeModuleSweep: false,
    moduleSweep: [],
  },
};

const INTENT_STRATEGY: Partial<Record<AiOrchestratorIntentKind, AiOrchestratorStrategyId>> = {
  analysis: "deep",
  audit: "audit",
  accounting: "accounting",
  import: "import",
  validation: "validation",
  navigation: "fast",
  search: "fast",
  question: "simple",
  explanation: "simple",
  workflow: "simple",
  mixed: "deep",
};

/**
 * Strategy selector — maps intent signals to orchestration profiles.
 */
export class AiOrchestratorStrategySelector {
  resolve(
    intent: AiOrchestratorIntent,
    explicit?: AiOrchestratorStrategyId,
  ): AiOrchestratorStrategyProfile {
    if (explicit) return STRATEGY_PROFILES[explicit];
    const fromIntent = INTENT_STRATEGY[intent.primary] ?? "simple";
    if (intent.mixed && fromIntent === "simple") {
      return STRATEGY_PROFILES.deep;
    }
    return STRATEGY_PROFILES[fromIntent];
  }

  profile(id: AiOrchestratorStrategyId): AiOrchestratorStrategyProfile {
    return STRATEGY_PROFILES[id];
  }

  list(): AiOrchestratorStrategyProfile[] {
    return Object.values(STRATEGY_PROFILES);
  }
}
