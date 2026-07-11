"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Label, Select, Textarea } from "@/components/ui";
import {
  WorkspaceEmptyPanel,
  WorkspaceMetricCard,
  WorkspaceNoticeBanner,
  WorkspacePanel,
  WorkspaceProgressBar,
  WorkspaceSectionShell,
  WorkspaceStatusBadge,
  WorkspaceTable,
} from "@/components/workspace";
import {
  approveDictionaryEntryAction,
  approveUnknownHeaderAction,
  deleteDictionaryEntryAction,
  disableDictionaryEntryAction,
  exportDictionaryAction,
  ignoreUnknownHeaderAction,
  importDictionaryAction,
  mergeDictionaryEntriesAction,
  rejectUnknownHeaderAction,
  restoreDictionaryEntryAction,
} from "@/lib/actions/uaie";
import { UAIE_CANONICAL_FIELDS } from "@/constants/uaie";
import type { UaieIntelligenceSection } from "@/lib/uaie/intelligence/intelligence-workspace-display";
import type { UaieCanonicalField } from "@/types/uaie";

type Analytics = {
  importsToday: number;
  importsThisMonth: number;
  successRate: number;
  averageConfidence: number;
  averageProcessingMs: number;
  unknownHeaders: number;
  pendingApprovals: number;
  dictionarySize: number;
  learningEvents: number;
  topErps: Array<{ name: string; count: number }>;
  topLanguages: Array<{ name: string; count: number }>;
  topCurrencies: Array<{ name: string; count: number }>;
  topCustomers: Array<{ name: string; count: number }>;
  mostCorrectedWords: Array<{ word: string; count: number }>;
  learningGrowth: Array<{ id: string; type: string; summary: string; createdAt: string }>;
};

type Labels = {
  sections: Record<string, { title: string; description: string }>;
  fields: Record<string, string>;
  statuses: Record<string, string>;
  erps: Record<string, string>;
  actions: {
    approve: string;
    reject: string;
    ignore: string;
    merge: string;
    disable: string;
    delete: string;
    restore: string;
    export: string;
    import: string;
    search: string;
    apply: string;
  };
  columns: Record<string, string>;
  metrics: Record<string, string>;
  empty: string;
  errorGeneric: string;
  suggestionNotice: string;
};

function issueCounts(validationJson: unknown): { warnings: number; errors: number } {
  const issues = (validationJson as { issues?: Array<{ severity?: string }> } | null)?.issues ?? [];
  return {
    warnings: issues.filter((i) => i.severity === "warning").length,
    errors: issues.filter((i) => i.severity === "error" || i.severity === "blocking").length,
  };
}

export function UaieIntelligenceExperience(props: {
  section: UaieIntelligenceSection;
  labels: Labels;
  capabilities: { canReview: boolean; canApprove: boolean; canAdmin: boolean };
  analytics: Analytics;
  sessions: Array<Record<string, unknown>>;
  unknowns: Array<Record<string, unknown>>;
  dictionary: Array<Record<string, unknown>>;
  fingerprints: Array<Record<string, unknown>>;
  profiles: Array<Record<string, unknown>>;
  mappings: Array<Record<string, unknown>>;
  timeline: Array<Record<string, unknown>>;
  audit: Array<Record<string, unknown>>;
  companyNames: Record<string, string>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sessionErp, setSessionErp] = useState("all");
  const [sessionStatus, setSessionStatus] = useState("all");
  const [mergeTarget, setMergeTarget] = useState("");
  const [importJson, setImportJson] = useState("");
  const [fieldDrafts, setFieldDrafts] = useState<Record<string, UaieCanonicalField>>({});

  const section = props.labels.sections[props.section] ?? {
    title: props.section,
    description: "",
  };

  const run = (action: () => Promise<{ success: boolean; error?: { message?: string } | null }>) => {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.success) {
        setError(result.error?.message ?? props.labels.errorGeneric);
        return;
      }
      router.refresh();
    });
  };

  const filteredSessions = useMemo(() => {
    return props.sessions.filter((session) => {
      if (sessionErp !== "all" && session.detected_erp !== sessionErp) return false;
      if (sessionStatus !== "all" && session.import_status !== sessionStatus) return false;
      if (search.trim()) {
        const hay = `${session.source_filename ?? ""} ${session.id ?? ""}`.toLowerCase();
        if (!hay.includes(search.trim().toLowerCase())) return false;
      }
      return true;
    });
  }, [props.sessions, search, sessionErp, sessionStatus]);

  const suggestions = props.unknowns.filter(
    (row) => row.unknown_status === "suggested" || Number(row.confidence ?? 0) >= 75,
  );

  const erpTemplates = useMemo(() => {
    const map = new Map<
      string,
      {
        erp: string;
        imports: number;
        confidenceSum: number;
        languages: Set<string>;
        currencies: Set<string>;
        templates: number;
        success: number;
        lastSeen: string;
      }
    >();
    for (const session of props.sessions) {
      const erp = String(session.detected_erp ?? "unknown");
      const current = map.get(erp) ?? {
        erp,
        imports: 0,
        confidenceSum: 0,
        languages: new Set<string>(),
        currencies: new Set<string>(),
        templates: 0,
        success: 0,
        lastSeen: String(session.created_at ?? ""),
      };
      current.imports += 1;
      current.confidenceSum += Number(session.overall_confidence ?? 0);
      if (session.detected_language) current.languages.add(String(session.detected_language));
      if (session.detected_currency) current.currencies.add(String(session.detected_currency));
      if (["validated", "staged", "mapped"].includes(String(session.import_status))) {
        current.success += 1;
      }
      if (String(session.created_at ?? "") > current.lastSeen) {
        current.lastSeen = String(session.created_at ?? "");
      }
      map.set(erp, current);
    }
    for (const profile of props.profiles) {
      const erp = String(profile.detected_erp ?? "unknown");
      const current = map.get(erp);
      if (current) current.templates += 1;
    }
    return [...map.values()].sort((a, b) => b.imports - a.imports);
  }, [props.sessions, props.profiles]);

  return (
    <WorkspaceSectionShell title={section.title} description={section.description}>
      {error ? <WorkspaceNoticeBanner variant="error" description={error} role="alert" /> : null}

      {props.section === "overview" || props.section === "analytics" ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <WorkspaceMetricCard
              label={props.labels.metrics.importsToday}
              value={String(props.analytics.importsToday)}
            />
            <WorkspaceMetricCard
              label={props.labels.metrics.importsMonth}
              value={String(props.analytics.importsThisMonth)}
            />
            <WorkspaceMetricCard
              label={props.labels.metrics.successRate}
              value={`${props.analytics.successRate}%`}
            />
            <WorkspaceMetricCard
              label={props.labels.metrics.averageConfidence}
              value={`${props.analytics.averageConfidence}%`}
            />
            <WorkspaceMetricCard
              label={props.labels.metrics.averageProcessing}
              value={`${props.analytics.averageProcessingMs} ms`}
            />
            <WorkspaceMetricCard
              label={props.labels.metrics.unknownHeaders}
              value={String(props.analytics.unknownHeaders)}
            />
            <WorkspaceMetricCard
              label={props.labels.metrics.pendingApprovals}
              value={String(props.analytics.pendingApprovals)}
            />
            <WorkspaceMetricCard
              label={props.labels.metrics.dictionarySize}
              value={String(props.analytics.dictionarySize)}
            />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <WorkspacePanel>
              <h3 className="mb-3 font-medium">{props.labels.metrics.topErps}</h3>
              <WorkspaceTable
                columns={[
                  {
                    id: "name",
                    header: props.labels.columns.erp,
                    cell: (row) => props.labels.erps[row.name] ?? row.name,
                  },
                  { id: "count", header: props.labels.columns.count, cell: (row) => String(row.count) },
                ]}
                rows={props.analytics.topErps}
                keyFn={(row) => row.name}
                emptyTitle={props.labels.empty}
              />
            </WorkspacePanel>
            <WorkspacePanel>
              <h3 className="mb-3 font-medium">{props.labels.metrics.learningGrowth}</h3>
              <WorkspaceTable
                columns={[
                  { id: "summary", header: props.labels.columns.summary, cell: (row) => row.summary },
                  {
                    id: "when",
                    header: props.labels.columns.created,
                    cell: (row) => new Date(row.createdAt).toLocaleString(),
                  },
                ]}
                rows={props.analytics.learningGrowth}
                keyFn={(row) => row.id}
                emptyTitle={props.labels.empty}
              />
            </WorkspacePanel>
          </div>
        </div>
      ) : null}

      {props.section === "sessions" ? (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={props.labels.actions.search}
            />
            <Select value={sessionErp} onChange={(e) => setSessionErp(e.target.value)}>
              <option value="all">All ERP</option>
              {Object.keys(props.labels.erps).map((erp) => (
                <option key={erp} value={erp}>
                  {props.labels.erps[erp]}
                </option>
              ))}
            </Select>
            <Select value={sessionStatus} onChange={(e) => setSessionStatus(e.target.value)}>
              <option value="all">All status</option>
              {Object.keys(props.labels.statuses).map((status) => (
                <option key={status} value={status}>
                  {props.labels.statuses[status]}
                </option>
              ))}
            </Select>
          </div>
          <WorkspaceTable
            columns={[
              {
                id: "id",
                header: props.labels.columns.importId,
                cell: (row) => String(row.id).slice(0, 8),
              },
              {
                id: "company",
                header: props.labels.columns.company,
                cell: (row) =>
                  props.companyNames[String(row.company_id)] ?? String(row.company_id).slice(0, 8),
              },
              {
                id: "erp",
                header: props.labels.columns.erp,
                cell: (row) =>
                  props.labels.erps[String(row.detected_erp)] ?? String(row.detected_erp),
              },
              {
                id: "file",
                header: props.labels.columns.workbook,
                cell: (row) => String(row.source_filename ?? "—"),
              },
              {
                id: "lang",
                header: props.labels.columns.language,
                cell: (row) => String(row.detected_language ?? "—"),
              },
              {
                id: "currency",
                header: props.labels.columns.currency,
                cell: (row) => String(row.detected_currency ?? "—"),
              },
              {
                id: "confidence",
                header: props.labels.columns.confidence,
                cell: (row) => `${row.overall_confidence ?? 0}%`,
              },
              {
                id: "duration",
                header: props.labels.columns.duration,
                cell: (row) => `${row.processing_ms ?? 0} ms`,
              },
              {
                id: "rows",
                header: props.labels.columns.rows,
                cell: (row) =>
                  String((row.summary_json as { rowCount?: number } | null)?.rowCount ?? 0),
              },
              {
                id: "warnings",
                header: props.labels.columns.warnings,
                cell: (row) => String(issueCounts(row.validation_json).warnings),
              },
              {
                id: "errors",
                header: props.labels.columns.errors,
                cell: (row) => String(issueCounts(row.validation_json).errors),
              },
              {
                id: "status",
                header: props.labels.columns.status,
                cell: (row) => (
                  <WorkspaceStatusBadge
                    label={
                      props.labels.statuses[String(row.import_status)] ?? String(row.import_status)
                    }
                    variant="outline"
                  />
                ),
              },
              {
                id: "created",
                header: props.labels.columns.created,
                cell: (row) => new Date(String(row.created_at)).toLocaleString(),
              },
            ]}
            rows={filteredSessions}
            keyFn={(row) => String(row.id)}
            emptyTitle={props.labels.empty}
          />
        </div>
      ) : null}

      {props.section === "unknown-headers" ||
      props.section === "unknown-words" ||
      props.section === "suggestions" ? (
        <div className="space-y-4">
          {props.section === "suggestions" ? (
            <WorkspaceNoticeBanner variant="info" description={props.labels.suggestionNotice} />
          ) : null}
          <WorkspaceTable
            columns={[
              {
                id: "raw",
                header: props.labels.columns.raw,
                cell: (row) => String(row.raw_value),
              },
              {
                id: "confidence",
                header: props.labels.columns.confidence,
                cell: (row) => `${row.confidence ?? 0}%`,
              },
              {
                id: "suggested",
                header: props.labels.columns.suggested,
                cell: (row) => (
                  <Select
                    value={
                      fieldDrafts[String(row.id)] ??
                      String(row.suggested_field ?? "balance")
                    }
                    disabled={!props.capabilities.canApprove || isPending}
                    onChange={(e) =>
                      setFieldDrafts((current) => ({
                        ...current,
                        [String(row.id)]: e.target.value as UaieCanonicalField,
                      }))
                    }
                  >
                    {UAIE_CANONICAL_FIELDS.map((field) => (
                      <option key={field} value={field}>
                        {props.labels.fields[field] ?? field}
                      </option>
                    ))}
                  </Select>
                ),
              },
              {
                id: "occurrences",
                header: props.labels.columns.occurrences,
                cell: (row) => String(row.occurrences ?? 0),
              },
              {
                id: "erp",
                header: props.labels.columns.erp,
                cell: (row) =>
                  props.labels.erps[String(row.detected_erp ?? "unknown")] ??
                  String(row.detected_erp ?? "—"),
              },
              {
                id: "seen",
                header: props.labels.columns.lastSeen,
                cell: (row) => new Date(String(row.last_seen_at)).toLocaleString(),
              },
              {
                id: "actions",
                header: props.labels.columns.actions,
                cell: (row) => (
                  <div className="flex flex-wrap gap-2">
                    {props.capabilities.canApprove ? (
                      <Button
                        size="sm"
                        disabled={isPending}
                        onClick={() =>
                          run(() =>
                            approveUnknownHeaderAction({
                              unknownId: String(row.id),
                              canonicalField:
                                fieldDrafts[String(row.id)] ??
                                ((row.suggested_field as UaieCanonicalField | null) ?? "balance"),
                            }),
                          )
                        }
                      >
                        {props.labels.actions.approve}
                      </Button>
                    ) : null}
                    {props.capabilities.canReview ? (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={isPending}
                          onClick={() =>
                            run(() =>
                              rejectUnknownHeaderAction({ unknownId: String(row.id) }),
                            )
                          }
                        >
                          {props.labels.actions.reject}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={isPending}
                          onClick={() =>
                            run(() =>
                              ignoreUnknownHeaderAction({ unknownId: String(row.id) }),
                            )
                          }
                        >
                          {props.labels.actions.ignore}
                        </Button>
                      </>
                    ) : null}
                  </div>
                ),
              },
            ]}
            rows={
              props.section === "suggestions"
                ? suggestions
                : props.unknowns.filter((row) =>
                    ["open", "suggested"].includes(String(row.unknown_status)),
                  )
            }
            keyFn={(row) => String(row.id)}
            emptyTitle={props.labels.empty}
          />
        </div>
      ) : null}

      {props.section === "dictionary" ? (
        <div className="space-y-4">
          <WorkspaceTable
            columns={[
              { id: "raw", header: props.labels.columns.raw, cell: (row) => String(row.raw_value) },
              {
                id: "normalized",
                header: props.labels.columns.normalized,
                cell: (row) => String(row.normalized_value),
              },
              {
                id: "field",
                header: props.labels.columns.canonical,
                cell: (row) =>
                  props.labels.fields[String(row.canonical_field)] ?? String(row.canonical_field),
              },
              {
                id: "lang",
                header: props.labels.columns.language,
                cell: (row) => String(row.language_code ?? "—"),
              },
              {
                id: "source",
                header: props.labels.columns.source,
                cell: (row) => String(row.source ?? "—"),
              },
              {
                id: "confidence",
                header: props.labels.columns.confidence,
                cell: (row) => `${row.confidence ?? 0}%`,
              },
              {
                id: "occ",
                header: props.labels.columns.occurrences,
                cell: (row) => String(row.occurrences ?? 0),
              },
              {
                id: "status",
                header: props.labels.columns.status,
                cell: (row) => String(row.entry_status),
              },
              {
                id: "actions",
                header: props.labels.columns.actions,
                cell: (row) => (
                  <div className="flex flex-wrap gap-2">
                    {props.capabilities.canApprove && row.entry_status !== "approved" ? (
                      <Button
                        size="sm"
                        disabled={isPending}
                        onClick={() =>
                          run(() => approveDictionaryEntryAction({ entryId: String(row.id) }))
                        }
                      >
                        {props.labels.actions.approve}
                      </Button>
                    ) : null}
                    {props.capabilities.canAdmin ? (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={isPending}
                          onClick={() =>
                            run(() => disableDictionaryEntryAction({ entryId: String(row.id) }))
                          }
                        >
                          {props.labels.actions.disable}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={isPending}
                          onClick={() =>
                            run(() => restoreDictionaryEntryAction({ entryId: String(row.id) }))
                          }
                        >
                          {props.labels.actions.restore}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={isPending}
                          onClick={() =>
                            run(() => deleteDictionaryEntryAction({ entryId: String(row.id) }))
                          }
                        >
                          {props.labels.actions.delete}
                        </Button>
                      </>
                    ) : null}
                  </div>
                ),
              },
            ]}
            rows={props.dictionary}
            keyFn={(row) => String(row.id)}
            emptyTitle={props.labels.empty}
          />
          {props.capabilities.canAdmin && props.dictionary.length >= 2 ? (
            <WorkspacePanel>
              <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                <div className="space-y-1">
                  <Label>Source</Label>
                  <Select
                    value={mergeTarget.split(">")[0] ?? ""}
                    onChange={(e) =>
                      setMergeTarget(`${e.target.value}>${mergeTarget.split(">")[1] ?? ""}`)
                    }
                  >
                    <option value="">—</option>
                    {props.dictionary.map((row) => (
                      <option key={String(row.id)} value={String(row.id)}>
                        {String(row.raw_value)}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Target</Label>
                  <Select
                    value={mergeTarget.split(">")[1] ?? ""}
                    onChange={(e) =>
                      setMergeTarget(`${mergeTarget.split(">")[0] ?? ""}>${e.target.value}`)
                    }
                  >
                    <option value="">—</option>
                    {props.dictionary.map((row) => (
                      <option key={String(row.id)} value={String(row.id)}>
                        {String(row.raw_value)}
                      </option>
                    ))}
                  </Select>
                </div>
                <Button
                  disabled={isPending || !mergeTarget.includes(">")}
                  onClick={() => {
                    const [sourceEntryId, targetEntryId] = mergeTarget.split(">");
                    if (!sourceEntryId || !targetEntryId) return;
                    run(() =>
                      mergeDictionaryEntriesAction({ sourceEntryId, targetEntryId }),
                    );
                  }}
                >
                  {props.labels.actions.merge}
                </Button>
              </div>
            </WorkspacePanel>
          ) : null}
        </div>
      ) : null}

      {props.section === "erp-templates" ? (
        <WorkspaceTable
          columns={[
            {
              id: "erp",
              header: props.labels.columns.erp,
              cell: (row) => props.labels.erps[row.erp] ?? row.erp,
            },
            {
              id: "imports",
              header: props.labels.columns.imports,
              cell: (row) => String(row.imports),
            },
            {
              id: "avg",
              header: props.labels.columns.confidence,
              cell: (row) =>
                `${row.imports ? Math.round(row.confidenceSum / row.imports) : 0}%`,
            },
            {
              id: "langs",
              header: props.labels.columns.language,
              cell: (row) => [...row.languages].join(", ") || "—",
            },
            {
              id: "currencies",
              header: props.labels.columns.currency,
              cell: (row) => [...row.currencies].join(", ") || "—",
            },
            {
              id: "templates",
              header: props.labels.columns.templates,
              cell: (row) => String(row.templates),
            },
            {
              id: "success",
              header: props.labels.metrics.successRate,
              cell: (row) =>
                `${row.imports ? Math.round((row.success / row.imports) * 100) : 0}%`,
            },
            {
              id: "last",
              header: props.labels.columns.lastSeen,
              cell: (row) => (row.lastSeen ? new Date(row.lastSeen).toLocaleString() : "—"),
            },
          ]}
          rows={erpTemplates}
          keyFn={(row) => row.erp}
          emptyTitle={props.labels.empty}
        />
      ) : null}

      {props.section === "customer-templates" ? (
        <WorkspaceTable
          columns={[
            {
              id: "company",
              header: props.labels.columns.company,
              cell: (row) =>
                props.companyNames[String(row.company_id)] ??
                String(row.company_id ?? "workspace").slice(0, 8),
            },
            {
              id: "name",
              header: props.labels.columns.template,
              cell: (row) => String(row.profile_name),
            },
            {
              id: "erp",
              header: props.labels.columns.erp,
              cell: (row) =>
                props.labels.erps[String(row.detected_erp)] ?? String(row.detected_erp),
            },
            {
              id: "layout",
              header: props.labels.columns.fingerprint,
              cell: (row) => String(row.layout_fingerprint ?? "—").slice(0, 12),
            },
            {
              id: "success",
              header: props.labels.columns.occurrences,
              cell: (row) => String(row.success_count ?? 0),
            },
            {
              id: "last",
              header: props.labels.columns.lastSeen,
              cell: (row) =>
                row.last_used_at ? new Date(String(row.last_used_at)).toLocaleString() : "—",
            },
          ]}
          rows={props.profiles}
          keyFn={(row) => String(row.id)}
          emptyTitle={props.labels.empty}
        />
      ) : null}

      {props.section === "fingerprints" ? (
        <WorkspaceTable
          columns={[
            {
              id: "workbook",
              header: props.labels.columns.workbookHash,
              cell: (row) => String(row.workbook_hash ?? "—").slice(0, 12),
            },
            {
              id: "header",
              header: props.labels.columns.headerHash,
              cell: (row) => String(row.header_hash ?? "—").slice(0, 12),
            },
            {
              id: "layout",
              header: props.labels.columns.layoutHash,
              cell: (row) => String(row.layout_hash ?? "—").slice(0, 12),
            },
            {
              id: "erp",
              header: props.labels.columns.erp,
              cell: (row) =>
                props.labels.erps[String(row.detected_erp)] ?? String(row.detected_erp),
            },
            {
              id: "confidence",
              header: props.labels.columns.confidence,
              cell: (row) => `${row.confidence ?? 0}%`,
            },
            {
              id: "learning",
              header: props.labels.columns.learningScore,
              cell: (row) => `${row.learning_score ?? 0}%`,
            },
            {
              id: "version",
              header: props.labels.columns.templateVersion,
              cell: (row) => String(row.template_version ?? 1),
            },
          ]}
          rows={props.fingerprints}
          keyFn={(row) => String(row.id)}
          emptyTitle={props.labels.empty}
        />
      ) : null}

      {props.section === "mappings" ? (
        <WorkspaceTable
          columns={[
            {
              id: "source",
              header: props.labels.columns.source,
              cell: (row) => String(row.source_header ?? "—"),
            },
            {
              id: "dest",
              header: props.labels.columns.canonical,
              cell: (row) =>
                props.labels.fields[String(row.canonical_field)] ?? String(row.canonical_field),
            },
            {
              id: "confidence",
              header: props.labels.columns.confidence,
              cell: (row) => `${row.confidence ?? 0}%`,
            },
            {
              id: "company",
              header: props.labels.columns.company,
              cell: (row) =>
                props.companyNames[String(row.company_id)] ?? String(row.company_id).slice(0, 8),
            },
            {
              id: "created",
              header: props.labels.columns.created,
              cell: (row) => new Date(String(row.created_at)).toLocaleString(),
            },
          ]}
          rows={props.mappings}
          keyFn={(row) => String(row.id)}
          emptyTitle={props.labels.empty}
        />
      ) : null}

      {props.section === "health" ? (
        <div className="space-y-4">
          {props.sessions.length === 0 ? (
            <WorkspaceEmptyPanel title={props.labels.empty} description={section.description} />
          ) : (
            props.sessions.slice(0, 20).map((session) => {
              const health = (session.health_json ?? {}) as Record<string, number>;
              return (
                <WorkspacePanel key={String(session.id)}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="font-medium">{String(session.source_filename)}</p>
                    <WorkspaceStatusBadge
                      label={`${health.overallHealth ?? 0}%`}
                      variant="outline"
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {(
                      [
                        "workbookHealth",
                        "headerHealth",
                        "columnHealth",
                        "languageHealth",
                        "currencyHealth",
                        "balanceHealth",
                        "validationHealth",
                        "overallHealth",
                      ] as const
                    ).map((key) => (
                      <WorkspaceProgressBar
                        key={key}
                        label={props.labels.metrics[key] ?? key}
                        value={Number(health[key] ?? 0)}
                      />
                    ))}
                  </div>
                </WorkspacePanel>
              );
            })
          )}
        </div>
      ) : null}

      {props.section === "timeline" ? (
        <WorkspaceTable
          columns={[
            {
              id: "type",
              header: props.labels.columns.type,
              cell: (row) => String(row.event_type),
            },
            {
              id: "summary",
              header: props.labels.columns.summary,
              cell: (row) => String(row.summary),
            },
            {
              id: "created",
              header: props.labels.columns.created,
              cell: (row) => new Date(String(row.created_at)).toLocaleString(),
            },
          ]}
          rows={props.timeline}
          keyFn={(row) => String(row.id)}
          emptyTitle={props.labels.empty}
        />
      ) : null}

      {props.section === "history" ? (
        <WorkspaceTable
          columns={[
            {
              id: "action",
              header: props.labels.columns.actions,
              cell: (row) => String(row.action_code),
            },
            {
              id: "summary",
              header: props.labels.columns.summary,
              cell: (row) => String(row.summary),
            },
            {
              id: "resource",
              header: props.labels.columns.source,
              cell: (row) => String(row.resource_type),
            },
            {
              id: "created",
              header: props.labels.columns.created,
              cell: (row) => new Date(String(row.created_at)).toLocaleString(),
            },
          ]}
          rows={props.audit}
          keyFn={(row) => String(row.id)}
          emptyTitle={props.labels.empty}
        />
      ) : null}

      {props.section === "admin" ? (
        <div className="space-y-4">
          {!props.capabilities.canAdmin ? (
            <WorkspaceNoticeBanner
              variant="warning"
              description="Administrator permission required."
            />
          ) : (
            <>
              <WorkspacePanel>
                <div className="flex flex-wrap gap-3">
                  <Button
                    disabled={isPending}
                    onClick={() =>
                      run(async () => {
                        const result = await exportDictionaryAction({});
                        if (result.success) {
                          const blob = new Blob([JSON.stringify(result.data.entries, null, 2)], {
                            type: "application/json",
                          });
                          const url = URL.createObjectURL(blob);
                          const anchor = document.createElement("a");
                          anchor.href = url;
                          anchor.download = "uaie-dictionary.json";
                          anchor.click();
                          URL.revokeObjectURL(url);
                        }
                        return result;
                      })
                    }
                  >
                    {props.labels.actions.export}
                  </Button>
                </div>
              </WorkspacePanel>
              <WorkspacePanel>
                <div className="space-y-3">
                  <Label>Import dictionary JSON</Label>
                  <Textarea
                    value={importJson}
                    onChange={(e) => setImportJson(e.target.value)}
                    rows={8}
                  />
                  <Button
                    disabled={isPending || !importJson.trim()}
                    onClick={() =>
                      run(async () => {
                        const parsed = JSON.parse(importJson) as Array<{
                          rawValue: string;
                          normalizedValue: string;
                          canonicalField: UaieCanonicalField;
                          languageCode?: string | null;
                          confidence?: number;
                        }>;
                        return importDictionaryAction({ entries: parsed });
                      })
                    }
                  >
                    {props.labels.actions.import}
                  </Button>
                </div>
              </WorkspacePanel>
            </>
          )}
        </div>
      ) : null}

      {props.section === "search" ? (
        <div className="space-y-4">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={props.labels.actions.search}
          />
          <WorkspaceTable
            columns={[
              { id: "kind", header: props.labels.columns.type, cell: (row) => row.kind },
              { id: "value", header: props.labels.columns.raw, cell: (row) => row.value },
              {
                id: "meta",
                header: props.labels.columns.summary,
                cell: (row) => row.meta,
              },
            ]}
            rows={[
              ...props.dictionary
                .filter((row) =>
                  String(row.raw_value).toLowerCase().includes(search.toLowerCase()),
                )
                .map((row) => ({
                  id: `d-${row.id}`,
                  kind: "dictionary",
                  value: String(row.raw_value),
                  meta: String(row.canonical_field),
                })),
              ...props.unknowns
                .filter((row) =>
                  String(row.raw_value).toLowerCase().includes(search.toLowerCase()),
                )
                .map((row) => ({
                  id: `u-${row.id}`,
                  kind: "unknown",
                  value: String(row.raw_value),
                  meta: `${row.confidence}%`,
                })),
              ...props.fingerprints
                .filter((row) =>
                  `${row.workbook_hash}${row.header_hash}${row.layout_hash}`
                    .toLowerCase()
                    .includes(search.toLowerCase()),
                )
                .map((row) => ({
                  id: `f-${row.id}`,
                  kind: "fingerprint",
                  value: String(row.layout_hash ?? "").slice(0, 16),
                  meta: String(row.detected_erp),
                })),
            ]}
            keyFn={(row) => row.id}
            emptyTitle={props.labels.empty}
          />
        </div>
      ) : null}
    </WorkspaceSectionShell>
  );
}
