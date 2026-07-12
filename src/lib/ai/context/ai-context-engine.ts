import type { AiContextCollectionInput, AiRuntimeContext } from "@/lib/ai/types/context";

function utcNow(): string {
  return new Date().toISOString();
}

/**
 * AI Context Engine — collects the governed runtime snapshot.
 * Pure collection / normalization. No LLM involvement.
 */
export function collectAiRuntimeContext(input: AiContextCollectionInput): AiRuntimeContext {
  return {
    route: input.route,
    moduleId: input.moduleId ?? null,
    pageId: input.pageId ?? null,
    organizationId: input.organizationId ?? null,
    workspaceId: input.workspaceId ?? null,
    companyId: input.companyId ?? null,
    companySlug: input.companySlug ?? null,
    engagementId: input.engagementId ?? null,
    engagementSlug: input.engagementSlug ?? null,
    locale: input.locale,
    userId: input.userId ?? null,
    roleSlugs: [...(input.roleSlugs ?? [])],
    permissionCodes: [...(input.permissionCodes ?? [])],
    workflowId: input.workflowId ?? null,
    workflowStatus: input.workflowStatus ?? null,
    filters: { ...(input.filters ?? {}) },
    selectedObjectType: input.selectedObjectType ?? null,
    selectedObjectId: input.selectedObjectId ?? null,
    navigationPath: [...(input.navigationPath ?? [])],
    hasUnsavedChanges: Boolean(input.hasUnsavedChanges),
    theme: input.theme ?? "system",
    device: input.device ?? "unknown",
    auditYear: input.auditYear ?? null,
    collectedAt: utcNow(),
  };
}

export class AiContextEngine {
  collect(input: AiContextCollectionInput): AiRuntimeContext {
    return collectAiRuntimeContext(input);
  }
}
