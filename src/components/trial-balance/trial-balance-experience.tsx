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
  approveTrialBalanceAction,
  archiveTrialBalanceAction,
  createTrialBalanceAdjustmentAction,
  createTrialBalanceFromUaieAction,
  lockTrialBalanceAction,
  returnTrialBalanceAction,
  rollForwardTrialBalanceAction,
  startTrialBalanceReviewAction,
  submitTrialBalanceAction,
  validateTrialBalanceAction,
} from "@/lib/actions/trial-balance";
import type { TrialBalanceWorkspaceSection } from "@/types/trial-balance";

type Labels = {
  sections: Record<string, { title: string; description: string }>;
  statuses: Record<string, string>;
  accountTypes: Record<string, string>;
  emptyTitle: string;
  emptyDescription: string;
  createAction: string;
  creating: string;
  selectImport: string;
  errorGeneric: string;
  metrics: Record<string, string>;
  columns: Record<string, string>;
  actions: Record<string, string>;
  workflow: Record<string, string>;
  filters?: {
    allTypes?: string;
  };
};

export function TrialBalanceExperience(props: {
  section: TrialBalanceWorkspaceSection;
  engagementId: string;
  labels: Labels;
  capabilities: {
    canCreate: boolean;
    canUpdate: boolean;
    canReview: boolean;
    canApprove: boolean;
    canArchive: boolean;
  };
  package: Record<string, unknown> | null;
  lines: Array<Record<string, unknown>>;
  adjustments: Array<Record<string, unknown>>;
  mappings: Array<Record<string, unknown>>;
  periods: Array<Record<string, unknown>>;
  versions: Array<Record<string, unknown>>;
  activity: Array<Record<string, unknown>>;
  stagedImports: Array<{
    id: string;
    filename: string;
    confidence: number;
    erp: string;
    createdAt: string;
    rowCount: number;
  }>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [importSessionId, setImportSessionId] = useState(props.stagedImports[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [adjustmentDescription, setAdjustmentDescription] = useState("");
  const [adjustmentAmount, setAdjustmentAmount] = useState("");
  const [returnNotes, setReturnNotes] = useState("");

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

  const filteredLines = useMemo(() => {
    return props.lines.filter((line) => {
      if (typeFilter !== "all" && line.account_type !== typeFilter) return false;
      if (!search.trim()) return true;
      const hay = `${line.account_code} ${line.account_name} ${line.category ?? ""}`.toLowerCase();
      return hay.includes(search.trim().toLowerCase());
    });
  }, [props.lines, search, typeFilter]);

  const issues =
    ((props.package?.validation_json as { issues?: Array<Record<string, unknown>> } | null)
      ?.issues ?? []) as Array<Record<string, unknown>>;

  if (!props.package) {
    return (
      <WorkspaceSectionShell title={section.title} description={section.description}>
        {error ? <WorkspaceNoticeBanner variant="error" description={error} role="alert" /> : null}
        <WorkspaceEmptyPanel
          title={props.labels.emptyTitle}
          description={props.labels.emptyDescription}
        />
        {props.capabilities.canCreate ? (
          <WorkspacePanel>
            <div className="space-y-3">
              <Label>{props.labels.selectImport}</Label>
              <Select
                value={importSessionId}
                onChange={(event) => setImportSessionId(event.target.value)}
              >
                <option value="">—</option>
                {props.stagedImports.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.filename} · {session.erp} · {session.confidence}%
                  </option>
                ))}
              </Select>
              <Button
                disabled={isPending || !importSessionId}
                onClick={() =>
                  run(() =>
                    createTrialBalanceFromUaieAction({
                      engagementId: props.engagementId,
                      importSessionId,
                    }),
                  )
                }
              >
                {isPending ? props.labels.creating : props.labels.createAction}
              </Button>
            </div>
          </WorkspacePanel>
        ) : null}
      </WorkspaceSectionShell>
    );
  }

  const pkg = props.package;

  return (
    <WorkspaceSectionShell title={section.title} description={section.description}>
      {error ? <WorkspaceNoticeBanner variant="error" description={error} role="alert" /> : null}

      {(props.section === "overview" || props.section === "validation") && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <WorkspaceMetricCard
              label={props.labels.metrics.accounts}
              value={String(pkg.account_count ?? 0)}
            />
            <WorkspaceMetricCard
              label={props.labels.metrics.warnings}
              value={String(pkg.warning_count ?? 0)}
            />
            <WorkspaceMetricCard
              label={props.labels.metrics.outOfBalance}
              value={String(pkg.out_of_balance_amount ?? 0)}
            />
            <WorkspaceMetricCard
              label={props.labels.metrics.adjustments}
              value={String(pkg.adjustment_count ?? 0)}
            />
            <WorkspaceMetricCard
              label={props.labels.metrics.mapped}
              value={String(pkg.mapped_count ?? 0)}
            />
            <WorkspaceMetricCard
              label={props.labels.metrics.unmapped}
              value={String(pkg.unmapped_count ?? 0)}
            />
            <WorkspaceMetricCard
              label={props.labels.metrics.currency}
              value={String(pkg.functional_currency ?? "—")}
            />
            <WorkspaceMetricCard
              label={props.labels.metrics.fiscalYear}
              value={String(pkg.fiscal_year ?? "—")}
            />
          </div>

          <WorkspacePanel>
            <h3 className="mb-3 font-medium">{props.labels.workflow.title}</h3>
            <div className="flex flex-wrap gap-2">
              {props.capabilities.canUpdate ? (
                <Button
                  size="sm"
                  disabled={isPending}
                  onClick={() =>
                    run(() => validateTrialBalanceAction({ packageId: String(pkg.id) }))
                  }
                >
                  {props.labels.workflow.validate}
                </Button>
              ) : null}
              {props.capabilities.canUpdate ? (
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={isPending}
                  onClick={() =>
                    run(() => submitTrialBalanceAction({ packageId: String(pkg.id) }))
                  }
                >
                  {props.labels.workflow.submit}
                </Button>
              ) : null}
              {props.capabilities.canReview ? (
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={isPending}
                  onClick={() =>
                    run(() => startTrialBalanceReviewAction({ packageId: String(pkg.id) }))
                  }
                >
                  {props.labels.workflow.review}
                </Button>
              ) : null}
              {props.capabilities.canApprove ? (
                <Button
                  size="sm"
                  disabled={isPending}
                  onClick={() =>
                    run(() => approveTrialBalanceAction({ packageId: String(pkg.id) }))
                  }
                >
                  {props.labels.workflow.approve}
                </Button>
              ) : null}
              {props.capabilities.canApprove ? (
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={isPending}
                  onClick={() => run(() => lockTrialBalanceAction({ packageId: String(pkg.id) }))}
                >
                  {props.labels.workflow.lock}
                </Button>
              ) : null}
              {props.capabilities.canArchive ? (
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={isPending}
                  onClick={() =>
                    run(() => archiveTrialBalanceAction({ packageId: String(pkg.id) }))
                  }
                >
                  {props.labels.workflow.archive}
                </Button>
              ) : null}
            </div>
            {props.capabilities.canReview ? (
              <div className="mt-4 space-y-2">
                <Textarea
                  value={returnNotes}
                  onChange={(event) => setReturnNotes(event.target.value)}
                  placeholder={props.labels.workflow.returnNotes}
                />
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={isPending || !returnNotes.trim()}
                  onClick={() =>
                    run(() =>
                      returnTrialBalanceAction({
                        packageId: String(pkg.id),
                        returnNotes,
                      }),
                    )
                  }
                >
                  {props.labels.workflow.return}
                </Button>
              </div>
            ) : null}
          </WorkspacePanel>

          {props.section === "validation" ? (
            <WorkspaceTable
              columns={[
                {
                  id: "severity",
                  header: props.labels.columns.severity,
                  cell: (row) => (
                    <WorkspaceStatusBadge label={String(row.severity)} variant="outline" />
                  ),
                },
                {
                  id: "message",
                  header: props.labels.columns.message,
                  cell: (row) => String(row.message),
                },
                {
                  id: "account",
                  header: props.labels.columns.code,
                  cell: (row) => String(row.accountCode ?? "—"),
                },
              ]}
              rows={issues}
              keyFn={(row) => `${String(row.issueCode)}-${String(row.accountCode ?? "")}-${String(row.message)}`}
              emptyTitle={props.labels.emptyTitle}
            />
          ) : null}
        </div>
      )}

      {(props.section === "accounts" ||
        props.section === "hierarchy" ||
        props.section === "search" ||
        props.section === "mappings") && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={props.labels.actions.search}
            />
            <Select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
              <option value="all">{props.labels.filters?.allTypes ?? "All types"}</option>
              {Object.keys(props.labels.accountTypes).map((type) => (
                <option key={type} value={type}>
                  {props.labels.accountTypes[type]}
                </option>
              ))}
            </Select>
          </div>
          <WorkspaceTable
            columns={[
              {
                id: "code",
                header: props.labels.columns.code,
                cell: (row) => String(row.account_code),
              },
              {
                id: "name",
                header: props.labels.columns.name,
                cell: (row) => (
                  <span style={{ paddingLeft: `${(Number(row.account_level) - 1) * 12}px` }}>
                    {String(row.account_name)}
                  </span>
                ),
              },
              {
                id: "type",
                header: props.labels.columns.type,
                cell: (row) =>
                  props.labels.accountTypes[String(row.account_type)] ?? String(row.account_type),
              },
              {
                id: "closing",
                header: props.labels.columns.closing,
                cell: (row) => Number(row.adjusted_closing_balance ?? row.closing_balance).toLocaleString(),
              },
              {
                id: "lead",
                header: props.labels.columns.lead,
                cell: (row) => String(row.lead_schedule),
              },
              {
                id: "fs",
                header: props.labels.columns.fs,
                cell: (row) => String(row.fs_statement),
              },
              {
                id: "confidence",
                header: props.labels.columns.confidence,
                cell: (row) => `${row.classification_confidence ?? 0}%`,
              },
            ]}
            rows={filteredLines}
            keyFn={(row) => String(row.id)}
            emptyTitle={props.labels.emptyTitle}
          />
        </div>
      )}

      {(props.section === "adjustments" || props.section === "reclassifications") && (
        <div className="space-y-4">
          {props.capabilities.canUpdate ? (
            <WorkspacePanel>
              <div className="grid gap-3 sm:grid-cols-[1fr_8rem_auto] sm:items-end">
                <div className="space-y-1">
                  <Label>{props.labels.columns.description}</Label>
                  <Input
                    value={adjustmentDescription}
                    onChange={(event) => setAdjustmentDescription(event.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>{props.labels.columns.amount}</Label>
                  <Input
                    value={adjustmentAmount}
                    onChange={(event) => setAdjustmentAmount(event.target.value)}
                  />
                </div>
                <Button
                  disabled={isPending || !adjustmentDescription.trim() || !adjustmentAmount}
                  onClick={() =>
                    run(() =>
                      createTrialBalanceAdjustmentAction({
                        packageId: String(pkg.id),
                        description: adjustmentDescription,
                        amount: Number(adjustmentAmount),
                        adjustmentType:
                          props.section === "reclassifications"
                            ? "reclassification"
                            : "adjustment",
                      }),
                    )
                  }
                >
                  {props.labels.actions.addAdjustment}
                </Button>
              </div>
            </WorkspacePanel>
          ) : null}
          <WorkspaceTable
            columns={[
              {
                id: "type",
                header: props.labels.columns.type,
                cell: (row) => String(row.adjustment_type),
              },
              {
                id: "description",
                header: props.labels.columns.description,
                cell: (row) => String(row.description),
              },
              {
                id: "amount",
                header: props.labels.columns.amount,
                cell: (row) => Number(row.amount).toLocaleString(),
              },
              {
                id: "status",
                header: props.labels.columns.status,
                cell: (row) => String(row.adjustment_status),
              },
            ]}
            rows={
              props.section === "reclassifications"
                ? props.adjustments.filter((row) => row.adjustment_type === "reclassification")
                : props.adjustments
            }
            keyFn={(row) => String(row.id)}
            emptyTitle={props.labels.emptyTitle}
          />
        </div>
      )}

      {(props.section === "currencies" || props.section === "periods" || props.section === "comparatives") && (
        <div className="space-y-4">
          {props.section === "currencies" ? (
            <div className="grid gap-4 sm:grid-cols-3">
              <WorkspaceMetricCard
                label={props.labels.metrics.functional}
                value={String(pkg.functional_currency ?? "—")}
              />
              <WorkspaceMetricCard
                label={props.labels.metrics.presentation}
                value={String(pkg.presentation_currency ?? "—")}
              />
              <WorkspaceMetricCard
                label={props.labels.metrics.fxAccounts}
                value={String(
                  props.lines.filter((line) => Number(line.fx_gain_loss ?? 0) !== 0).length,
                )}
              />
            </div>
          ) : null}
          <WorkspaceTable
            columns={[
              {
                id: "label",
                header: props.labels.columns.period,
                cell: (row) => String(row.period_label),
              },
              {
                id: "type",
                header: props.labels.columns.type,
                cell: (row) => String(row.period_type),
              },
              {
                id: "year",
                header: props.labels.metrics.fiscalYear,
                cell: (row) => String(row.fiscal_year),
              },
              {
                id: "comparative",
                header: props.labels.columns.comparative,
                cell: (row) => (row.is_comparative ? "Yes" : "No"),
              },
            ]}
            rows={
              props.section === "comparatives"
                ? props.periods.filter((row) => row.is_comparative)
                : props.periods
            }
            keyFn={(row) => String(row.id)}
            emptyTitle={props.labels.emptyTitle}
          />
        </div>
      )}

      {(props.section === "history" || props.section === "versions") && (
        <WorkspaceTable
          columns={[
            {
              id: "summary",
              header: props.labels.columns.description,
              cell: (row) => String(row.summary ?? row.change_summary ?? "—"),
            },
            {
              id: "action",
              header: props.labels.columns.type,
              cell: (row) => String(row.action ?? row.version_number ?? "—"),
            },
            {
              id: "created",
              header: props.labels.columns.created,
              cell: (row) => new Date(String(row.created_at)).toLocaleString(),
            },
          ]}
          rows={props.section === "versions" ? props.versions : props.activity}
          keyFn={(row) => String(row.id)}
          emptyTitle={props.labels.emptyTitle}
        />
      )}

      {props.section === "settings" && (
        <WorkspacePanel>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Status: {props.labels.statuses[String(pkg.package_status)] ?? String(pkg.package_status)}
            </p>
            <WorkspaceProgressBar
              label={props.labels.metrics.mapped}
              value={
                Number(pkg.account_count)
                  ? Math.round((Number(pkg.mapped_count) / Number(pkg.account_count)) * 100)
                  : 0
              }
            />
            {props.capabilities.canCreate ? (
              <Button
                disabled={isPending}
                onClick={() =>
                  run(() =>
                    rollForwardTrialBalanceAction({
                      packageId: String(pkg.id),
                      targetFiscalYear: Number(pkg.fiscal_year) + 1,
                    }),
                  )
                }
              >
                {props.labels.actions.rollForward}
              </Button>
            ) : null}
          </div>
        </WorkspacePanel>
      )}
    </WorkspaceSectionShell>
  );
}
