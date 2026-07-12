import { AI_FOUNDATION_VERSION } from "@/lib/ai/constants";
import type { AiModuleId } from "@/lib/ai/constants";
import type { AiKnowledgeSnapshot, AiModuleKnowledge } from "@/lib/ai/types/knowledge";
import { AI_MODULE_CATALOG, getAiModuleKnowledge } from "@/lib/ai/knowledge/module-catalog";

/**
 * AI Knowledge Engine — registers platform module knowledge for the copilot.
 */
export class AiKnowledgeEngine {
  private readonly modules: Map<AiModuleId, AiModuleKnowledge>;

  constructor(seed: readonly AiModuleKnowledge[] = AI_MODULE_CATALOG) {
    this.modules = new Map(seed.map((module) => [module.id, module]));
  }

  listModules(): AiModuleKnowledge[] {
    return [...this.modules.values()];
  }

  getModule(id: AiModuleId): AiModuleKnowledge | null {
    return this.modules.get(id) ?? getAiModuleKnowledge(id) ?? null;
  }

  snapshot(): AiKnowledgeSnapshot {
    return {
      modules: this.listModules(),
      version: AI_FOUNDATION_VERSION,
      registeredAt: new Date().toISOString(),
    };
  }
}

export { AI_MODULE_CATALOG, getAiModuleKnowledge };
