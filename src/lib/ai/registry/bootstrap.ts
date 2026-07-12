import { AiCopilotCore } from "@/lib/ai/core/ai-copilot-core";
import { AI_FOUNDATION_VERSION } from "@/lib/ai/constants";
import { AI_MODULE_CATALOG } from "@/lib/ai/knowledge/module-catalog";
import { AI_ACTION_DEFINITIONS } from "@/lib/ai/actions/action-definitions";
import { AI_SKILL_CATALOG } from "@/lib/ai/skills/catalog";
import { AI_TOOL_CATALOG } from "@/lib/ai/tools/catalog";
import {
  bootstrapLlmPlatform,
  type LlmPlatform,
  type LlmPlatformBootstrap,
} from "@/lib/ai/providers/llm-platform";
import { bootstrapKnowledgeGraphEngine } from "@/lib/ai/knowledge-graph";
import { bootstrapAiToolRuntime } from "@/lib/ai/tools";

export type AiFoundationBootstrap = {
  version: string;
  moduleCount: number;
  actionCount: number;
  skillCount: number;
  toolCount: number;
  knowledgeNodeCount: number;
  knowledgeEdgeCount: number;
  knowledgeDocumentCount: number;
  core: AiCopilotCore;
  llm: LlmPlatformBootstrap;
};

/**
 * Bootstraps AI Foundation, Skills, Knowledge Graph, Tool Runtime, and LLM Platform.
 */
export function bootstrapAiFoundation(): AiFoundationBootstrap {
  const llm = bootstrapLlmPlatform();
  const knowledgeGraph = bootstrapKnowledgeGraphEngine();
  const toolRuntime = bootstrapAiToolRuntime();
  const core = new AiCopilotCore({
    llmPlatform: llm.platform,
    knowledgeGraph,
    toolRuntime,
  });
  core.panelContract.bindHost({
    onFoundationReady: () => undefined,
  });
  core.panelContract.getHost()?.onFoundationReady?.(AI_FOUNDATION_VERSION);

  const stats = knowledgeGraph.stats();

  return {
    version: AI_FOUNDATION_VERSION,
    moduleCount: AI_MODULE_CATALOG.length,
    actionCount: AI_ACTION_DEFINITIONS.length,
    skillCount: AI_SKILL_CATALOG.length,
    toolCount: AI_TOOL_CATALOG.length,
    knowledgeNodeCount: stats.nodeCount,
    knowledgeEdgeCount: stats.edgeCount,
    knowledgeDocumentCount: stats.documentCount,
    core,
    llm,
  };
}

export type { LlmPlatform, LlmPlatformBootstrap };
