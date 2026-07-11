import "server-only";

import { cache } from "react";
import { UAIE_PERMISSIONS } from "@/constants/uaie";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { AuthenticationError, AuthorizationError, DatabaseError } from "@/lib/errors";
import { createServerClient } from "@/lib/supabase/server";
import { CompanyRepository } from "@/repositories/company/company-repository";
import { UaieRepository } from "@/repositories/uaie/uaie-repository";
import type { RepositoryContext } from "@/types/context";

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

export type UaieWorkspaceLoadResult =
  | {
      ok: true;
      companyId: string;
      companySlug: string;
      companyName: string;
      sessions: Array<{
        id: string;
        filename: string;
        importStatus: string;
        detectedErp: string;
        overallConfidence: number;
        detectedLanguage: string | null;
        detectedCurrency: string | null;
        createdAt: string;
        processingMs: number | null;
        rowCount: number;
      }>;
    }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "not_found" | "error" };

export async function loadUaieWorkspace(companySlug: string): Promise<UaieWorkspaceLoadResult> {
  try {
    const user = await getCurrentUser();
    if (!user) return { ok: false, reason: "unauthenticated" };
    requirePermissionCodes(user, UAIE_PERMISSIONS.READ);

    const workspace = await getWorkspaceContext();
    if (!workspace.isResolved || !workspace.workspaceId || !user.organizationId) {
      return { ok: false, reason: "no_workspace" };
    }

    const supabase = await createServerClient();
    const context = createRepositoryContext(user.id, user.organizationId, workspace.workspaceId);
    const companyRepository = new CompanyRepository(supabase, context);
    const uaieRepository = new UaieRepository(supabase, context);

    const company = await companyRepository.findBySlugInWorkspace(
      workspace.workspaceId,
      companySlug,
    );
    if (!company) return { ok: false, reason: "not_found" };

    const sessions = await uaieRepository.listSessionsByCompany(company.id);
    return {
      ok: true,
      companyId: company.id,
      companySlug: company.slug,
      companyName: company.name,
      sessions: sessions.map((session) => {
        const summary = (session.summary_json ?? {}) as { rowCount?: number };
        return {
          id: session.id,
          filename: session.source_filename,
          importStatus: session.import_status,
          detectedErp: session.detected_erp,
          overallConfidence: session.overall_confidence,
          detectedLanguage: session.detected_language,
          detectedCurrency: session.detected_currency,
          createdAt: session.created_at,
          processingMs: session.processing_ms,
          rowCount: summary.rowCount ?? 0,
        };
      }),
    };
  } catch (error) {
    if (error instanceof AuthenticationError) return { ok: false, reason: "unauthenticated" };
    if (error instanceof AuthorizationError) return { ok: false, reason: "forbidden" };
    if (error instanceof DatabaseError) return { ok: false, reason: "error" };
    return { ok: false, reason: "error" };
  }
}

export const loadUaieWorkspaceCached = cache(loadUaieWorkspace);

export type UaieSessionLoadResult =
  | {
      ok: true;
      session: {
        id: string;
        companyId: string;
        filename: string;
        importStatus: string;
        detectedErp: string;
        erpConfidence: number;
        detectedLanguage: string | null;
        languageConfidence: number;
        detectedCurrency: string | null;
        currencyConfidence: number;
        selectedSheetName: string | null;
        sheetConfidence: number;
        overallConfidence: number;
        mappingConfidence: number;
        requiresWizard: boolean;
        summary: Record<string, unknown>;
        sheetScores: Array<{ name: string; score: number; rowCount: number; columnCount: number }>;
        mappings: Array<{
          sourceColumnIndex: number;
          sourceHeader: string | null;
          canonicalField: string;
          confidence: number;
          isManual: boolean;
        }>;
        issues: Array<{
          issueCode: string;
          severity: string;
          message: string;
          rowNumber: number | null;
          accountCode: string | null;
        }>;
        rows: Array<{
          rowNumber: number;
          accountCode: string | null;
          accountName: string | null;
          debit: number | null;
          credit: number | null;
          balance: number | null;
          currencyCode: string | null;
          isValid: boolean;
        }>;
      };
    }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "not_found" | "error" };

export async function loadUaieSession(sessionId: string): Promise<UaieSessionLoadResult> {
  try {
    const user = await getCurrentUser();
    if (!user) return { ok: false, reason: "unauthenticated" };
    requirePermissionCodes(user, UAIE_PERMISSIONS.READ);

    const workspace = await getWorkspaceContext();
    if (!workspace.isResolved || !workspace.workspaceId || !user.organizationId) {
      return { ok: false, reason: "no_workspace" };
    }

    const supabase = await createServerClient();
    const context = createRepositoryContext(user.id, user.organizationId, workspace.workspaceId);
    const uaieRepository = new UaieRepository(supabase, context);
    const session = await uaieRepository.findSessionById(sessionId);
    if (!session || session.workspace_id !== workspace.workspaceId) {
      return { ok: false, reason: "not_found" };
    }

    const [mappings, issues, rows] = await Promise.all([
      uaieRepository.listColumnMappings(session.id),
      uaieRepository.listValidationIssues(session.id),
      uaieRepository.listNormalizedRows(session.id, 250),
    ]);

    const detection = (session.detection_json ?? {}) as {
      sheetScores?: Array<{ name: string; score: number; rowCount: number; columnCount: number }>;
    };
    const mappingJson = (session.mapping_json ?? {}) as {
      columns?: Array<{ confidence?: number }>;
    };
    const mappingConfidence =
      mappingJson.columns && mappingJson.columns.length > 0
        ? Math.round(
            mappingJson.columns.reduce((sum, column) => sum + (column.confidence ?? 0), 0) /
              mappingJson.columns.length,
          )
        : 0;

    return {
      ok: true,
      session: {
        id: session.id,
        companyId: session.company_id,
        filename: session.source_filename,
        importStatus: session.import_status,
        detectedErp: session.detected_erp,
        erpConfidence: session.erp_confidence,
        detectedLanguage: session.detected_language,
        languageConfidence: session.language_confidence,
        detectedCurrency: session.detected_currency,
        currencyConfidence: session.currency_confidence,
        selectedSheetName: session.selected_sheet_name,
        sheetConfidence: session.sheet_confidence,
        overallConfidence: session.overall_confidence,
        mappingConfidence,
        requiresWizard: session.import_status === "mapping_required",
        summary: (session.summary_json ?? {}) as Record<string, unknown>,
        sheetScores: detection.sheetScores ?? [],
        mappings: mappings.map((mapping) => ({
          sourceColumnIndex: mapping.source_column_index,
          sourceHeader: mapping.source_header,
          canonicalField: mapping.canonical_field,
          confidence: mapping.confidence,
          isManual: mapping.is_manual,
        })),
        issues: issues.map((issue) => ({
          issueCode: issue.issue_code,
          severity: issue.severity,
          message: issue.message,
          rowNumber: issue.row_number,
          accountCode: issue.account_code,
        })),
        rows: rows.map((row) => ({
          rowNumber: row.row_number,
          accountCode: row.account_code,
          accountName: row.account_name,
          debit: row.debit,
          credit: row.credit,
          balance: row.balance,
          currencyCode: row.currency_code,
          isValid: row.is_valid,
        })),
      },
    };
  } catch (error) {
    if (error instanceof AuthenticationError) return { ok: false, reason: "unauthenticated" };
    if (error instanceof AuthorizationError) return { ok: false, reason: "forbidden" };
    return { ok: false, reason: "error" };
  }
}

export const loadUaieSessionCached = cache(loadUaieSession);
