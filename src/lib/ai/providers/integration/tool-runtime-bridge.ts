/**
 * Connects LLM Platform tool-calling engine to Enterprise Tool Runtime definitions.
 * LLM may only request registered tools — never repositories or server actions.
 */

import type { LlmPlatform } from "@/lib/ai/providers/llm-platform";
import type { AiToolRuntime } from "@/lib/ai/tools";

export function bindToolRuntimeToLlmPlatform(
  platform: LlmPlatform,
  toolRuntime: AiToolRuntime,
): number {
  const definitions = toolRuntime.listLlmDefinitions();
  for (const tool of definitions) {
    platform.tools.registerTool({
      name: tool.id,
      description: tool.description,
      parametersSchema: tool.inputSchema as unknown as Record<string, unknown>,
      actionId: tool.id,
    });
  }
  return definitions.length;
}
