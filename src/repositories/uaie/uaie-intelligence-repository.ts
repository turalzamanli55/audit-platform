import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json, Tables, TablesInsert } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter, requireRow } from "../base/repository-helpers";
import {
  unwrapSupabaseList,
  unwrapSupabaseMaybeSingle,
  unwrapSupabaseResult,
} from "@/utils/supabase-result";
import type { UaieCanonicalField, UaieErpSystem } from "@/types/uaie";

export type UaieDictionaryEntry = Tables<"uaie_dictionary_entries">;
export type UaieUnknownHeader = Tables<"uaie_unknown_headers">;
export type UaieFingerprint = Tables<"uaie_fingerprints">;
export type UaieLearningEvent = Tables<"uaie_learning_events">;
export type UaieIntelligenceAudit = Tables<"uaie_intelligence_audit">;

export class UaieIntelligenceRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async listSessions(filters?: {
    erp?: string | null;
    status?: string | null;
    companyId?: string | null;
    createdBy?: string | null;
    minConfidence?: number | null;
    search?: string | null;
    limit?: number;
  }) {
    let query = applyActiveFilter(
      this.client
        .from("uaie_import_sessions")
        .select(
          "id, company_id, created_by, detected_erp, source_filename, detected_language, detected_currency, overall_confidence, processing_ms, import_status, created_at, completed_at, summary_json, validation_json, health_json, started_at",
        )
        .order("created_at", { ascending: false })
        .limit(filters?.limit ?? 100),
    );
    if (filters?.erp) query = query.eq("detected_erp", filters.erp as never);
    if (filters?.status) query = query.eq("import_status", filters.status as never);
    if (filters?.companyId) query = query.eq("company_id", filters.companyId);
    if (filters?.createdBy) query = query.eq("created_by", filters.createdBy);
    if (filters?.minConfidence != null) {
      query = query.gte("overall_confidence", filters.minConfidence);
    }
    if (filters?.search?.trim()) {
      query = query.ilike("source_filename", `%${filters.search.trim()}%`);
    }
    return unwrapSupabaseList(await query);
  }

  async listApprovedDictionary(workspaceId: string): Promise<UaieDictionaryEntry[]> {
    const result = await applyActiveFilter(
      this.client
        .from("uaie_dictionary_entries")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("entry_status", "approved")
        .order("occurrences", { ascending: false })
        .limit(2000),
    );
    return unwrapSupabaseList(result);
  }

  async listDictionary(filters?: {
    status?: string | null;
    search?: string | null;
    limit?: number;
  }): Promise<UaieDictionaryEntry[]> {
    let query = applyActiveFilter(
      this.client
        .from("uaie_dictionary_entries")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(filters?.limit ?? 200),
    );
    if (filters?.status) query = query.eq("entry_status", filters.status as never);
    if (filters?.search?.trim()) {
      query = query.or(
        `raw_value.ilike.%${filters.search.trim()}%,normalized_value.ilike.%${filters.search.trim()}%`,
      );
    }
    return unwrapSupabaseList(await query);
  }

  async findDictionaryByNormalized(
    workspaceId: string,
    normalizedValue: string,
  ): Promise<UaieDictionaryEntry | null> {
    const result = await applyActiveFilter(
      this.client
        .from("uaie_dictionary_entries")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("normalized_value", normalizedValue)
        .eq("entry_status", "approved")
        .limit(1),
    ).maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async upsertDictionaryEntry(
    input: TablesInsert<"uaie_dictionary_entries">,
  ): Promise<UaieDictionaryEntry> {
    const existing = await applyActiveFilter(
      this.client
        .from("uaie_dictionary_entries")
        .select("*")
        .eq("workspace_id", input.workspace_id)
        .eq("normalized_value", input.normalized_value)
        .eq("canonical_field", input.canonical_field)
        .limit(1),
    ).maybeSingle();
    const found = unwrapSupabaseMaybeSingle(existing);
    if (found) {
      const result = await this.client
        .from("uaie_dictionary_entries")
        .update({
          occurrences: (found.occurrences ?? 0) + (input.occurrences ?? 1),
          confidence: Math.max(found.confidence, input.confidence ?? 0),
          language_code: input.language_code ?? found.language_code,
          detected_erp: input.detected_erp ?? found.detected_erp,
          updated_by: this.userId,
        })
        .eq("id", found.id)
        .select("*")
        .single();
      return requireRow(unwrapSupabaseResult(result), "UaieDictionaryEntry");
    }
    const result = await this.client
      .from("uaie_dictionary_entries")
      .insert({ ...input, created_by: this.userId, updated_by: this.userId })
      .select("*")
      .single();
    return requireRow(unwrapSupabaseResult(result), "UaieDictionaryEntry");
  }

  async updateDictionaryEntry(
    id: string,
    patch: Partial<UaieDictionaryEntry>,
  ): Promise<UaieDictionaryEntry> {
    const result = await applyActiveFilter(
      this.client
        .from("uaie_dictionary_entries")
        .update({ ...patch, updated_by: this.userId })
        .eq("id", id)
        .select("*"),
    ).maybeSingle();
    return requireRow(unwrapSupabaseMaybeSingle(result), "UaieDictionaryEntry", id);
  }

  async listUnknownHeaders(filters?: {
    status?: string | null;
    search?: string | null;
    limit?: number;
  }): Promise<UaieUnknownHeader[]> {
    let query = applyActiveFilter(
      this.client
        .from("uaie_unknown_headers")
        .select("*")
        .order("occurrences", { ascending: false })
        .limit(filters?.limit ?? 200),
    );
    if (filters?.status) query = query.eq("unknown_status", filters.status as never);
    if (filters?.search?.trim()) {
      query = query.or(
        `raw_value.ilike.%${filters.search.trim()}%,normalized_value.ilike.%${filters.search.trim()}%`,
      );
    }
    return unwrapSupabaseList(await query);
  }

  async upsertUnknownHeader(input: {
    organizationId: string;
    workspaceId: string;
    companyId?: string | null;
    rawValue: string;
    normalizedValue: string;
    suggestedField?: UaieCanonicalField | null;
    confidence: number;
    detectedErp?: UaieErpSystem | null;
    languageCode?: string | null;
    sessionId?: string | null;
  }): Promise<UaieUnknownHeader> {
    const existing = await applyActiveFilter(
      this.client
        .from("uaie_unknown_headers")
        .select("*")
        .eq("workspace_id", input.workspaceId)
        .eq("normalized_value", input.normalizedValue)
        .in("unknown_status", ["open", "suggested"])
        .limit(1),
    ).maybeSingle();
    const found = unwrapSupabaseMaybeSingle(existing);
    if (found) {
      const result = await this.client
        .from("uaie_unknown_headers")
        .update({
          occurrences: found.occurrences + 1,
          confidence: Math.max(found.confidence, input.confidence),
          suggested_field: input.suggestedField ?? found.suggested_field,
          detected_erp: input.detectedErp ?? found.detected_erp,
          language_code: input.languageCode ?? found.language_code,
          company_id: input.companyId ?? found.company_id,
          last_seen_at: new Date().toISOString(),
          last_session_id: input.sessionId ?? found.last_session_id,
          unknown_status:
            input.confidence >= 75
              ? "suggested"
              : found.unknown_status === "suggested"
                ? "suggested"
                : "open",
          updated_by: this.userId,
        })
        .eq("id", found.id)
        .select("*")
        .single();
      return requireRow(unwrapSupabaseResult(result), "UaieUnknownHeader");
    }
    const result = await this.client
      .from("uaie_unknown_headers")
      .insert({
        organization_id: input.organizationId,
        workspace_id: input.workspaceId,
        company_id: input.companyId ?? null,
        raw_value: input.rawValue,
        normalized_value: input.normalizedValue,
        suggested_field: input.suggestedField ?? null,
        confidence: input.confidence,
        detected_erp: input.detectedErp ?? null,
        language_code: input.languageCode ?? null,
        last_session_id: input.sessionId ?? null,
        unknown_status: input.confidence >= 75 ? "suggested" : "open",
        created_by: this.userId,
        updated_by: this.userId,
      })
      .select("*")
      .single();
    return requireRow(unwrapSupabaseResult(result), "UaieUnknownHeader");
  }

  async updateUnknownHeader(
    id: string,
    patch: Partial<UaieUnknownHeader>,
  ): Promise<UaieUnknownHeader> {
    const result = await applyActiveFilter(
      this.client
        .from("uaie_unknown_headers")
        .update({ ...patch, updated_by: this.userId })
        .eq("id", id)
        .select("*"),
    ).maybeSingle();
    return requireRow(unwrapSupabaseMaybeSingle(result), "UaieUnknownHeader", id);
  }

  async listFingerprints(limit = 100): Promise<UaieFingerprint[]> {
    const result = await applyActiveFilter(
      this.client
        .from("uaie_fingerprints")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit),
    );
    return unwrapSupabaseList(result);
  }

  async createFingerprint(input: TablesInsert<"uaie_fingerprints">): Promise<UaieFingerprint> {
    const result = await this.client
      .from("uaie_fingerprints")
      .insert({ ...input, created_by: this.userId, updated_by: this.userId })
      .select("*")
      .single();
    return requireRow(unwrapSupabaseResult(result), "UaieFingerprint");
  }

  async listLearningEvents(limit = 100): Promise<UaieLearningEvent[]> {
    const result = await this.client
      .from("uaie_learning_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    return unwrapSupabaseList(result);
  }

  async logLearningEvent(input: TablesInsert<"uaie_learning_events">): Promise<void> {
    await this.client.from("uaie_learning_events").insert({
      ...input,
      actor_user_id: input.actor_user_id ?? this.userId,
    });
  }

  async logIntelligenceAudit(input: TablesInsert<"uaie_intelligence_audit">): Promise<void> {
    await this.client.from("uaie_intelligence_audit").insert({
      ...input,
      actor_user_id: input.actor_user_id ?? this.userId,
    });
  }

  async listIntelligenceAudit(limit = 100): Promise<UaieIntelligenceAudit[]> {
    const result = await this.client
      .from("uaie_intelligence_audit")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    return unwrapSupabaseList(result);
  }

  async listMappingProfiles(companyId?: string | null) {
    let query = applyActiveFilter(
      this.client
        .from("uaie_mapping_profiles")
        .select("*")
        .order("last_used_at", { ascending: false })
        .limit(200),
    );
    if (companyId) query = query.eq("company_id", companyId);
    return unwrapSupabaseList(await query);
  }

  async listApprovedMappings(limit = 200) {
    const result = await this.client
      .from("uaie_column_mappings")
      .select(
        "id, source_header, canonical_field, confidence, is_manual, created_at, company_id, import_session_id, organization_id, workspace_id",
      )
      .eq("is_manual", true)
      .order("created_at", { ascending: false })
      .limit(limit);
    return unwrapSupabaseList(result);
  }

  async globalSearch(term: string) {
    const q = term.trim();
    if (!q) {
      return {
        dictionary: [] as UaieDictionaryEntry[],
        unknowns: [] as UaieUnknownHeader[],
        fingerprints: [] as UaieFingerprint[],
        sessions: [] as Awaited<ReturnType<UaieIntelligenceRepository["listSessions"]>>,
      };
    }
    const [dictionary, unknowns, fingerprints, sessions] = await Promise.all([
      this.listDictionary({ search: q, limit: 25 }),
      this.listUnknownHeaders({ search: q, limit: 25 }),
      applyActiveFilter(
        this.client
          .from("uaie_fingerprints")
          .select("*")
          .or(
            `workbook_hash.ilike.%${q}%,header_hash.ilike.%${q}%,layout_hash.ilike.%${q}%`,
          )
          .limit(25),
      ).then(unwrapSupabaseList),
      this.listSessions({ search: q, limit: 25 }),
    ]);
    return { dictionary, unknowns, fingerprints, sessions };
  }

  async analyticsSnapshot(workspaceId: string) {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [sessions, unknowns, dictionary, events] = await Promise.all([
      applyActiveFilter(
        this.client
          .from("uaie_import_sessions")
          .select(
            "id, import_status, overall_confidence, processing_ms, detected_erp, detected_language, detected_currency, company_id, created_at",
          )
          .eq("workspace_id", workspaceId)
          .order("created_at", { ascending: false })
          .limit(500),
      ).then(unwrapSupabaseList),
      this.listUnknownHeaders({ status: "open", limit: 500 }),
      this.listDictionary({ status: "approved", limit: 500 }),
      this.listLearningEvents(200),
    ]);

    const today = sessions.filter((s) => new Date(s.created_at) >= startOfDay).length;
    const month = sessions.filter((s) => new Date(s.created_at) >= startOfMonth).length;
    const successLike = sessions.filter((s) =>
      ["validated", "staged", "mapped"].includes(s.import_status),
    ).length;
    const avgConfidence =
      sessions.length === 0
        ? 0
        : Math.round(
            sessions.reduce((sum, s) => sum + (s.overall_confidence ?? 0), 0) / sessions.length,
          );
    const timed = sessions.filter((s) => s.processing_ms != null);
    const avgMs =
      timed.length === 0
        ? 0
        : Math.round(timed.reduce((sum, s) => sum + (s.processing_ms ?? 0), 0) / timed.length);

    const countBy = <T extends string>(items: Array<Record<string, unknown>>, key: string) => {
      const map = new Map<string, number>();
      for (const item of items) {
        const value = String(item[key] ?? "unknown");
        map.set(value, (map.get(value) ?? 0) + 1);
      }
      return [...map.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
    };

    return {
      importsToday: today,
      importsThisMonth: month,
      successRate: sessions.length === 0 ? 0 : Math.round((successLike / sessions.length) * 100),
      averageConfidence: avgConfidence,
      averageProcessingMs: avgMs,
      unknownHeaders: unknowns.length,
      pendingApprovals: unknowns.filter((u) => u.unknown_status === "suggested").length,
      dictionarySize: dictionary.length,
      learningEvents: events.length,
      topErps: countBy(sessions as Array<Record<string, unknown>>, "detected_erp").slice(0, 8),
      topLanguages: countBy(sessions as Array<Record<string, unknown>>, "detected_language").slice(
        0,
        8,
      ),
      topCurrencies: countBy(
        sessions as Array<Record<string, unknown>>,
        "detected_currency",
      ).slice(0, 8),
      topCustomers: countBy(sessions as Array<Record<string, unknown>>, "company_id").slice(0, 8),
      mostCorrectedWords: unknowns
        .slice()
        .sort((a, b) => b.occurrences - a.occurrences)
        .slice(0, 10)
        .map((u) => ({ word: u.raw_value, count: u.occurrences })),
      learningGrowth: events.slice(0, 30).map((e) => ({
        id: e.id,
        type: e.event_type,
        summary: e.summary,
        createdAt: e.created_at,
      })),
    };
  }

  toJson(value: unknown): Json {
    return value as Json;
  }
}
