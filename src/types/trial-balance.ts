import type {
  TRIAL_BALANCE_ACCOUNT_TYPES,
  TRIAL_BALANCE_ADJUSTMENT_STATUSES,
  TRIAL_BALANCE_ADJUSTMENT_TYPES,
  TRIAL_BALANCE_FS_STATEMENTS,
  TRIAL_BALANCE_LEAD_SCHEDULES,
  TRIAL_BALANCE_MAPPING_FRAMEWORKS,
  TRIAL_BALANCE_PACKAGE_STATUSES,
  TRIAL_BALANCE_PERIOD_TYPES,
  TRIAL_BALANCE_WORKSPACE_SECTIONS,
} from "@/constants/trial-balance";

export type TrialBalancePackageStatus = (typeof TRIAL_BALANCE_PACKAGE_STATUSES)[number];
export type TrialBalanceAccountType = (typeof TRIAL_BALANCE_ACCOUNT_TYPES)[number];
export type TrialBalancePeriodType = (typeof TRIAL_BALANCE_PERIOD_TYPES)[number];
export type TrialBalanceAdjustmentType = (typeof TRIAL_BALANCE_ADJUSTMENT_TYPES)[number];
export type TrialBalanceAdjustmentStatus = (typeof TRIAL_BALANCE_ADJUSTMENT_STATUSES)[number];
export type TrialBalanceMappingFramework = (typeof TRIAL_BALANCE_MAPPING_FRAMEWORKS)[number];
export type TrialBalanceLeadSchedule = (typeof TRIAL_BALANCE_LEAD_SCHEDULES)[number];
export type TrialBalanceFsStatement = (typeof TRIAL_BALANCE_FS_STATEMENTS)[number];
export type TrialBalanceWorkspaceSection = (typeof TRIAL_BALANCE_WORKSPACE_SECTIONS)[number];

export type TrialBalanceBuiltLine = {
  accountCode: string;
  accountName: string;
  parentAccountCode: string | null;
  accountLevel: number;
  accountType: TrialBalanceAccountType;
  category: string | null;
  subcategory: string | null;
  classificationConfidence: number;
  openingDebit: number;
  openingCredit: number;
  movementDebit: number;
  movementCredit: number;
  closingDebit: number;
  closingCredit: number;
  closingBalance: number;
  originalCurrency: string | null;
  exchangeRate: number;
  functionalAmount: number;
  presentationAmount: number | null;
  fxGainLoss: number;
  leadSchedule: TrialBalanceLeadSchedule;
  fsStatement: TrialBalanceFsStatement;
  isMapped: boolean;
  isOrphan: boolean;
  sourceRowNumber: number | null;
  sortOrder: number;
};

export type TrialBalanceValidationIssue = {
  issueCode: string;
  severity: "info" | "warning" | "error" | "blocking";
  message: string;
  accountCode?: string | null;
};

export type TrialBalanceBuildResult = {
  lines: TrialBalanceBuiltLine[];
  issues: TrialBalanceValidationIssue[];
  isBalanced: boolean;
  outOfBalanceAmount: number;
  summary: {
    accountCount: number;
    warningCount: number;
    errorCount: number;
    mappedCount: number;
    unmappedCount: number;
    debitTotal: number;
    creditTotal: number;
  };
};
