import type { AiToolResult } from "@/lib/ai/tools/types";

/** Result helpers — structured errors only, never provider exceptions. */
export function mapToolFailure(
  toolId: string,
  code: string,
  message: string,
  extras?: Partial<AiToolResult>,
): AiToolResult {
  return {
    toolId,
    status: extras?.status ?? "failed",
    success: false,
    summary: message,
    details: extras?.details ?? { code },
    affectedObjects: extras?.affectedObjects ?? [],
    warnings: extras?.warnings ?? [],
    errors: [{ code, message }, ...(extras?.errors ?? [])],
    durationMs: extras?.durationMs ?? 0,
    references: extras?.references ?? [],
    nextActions: extras?.nextActions ?? [],
    executionMode: extras?.executionMode ?? "dry_run",
    producedAt: new Date().toISOString(),
    confirmationToken: extras?.confirmationToken,
  };
}
