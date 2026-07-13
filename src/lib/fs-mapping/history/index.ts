import type { FsMappingHistoryRecord } from "@/types/fs-mapping";

export type FsHistoryWriteInput = {
  mappingSetId: string;
  organizationId: string;
  workspaceId: string;
  engagementId: string;
  action: string;
  actorUserId?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  summary: string;
  detailsJson?: Record<string, unknown>;
};

/**
 * History helpers — structured audit trail entries.
 */
export function buildHistoryRecord(input: FsHistoryWriteInput): Omit<FsMappingHistoryRecord, "id"> {
  return {
    mappingSetId: input.mappingSetId,
    organizationId: input.organizationId,
    workspaceId: input.workspaceId,
    engagementId: input.engagementId,
    action: input.action,
    actorUserId: input.actorUserId ?? null,
    entityType: input.entityType ?? null,
    entityId: input.entityId ?? null,
    summary: input.summary,
    detailsJson: input.detailsJson ?? {},
    createdAt: new Date().toISOString(),
  };
}
