import { ValidationError } from "@/lib/errors";
import { COMPLETION_COMMENT_TYPES } from "@/constants/completion";

export type CreateCompletionPackageInput = {
  engagementId: string;
};

export type UpdateCompletionPackageInput = {
  packageId: string;
  version: number;
  summaryNotes?: string | null;
};

export type CompletionWorkflowInput = {
  packageId: string;
  version: number;
  notes?: string | null;
};

export type AddCompletionCommentInput = {
  packageId: string;
  version: number;
  body: string;
  commentType?: string;
  parentCommentId?: string | null;
  completionItemId?: string | null;
  mentions?: string[];
  attachmentMetadata?: Array<{ name: string; type?: string; size?: number; url?: string }>;
};

export type UpdateCompletionCommentInput = {
  packageId: string;
  packageVersion: number;
  commentId: string;
  commentVersion: number;
  body: string;
  mentions?: string[];
  attachmentMetadata?: Array<{ name: string; type?: string; size?: number; url?: string }>;
};

export type CompletionCommentMutationInput = {
  packageId: string;
  packageVersion: number;
  commentId: string;
  commentVersion: number;
};

export type UpdateCompletionItemInput = {
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

export type RestoreCompletionVersionInput = {
  packageId: string;
  version: number;
  versionId: string;
};

export type CompletionItemMutationInput = {
  packageId: string;
  packageVersion: number;
  itemId: string;
  itemVersion: number;
  returnNotes?: string | null;
};

export function validateCreateCompletionPackageInput(input: CreateCompletionPackageInput) {
  if (!input.engagementId?.trim()) {
    throw new ValidationError("Engagement is required");
  }

  return { engagementId: input.engagementId.trim() };
}

export function validateUpdateCompletionPackageInput(input: UpdateCompletionPackageInput) {
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

export function validateCompletionWorkflowInput(input: CompletionWorkflowInput) {
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

export function validateAddCompletionCommentInput(input: AddCompletionCommentInput) {
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
    !COMPLETION_COMMENT_TYPES.includes(
      input.commentType as (typeof COMPLETION_COMMENT_TYPES)[number],
    )
  ) {
    throw new ValidationError("Invalid comment type");
  }

  return {
    packageId: input.packageId.trim(),
    version: input.version,
    body: input.body.trim(),
    commentType: (input.commentType ?? "review") as (typeof COMPLETION_COMMENT_TYPES)[number],
    parentCommentId: input.parentCommentId?.trim() || null,
    completionItemId: input.completionItemId?.trim() || null,
    mentions: input.mentions ?? [],
    attachmentMetadata: input.attachmentMetadata ?? [],
  };
}

export function validateUpdateCompletionCommentInput(input: UpdateCompletionCommentInput) {
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

export function validateCompletionCommentMutationInput(input: CompletionCommentMutationInput) {
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

export function validateUpdateCompletionItemInput(input: UpdateCompletionItemInput) {
  const base = validateCompletionItemMutationInput({
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

export function validateRestoreCompletionVersionInput(input: RestoreCompletionVersionInput) {
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

export function validateCompletionItemMutationInput(input: CompletionItemMutationInput) {
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

export function validateArchiveCompletionInput(input: {
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
