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
