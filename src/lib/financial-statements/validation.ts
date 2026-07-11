import { ValidationError } from "@/lib/errors";
import { FINANCIAL_STATEMENT_COMMENT_TYPES } from "@/constants/financial-statements";

export type CreateFinancialStatementPackageInput = {
  engagementId: string;
};

export type UpdateFinancialStatementPackageInput = {
  packageId: string;
  version: number;
  summaryNotes?: string | null;
};

export type FinancialStatementsWorkflowInput = {
  packageId: string;
  version: number;
  notes?: string | null;
};

export type AddFinancialStatementCommentInput = {
  packageId: string;
  version: number;
  body: string;
  commentType?: string;
  parentCommentId?: string | null;
  financialStatementSectionId?: string | null;
  mentions?: string[];
  attachmentMetadata?: Array<{ name: string; type?: string; size?: number; url?: string }>;
};

export type UpdateFinancialStatementCommentInput = {
  packageId: string;
  packageVersion: number;
  commentId: string;
  commentVersion: number;
  body: string;
  mentions?: string[];
  attachmentMetadata?: Array<{ name: string; type?: string; size?: number; url?: string }>;
};

export type FinancialStatementCommentMutationInput = {
  packageId: string;
  packageVersion: number;
  commentId: string;
  commentVersion: number;
};

export type UpdateFinancialStatementSectionInput = {
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

export type RestoreFinancialStatementVersionInput = {
  packageId: string;
  version: number;
  versionId: string;
};

export type FinancialStatementSectionMutationInput = {
  packageId: string;
  packageVersion: number;
  itemId: string;
  itemVersion: number;
  returnNotes?: string | null;
};

export function validateCreateFinancialStatementPackageInput(input: CreateFinancialStatementPackageInput) {
  if (!input.engagementId?.trim()) {
    throw new ValidationError("Engagement is required");
  }

  return { engagementId: input.engagementId.trim() };
}

export function validateUpdateFinancialStatementPackageInput(input: UpdateFinancialStatementPackageInput) {
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

export function validateFinancialStatementsWorkflowInput(input: FinancialStatementsWorkflowInput) {
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

export function validateAddFinancialStatementCommentInput(input: AddFinancialStatementCommentInput) {
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
    !FINANCIAL_STATEMENT_COMMENT_TYPES.includes(
      input.commentType as (typeof FINANCIAL_STATEMENT_COMMENT_TYPES)[number],
    )
  ) {
    throw new ValidationError("Invalid comment type");
  }

  return {
    packageId: input.packageId.trim(),
    version: input.version,
    body: input.body.trim(),
    commentType: (input.commentType ?? "financialStatements") as (typeof FINANCIAL_STATEMENT_COMMENT_TYPES)[number],
    parentCommentId: input.parentCommentId?.trim() || null,
    financialStatementSectionId: input.financialStatementSectionId?.trim() || null,
    mentions: input.mentions ?? [],
    attachmentMetadata: input.attachmentMetadata ?? [],
  };
}

export function validateUpdateFinancialStatementCommentInput(input: UpdateFinancialStatementCommentInput) {
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

export function validateFinancialStatementCommentMutationInput(input: FinancialStatementCommentMutationInput) {
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

export function validateUpdateFinancialStatementSectionInput(input: UpdateFinancialStatementSectionInput) {
  const base = validateFinancialStatementSectionMutationInput({
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

export function validateRestoreFinancialStatementVersionInput(input: RestoreFinancialStatementVersionInput) {
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

export function validateFinancialStatementSectionMutationInput(input: FinancialStatementSectionMutationInput) {
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
