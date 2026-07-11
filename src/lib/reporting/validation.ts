import { ValidationError } from "@/lib/errors";
import { REPORT_COMMENT_TYPES } from "@/constants/reporting";

export type CreateReportingPackageInput = {
  engagementId: string;
};

export type UpdateReportingPackageInput = {
  packageId: string;
  version: number;
  summaryNotes?: string | null;
};

export type ReportingWorkflowInput = {
  packageId: string;
  version: number;
  notes?: string | null;
};

export type AddReportCommentInput = {
  packageId: string;
  version: number;
  body: string;
  commentType?: string;
  parentCommentId?: string | null;
  reportSectionId?: string | null;
  mentions?: string[];
  attachmentMetadata?: Array<{ name: string; type?: string; size?: number; url?: string }>;
};

export type UpdateReportCommentInput = {
  packageId: string;
  packageVersion: number;
  commentId: string;
  commentVersion: number;
  body: string;
  mentions?: string[];
  attachmentMetadata?: Array<{ name: string; type?: string; size?: number; url?: string }>;
};

export type ReportCommentMutationInput = {
  packageId: string;
  packageVersion: number;
  commentId: string;
  commentVersion: number;
};

export type UpdateReportSectionInput = {
  packageId: string;
  packageVersion: number;
  itemId: string;
  itemVersion: number;
  assignedReviewerId?: string | null;
  priority?: string | null;
  severity?: string | null;
  dueDate?: string | null;
  sectionStatus?: string;
};

export type RestoreReportVersionInput = {
  packageId: string;
  version: number;
  versionId: string;
};

export type ReportSectionMutationInput = {
  packageId: string;
  packageVersion: number;
  itemId: string;
  itemVersion: number;
  returnNotes?: string | null;
};

export function validateCreateReportingPackageInput(input: CreateReportingPackageInput) {
  if (!input.engagementId?.trim()) {
    throw new ValidationError("Engagement is required");
  }

  return { engagementId: input.engagementId.trim() };
}

export function validateUpdateReportingPackageInput(input: UpdateReportingPackageInput) {
  if (!input.packageId?.trim()) {
    throw new ValidationError("Review package is required");
  }
  if (!Number.isInteger(input.version) || input.version < 1) {
    throw new ValidationError("Review package version is required");
  }

  return {
    packageId: input.packageId.trim(),
    version: input.version,
    summaryNotes: input.summaryNotes?.trim() || null,
  };
}

export function validateReportingWorkflowInput(input: ReportingWorkflowInput) {
  if (!input.packageId?.trim()) {
    throw new ValidationError("Review package is required");
  }
  if (!Number.isInteger(input.version) || input.version < 1) {
    throw new ValidationError("Review package version is required");
  }

  return {
    packageId: input.packageId.trim(),
    version: input.version,
    notes: input.notes?.trim() || null,
  };
}

export function validateAddReportCommentInput(input: AddReportCommentInput) {
  if (!input.packageId?.trim()) {
    throw new ValidationError("Review package is required");
  }
  if (!Number.isInteger(input.version) || input.version < 1) {
    throw new ValidationError("Review package version is required");
  }
  if (!input.body?.trim()) {
    throw new ValidationError("Comment is required");
  }
  if (
    input.commentType &&
    !REPORT_COMMENT_TYPES.includes(
      input.commentType as (typeof REPORT_COMMENT_TYPES)[number],
    )
  ) {
    throw new ValidationError("Invalid comment type");
  }

  return {
    packageId: input.packageId.trim(),
    version: input.version,
    body: input.body.trim(),
    commentType: (input.commentType ?? "review") as (typeof REPORT_COMMENT_TYPES)[number],
    parentCommentId: input.parentCommentId?.trim() || null,
    reportSectionId: input.reportSectionId?.trim() || null,
    mentions: input.mentions ?? [],
    attachmentMetadata: input.attachmentMetadata ?? [],
  };
}

export function validateUpdateReportCommentInput(input: UpdateReportCommentInput) {
  if (!input.packageId?.trim()) {
    throw new ValidationError("Review package is required");
  }
  if (!input.commentId?.trim()) {
    throw new ValidationError("Comment is required");
  }
  if (!input.body?.trim()) {
    throw new ValidationError("Comment is required");
  }
  if (!Number.isInteger(input.packageVersion) || input.packageVersion < 1) {
    throw new ValidationError("Review package version is required");
  }
  if (!Number.isInteger(input.commentVersion) || input.commentVersion < 1) {
    throw new ValidationError("Comment version is required");
  }

  return {
    packageId: input.packageId.trim(),
    packageVersion: input.packageVersion,
    commentId: input.commentId.trim(),
    commentVersion: input.commentVersion,
    body: input.body.trim(),
    mentions: input.mentions ?? [],
    attachmentMetadata: input.attachmentMetadata ?? [],
  };
}

export function validateReportCommentMutationInput(input: ReportCommentMutationInput) {
  if (!input.packageId?.trim()) {
    throw new ValidationError("Review package is required");
  }
  if (!input.commentId?.trim()) {
    throw new ValidationError("Comment is required");
  }
  if (!Number.isInteger(input.packageVersion) || input.packageVersion < 1) {
    throw new ValidationError("Review package version is required");
  }
  if (!Number.isInteger(input.commentVersion) || input.commentVersion < 1) {
    throw new ValidationError("Comment version is required");
  }

  return {
    packageId: input.packageId.trim(),
    packageVersion: input.packageVersion,
    commentId: input.commentId.trim(),
    commentVersion: input.commentVersion,
  };
}

export function validateUpdateReportSectionInput(input: UpdateReportSectionInput) {
  const base = validateReportSectionMutationInput({
    packageId: input.packageId,
    packageVersion: input.packageVersion,
    itemId: input.itemId,
    itemVersion: input.itemVersion,
  });

  return {
    ...base,
    assignedReviewerId: input.assignedReviewerId ?? undefined,
    priority: input.priority ?? undefined,
    severity: input.severity ?? undefined,
    dueDate: input.dueDate ?? undefined,
    sectionStatus: input.sectionStatus ?? undefined,
  };
}

export function validateRestoreReportVersionInput(input: RestoreReportVersionInput) {
  if (!input.packageId?.trim()) {
    throw new ValidationError("Review package is required");
  }
  if (!input.versionId?.trim()) {
    throw new ValidationError("Version is required");
  }
  if (!Number.isInteger(input.version) || input.version < 1) {
    throw new ValidationError("Review package version is required");
  }

  return {
    packageId: input.packageId.trim(),
    version: input.version,
    versionId: input.versionId.trim(),
  };
}

export function validateReportSectionMutationInput(input: ReportSectionMutationInput) {
  if (!input.packageId?.trim()) {
    throw new ValidationError("Review package is required");
  }
  if (!input.itemId?.trim()) {
    throw new ValidationError("Review item is required");
  }
  if (!Number.isInteger(input.packageVersion) || input.packageVersion < 1) {
    throw new ValidationError("Review package version is required");
  }
  if (!Number.isInteger(input.itemVersion) || input.itemVersion < 1) {
    throw new ValidationError("Review item version is required");
  }

  return {
    packageId: input.packageId.trim(),
    packageVersion: input.packageVersion,
    itemId: input.itemId.trim(),
    itemVersion: input.itemVersion,
    returnNotes: input.returnNotes?.trim() || null,
  };
}

export function validateArchiveReportingInput(input: {
  packageId: string;
  version: number;
  archiveReason?: string | null;
}) {
  if (!input.packageId?.trim()) {
    throw new ValidationError("Review package is required");
  }
  if (!Number.isInteger(input.version) || input.version < 1) {
    throw new ValidationError("Review package version is required");
  }

  return {
    packageId: input.packageId.trim(),
    version: input.version,
    archiveReason: input.archiveReason?.trim() || null,
  };
}
