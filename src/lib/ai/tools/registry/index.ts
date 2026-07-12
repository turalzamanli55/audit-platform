import type {
  AiToolCategory,
  AiToolDefinition,
  AiToolLlmDefinition,
  AiToolRegistration,
} from "@/lib/ai/tools/types";
import type { AiModuleId } from "@/lib/ai/constants";

/**
 * Enterprise Tool Registry.
 */
export class AiToolRegistry {
  private readonly tools = new Map<string, AiToolRegistration>();

  registerTool(registration: AiToolRegistration): void {
    if (this.tools.has(registration.definition.id)) {
      throw new Error(`Duplicate AI tool id: ${registration.definition.id}`);
    }
    this.tools.set(registration.definition.id, registration);
  }

  registerAll(registrations: readonly AiToolRegistration[]): void {
    for (const registration of registrations) this.registerTool(registration);
  }

  removeTool(toolId: string): boolean {
    return this.tools.delete(toolId);
  }

  findTool(toolId: string): AiToolRegistration | null {
    return this.tools.get(toolId) ?? null;
  }

  findByModule(moduleId: AiModuleId | "*"): AiToolDefinition[] {
    return this.listTools().filter(
      (tool) => tool.moduleId === "*" || tool.moduleId === moduleId,
    );
  }

  findByCategory(category: AiToolCategory): AiToolDefinition[] {
    return this.listTools().filter((tool) => tool.category === category);
  }

  listTools(): AiToolDefinition[] {
    return [...this.tools.values()]
      .map((entry) => entry.definition)
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  listIds(): string[] {
    return [...this.tools.keys()];
  }

  count(): number {
    return this.tools.size;
  }

  /** Definitions safe to expose to an LLM — schemas only. */
  listLlmDefinitions(): AiToolLlmDefinition[] {
    return this.listTools().map((tool) => ({
      id: tool.id,
      name: tool.name,
      description: tool.description,
      category: tool.category,
      accessMode: tool.accessMode,
      inputSchema: tool.inputSchema,
      requiresConfirmation: tool.requiresConfirmation,
      riskLevel: tool.riskLevel,
    }));
  }
}
