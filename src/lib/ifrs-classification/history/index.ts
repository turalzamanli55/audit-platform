/** IFRS classification / note-management history trail builders. */

export type IfrsClassificationHistoryRecord = {
  engagementId: string;
  entityType: string;
  entityId: string;
  action: string;
  summary: string;
  createdAt: string;
};

export function buildIfrsClassificationHistoryRecord(input: {
  engagementId: string;
  entityType: string;
  entityId: string;
  action: string;
  summary: string;
}): IfrsClassificationHistoryRecord {
  return {
    engagementId: input.engagementId,
    entityType: input.entityType,
    entityId: input.entityId,
    action: input.action,
    summary: input.summary,
    createdAt: new Date().toISOString(),
  };
}

export class IfrsClassificationHistoryEngine {
  build(input: {
    engagementId: string;
    entityType: string;
    entityId: string;
    action: string;
    summary: string;
  }): IfrsClassificationHistoryRecord {
    return buildIfrsClassificationHistoryRecord(input);
  }
}
