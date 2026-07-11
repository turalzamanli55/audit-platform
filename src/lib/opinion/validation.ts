import { ValidationError } from "@/lib/errors";
import { OPINION_COMMENT_TYPES } from "@/constants/opinion";

export type CreateOpinionPackageInput = {
  engagementId: string;
};

export type UpdateOpinionPackageInput = {
  packageId: string;
  version: number;
  summaryNotes?: string | null;
};

export type OpinionWorkflowInput = {
  packageId: string;
  version: number;
  notes?: string | null;
};

export type AddOpinionCommentInput = {
  packageId: string;
  version: number;
  body: string;
  commentType?: string;
  parentCommentId?: string | null;
  opinionSectionId?: string | null;
  mentions?: string[];
  attachmentMetadata?: Array<{ name: string; type?: string; size?: number; url?: string }>;
};

export type UpdateOpinionCommentInput = {
  packageId: string;
  packageVersion: number;
  commentId: string;
  commentVersion: number;
  body: string;
  mentions?: string[];
  attachmentMetadata?: Array<{ name: string; type?: string; size?: number; url?: string }>;
};

export type OpinionCommentMutationInput = {
  packageId: string;
  packageVersion: number;
  commentId: string;
  commentVersion: number;
};

export type UpdateOpinionSectionInput = {
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

export type RestoreOpinionVersionInput = {
  packageId: string;
  version: number;
  versionId: string;
};

export type OpinionSectionMutationInput = {
  packageId: string;
  packageVersion: number;
  itemId: string;
  itemVersion: number;
  returnNotes?: string | null;
};

export function validateCreateOpinionPackageInput(input: CreateOpinionPackageInput) {
  if (!input.engagementId?.trim()) {
    throw new ValidationError("Engagement is required");
  }

  return { engagementId: input.engagementId.trim() };
}

export function validateUpdateOpinionPackageInput(input: UpdateOpinionPackageInput) {
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

export function validateOpinionWorkflowInput(input: OpinionWorkflowInput) {
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

export function validateAddOpinionCommentInput(input: AddOpinionCommentInput) {
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
    !OPINION_COMMENT_TYPES.includes(
      input.commentType as (typeof OPINION_COMMENT_TYPES)[number],
    )
  ) {
    throw new ValidationError("Invalid comment type");
  }

  return {
    packageId: input.packageId.trim(),
    version: input.version,
    body: input.body.trim(),
    commentType: (input.commentType ?? "opinion") as (typeof OPINION_COMMENT_TYPES)[number],
    parentCommentId: input.parentCommentId?.trim() || null,
    opinionSectionId: input.opinionSectionId?.trim() || null,
    mentions: input.mentions ?? [],
    attachmentMetadata: input.attachmentMetadata ?? [],
  };
}

export function validateUpdateOpinionCommentInput(input: UpdateOpinionCommentInput) {
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

export function validateOpinionCommentMutationInput(input: OpinionCommentMutationInput) {
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

export function validateUpdateOpinionSectionInput(input: UpdateOpinionSectionInput) {
  const base = validateOpinionSectionMutationInput({
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

export function validateRestoreOpinionVersionInput(input: RestoreOpinionVersionInput) {
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

export function validateOpinionSectionMutationInput(input: OpinionSectionMutationInput) {
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
