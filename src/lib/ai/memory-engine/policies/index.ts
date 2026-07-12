import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type { EmeMemoryPolicy, EmeMemoryRecord, EmeMemoryScope } from "@/lib/ai/memory-engine/types";
import { createEmeError } from "@/lib/ai/memory-engine/utils";

const SECRET_PATTERNS = [
  /\bpassword\b/i,
  /\bapi[_-]?key\b/i,
  /\bsecret\b/i,
  /\btoken\b/i,
  /\bbearer\b/i,
  /\bauthorization\b/i,
  /\bsupabase[_-]?key\b/i,
  /\bprivate[_-]?key\b/i,
];

const RESTRICTED_PII_PATTERNS = [
  /\b\d{3}-\d{2}-\d{4}\b/,
  /\b\d{16}\b/,
  /\bpassport\b/i,
  /\bssn\b/i,
];

/**
 * Memory policies — visibility, expiration, confidence, importance.
 */
export class EmeMemoryPolicyEngine {
  defaultPolicy(
    context: AiRuntimeContext,
    overrides?: Partial<EmeMemoryPolicy>,
  ): EmeMemoryPolicy {
    return {
      visibility: overrides?.visibility ?? "private",
      ownerId: overrides?.ownerId ?? context.userId,
      workspaceId: overrides?.workspaceId ?? context.workspaceId,
      organizationId: overrides?.organizationId ?? context.organizationId,
      companyId: overrides?.companyId ?? context.companyId,
      engagementId: overrides?.engagementId ?? context.engagementId,
      expiresAt: overrides?.expiresAt ?? null,
      confidence: overrides?.confidence ?? 0.7,
      source: overrides?.source ?? "user",
      importance: overrides?.importance ?? 0.5,
      learningEnabled: overrides?.learningEnabled ?? true,
    };
  }

  assertReadable(
    record: EmeMemoryRecord,
    context: AiRuntimeContext,
  ): { ok: true } | { ok: false; error: ReturnType<typeof createEmeError> } {
    if (record.status === "forgotten" || record.status === "archived") {
      return { ok: false, error: createEmeError("memory_unavailable", "Memory is not active.") };
    }
    if (
      record.policy.organizationId &&
      context.organizationId &&
      record.policy.organizationId !== context.organizationId
    ) {
      return { ok: false, error: createEmeError("tenant_isolation", "Organization scope mismatch.") };
    }
    if (
      record.policy.workspaceId &&
      context.workspaceId &&
      record.policy.workspaceId !== context.workspaceId
    ) {
      return { ok: false, error: createEmeError("workspace_isolation", "Workspace scope mismatch.") };
    }
    if (record.policy.visibility === "private" && record.policy.ownerId && context.userId) {
      if (record.policy.ownerId !== context.userId) {
        return { ok: false, error: createEmeError("visibility_denied", "Private memory owner mismatch.") };
      }
    }
    return { ok: true };
  }

  containsRestrictedContent(text: string): boolean {
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.test(text)) return true;
    }
    for (const pattern of RESTRICTED_PII_PATTERNS) {
      if (pattern.test(text)) return true;
    }
    return false;
  }
}

export function scopeFromContext(context: AiRuntimeContext, conversationId?: string | null): EmeMemoryScope {
  return {
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    companyId: context.companyId,
    engagementId: context.engagementId,
    conversationId: conversationId ?? null,
  };
}
