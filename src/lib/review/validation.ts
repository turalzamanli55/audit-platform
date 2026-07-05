import { ValidationError } from "@/lib/errors";
import { REVIEW_COMMENT_TYPES } from "@/constants/review";

export type CreateReviewPackageInput = {
  engagementId: string;
};

export type UpdateReviewPackageInput = {
  packageId: string;
  version: number;
  summaryNotes?: string | null;
};

export type ReviewWorkflowInput = {
  packageId: string;
  version: number;
  notes?: string | null;
};

export type AddReviewCommentInput = {
  packageId: string;
  version: number;
  body: string;
  commentType?: string;
  parentCommentId?: string | null;
  reviewItemId?: string | null;
  mentions?: string[];
  attachmentMetadata?: Array<{ name: string; type?: string; size?: number; url?: string }>;
};

export type UpdateReviewCommentInput = {
  packageId: string;
  packageVersion: number;
  commentId: string;
  commentVersion: number;
  body: string;
  mentions?: string[];
  attachmentMetadata?: Array<{ name: string; type?: string; size?: number; url?: string }>;
};

export type ReviewCommentMutationInput = {
  packageId: string;
  packageVersion: number;
  commentId: string;
  commentVersion: number;
};

export type UpdateReviewItemInput = {
  packageId: string;
  packageVersion: number;
  itemId: string;
  itemVersion: number;
  assignedReviewerId?: string | null;
  priority?: string | null;
  severity?: string | null;
  dueDate?: string | null;
  itemStatus?: string;
};

export type RestoreReviewVersionInput = {
  packageId: string;
  version: number;
  versionId: string;
};

export type ReviewItemMutationInput = {
  packageId: string;
  packageVersion: number;
  itemId: string;
  itemVersion: number;
  returnNotes?: string | null;
};

export function validateCreateReviewPackageInput(input: CreateReviewPackageInput) {
  if (!input.engagementId?.trim()) {
    throw new ValidationError("Engagement is required");
  }

  return { engagementId: input.engagementId.trim() };
}

export function validateUpdateReviewPackageInput(input: UpdateReviewPackageInput) {
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

export function validateReviewWorkflowInput(input: ReviewWorkflowInput) {
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

export function validateAddReviewCommentInput(input: AddReviewCommentInput) {
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
    !REVIEW_COMMENT_TYPES.includes(
      input.commentType as (typeof REVIEW_COMMENT_TYPES)[number],
    )
  ) {
    throw new ValidationError("Invalid comment type");
  }

  return {
    packageId: input.packageId.trim(),
    version: input.version,
    body: input.body.trim(),
    commentType: (input.commentType ?? "review") as (typeof REVIEW_COMMENT_TYPES)[number],
    parentCommentId: input.parentCommentId?.trim() || null,
    reviewItemId: input.reviewItemId?.trim() || null,
    mentions: input.mentions ?? [],
    attachmentMetadata: input.attachmentMetadata ?? [],
  };
}

export function validateUpdateReviewCommentInput(input: UpdateReviewCommentInput) {
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

export function validateReviewCommentMutationInput(input: ReviewCommentMutationInput) {
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

export function validateUpdateReviewItemInput(input: UpdateReviewItemInput) {
  const base = validateReviewItemMutationInput({
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
    itemStatus: input.itemStatus ?? undefined,
  };
}

export function validateRestoreReviewVersionInput(input: RestoreReviewVersionInput) {
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

export function validateReviewItemMutationInput(input: ReviewItemMutationInput) {
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

export function validateArchiveReviewInput(input: {
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
