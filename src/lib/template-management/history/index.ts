export type TemplateManagementHistoryRecord = {
  organizationId: string;
  templateCode: string;
  action: string;
  summary: string;
  createdAt: string;
};

export function buildTemplateManagementHistoryRecord(input: {
  organizationId: string;
  templateCode: string;
  action: string;
  summary: string;
}): TemplateManagementHistoryRecord {
  return { ...input, createdAt: new Date().toISOString() };
}

export class TemplateManagementHistoryEngine {
  build(input: {
    organizationId: string;
    templateCode: string;
    action: string;
    summary: string;
  }): TemplateManagementHistoryRecord {
    return buildTemplateManagementHistoryRecord(input);
  }
}
