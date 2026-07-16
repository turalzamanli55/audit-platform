import type { IfrsNoteHistoryRecord } from "@/types/ifrs-notes";

export function buildIfrsNoteHistoryRecord(input: {
  packageId: string;
  organizationId: string;
  workspaceId: string;
  engagementId: string;
  action: string;
  actorUserId?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  summary: string;
  detailsJson?: Record<string, unknown>;
}): Omit<IfrsNoteHistoryRecord, "id"> {
  return {
    packageId: input.packageId,
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
