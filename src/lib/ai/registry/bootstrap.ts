import { AiCopilotCore } from "@/lib/ai/core/ai-copilot-core";
import { AI_FOUNDATION_VERSION } from "@/lib/ai/constants";
import { AI_MODULE_CATALOG } from "@/lib/ai/knowledge/module-catalog";
import { AI_ACTION_DEFINITIONS } from "@/lib/ai/actions/action-definitions";
import { AI_SKILL_CATALOG } from "@/lib/ai/skills/catalog";
import {
  bootstrapLlmPlatform,
  type LlmPlatform,
  type LlmPlatformBootstrap,
} from "@/lib/ai/providers/llm-platform";

export type AiFoundationBootstrap = {
  version: string;
  moduleCount: number;
  actionCount: number;
  skillCount: number;
  core: AiCopilotCore;
  llm: LlmPlatformBootstrap;
};

/**
 * Bootstraps the Enterprise AI Foundation with knowledge, actions,
 * Skills Engine, and the provider-independent LLM Platform Layer.
 */
export function bootstrapAiFoundation(): AiFoundationBootstrap {
  const llm = bootstrapLlmPlatform();
  const core = new AiCopilotCore({ llmPlatform: llm.platform });
  core.panelContract.bindHost({
    onFoundationReady: () => undefined,
  });
  core.panelContract.getHost()?.onFoundationReady?.(AI_FOUNDATION_VERSION);

  return {
    version: AI_FOUNDATION_VERSION,
    moduleCount: AI_MODULE_CATALOG.length,
    actionCount: AI_ACTION_DEFINITIONS.length,
    skillCount: AI_SKILL_CATALOG.length,
    core,
    llm,
  };
}

export type { LlmPlatform, LlmPlatformBootstrap };
