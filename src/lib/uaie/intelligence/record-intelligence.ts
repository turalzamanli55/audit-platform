import "server-only";

import { createHash } from "crypto";
import { normalizeAccountingHeader } from "@/lib/uaie/normalize";
import { fuzzyMatchCanonicalField } from "@/lib/uaie/fuzzy";
import { calculateImportHealth } from "@/lib/uaie/intelligence/health";
import type { UaieIntelligenceRepository } from "@/repositories/uaie/uaie-intelligence-repository";
import type { UaieImportSession } from "@/repositories/uaie/uaie-repository";
import type { UaiePipelineResult } from "@/types/uaie";
import type { Json } from "@/types/supabase";

export async function recordIntelligenceFromPipeline(input: {
  intelligence: UaieIntelligenceRepository;
  session: UaieImportSession;
  pipeline: UaiePipelineResult;
  actorUserId: string;
}): Promise<{ health: ReturnType<typeof calculateImportHealth> }> {
  const { intelligence, session, pipeline, actorUserId } = input;
  const health = calculateImportHealth(pipeline);

  await intelligence.createFingerprint({
    organization_id: session.organization_id,
    workspace_id: session.workspace_id,
    company_id: session.company_id,
    import_session_id: session.id,
    workbook_hash: pipeline.workbookHash,
    header_hash: pipeline.headerHash,
    layout_hash: pipeline.layoutFingerprint,
    erp_hash: createHash("sha256")
      .update(`${pipeline.detectedErp}:${pipeline.headerHash}`)
      .digest("hex")
      .slice(0, 32),
    detected_erp: pipeline.detectedErp,
    confidence: Math.round(
      (pipeline.sheetConfidence +
        pipeline.mappingConfidence +
        pipeline.languageConfidence +
        pipeline.currencyConfidence +
        pipeline.erpConfidence) /
        5,
    ),
    template_version: 1,
    learning_score: health.overallHealth,
    similarity_json: [] as Json,
    metadata_json: {
      language: pipeline.detectedLanguage,
      currency: pipeline.detectedCurrency,
      sheet: pipeline.selectedSheetName,
    } as Json,
  });

  for (const mapping of pipeline.mappings) {
    const raw = mapping.sourceHeader?.trim();
    if (!raw) continue;
    const normalized = normalizeAccountingHeader(raw);
    if (!normalized) continue;

    if (mapping.canonicalField !== "ignore" && mapping.confidence >= 95) {
      await intelligence.upsertDictionaryEntry({
        organization_id: session.organization_id,
        workspace_id: session.workspace_id,
        company_id: session.company_id,
        raw_value: raw,
        normalized_value: normalized,
        canonical_field: mapping.canonicalField,
        language_code: pipeline.detectedLanguage,
        source: mapping.isManual ? "manual_mapping" : "auto_detection",
        confidence: mapping.confidence,
        detected_erp: pipeline.detectedErp,
        entry_status: mapping.isManual ? "approved" : "pending",
        approved_by: mapping.isManual ? actorUserId : null,
        approved_at: mapping.isManual ? new Date().toISOString() : null,
      });
      continue;
    }

    if (mapping.canonicalField === "ignore" || mapping.confidence < 95) {
      const fuzzy = fuzzyMatchCanonicalField(raw);
      await intelligence.upsertUnknownHeader({
        organizationId: session.organization_id,
        workspaceId: session.workspace_id,
        companyId: session.company_id,
        rawValue: raw,
        normalizedValue: normalized,
        suggestedField:
          mapping.canonicalField !== "ignore"
            ? mapping.canonicalField
            : (fuzzy?.field ?? null),
        confidence:
          mapping.canonicalField !== "ignore"
            ? mapping.confidence
            : (fuzzy?.confidence ?? 0),
        detectedErp: pipeline.detectedErp,
        languageCode: pipeline.detectedLanguage,
        sessionId: session.id,
      });
    }
  }

  await intelligence.logLearningEvent({
    organization_id: session.organization_id,
    workspace_id: session.workspace_id,
    company_id: session.company_id,
    import_session_id: session.id,
    event_type: "fingerprint_recorded",
    summary: `Recorded fingerprint for ${session.source_filename}`,
    metadata_json: {
      erp: pipeline.detectedErp,
      health: health.overallHealth,
      unknowns: pipeline.mappings.filter((m) => m.canonicalField === "ignore" || m.confidence < 95)
        .length,
    } as Json,
    actor_user_id: actorUserId,
  });

  return { health };
}

export async function applyLearnedDictionaryMappings(input: {
  intelligence: UaieIntelligenceRepository;
  workspaceId: string;
  pipeline: UaiePipelineResult;
}): Promise<Array<{ sourceColumnIndex: number; canonicalField: import("@/types/uaie").UaieCanonicalField }>> {
  const approved = await input.intelligence.listApprovedDictionary(input.workspaceId);
  if (approved.length === 0) return [];

  const byNormalized = new Map(approved.map((entry) => [entry.normalized_value, entry]));
  const learned: Array<{
    sourceColumnIndex: number;
    canonicalField: import("@/types/uaie").UaieCanonicalField;
  }> = [];

  for (const mapping of input.pipeline.mappings) {
    if (mapping.canonicalField !== "ignore" && mapping.confidence >= 95) continue;
    const raw = mapping.sourceHeader?.trim();
    if (!raw) continue;
    const normalized = normalizeAccountingHeader(raw);
    const entry = byNormalized.get(normalized);
    if (!entry) continue;
    learned.push({
      sourceColumnIndex: mapping.sourceColumnIndex,
      canonicalField: entry.canonical_field,
    });
  }

  return learned;
}
