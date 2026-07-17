/** Account mapping governance history trail. */

export type AccountMappingGovernanceHistoryRecord = {
  engagementId: string;
  accountCode: string;
  fsLineCode: string;
  action: string;
  summary: string;
  createdAt: string;
};

export function buildAccountMappingGovernanceHistoryRecord(input: {
  engagementId: string;
  accountCode: string;
  fsLineCode: string;
  action: string;
  summary: string;
}): AccountMappingGovernanceHistoryRecord {
  return {
    engagementId: input.engagementId,
    accountCode: input.accountCode,
    fsLineCode: input.fsLineCode,
    action: input.action,
    summary: input.summary,
    createdAt: new Date().toISOString(),
  };
}

export class AccountMappingGovernanceHistoryEngine {
  build(input: {
    engagementId: string;
    accountCode: string;
    fsLineCode: string;
    action: string;
    summary: string;
  }): AccountMappingGovernanceHistoryRecord {
    return buildAccountMappingGovernanceHistoryRecord(input);
  }
}
