import type { AiToolRegistration } from "@/lib/ai/tools/types";
import { AiToolRegistry } from "@/lib/ai/tools/registry";
import { NAVIGATION_AI_TOOLS } from "@/lib/ai/tools/navigation/tools";
import { SEARCH_AI_TOOLS } from "@/lib/ai/tools/search/tools";
import { WORKFLOW_AI_TOOLS } from "@/lib/ai/tools/workflow/tools";
import { REPOSITORY_AI_TOOLS } from "@/lib/ai/tools/repositories/tools";
import { ACTION_AI_TOOLS } from "@/lib/ai/tools/actions/tools";

export const AI_TOOL_CATALOG: readonly AiToolRegistration[] = [
  ...NAVIGATION_AI_TOOLS,
  ...SEARCH_AI_TOOLS,
  ...WORKFLOW_AI_TOOLS,
  ...REPOSITORY_AI_TOOLS,
  ...ACTION_AI_TOOLS,
];

export function createPopulatedAiToolRegistry(
  registrations: readonly AiToolRegistration[] = AI_TOOL_CATALOG,
): AiToolRegistry {
  const registry = new AiToolRegistry();
  registry.registerAll(registrations);
  return registry;
}
