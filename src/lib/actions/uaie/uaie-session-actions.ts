"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, UAIE_ACTIVITY_ACTIONS, UAIE_PERMISSIONS } from "@/constants/uaie";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createUaieAction } from "@/lib/actions/uaie/uaie-action";
import { runUaiePipeline } from "@/lib/uaie/pipeline";
import { createServerClient } from "@/lib/supabase/server";
import { UaieRepository } from "@/repositories/uaie/uaie-repository";
import type { RepositoryContext } from "@/types/context";
import type { UaieCanonicalField } from "@/types/uaie";
import type { Json } from "@/types/supabase";
import { NotFoundError, ValidationError } from "@/lib/errors";

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

export const applyUaieMappingAction = createUaieAction<
  {
    sessionId: string;
    preferredSheetName?: string | null;
    mappings: Array<{ sourceColumnIndex: number; canonicalField: UaieCanonicalField }>;
  },
  { sessionId: string; importStatus: string; overallConfidence: number }
>({ module: "uaie.map" }, UAIE_PERMISSIONS.UPDATE, async (input, context) => {
  if (!input.mappings?.length) throw new ValidationError("At least one column mapping is required");

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const uaieRepository = new UaieRepository(supabase, repositoryContext);
  const session = await uaieRepository.requireSession(input.sessionId);
  if (session.workspace_id !== context.workspaceId) {
    throw new NotFoundError("Import session not found");
  }

  const detection = (session.detection_json ?? {}) as {
    contentBase64?: string;
    sourceFormatHint?: string | null;
  };
  if (!detection.contentBase64) {
    throw new ValidationError("Original upload payload is unavailable for remapping");
  }

  const bytes = Buffer.from(detection.contentBase64, "base64");
  const pipeline = await runUaiePipeline({
    filename: session.source_filename,
    mimeType: session.source_mime_type ?? detection.sourceFormatHint,
    bytes,
    manualMappings: input.mappings.map((mapping) => ({
      ...mapping,
    })),
    preferredSheetName: input.preferredSheetName ?? session.selected_sheet_name,
  });

  const hasBlocking = pipeline.issues.some((issue) => issue.severity === "blocking");
  const importStatus = hasBlocking
    ? "failed"
    : pipeline.requiresWizard
      ? "mapping_required"
      : "validated";

  const updated = await uaieRepository.updateSession(session.id, {
    import_status: importStatus,
    selected_sheet_name: pipeline.selectedSheetName,
    sheet_confidence: pipeline.sheetConfidence,
    overall_confidence: Math.round(
      (pipeline.sheetConfidence +
        pipeline.mappingConfidence +
        pipeline.languageConfidence +
        pipeline.currencyConfidence +
        pipeline.erpConfidence) /
        5,
    ),
    detected_erp: pipeline.detectedErp,
    erp_confidence: pipeline.erpConfidence,
    detected_language: pipeline.detectedLanguage,
    language_confidence: pipeline.languageConfidence,
    detected_currency: pipeline.detectedCurrency,
    currency_confidence: pipeline.currencyConfidence,
    workbook_hash: pipeline.workbookHash,
    header_hash: pipeline.headerHash,
    layout_fingerprint: pipeline.layoutFingerprint,
    mapping_json: { columns: pipeline.mappings } as Json,
    validation_json: { issues: pipeline.issues } as Json,
    summary_json: pipeline.summary as unknown as Json,
    processing_ms: pipeline.processingMs,
    error_message: hasBlocking
      ? pipeline.issues.find((issue) => issue.severity === "blocking")?.message ?? null
      : null,
    completed_at: importStatus === "validated" ? new Date().toISOString() : null,
  } as never);

  await uaieRepository.replaceColumnMappings(updated, pipeline.mappings);
  await uaieRepository.replaceValidationIssues(updated, pipeline.issues);
  await uaieRepository.replaceNormalizedRows(updated, pipeline.rows);
  await uaieRepository.replaceSheetScans(
    updated,
    pipeline.sheetScores.map((score, index) => ({
      sheetName: score.name,
      sheetIndex: index,
      rowCount: score.rowCount,
      columnCount: score.columnCount,
      score: score.score,
      isSelected: score.name === pipeline.selectedSheetName,
      previewJson: [] as Json,
      headersJson: [] as Json,
    })),
  );

  await uaieRepository.logActivity({
    sessionId: updated.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    companyId: updated.company_id,
    action: UAIE_ACTIVITY_ACTIONS.MAPPED,
    summary: "Column mapping applied",
    metadata: { importStatus, confidence: updated.overall_confidence },
  });

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.UAIE_MAPPED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: updated.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { importStatus },
  });

  return {
    sessionId: updated.id,
    importStatus,
    overallConfidence: updated.overall_confidence,
  };
});

export const confirmUaieStageAction = createUaieAction<
  { sessionId: string },
  { sessionId: string; importStatus: string }
>({ module: "uaie.stage" }, UAIE_PERMISSIONS.VALIDATE, async (input, context) => {
  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const uaieRepository = new UaieRepository(supabase, repositoryContext);
  const session = await uaieRepository.requireSession(input.sessionId);
  if (session.workspace_id !== context.workspaceId) {
    throw new NotFoundError("Import session not found");
  }
  if (session.import_status !== "validated" && session.import_status !== "mapped") {
    throw new ValidationError("Only validated imports can be staged");
  }

  const issues = await uaieRepository.listValidationIssues(session.id);
  if (issues.some((issue) => issue.severity === "blocking")) {
    throw new ValidationError("Resolve blocking validation issues before staging");
  }

  const profile = await uaieRepository.saveMappingProfile({
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    companyId: session.company_id,
    profileName: `${session.detected_erp}-${session.header_hash?.slice(0, 8) ?? "profile"}`,
    detectedErp: session.detected_erp,
    workbookHash: session.workbook_hash,
    headerHash: session.header_hash,
    layoutFingerprint: session.layout_fingerprint,
    mappingJson: session.mapping_json,
  });

  const updated = await uaieRepository.updateSession(session.id, {
    import_status: "staged",
    is_active: true,
    mapping_profile_id: profile.id,
    completed_at: new Date().toISOString(),
  } as never);

  await uaieRepository.logActivity({
    sessionId: updated.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    companyId: updated.company_id,
    action: UAIE_ACTIVITY_ACTIONS.STAGED,
    summary: "Normalized dataset staged",
    metadata: { profileId: profile.id },
  });

  const { UaieIntelligenceRepository } = await import(
    "@/repositories/uaie/uaie-intelligence-repository"
  );
  const intelligence = new UaieIntelligenceRepository(supabase, repositoryContext);
  await intelligence.logLearningEvent({
    organization_id: context.organizationId,
    workspace_id: context.workspaceId,
    company_id: updated.company_id,
    import_session_id: updated.id,
    event_type: "import_staged",
    summary: `Staged normalized dataset for ${updated.source_filename}`,
    metadata_json: { profileId: profile.id } as import("@/types/supabase").Json,
  });

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.UAIE_STAGED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: updated.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { profileId: profile.id },
  });

  return { sessionId: updated.id, importStatus: updated.import_status };
});

export const cancelUaieSessionAction = createUaieAction<
  { sessionId: string },
  { sessionId: string }
>({ module: "uaie.cancel" }, UAIE_PERMISSIONS.UPDATE, async (input, context) => {
  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const uaieRepository = new UaieRepository(supabase, repositoryContext);
  const session = await uaieRepository.requireSession(input.sessionId);
  if (session.workspace_id !== context.workspaceId) {
    throw new NotFoundError("Import session not found");
  }
  const updated = await uaieRepository.cancelSession(session.id);
  await uaieRepository.logActivity({
    sessionId: updated.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    companyId: updated.company_id,
    action: UAIE_ACTIVITY_ACTIONS.CANCELLED,
    summary: "Import session cancelled",
  });
  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.UAIE_CANCELLED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: updated.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
  });
  return { sessionId: updated.id };
});

export const archiveUaieSessionAction = createUaieAction<
  { sessionId: string },
  { sessionId: string }
>({ module: "uaie.archive" }, UAIE_PERMISSIONS.ARCHIVE, async (input, context) => {
  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const uaieRepository = new UaieRepository(supabase, repositoryContext);
  const session = await uaieRepository.requireSession(input.sessionId);
  if (session.workspace_id !== context.workspaceId) {
    throw new NotFoundError("Import session not found");
  }
  const updated = await uaieRepository.archiveSession(session.id);
  await uaieRepository.logActivity({
    sessionId: updated.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    companyId: updated.company_id,
    action: UAIE_ACTIVITY_ACTIONS.ARCHIVED,
    summary: "Import session archived",
  });
  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.UAIE_ARCHIVED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: updated.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
  });
  return { sessionId: updated.id };
});
