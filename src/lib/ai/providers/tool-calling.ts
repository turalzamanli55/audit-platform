/**
 * Tool calling infrastructure only.
 * Does NOT execute actions — Action Registry integration is deferred.
 */

import type {
  LlmProvider,
  LlmToolCallRequest,
  LlmToolCallResult,
  LlmToolDefinition,
} from "@/lib/ai/providers/provider";
import { LlmCapabilityResolver } from "@/lib/ai/providers/provider-capabilities";
import { LlmPlatformError } from "@/lib/ai/providers/provider-errors";

export type LlmRegisteredTool = LlmToolDefinition & {
  /** Optional Action Registry action id — binding only, never executed here. */
  actionId?: string;
};

export class LlmToolCallingEngine {
  private readonly capabilities = new LlmCapabilityResolver();
  private readonly tools = new Map<string, LlmRegisteredTool>();

  registerTool(tool: LlmRegisteredTool): void {
    this.validateDefinition(tool);
    this.tools.set(tool.name, tool);
  }

  removeTool(name: string): boolean {
    return this.tools.delete(name);
  }

  listTools(): LlmRegisteredTool[] {
    return [...this.tools.values()];
  }

  getTool(name: string): LlmRegisteredTool | undefined {
    return this.tools.get(name);
  }

  async invoke(
    provider: LlmProvider,
    request: Omit<LlmToolCallRequest, "tools"> & { tools?: LlmToolDefinition[] },
  ): Promise<LlmToolCallResult> {
    this.capabilities.assert(provider, "toolCalling");
    const tools = request.tools ?? this.listTools();
    for (const tool of tools) {
      this.validateDefinition(tool);
    }
    return provider.toolCall({ ...request, tools });
  }

  /**
   * Maps tool call names to Action Registry ids when bound.
   * Returns instructions metadata only — never executes business logic.
   */
  resolveActionBindings(
    toolCalls: Array<{ name: string; argumentsJson: string; id: string }>,
  ): Array<{
    toolCallId: string;
    toolName: string;
    actionId: string | null;
    argumentsJson: string;
  }> {
    return toolCalls.map((call) => {
      const registered = this.tools.get(call.name);
      return {
        toolCallId: call.id,
        toolName: call.name,
        actionId: registered?.actionId ?? null,
        argumentsJson: call.argumentsJson,
      };
    });
  }

  private validateDefinition(tool: LlmToolDefinition): void {
    if (!tool.name.trim()) {
      throw new LlmPlatformError("tool_definition_invalid", "Tool name is required.");
    }
    if (!tool.parametersSchema || typeof tool.parametersSchema !== "object") {
      throw new LlmPlatformError(
        "tool_definition_invalid",
        `Tool "${tool.name}" requires a JSON Schema parameters object.`,
        { details: { toolName: tool.name } },
      );
    }
  }
}
