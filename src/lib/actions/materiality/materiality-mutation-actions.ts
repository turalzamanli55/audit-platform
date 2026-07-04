"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, MATERIALITY_PERMISSIONS } from "@/constants/materiality";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createMaterialityAction as defineMaterialityAction } from "@/lib/actions/materiality/materiality-action";
import {
  buildCalculationExplanation,
  calculatePerformanceMateriality,
  calculateTrivialThreshold,
} from "@/lib/materiality/materiality-engine";
import {
  validateAddMaterialityCommentInput,
  validateUpdateMaterialityThresholdsInput,
  validateUpsertMaterialityBenchmarkInput,
} from "@/lib/materiality/validation";
import { createServerClient } from "@/lib/supabase/server";
import { MaterialityRepository } from "@/repositories/materiality/materiality-repository";
import type { RepositoryContext } from "@/types/context";
import { ValidationError } from "@/lib/errors";

function createRepositoryContext(
  userId: string,
  organizationId: string,
  workspaceId: string,
): RepositoryContext {
  return {
    userId,
    tenant: {
      organization: { organizationId, isResolved: true },
      workspace: { workspaceId, isResolved: true },
      company: { companyId: null, isResolved: false },
      permissions: { permissions: [], isResolved: false },
      roles: { roles: [], isResolved: false },
    },
  };
}

async function loadEditablePackage(
  packageId: string,
  workspaceId: string,
  expectedVersion: number,
  materialityRepository: MaterialityRepository,
) {
  const pkg = await materialityRepository.validateWorkspaceOwnership(packageId, workspaceId);
  if (pkg.version !== expectedVersion) {
    throw new ValidationError("Materiality package was modified by another user");
  }
  return pkg;
}

export const updateMaterialityThresholdsAction = defineMaterialityAction<
  import("@/lib/materiality/validation").UpdateMaterialityThresholdsInput,
  { packageId: string; version: number }
>(
  { module: "materiality.thresholds.update" },
  MATERIALITY_PERMISSIONS.UPDATE,
  async (input, context) => {
    const validated = validateUpdateMaterialityThresholdsInput(input);

    const supabase = await createServerClient();
    const repositoryContext = createRepositoryContext(
      context.userId,
      context.organizationId,
      context.workspaceId,
    );
    const materialityRepository = new MaterialityRepository(supabase, repositoryContext);

    const pkg = await loadEditablePackage(
      validated.packageId,
      context.workspaceId,
      validated.version,
      materialityRepository,
    );

    const overallMateriality =
      validated.overallMateriality ?? (pkg.overall_materiality != null ? Number(pkg.overall_materiality) : null);
    const performancePct =
      validated.performanceMaterialityPct ??
      (pkg.performance_materiality_pct != null ? Number(pkg.performance_materiality_pct) : null);
    const trivialPct =
      validated.trivialThresholdPct ??
      (pkg.trivial_threshold_pct != null ? Number(pkg.trivial_threshold_pct) : null);

    let performanceMateriality = validated.performanceMateriality ?? null;
    let trivialThreshold = validated.trivialThreshold ?? null;

    if (overallMateriality != null && performancePct != null && performanceMateriality == null) {
      performanceMateriality = calculatePerformanceMateriality(overallMateriality, performancePct);
    }
    if (overallMateriality != null && trivialPct != null && trivialThreshold == null) {
      trivialThreshold = calculateTrivialThreshold(overallMateriality, trivialPct);
    }

    const updated = await materialityRepository.updatePackage(validated.packageId, validated.version, {
      overall_materiality: validated.overallMateriality,
      performance_materiality: performanceMateriality,
      performance_materiality_pct: validated.performanceMaterialityPct,
      trivial_threshold: trivialThreshold,
      trivial_threshold_pct: validated.trivialThresholdPct,
      basis_notes: validated.basisNotes,
      specific_materiality: validated.specificMateriality,
      currency_code: validated.currencyCode,
    });

    if (overallMateriality != null && performancePct != null && performanceMateriality != null) {
      await materialityRepository.recordCalculation({
        materialityPackageId: updated.id,
        benchmarkId: updated.selected_benchmark_id,
        calculationType: "performance",
        inputAmount: overallMateriality,
        percentage: performancePct,
        resultAmount: performanceMateriality,
        isManualOverride: validated.performanceMateriality != null,
        explanation: buildCalculationExplanation({
          calculationType: "performance",
          inputAmount: overallMateriality,
          percentage: performancePct,
          resultAmount: performanceMateriality,
          currencyCode: updated.currency_code,
        }),
      });
    }

    if (overallMateriality != null && trivialPct != null && trivialThreshold != null) {
      await materialityRepository.recordCalculation({
        materialityPackageId: updated.id,
        benchmarkId: updated.selected_benchmark_id,
        calculationType: "trivial",
        inputAmount: overallMateriality,
        percentage: trivialPct,
        resultAmount: trivialThreshold,
        isManualOverride: validated.trivialThreshold != null,
        explanation: buildCalculationExplanation({
          calculationType: "trivial",
          inputAmount: overallMateriality,
          percentage: trivialPct,
          resultAmount: trivialThreshold,
          currencyCode: updated.currency_code,
        }),
      });
    }

    await materialityRepository.recomputeProgress(updated.id);

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.MATERIALITY_THRESHOLDS_UPDATED,
      resourceType: AUDIT_RESOURCE_TYPE,
      resourceId: updated.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: { version: updated.version },
    });

    return { packageId: updated.id, version: updated.version };
  },
);

export const upsertMaterialityBenchmarkAction = defineMaterialityAction<
  import("@/lib/materiality/validation").UpsertMaterialityBenchmarkInput,
  { benchmarkId: string; version: number }
>(
  { module: "materiality.benchmark.upsert" },
  MATERIALITY_PERMISSIONS.UPDATE,
  async (input, context) => {
    const validated = validateUpsertMaterialityBenchmarkInput(input);

    const supabase = await createServerClient();
    const repositoryContext = createRepositoryContext(
      context.userId,
      context.organizationId,
      context.workspaceId,
    );
    const materialityRepository = new MaterialityRepository(supabase, repositoryContext);

    await loadEditablePackage(
      validated.packageId,
      context.workspaceId,
      validated.version,
      materialityRepository,
    );

    const benchmark = await materialityRepository.upsertBenchmark({
      materialityPackageId: validated.packageId,
      benchmarkId: validated.benchmarkId,
      benchmarkType: validated.benchmarkType as never,
      benchmarkLabel: validated.benchmarkLabel,
      benchmarkAmount: validated.benchmarkAmount,
      percentage: validated.percentage,
      rationale: validated.rationale,
      sortOrder: validated.sortOrder,
    });

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.MATERIALITY_BENCHMARK_UPSERTED,
      resourceType: AUDIT_RESOURCE_TYPE,
      resourceId: validated.packageId,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: { benchmarkId: benchmark.id },
    });

    const pkg = await materialityRepository.findById(validated.packageId);
    return { benchmarkId: benchmark.id, version: pkg?.version ?? validated.version };
  },
);

export const selectMaterialityBenchmarkAction = defineMaterialityAction<
  { packageId: string; version: number; benchmarkId: string },
  { packageId: string; version: number }
>(
  { module: "materiality.benchmark.select" },
  MATERIALITY_PERMISSIONS.UPDATE,
  async (input, context) => {
    if (!input.benchmarkId) throw new ValidationError("Benchmark is required");

    const supabase = await createServerClient();
    const repositoryContext = createRepositoryContext(
      context.userId,
      context.organizationId,
      context.workspaceId,
    );
    const materialityRepository = new MaterialityRepository(supabase, repositoryContext);

    await loadEditablePackage(
      input.packageId,
      context.workspaceId,
      input.version,
      materialityRepository,
    );

    const updated = await materialityRepository.selectBenchmark(
      input.packageId,
      input.version,
      input.benchmarkId,
    );

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.MATERIALITY_BENCHMARK_SELECTED,
      resourceType: AUDIT_RESOURCE_TYPE,
      resourceId: updated.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: { benchmarkId: input.benchmarkId, version: updated.version },
    });

    return { packageId: updated.id, version: updated.version };
  },
);

export const addMaterialityCommentAction = defineMaterialityAction<
  import("@/lib/materiality/validation").AddMaterialityCommentInput,
  { commentId: string; version: number }
>({ module: "materiality.comment.add" }, MATERIALITY_PERMISSIONS.COMMENT, async (input, context) => {
  const validated = validateAddMaterialityCommentInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const materialityRepository = new MaterialityRepository(supabase, repositoryContext);

  await loadEditablePackage(
    validated.packageId,
    context.workspaceId,
    validated.version,
    materialityRepository,
  );

  const comment = await materialityRepository.addComment({
    materialityPackageId: validated.packageId,
    commentType: validated.commentType,
    body: validated.body,
  });

  const pkg = await materialityRepository.findById(validated.packageId);

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.MATERIALITY_COMMENT_ADDED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: validated.packageId,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { commentId: comment.id },
  });

  return { commentId: comment.id, version: pkg?.version ?? validated.version };
});

export const createMaterialityVersionAction = defineMaterialityAction<
  { packageId: string; version: number; changeSummary?: string | null },
  { versionId: string; packageVersion: number }
>(
  { module: "materiality.version.create" },
  MATERIALITY_PERMISSIONS.UPDATE,
  async (input, context) => {
    if (!input.packageId) throw new ValidationError("Materiality package is required");

    const supabase = await createServerClient();
    const repositoryContext = createRepositoryContext(
      context.userId,
      context.organizationId,
      context.workspaceId,
    );
    const materialityRepository = new MaterialityRepository(supabase, repositoryContext);

    await loadEditablePackage(
      input.packageId,
      context.workspaceId,
      input.version,
      materialityRepository,
    );

    const version = await materialityRepository.createVersion(
      input.packageId,
      input.changeSummary,
    );

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.MATERIALITY_VERSION_CREATED,
      resourceType: AUDIT_RESOURCE_TYPE,
      resourceId: input.packageId,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: { versionId: version.id, versionNumber: version.version_number },
    });

    return { versionId: version.id, packageVersion: version.version_number };
  },
);

export const archiveMaterialityPackageAction = defineMaterialityAction<
  { packageId: string; version: number; archiveReason?: string | null },
  { packageId: string; version: number; packageStatus: string }
>({ module: "materiality.archive" }, MATERIALITY_PERMISSIONS.ARCHIVE, async (input, context) => {
  if (!input.packageId) throw new ValidationError("Materiality package is required");
  if (!Number.isInteger(input.version) || input.version < 1) {
    throw new ValidationError("Materiality package version is required");
  }

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const materialityRepository = new MaterialityRepository(supabase, repositoryContext);

  const current = await materialityRepository.validateWorkspaceOwnership(
    input.packageId,
    context.workspaceId,
  );
  if (current.version !== input.version) {
    throw new ValidationError("Materiality package was modified by another user");
  }
  if (current.deleted_at || current.status === "archived") {
    throw new ValidationError("Materiality package is already archived");
  }

  const updated = await materialityRepository.archive(input.packageId, input.version);

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.MATERIALITY_ARCHIVED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: updated.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { version: updated.version, archiveReason: input.archiveReason ?? null },
  });

  return {
    packageId: updated.id,
    version: updated.version,
    packageStatus: updated.package_status,
  };
});

export const restoreMaterialityPackageAction = defineMaterialityAction<
  { packageId: string; version: number },
  { packageId: string; version: number; packageStatus: string }
>({ module: "materiality.restore" }, MATERIALITY_PERMISSIONS.ARCHIVE, async (input, context) => {
  if (!input.packageId) throw new ValidationError("Materiality package is required");
  if (!Number.isInteger(input.version) || input.version < 1) {
    throw new ValidationError("Materiality package version is required");
  }

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const materialityRepository = new MaterialityRepository(supabase, repositoryContext);

  const current = await materialityRepository.validateWorkspaceOwnership(
    input.packageId,
    context.workspaceId,
  );
  if (current.version !== input.version) {
    throw new ValidationError("Materiality package was modified by another user");
  }
  if (!current.deleted_at && current.status !== "archived") {
    throw new ValidationError("Materiality package is not archived");
  }

  const updated = await materialityRepository.restore(input.packageId, input.version);

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.MATERIALITY_RESTORED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: updated.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { version: updated.version },
  });

  return {
    packageId: updated.id,
    version: updated.version,
    packageStatus: updated.package_status,
  };
});
