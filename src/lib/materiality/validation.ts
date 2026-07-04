import { ValidationError } from "@/lib/errors";
import {
  MATERIALITY_BENCHMARK_TYPES,
  MATERIALITY_COMMENT_TYPES,
} from "@/constants/materiality";

export type CreateMaterialityPackageInput = {
  engagementId: string;
};

export type UpdateMaterialityThresholdsInput = {
  packageId: string;
  version: number;
  overallMateriality?: number | null;
  performanceMateriality?: number | null;
  performanceMaterialityPct?: number | null;
  trivialThreshold?: number | null;
  trivialThresholdPct?: number | null;
  basisNotes?: string | null;
  specificMateriality?: Array<{
    id: string;
    label: string;
    amount: number;
    rationale?: string | null;
  }>;
  currencyCode?: string;
};

export type UpsertMaterialityBenchmarkInput = {
  packageId: string;
  version: number;
  benchmarkId?: string;
  benchmarkType: string;
  benchmarkLabel?: string | null;
  benchmarkAmount: number;
  percentage: number;
  rationale?: string | null;
  sortOrder?: number;
};

export type AddMaterialityCommentInput = {
  packageId: string;
  version: number;
  body: string;
  commentType?: string;
};

export function validateCreateMaterialityPackageInput(input: CreateMaterialityPackageInput) {
  if (!input.engagementId?.trim()) {
    throw new ValidationError("Engagement is required");
  }

  return { engagementId: input.engagementId.trim() };
}

export function validateMaterialityWorkflowInput(input: {
  packageId: string;
  version: number;
  notes?: string | null;
}) {
  if (!input.packageId?.trim()) {
    throw new ValidationError("Materiality package is required");
  }
  if (!Number.isInteger(input.version) || input.version < 1) {
    throw new ValidationError("Materiality package version is required");
  }

  return {
    packageId: input.packageId.trim(),
    version: input.version,
    notes: input.notes?.trim() || null,
  };
}

export function validateUpdateMaterialityThresholdsInput(input: UpdateMaterialityThresholdsInput) {
  if (!input.packageId?.trim()) {
    throw new ValidationError("Materiality package is required");
  }
  if (!Number.isInteger(input.version) || input.version < 1) {
    throw new ValidationError("Materiality package version is required");
  }

  if (
    input.performanceMaterialityPct != null &&
    (input.performanceMaterialityPct <= 0 || input.performanceMaterialityPct > 100)
  ) {
    throw new ValidationError("Performance materiality percentage must be between 0 and 100");
  }

  if (
    input.trivialThresholdPct != null &&
    (input.trivialThresholdPct <= 0 || input.trivialThresholdPct > 100)
  ) {
    throw new ValidationError("Trivial threshold percentage must be between 0 and 100");
  }

  return input;
}

export function validateUpsertMaterialityBenchmarkInput(input: UpsertMaterialityBenchmarkInput) {
  if (!input.packageId?.trim()) {
    throw new ValidationError("Materiality package is required");
  }
  if (!Number.isInteger(input.version) || input.version < 1) {
    throw new ValidationError("Materiality package version is required");
  }
  if (
    !MATERIALITY_BENCHMARK_TYPES.includes(
      input.benchmarkType as (typeof MATERIALITY_BENCHMARK_TYPES)[number],
    )
  ) {
    throw new ValidationError("Invalid benchmark type");
  }
  if (input.benchmarkAmount < 0) {
    throw new ValidationError("Benchmark amount must be non-negative");
  }
  if (input.percentage <= 0 || input.percentage > 100) {
    throw new ValidationError("Benchmark percentage must be between 0 and 100");
  }

  return input;
}

export function validateAddMaterialityCommentInput(input: AddMaterialityCommentInput) {
  if (!input.packageId?.trim()) {
    throw new ValidationError("Materiality package is required");
  }
  if (!Number.isInteger(input.version) || input.version < 1) {
    throw new ValidationError("Materiality package version is required");
  }
  if (!input.body?.trim()) {
    throw new ValidationError("Comment is required");
  }
  if (
    input.commentType &&
    !MATERIALITY_COMMENT_TYPES.includes(
      input.commentType as (typeof MATERIALITY_COMMENT_TYPES)[number],
    )
  ) {
    throw new ValidationError("Invalid comment type");
  }

  return {
    packageId: input.packageId.trim(),
    version: input.version,
    body: input.body.trim(),
    commentType: (input.commentType ?? "review") as (typeof MATERIALITY_COMMENT_TYPES)[number],
  };
}
