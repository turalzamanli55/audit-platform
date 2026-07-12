import { createConfirmationToken } from "@/lib/ai/tools/utils";
import type { AiToolDefinition } from "@/lib/ai/tools/types";

const DANGEROUS_HINTS = [
  "delete",
  "archive",
  "restore",
  "approve",
  "reject",
  "reset",
  "bulk",
] as const;

/**
 * Confirmation engine — dangerous tools require explicit confirmation tokens.
 */
export class AiToolConfirmationEngine {
  private readonly pending = new Map<
    string,
    { toolId: string; args: Record<string, unknown>; createdAt: string }
  >();

  requiresConfirmation(tool: AiToolDefinition): boolean {
    if (tool.requiresConfirmation) return true;
    if (tool.riskLevel === "high" || tool.riskLevel === "critical") return true;
    const id = tool.id.toLowerCase();
    return DANGEROUS_HINTS.some((hint) => id.includes(hint));
  }

  issue(toolId: string, args: Record<string, unknown>): string {
    const token = createConfirmationToken(toolId);
    this.pending.set(token, {
      toolId,
      args,
      createdAt: new Date().toISOString(),
    });
    return token;
  }

  consume(token: string, toolId: string): boolean {
    const entry = this.pending.get(token);
    if (!entry) return false;
    if (entry.toolId !== toolId) return false;
    this.pending.delete(token);
    return true;
  }

  peek(token: string) {
    return this.pending.get(token) ?? null;
  }
}
