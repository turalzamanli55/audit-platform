import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type { EmeLearningSignal, EmeMemoryWriteInput } from "@/lib/ai/memory-engine/types";
import { EmeMemoryPolicyEngine } from "@/lib/ai/memory-engine/policies";
import { createEmeError, stringifyMemoryValue } from "@/lib/ai/memory-engine/utils";

const BLOCKED_KEYS = new Set([
  "password",
  "api_key",
  "apiKey",
  "token",
  "secret",
  "authorization",
  "database_url",
  "supabase_key",
]);

/**
 * Learning rules — validate candidates before persistence.
 * Never auto-trust interactions. Never store secrets or unrestricted PII.
 */
export class EmeLearningRulesEngine {
  private readonly policies = new EmeMemoryPolicyEngine();

  validateSignal(
    signal: EmeLearningSignal,
    context: AiRuntimeContext,
  ): { ok: true } | { ok: false; error: ReturnType<typeof createEmeError> } {
    if (!context.userId) {
      return { ok: false, error: createEmeError("unauthenticated", "User required for learning.") };
    }
    if (!context.workspaceId) {
      return { ok: false, error: createEmeError("missing_workspace", "Workspace required for learning.") };
    }
    if (BLOCKED_KEYS.has(signal.key.toLowerCase())) {
      return { ok: false, error: createEmeError("blocked_key", "Memory key is not allowed.") };
    }
    const serialized = stringifyMemoryValue(signal.value);
    if (this.policies.containsRestrictedContent(`${signal.key} ${serialized}`)) {
      return { ok: false, error: createEmeError("restricted_content", "Memory contains restricted content.") };
    }
    if (signal.confidence < 0.3) {
      return { ok: false, error: createEmeError("low_confidence", "Learning signal confidence too low.") };
    }
    return { ok: true };
  }

  validateWrite(
    input: EmeMemoryWriteInput,
    context: AiRuntimeContext,
  ): { ok: true } | { ok: false; error: ReturnType<typeof createEmeError> } {
    if (BLOCKED_KEYS.has(input.key.toLowerCase())) {
      return { ok: false, error: createEmeError("blocked_key", "Memory key is not allowed.") };
    }
    const serialized = stringifyMemoryValue(input.value);
    if (this.policies.containsRestrictedContent(`${input.key} ${input.label} ${serialized}`)) {
      return { ok: false, error: createEmeError("restricted_content", "Memory contains restricted content.") };
    }
    if (!context.workspaceId && input.level !== "session") {
      return { ok: false, error: createEmeError("missing_workspace", "Workspace context required.") };
    }
    return { ok: true };
  }
}
