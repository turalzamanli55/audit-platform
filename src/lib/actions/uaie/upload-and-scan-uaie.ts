"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, UAIE_ACTIVITY_ACTIONS, UAIE_PERMISSIONS } from "@/constants/uaie";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createUaieAction } from "@/lib/actions/uaie/uaie-action";
import { previewRows } from "@/lib/uaie/fingerprint";
import { runUaiePipeline } from "@/lib/uaie/pipeline";
import { createServerClient } from "@/lib/supabase/server";
import { CompanyRepository } from "@/repositories/company/company-repository";
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

function parseManualMappings(
  mappingJson: unknown,
): Array<{ sourceColumnIndex: number; canonicalField: UaieCanonicalField }> | undefined {
  if (!mappingJson || typeof mappingJson !== "object") return undefined;
  const record = mappingJson as { columns?: Array<{ sourceColumnIndex: number; canonicalField: string }> };
  if (!Array.isArray(record.columns)) return undefined;
  return record.columns.map((column) => ({
    sourceColumnIndex: column.sourceColumnIndex,
    canonicalField: column.canonicalField as UaieCanonicalField,
  }));
}

export const uploadAndScanUaieAction = createUaieAction<
  {
    companyId: string;
    engagementId?: string | null;
    filename: string;
    mimeType?: string | null;
    contentBase64: string;
  },
  { sessionId: string; importStatus: string; overallConfidence: number; requiresWizard: boolean }
>({ module: "uaie.upload" }, UAIE_PERMISSIONS.CREATE, async (input, context) => {
  if (!input.filename?.trim()) throw new ValidationError("Filename is required");
  if (!input.contentBase64?.trim()) throw new ValidationError("File content is required");

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const companyRepository = new CompanyRepository(supabase, repositoryContext);
  const uaieRepository = new UaieRepository(supabase, repositoryContext);

  const company = await companyRepository.findById(input.companyId);
  if (!company || company.workspace_id !== context.workspaceId) {
    throw new NotFoundError("Company not found");
  }

  const bytes = Buffer.from(input.contentBase64, "base64");
  if (bytes.length === 0) throw new ValidationError("Uploaded file is empty");
  if (bytes.length > 25 * 1024 * 1024) {
    throw new ValidationError("File exceeds the 25MB import limit");
  }

  const pipeline = await runUaiePipeline({
    filename: input.filename,
    mimeType: input.mimeType,
    bytes,
  });

  const learned = await uaieRepository.findMappingProfileByFingerprint({
    workspaceId: context.workspaceId,
    companyId: company.id,
    layoutFingerprint: pipeline.layoutFingerprint,
    headerHash: pipeline.headerHash,
  });

  let effectivePipeline = pipeline;
  if (learned?.mapping_json) {
    const manual = parseManualMappings(learned.mapping_json);
    if (manual?.length) {
      effectivePipeline = await runUaiePipeline({
        filename: input.filename,
        mimeType: input.mimeType,
        bytes,
        manualMappings: manual,
        preferredSheetName: pipeline.selectedSheetName,
      });
    }
  }

  const hasBlocking = effectivePipeline.issues.some((issue) => issue.severity === "blocking");
  const importStatus = hasBlocking
    ? "failed"
    : effectivePipeline.requiresWizard
      ? "mapping_required"
      : "validated";

  const selectedSheet = effectivePipeline.sheetScores.find(
    (sheet) => sheet.name === effectivePipeline.selectedSheetName,
  );

  const session = await uaieRepository.createSession({
    organization_id: context.organizationId,
    workspace_id: context.workspaceId,
    company_id: company.id,
    engagement_id: input.engagementId ?? null,
    data_type: "trial_balance",
    import_status: importStatus,
    source_filename: input.filename,
    source_mime_type: input.mimeType ?? null,
    source_byte_size: bytes.length,
    source_sha256: effectivePipeline.workbookHash,
    detected_erp: effectivePipeline.detectedErp,
    erp_confidence: effectivePipeline.erpConfidence,
    detected_language: effectivePipeline.detectedLanguage,
    language_confidence: effectivePipeline.languageConfidence,
    detected_currency: effectivePipeline.detectedCurrency,
    currency_confidence: effectivePipeline.currencyConfidence,
    selected_sheet_name: effectivePipeline.selectedSheetName,
    sheet_confidence: effectivePipeline.sheetConfidence,
    overall_confidence: Math.round(
      (effectivePipeline.sheetConfidence +
        effectivePipeline.mappingConfidence +
        effectivePipeline.languageConfidence +
        effectivePipeline.currencyConfidence +
        effectivePipeline.erpConfidence) /
        5,
    ),
    workbook_hash: effectivePipeline.workbookHash,
    header_hash: effectivePipeline.headerHash,
    layout_fingerprint: effectivePipeline.layoutFingerprint,
    mapping_profile_id: learned?.id ?? null,
    mapping_json: {
      columns: effectivePipeline.mappings,
    } as Json,
    detection_json: {
      sheetScores: effectivePipeline.sheetScores,
      headerRowIndex: effectivePipeline.headerRowIndex,
      selectedSheetRows: [],
      sourceFormatHint: input.mimeType ?? null,
      contentBase64: input.contentBase64,
    } as Json,
    validation_json: { issues: effectivePipeline.issues } as Json,
    summary_json: effectivePipeline.summary as unknown as Json,
    processing_ms: effectivePipeline.processingMs,
    error_message: hasBlocking
      ? effectivePipeline.issues.find((issue) => issue.severity === "blocking")?.message ??
        "Import validation failed"
      : null,
    completed_at: importStatus === "validated" ? new Date().toISOString() : null,
  });

  await uaieRepository.replaceSheetScans(
    session,
    effectivePipeline.sheetScores.map((score, index) => ({
      sheetName: score.name,
      sheetIndex: index,
      rowCount: score.rowCount,
      columnCount: score.columnCount,
      score: score.score,
      isSelected: score.name === effectivePipeline.selectedSheetName,
      previewJson: [] as Json,
      headersJson: [] as Json,
    })),
  );

  await uaieRepository.replaceColumnMappings(session, effectivePipeline.mappings);
  await uaieRepository.replaceValidationIssues(session, effectivePipeline.issues);
  await uaieRepository.replaceNormalizedRows(session, effectivePipeline.rows);

  await uaieRepository.logActivity({
    sessionId: session.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    companyId: company.id,
    action: UAIE_ACTIVITY_ACTIONS.SCANNED,
    summary: `Scanned ${input.filename}`,
    metadata: {
      erp: effectivePipeline.detectedErp,
      confidence: session.overall_confidence,
      selectedSheet: effectivePipeline.selectedSheetName,
      selectedSheetRowsPreview: selectedSheet ? previewRows({
        name: selectedSheet.name,
        index: 0,
        rows: [],
      }) : [],
    },
  });

  if (learned) {
    await uaieRepository.incrementProfileSuccess(learned.id);
  }

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.UAIE_SCANNED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: session.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: {
      companyId: company.id,
      filename: input.filename,
      importStatus,
      overallConfidence: session.overall_confidence,
    },
  });

  return {
    sessionId: session.id,
    importStatus,
    overallConfidence: session.overall_confidence,
    requiresWizard: effectivePipeline.requiresWizard,
  };
});
