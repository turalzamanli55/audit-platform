import type {
  IFRS_DISCLOSURE_KINDS,
  IFRS_NOTE_ITEM_KINDS,
  IFRS_NOTE_PACKAGE_STATUSES,
  IFRS_NOTE_STANDARDS,
  IFRS_NOTE_TYPES,
  IFRS_NOTE_VERSION_STATUSES,
  IFRS_NOTES_WORKSPACE_SECTIONS,
} from "@/constants/ifrs-notes";
import type { FsNormalizedDataset } from "@/types/fs-mapping";

export type IfrsNotePackageStatus = (typeof IFRS_NOTE_PACKAGE_STATUSES)[number];
export type IfrsNoteVersionStatus = (typeof IFRS_NOTE_VERSION_STATUSES)[number];
export type IfrsNoteStandard = (typeof IFRS_NOTE_STANDARDS)[number];
export type IfrsNoteType = (typeof IFRS_NOTE_TYPES)[number];
export type IfrsDisclosureKind = (typeof IFRS_DISCLOSURE_KINDS)[number];
export type IfrsNoteItemKind = (typeof IFRS_NOTE_ITEM_KINDS)[number];
export type IfrsNotesWorkspaceSection = (typeof IFRS_NOTES_WORKSPACE_SECTIONS)[number];

export type IfrsNotePackage = {
  id: string;
  organizationId: string;
  workspaceId: string;
  companyId: string;
  engagementId: string;
  mappingSetId: string | null;
  name: string;
  description: string | null;
  standard: IfrsNoteStandard;
  packageStatus: IfrsNotePackageStatus;
  packageVersion: number;
  versionCount: number;
  requiredNoteCount: number;
  completedNoteCount: number;
  missingNoteCount: number;
  validationErrorCount: number;
  validationWarningCount: number;
  coveragePct: number;
  summaryJson: Record<string, unknown>;
  validationJson: Record<string, unknown>;
  structureJson: Record<string, unknown>;
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

export type IfrsNoteSection = {
  id: string;
  packageId: string;
  organizationId: string;
  workspaceId: string;
  engagementId: string;
  noteType: IfrsNoteType;
  noteCode: string;
  title: string;
  standardRef: string | null;
  disclosureKind: IfrsDisclosureKind;
  sortOrder: number;
  isRequired: boolean;
  isCompleted: boolean;
  isApplicable: boolean;
  parentSectionId: string | null;
  metadataJson: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  version: number;
};

export type IfrsNoteItem = {
  id: string;
  packageId: string;
  sectionId: string;
  organizationId: string;
  workspaceId: string;
  engagementId: string;
  itemKind: IfrsNoteItemKind;
  itemCode: string;
  title: string | null;
  bodyText: string;
  tableJson: unknown[];
  listJson: unknown[];
  sortOrder: number;
  isEditable: boolean;
  metadataJson: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  version: number;
};

export type IfrsNoteCrossReference = {
  id: string;
  packageId: string;
  organizationId: string;
  workspaceId: string;
  engagementId: string;
  fromSectionId: string | null;
  fromItemId: string | null;
  toSectionId: string | null;
  statementLineCode: string | null;
  disclosureCode: string | null;
  sourceAccountCode: string | null;
  referenceLabel: string;
  metadataJson: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  version: number;
};

export type IfrsNoteVersion = {
  id: string;
  packageId: string;
  organizationId: string;
  workspaceId: string;
  engagementId: string;
  versionNumber: number;
  versionStatus: IfrsNoteVersionStatus;
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

export type IfrsNoteComment = {
  id: string;
  packageId: string;
  sectionId: string | null;
  itemId: string | null;
  organizationId: string;
  workspaceId: string;
  engagementId: string;
  body: string;
  authorUserId: string | null;
  resolvedAt: string | null;
  resolvedBy: string | null;
  createdAt: string;
  updatedAt: string;
  version: number;
};

export type IfrsNoteHistoryRecord = {
  id: string;
  packageId: string;
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

export type IfrsDisclosureRequirement = {
  noteType: IfrsNoteType;
  noteCode: string;
  title: string;
  standardRef: string;
  disclosureKind: IfrsDisclosureKind;
  isRequired: boolean;
  triggerClassifications: string[];
  standard: IfrsNoteStandard;
};

export type IfrsNoteStructure = {
  sections: Array<IfrsNoteSection & { items: IfrsNoteItem[] }>;
  crossReferences: IfrsNoteCrossReference[];
};

export type IfrsNoteValidationIssue = {
  code: string;
  severity: "error" | "warning";
  message: string;
  entityType?: "package" | "section" | "item" | "cross_reference";
  entityId?: string | null;
  noteCode?: string | null;
};

export type IfrsNoteValidationReport = {
  ok: boolean;
  errors: IfrsNoteValidationIssue[];
  warnings: IfrsNoteValidationIssue[];
  requiredCount: number;
  completedCount: number;
  missingCount: number;
  coveragePct: number;
};

export type IfrsNotesDashboardMetrics = {
  requiredNotes: number;
  completedNotes: number;
  missingNotes: number;
  validationErrors: number;
  warnings: number;
  coveragePct: number;
  packageStatus: IfrsNotePackageStatus;
  standard: IfrsNoteStandard;
};

export type IfrsNotesEngineInput = {
  package: IfrsNotePackage;
  dataset: FsNormalizedDataset | null;
  idFactory?: () => string;
};

export type IfrsNoteSectionDraft = Omit<
  IfrsNoteSection,
  "id" | "createdAt" | "updatedAt" | "version"
>;

export type IfrsNoteItemDraft = Omit<
  IfrsNoteItem,
  "id" | "createdAt" | "updatedAt" | "version" | "sectionId"
>;

export type IfrsNoteCrossReferenceDraft = Omit<
  IfrsNoteCrossReference,
  "id" | "createdAt" | "updatedAt" | "version"
>;

export type IfrsNotesEngineResult = {
  requirements: IfrsDisclosureRequirement[];
  sectionDrafts: IfrsNoteSectionDraft[];
  itemDrafts: Array<IfrsNoteItemDraft & { noteCode: string }>;
  crossReferenceDrafts: IfrsNoteCrossReferenceDraft[];
  sections: IfrsNoteSection[];
  items: IfrsNoteItem[];
  crossReferences: IfrsNoteCrossReference[];
  structure: IfrsNoteStructure;
  validation: IfrsNoteValidationReport;
  metrics: IfrsNotesDashboardMetrics;
};
