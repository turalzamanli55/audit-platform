"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, UAIE_ACTIVITY_ACTIONS, UAIE_PERMISSIONS } from "@/constants/uaie";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createUaieAction } from "@/lib/actions/uaie/uaie-action";
import { createServerClient } from "@/lib/supabase/server";
import { UaieIntelligenceRepository } from "@/repositories/uaie/uaie-intelligence-repository";
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

async function getIntelligenceRepo(context: {
  userId: string;
  organizationId: string;
  workspaceId: string;
}) {
  const supabase = await createServerClient();
  return {
    supabase,
    intelligence: new UaieIntelligenceRepository(
      supabase,
      createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
    ),
  };
}

export const approveUnknownHeaderAction = createUaieAction<
  { unknownId: string; canonicalField?: UaieCanonicalField },
  { dictionaryEntryId: string }
>({ module: "uaie.intelligence.approve-unknown" }, UAIE_PERMISSIONS.APPROVE, async (input, context) => {
  const { intelligence } = await getIntelligenceRepo(context);
  const unknowns = await intelligence.listUnknownHeaders({ limit: 500 });
  const unknown = unknowns.find((row) => row.id === input.unknownId);
  if (!unknown) throw new NotFoundError("Unknown header not found");

  const field = input.canonicalField ?? unknown.suggested_field;
  if (!field) throw new ValidationError("Canonical field is required to approve");

  const entry = await intelligence.upsertDictionaryEntry({
    organization_id: context.organizationId,
    workspace_id: context.workspaceId,
    company_id: unknown.company_id,
    raw_value: unknown.raw_value,
    normalized_value: unknown.normalized_value,
    canonical_field: field,
    language_code: unknown.language_code,
    source: "unknown_approval",
    confidence: Math.max(unknown.confidence, 95),
    detected_erp: unknown.detected_erp,
    entry_status: "approved",
    approved_by: context.userId,
    approved_at: new Date().toISOString(),
  });

  await intelligence.updateUnknownHeader(unknown.id, {
    unknown_status: "approved",
    suggested_field: field,
    dictionary_entry_id: entry.id,
  });

  await intelligence.logLearningEvent({
    organization_id: context.organizationId,
    workspace_id: context.workspaceId,
    company_id: unknown.company_id,
    event_type: "unknown_approved",
    summary: `Approved unknown header "${unknown.raw_value}" → ${field}`,
    metadata_json: { unknownId: unknown.id, dictionaryEntryId: entry.id } as Json,
  });

  await intelligence.logIntelligenceAudit({
    organization_id: context.organizationId,
    workspace_id: context.workspaceId,
    company_id: unknown.company_id,
    action_code: UAIE_ACTIVITY_ACTIONS.UNKNOWN_APPROVED,
    resource_type: "uaie_unknown_headers",
    resource_id: unknown.id,
    summary: `Approved unknown header ${unknown.raw_value}`,
    after_json: { canonicalField: field, dictionaryEntryId: entry.id } as Json,
  });

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.UAIE_MAPPED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: entry.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { kind: "unknown_approved", field },
  });

  return { dictionaryEntryId: entry.id };
});

export const rejectUnknownHeaderAction = createUaieAction<
  { unknownId: string },
  { unknownId: string }
>({ module: "uaie.intelligence.reject-unknown" }, UAIE_PERMISSIONS.REVIEW, async (input, context) => {
  const { intelligence } = await getIntelligenceRepo(context);
  const unknowns = await intelligence.listUnknownHeaders({ limit: 500 });
  const unknown = unknowns.find((row) => row.id === input.unknownId);
  if (!unknown) throw new NotFoundError("Unknown header not found");
  await intelligence.updateUnknownHeader(unknown.id, { unknown_status: "rejected" });
  await intelligence.logLearningEvent({
    organization_id: context.organizationId,
    workspace_id: context.workspaceId,
    company_id: unknown.company_id,
    event_type: "unknown_rejected",
    summary: `Rejected unknown header "${unknown.raw_value}"`,
    metadata_json: { unknownId: unknown.id } as Json,
  });
  await intelligence.logIntelligenceAudit({
    organization_id: context.organizationId,
    workspace_id: context.workspaceId,
    action_code: UAIE_ACTIVITY_ACTIONS.UNKNOWN_REJECTED,
    resource_type: "uaie_unknown_headers",
    resource_id: unknown.id,
    summary: `Rejected unknown header ${unknown.raw_value}`,
  });
  return { unknownId: unknown.id };
});

export const ignoreUnknownHeaderAction = createUaieAction<
  { unknownId: string },
  { unknownId: string }
>({ module: "uaie.intelligence.ignore-unknown" }, UAIE_PERMISSIONS.REVIEW, async (input, context) => {
  const { intelligence } = await getIntelligenceRepo(context);
  const unknowns = await intelligence.listUnknownHeaders({ limit: 500 });
  const unknown = unknowns.find((row) => row.id === input.unknownId);
  if (!unknown) throw new NotFoundError("Unknown header not found");
  await intelligence.updateUnknownHeader(unknown.id, { unknown_status: "ignored" });
  await intelligence.logLearningEvent({
    organization_id: context.organizationId,
    workspace_id: context.workspaceId,
    company_id: unknown.company_id,
    event_type: "unknown_ignored",
    summary: `Ignored unknown header "${unknown.raw_value}"`,
    metadata_json: { unknownId: unknown.id } as Json,
  });
  await intelligence.logIntelligenceAudit({
    organization_id: context.organizationId,
    workspace_id: context.workspaceId,
    action_code: UAIE_ACTIVITY_ACTIONS.UNKNOWN_IGNORED,
    resource_type: "uaie_unknown_headers",
    resource_id: unknown.id,
    summary: `Ignored unknown header ${unknown.raw_value}`,
  });
  return { unknownId: unknown.id };
});

export const mergeUnknownHeaderAction = createUaieAction<
  { unknownId: string; dictionaryEntryId: string },
  { unknownId: string }
>({ module: "uaie.intelligence.merge-unknown" }, UAIE_PERMISSIONS.ADMIN, async (input, context) => {
  const { intelligence } = await getIntelligenceRepo(context);
  const unknowns = await intelligence.listUnknownHeaders({ limit: 500 });
  const unknown = unknowns.find((row) => row.id === input.unknownId);
  if (!unknown) throw new NotFoundError("Unknown header not found");
  const dictionary = await intelligence.listDictionary({ limit: 1000 });
  const entry = dictionary.find((row) => row.id === input.dictionaryEntryId);
  if (!entry) throw new NotFoundError("Dictionary entry not found");

  await intelligence.updateDictionaryEntry(entry.id, {
    occurrences: entry.occurrences + unknown.occurrences,
  });
  await intelligence.updateUnknownHeader(unknown.id, {
    unknown_status: "merged",
    dictionary_entry_id: entry.id,
  });
  await intelligence.logLearningEvent({
    organization_id: context.organizationId,
    workspace_id: context.workspaceId,
    event_type: "dictionary_merged",
    summary: `Merged "${unknown.raw_value}" into dictionary entry`,
    metadata_json: { unknownId: unknown.id, dictionaryEntryId: entry.id } as Json,
  });
  return { unknownId: unknown.id };
});

export const approveDictionaryEntryAction = createUaieAction<
  { entryId: string },
  { entryId: string }
>({ module: "uaie.intelligence.approve-dictionary" }, UAIE_PERMISSIONS.APPROVE, async (input, context) => {
  const { intelligence } = await getIntelligenceRepo(context);
  const entry = await intelligence.updateDictionaryEntry(input.entryId, {
    entry_status: "approved",
    approved_by: context.userId,
    approved_at: new Date().toISOString(),
  });
  await intelligence.logLearningEvent({
    organization_id: context.organizationId,
    workspace_id: context.workspaceId,
    company_id: entry.company_id,
    event_type: "header_learned",
    summary: `Approved dictionary entry "${entry.raw_value}"`,
    metadata_json: { entryId: entry.id } as Json,
  });
  await intelligence.logIntelligenceAudit({
    organization_id: context.organizationId,
    workspace_id: context.workspaceId,
    action_code: UAIE_ACTIVITY_ACTIONS.DICTIONARY_APPROVED,
    resource_type: "uaie_dictionary_entries",
    resource_id: entry.id,
    summary: `Approved dictionary ${entry.raw_value}`,
  });
  return { entryId: entry.id };
});

export const disableDictionaryEntryAction = createUaieAction<
  { entryId: string },
  { entryId: string }
>({ module: "uaie.intelligence.disable-dictionary" }, UAIE_PERMISSIONS.ADMIN, async (input, context) => {
  const { intelligence } = await getIntelligenceRepo(context);
  const entry = await intelligence.updateDictionaryEntry(input.entryId, {
    entry_status: "disabled",
  });
  await intelligence.logLearningEvent({
    organization_id: context.organizationId,
    workspace_id: context.workspaceId,
    event_type: "dictionary_disabled",
    summary: `Disabled dictionary entry "${entry.raw_value}"`,
    metadata_json: { entryId: entry.id } as Json,
  });
  return { entryId: entry.id };
});

export const restoreDictionaryEntryAction = createUaieAction<
  { entryId: string },
  { entryId: string }
>({ module: "uaie.intelligence.restore-dictionary" }, UAIE_PERMISSIONS.ADMIN, async (input, context) => {
  const { intelligence } = await getIntelligenceRepo(context);
  const entry = await intelligence.updateDictionaryEntry(input.entryId, {
    entry_status: "approved",
    deleted_at: null,
    deleted_by: null,
  });
  await intelligence.logLearningEvent({
    organization_id: context.organizationId,
    workspace_id: context.workspaceId,
    event_type: "dictionary_restored",
    summary: `Restored dictionary entry "${entry.raw_value}"`,
    metadata_json: { entryId: entry.id } as Json,
  });
  return { entryId: entry.id };
});

export const deleteDictionaryEntryAction = createUaieAction<
  { entryId: string },
  { entryId: string }
>({ module: "uaie.intelligence.delete-dictionary" }, UAIE_PERMISSIONS.ADMIN, async (input, context) => {
  const { intelligence } = await getIntelligenceRepo(context);
  const entry = await intelligence.updateDictionaryEntry(input.entryId, {
    entry_status: "deleted",
    deleted_at: new Date().toISOString(),
    deleted_by: context.userId,
  });
  await intelligence.logIntelligenceAudit({
    organization_id: context.organizationId,
    workspace_id: context.workspaceId,
    action_code: UAIE_ACTIVITY_ACTIONS.DICTIONARY_DISABLED,
    resource_type: "uaie_dictionary_entries",
    resource_id: entry.id,
    summary: `Deleted dictionary ${entry.raw_value}`,
  });
  return { entryId: entry.id };
});

export const mergeDictionaryEntriesAction = createUaieAction<
  { sourceEntryId: string; targetEntryId: string },
  { targetEntryId: string }
>({ module: "uaie.intelligence.merge-dictionary" }, UAIE_PERMISSIONS.ADMIN, async (input, context) => {
  const { intelligence } = await getIntelligenceRepo(context);
  const dictionary = await intelligence.listDictionary({ limit: 2000 });
  const source = dictionary.find((row) => row.id === input.sourceEntryId);
  const target = dictionary.find((row) => row.id === input.targetEntryId);
  if (!source || !target) throw new NotFoundError("Dictionary entries not found");

  await intelligence.updateDictionaryEntry(target.id, {
    occurrences: target.occurrences + source.occurrences,
    confidence: Math.max(target.confidence, source.confidence),
  });
  await intelligence.updateDictionaryEntry(source.id, {
    entry_status: "merged",
    merged_into_id: target.id,
  });
  await intelligence.logLearningEvent({
    organization_id: context.organizationId,
    workspace_id: context.workspaceId,
    event_type: "dictionary_merged",
    summary: `Merged "${source.raw_value}" into "${target.raw_value}"`,
    metadata_json: { sourceEntryId: source.id, targetEntryId: target.id } as Json,
  });
  return { targetEntryId: target.id };
});

export const exportDictionaryAction = createUaieAction<
  Record<string, never>,
  { entries: Array<Record<string, unknown>> }
>({ module: "uaie.intelligence.export-dictionary" }, UAIE_PERMISSIONS.ADMIN, async (_input, context) => {
  const { intelligence } = await getIntelligenceRepo(context);
  const entries = await intelligence.listDictionary({ limit: 5000 });
  await intelligence.logLearningEvent({
    organization_id: context.organizationId,
    workspace_id: context.workspaceId,
    event_type: "admin_export",
    summary: `Exported ${entries.length} dictionary entries`,
    metadata_json: { count: entries.length } as Json,
  });
  return {
    entries: entries.map((entry) => ({
      rawValue: entry.raw_value,
      normalizedValue: entry.normalized_value,
      canonicalField: entry.canonical_field,
      languageCode: entry.language_code,
      confidence: entry.confidence,
      occurrences: entry.occurrences,
      entryStatus: entry.entry_status,
    })),
  };
});

export const importDictionaryAction = createUaieAction<
  {
    entries: Array<{
      rawValue: string;
      normalizedValue: string;
      canonicalField: UaieCanonicalField;
      languageCode?: string | null;
      confidence?: number;
    }>;
  },
  { imported: number }
>({ module: "uaie.intelligence.import-dictionary" }, UAIE_PERMISSIONS.ADMIN, async (input, context) => {
  if (!input.entries?.length) throw new ValidationError("No dictionary entries provided");
  const { intelligence } = await getIntelligenceRepo(context);
  let imported = 0;
  for (const entry of input.entries) {
    await intelligence.upsertDictionaryEntry({
      organization_id: context.organizationId,
      workspace_id: context.workspaceId,
      raw_value: entry.rawValue,
      normalized_value: entry.normalizedValue,
      canonical_field: entry.canonicalField,
      language_code: entry.languageCode ?? null,
      source: "dictionary_import",
      confidence: entry.confidence ?? 100,
      entry_status: "approved",
      approved_by: context.userId,
      approved_at: new Date().toISOString(),
    });
    imported += 1;
  }
  await intelligence.logLearningEvent({
    organization_id: context.organizationId,
    workspace_id: context.workspaceId,
    event_type: "admin_import",
    summary: `Imported ${imported} dictionary entries`,
    metadata_json: { count: imported } as Json,
  });
  return { imported };
});
