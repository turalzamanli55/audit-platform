import type {
  FS_ACCOUNT_CLASSIFICATIONS,
  FS_AGGREGATION_METHODS,
  FS_COMPARATIVE_PERIODS,
  FS_MAPPING_RULE_TYPES,
  FS_MAPPING_SET_STATUSES,
  FS_MAPPING_STANDARDS,
  FS_MAPPING_VERSION_STATUSES,
  FS_MAPPING_WORKSPACE_SECTIONS,
  FS_STATEMENT_SECTIONS,
} from "@/constants/fs-mapping";

export type FsMappingSetStatus = (typeof FS_MAPPING_SET_STATUSES)[number];
export type FsMappingVersionStatus = (typeof FS_MAPPING_VERSION_STATUSES)[number];
export type FsMappingStandard = (typeof FS_MAPPING_STANDARDS)[number];
export type FsAccountClassification = (typeof FS_ACCOUNT_CLASSIFICATIONS)[number];
export type FsMappingRuleType = (typeof FS_MAPPING_RULE_TYPES)[number];
export type FsAggregationMethod = (typeof FS_AGGREGATION_METHODS)[number];
export type FsStatementSection = (typeof FS_STATEMENT_SECTIONS)[number];
export type FsComparativePeriod = (typeof FS_COMPARATIVE_PERIODS)[number];
export type FsMappingWorkspaceSection = (typeof FS_MAPPING_WORKSPACE_SECTIONS)[number];

export type FsMappingSet = {
  id: string;
  organizationId: string;
  workspaceId: string;
  companyId: string;
  engagementId: string;
  trialBalancePackageId: string | null;
  name: string;
  description: string | null;
  standard: FsMappingStandard;
  setStatus: FsMappingSetStatus;
  setVersion: number;
  comparativeMode: FsComparativePeriod;
  coveragePct: number;
  mappedAccountCount: number;
  unmappedAccountCount: number;
  validationErrorCount: number;
  validationWarningCount: number;
  versionCount: number;
  summaryJson: Record<string, unknown>;
  validationJson: Record<string, unknown>;
  datasetJson: Record<string, unknown>;
  validatedAt: string | null;
  validatedBy: string | null;
  approvedAt: string | null;
  approvedBy: string | null;
  publishedAt: string | null;
  publishedBy: string | null;
  archivedAt: string | null;
  archivedBy: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  deletedAt: string | null;
  version: number;
};

export type FsMappingRule = {
  id: string;
  mappingSetId: string;
  organizationId: string;
  workspaceId: string;
  engagementId: string;
  ruleCode: string;
  ruleName: string;
  ruleType: FsMappingRuleType;
  sourceAccountCodes: string[];
  targetLineCode: string;
  targetSection: FsStatementSection;
  classification: FsAccountClassification;
  aggregationMethod: FsAggregationMethod;
  formulaExpression: string | null;
  conditionExpression: string | null;
  weight: number | null;
  sortOrder: number;
  isActive: boolean;
  allowsNegative: boolean;
  metadataJson: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  version: number;
};

export type FsMappingLine = {
  id: string;
  mappingSetId: string;
  mappingRuleId: string | null;
  organizationId: string;
  workspaceId: string;
  engagementId: string;
  trialBalanceLineId: string | null;
  accountCode: string;
  accountName: string;
  classification: FsAccountClassification;
  classificationConfidence: number;
  statementSection: FsStatementSection;
  targetLineCode: string | null;
  targetLineLabel: string | null;
  parentLineCode: string | null;
  hierarchyLevel: number;
  aggregationMethod: FsAggregationMethod;
  currentYearAmount: number;
  previousYearAmount: number | null;
  multiYearAmounts: Array<{ year: number; amount: number }>;
  isMapped: boolean;
  isOrphan: boolean;
  isCalculated: boolean;
  sortOrder: number;
  metadataJson: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  version: number;
};

export type FsMappingVersion = {
  id: string;
  mappingSetId: string;
  organizationId: string;
  workspaceId: string;
  engagementId: string;
  versionNumber: number;
  versionStatus: FsMappingVersionStatus;
  changeSummary: string | null;
  snapshotJson: Record<string, unknown>;
  rolledBackFromVersion: number | null;
  publishedAt: string | null;
  publishedBy: string | null;
  archivedAt: string | null;
  archivedBy: string | null;
  createdAt: string;
  createdBy: string | null;
};

export type FsMappingHistoryRecord = {
  id: string;
  mappingSetId: string;
  organizationId: string;
  workspaceId: string;
  engagementId: string;
  action: string;
  actorUserId: string | null;
  entityType: string | null;
  entityId: string | null;
  summary: string;
  detailsJson: Record<string, unknown>;
  createdAt: string;
};

export type FsTrialBalanceAccountInput = {
  id?: string | null;
  accountCode: string;
  accountName: string;
  debit?: number;
  credit?: number;
  netAmount?: number;
  previousYearAmount?: number | null;
};

export type FsClassificationResult = {
  classification: FsAccountClassification;
  statementSection: FsStatementSection;
  confidence: number;
  categoryLabel: string;
  parentClassification: FsAccountClassification | null;
};

export type FsValidationIssue = {
  code: string;
  severity: "error" | "warning";
  message: string;
  entityType?: "rule" | "line" | "section" | "set";
  entityId?: string | null;
  accountCode?: string | null;
  targetLineCode?: string | null;
};

export type FsValidationReport = {
  ok: boolean;
  errors: FsValidationIssue[];
  warnings: FsValidationIssue[];
  coveragePct: number;
  mappedCount: number;
  unmappedCount: number;
};

export type FsAggregatedLine = {
  lineCode: string;
  lineLabel: string;
  section: FsStatementSection;
  classification: FsAccountClassification;
  method: FsAggregationMethod;
  amount: number;
  previousYearAmount: number | null;
  sourceAccountCodes: string[];
  isCalculated: boolean;
};

export type FsStatementSectionNode = {
  section: FsStatementSection;
  label: string;
  lines: FsAggregatedLine[];
  total: number;
  previousTotal: number | null;
};

export type FsNormalizedDataset = {
  standard: FsMappingStandard;
  comparativeMode: FsComparativePeriod;
  sections: FsStatementSectionNode[];
  coveragePct: number;
  mappedAccountCount: number;
  unmappedAccountCount: number;
  builtAt: string;
};

export type FsMappingDashboardMetrics = {
  coveragePct: number;
  mappedAccounts: number;
  unmappedAccounts: number;
  validationErrors: number;
  validationWarnings: number;
  versionCount: number;
  setStatus: FsMappingSetStatus;
  standard: FsMappingStandard;
};
