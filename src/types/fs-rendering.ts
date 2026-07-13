import type {
  DEFAULT_FS_RENDER_FORMATTING,
  FS_RENDER_COMPARATIVE_MODES,
  FS_RENDER_LAYOUT_MODES,
  FS_RENDER_LINE_STYLES,
  FS_RENDER_PRESENTATION_STATUSES,
  FS_RENDER_STANDARDS,
  FS_RENDER_STATEMENT_TYPES,
  FS_RENDER_VERSION_STATUSES,
  FS_RENDERING_WORKSPACE_SECTIONS,
} from "@/constants/fs-rendering";
import type { FsNormalizedDataset } from "@/types/fs-mapping";

export type FsRenderPresentationStatus = (typeof FS_RENDER_PRESENTATION_STATUSES)[number];
export type FsRenderVersionStatus = (typeof FS_RENDER_VERSION_STATUSES)[number];
export type FsRenderStandard = (typeof FS_RENDER_STANDARDS)[number];
export type FsRenderLayoutMode = (typeof FS_RENDER_LAYOUT_MODES)[number];
export type FsRenderComparativeMode = (typeof FS_RENDER_COMPARATIVE_MODES)[number];
export type FsRenderStatementType = (typeof FS_RENDER_STATEMENT_TYPES)[number];
export type FsRenderLineStyle = (typeof FS_RENDER_LINE_STYLES)[number];
export type FsRenderingWorkspaceSection = (typeof FS_RENDERING_WORKSPACE_SECTIONS)[number];

export type FsRenderFormattingOptions = {
  currencyCode: string;
  decimals: number;
  thousandsSeparator: boolean;
  negativeStyle: "minus" | "parentheses";
  zeroSuppression: boolean;
  multiCurrencyDisplay: boolean;
};

export type FsRenderLayout = {
  id: string;
  organizationId: string;
  workspaceId: string;
  companyId: string | null;
  engagementId: string | null;
  layoutCode: string;
  layoutName: string;
  layoutMode: FsRenderLayoutMode;
  standard: FsRenderStandard;
  isSystem: boolean;
  formattingJson: FsRenderFormattingOptions & Record<string, unknown>;
  metadataJson: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  deletedAt: string | null;
  version: number;
};

export type FsRenderHistoryEntry = {
  action: string;
  actorUserId: string | null;
  summary: string;
  detailsJson: Record<string, unknown>;
  createdAt: string;
};

export type FsRenderPresentation = {
  id: string;
  organizationId: string;
  workspaceId: string;
  companyId: string;
  engagementId: string;
  mappingSetId: string | null;
  layoutId: string | null;
  name: string;
  description: string | null;
  standard: FsRenderStandard;
  presentationStatus: FsRenderPresentationStatus;
  layoutMode: FsRenderLayoutMode;
  comparativeMode: FsRenderComparativeMode;
  currencyCode: string;
  presentationVersion: number;
  versionCount: number;
  renderedStatementCount: number;
  validationErrorCount: number;
  validationWarningCount: number;
  presentationCoveragePct: number;
  formattingJson: FsRenderFormattingOptions & Record<string, unknown>;
  validationJson: Record<string, unknown>;
  renderJson: Record<string, unknown>;
  historyJson: FsRenderHistoryEntry[];
  summaryJson: Record<string, unknown>;
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

export type FsRenderVersion = {
  id: string;
  presentationId: string;
  organizationId: string;
  workspaceId: string;
  engagementId: string;
  versionNumber: number;
  versionStatus: FsRenderVersionStatus;
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

export type FsRenderedLine = {
  lineCode: string;
  label: string;
  amount: number | null;
  previousAmount: number | null;
  multiYearAmounts: Array<{ year: number; amount: number }>;
  formattedAmount: string;
  formattedPreviousAmount: string | null;
  indentation: number;
  style: FsRenderLineStyle;
  isHidden: boolean;
  isCalculated: boolean;
  referenceCode: string | null;
  crossReferenceCode: string | null;
  sourceAccountCodes: string[];
};

export type FsRenderedSection = {
  statementType: FsRenderStatementType;
  title: string;
  lines: FsRenderedLine[];
  totalFormatted: string;
  previousTotalFormatted: string | null;
};

export type FsRenderedStatementBundle = {
  standard: FsRenderStandard;
  layoutMode: FsRenderLayoutMode;
  comparativeMode: FsRenderComparativeMode;
  formatting: FsRenderFormattingOptions;
  statements: FsRenderedSection[];
  sourceDatasetBuiltAt: string | null;
  renderedAt: string;
};

export type FsRenderValidationIssue = {
  code: string;
  severity: "error" | "warning";
  message: string;
  entityType?: "presentation" | "section" | "line" | "layout";
  entityId?: string | null;
  lineCode?: string | null;
};

export type FsRenderValidationReport = {
  ok: boolean;
  errors: FsRenderValidationIssue[];
  warnings: FsRenderValidationIssue[];
  presentationCoveragePct: number;
  renderedStatementCount: number;
};

export type FsRenderDashboardMetrics = {
  renderedStatements: number;
  validationStatus: "ok" | "errors" | "warnings" | "empty";
  presentationCoveragePct: number;
  renderingErrors: number;
  warnings: number;
  presentationStatus: FsRenderPresentationStatus;
  standard: FsRenderStandard;
  layoutMode: FsRenderLayoutMode;
};

export type FsRenderEngineInput = {
  presentation: FsRenderPresentation;
  dataset: FsNormalizedDataset | null;
  formatting?: Partial<FsRenderFormattingOptions>;
};

export type FsRenderEngineResult = {
  bundle: FsRenderedStatementBundle;
  validation: FsRenderValidationReport;
  metrics: FsRenderDashboardMetrics;
};

export type DefaultFormatting = typeof DEFAULT_FS_RENDER_FORMATTING;
