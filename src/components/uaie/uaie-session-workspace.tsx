"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, Label, Select } from "@/components/ui";
import {
  WorkspaceMetricCard,
  WorkspaceNoticeBanner,
  WorkspacePanel,
  WorkspaceProgressBar,
  WorkspaceStatusBadge,
  WorkspaceTable,
} from "@/components/workspace";
import {
  applyUaieMappingAction,
  archiveUaieSessionAction,
  cancelUaieSessionAction,
  confirmUaieStageAction,
} from "@/lib/actions/uaie";
import { UAIE_CANONICAL_FIELDS } from "@/constants/uaie";
import type { UaieCanonicalField } from "@/types/uaie";

type SessionView = {
  id: string;
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

type Labels = {
  backAction: string;
  detectionTitle: string;
  detectionDescription: string;
  sheetsTitle: string;
  mappingTitle: string;
  mappingDescription: string;
  validationTitle: string;
  datasetTitle: string;
  summaryTitle: string;
  applyMapping: string;
  applying: string;
  stageAction: string;
  staging: string;
  cancelAction: string;
  archiveAction: string;
  confidence: string;
  erp: string;
  language: string;
  currency: string;
  sheet: string;
  mapping: string;
  sourceColumn: string;
  canonicalField: string;
  severity: string;
  message: string;
  accountCode: string;
  accountName: string;
  debit: string;
  credit: string;
  balance: string;
  rowCount: string;
  validRows: string;
  debitTotal: string;
  creditTotal: string;
  wizardRequired: string;
  stagedNotice: string;
  errorGeneric: string;
  fields: Record<string, string>;
};

export function UaieSessionWorkspace(props: {
  locale: string;
  companySlug: string;
  session: SessionView;
  canUpdate: boolean;
  canValidate: boolean;
  canArchive: boolean;
  labels: Labels;
  statusLabels: Record<string, string>;
  erpLabels: Record<string, string>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [sheetName, setSheetName] = useState(props.session.selectedSheetName ?? "");
  const [draftMappings, setDraftMappings] = useState<Record<number, UaieCanonicalField>>(() => {
    const initial: Record<number, UaieCanonicalField> = {};
    for (const mapping of props.session.mappings) {
      initial[mapping.sourceColumnIndex] = mapping.canonicalField as UaieCanonicalField;
    }
    return initial;
  });

  const summary = props.session.summary;
  const rowCount = typeof summary.rowCount === "number" ? summary.rowCount : props.session.rows.length;
  const validRowCount =
    typeof summary.validRowCount === "number"
      ? summary.validRowCount
      : props.session.rows.filter((row) => row.isValid).length;
  const debitTotal = typeof summary.debitTotal === "number" ? summary.debitTotal : 0;
  const creditTotal = typeof summary.creditTotal === "number" ? summary.creditTotal : 0;

  const mappingColumns = useMemo(() => {
    if (props.session.mappings.length > 0) return props.session.mappings;
    return Object.keys(draftMappings).map((key) => ({
      sourceColumnIndex: Number(key),
      sourceHeader: `Column ${Number(key) + 1}`,
      canonicalField: draftMappings[Number(key)] ?? "ignore",
      confidence: 0,
      isManual: true,
    }));
  }, [draftMappings, props.session.mappings]);

  const runAction = (
    action: () => Promise<{ success: boolean; error?: { message?: string } | null }>,
  ) => {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() =>
            router.push(`/${props.locale}/app/companies/${props.companySlug}/import`)
          }
        >
          {props.labels.backAction}
        </Button>
        <WorkspaceStatusBadge
          label={props.statusLabels[props.session.importStatus] ?? props.session.importStatus}
          variant="outline"
        />
      </div>

      <WorkspacePanel>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{props.session.filename}</h1>
          <p className="text-sm text-muted-foreground">{props.labels.detectionDescription}</p>
        </div>
        <div className="mt-4">
          <WorkspaceProgressBar value={props.session.overallConfidence} label={props.labels.confidence} />
        </div>
      </WorkspacePanel>

      {props.session.requiresWizard ? (
        <WorkspaceNoticeBanner variant="warning" description={props.labels.wizardRequired} />
      ) : null}
      {props.session.importStatus === "staged" ? (
        <WorkspaceNoticeBanner variant="success" description={props.labels.stagedNotice} />
      ) : null}
      {error ? <WorkspaceNoticeBanner variant="error" description={error} role="alert" /> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <WorkspaceMetricCard
          label={props.labels.erp}
          value={props.erpLabels[props.session.detectedErp] ?? props.session.detectedErp}
          hint={`${props.session.erpConfidence}%`}
        />
        <WorkspaceMetricCard
          label={props.labels.language}
          value={props.session.detectedLanguage ?? "—"}
          hint={`${props.session.languageConfidence}%`}
        />
        <WorkspaceMetricCard
          label={props.labels.currency}
          value={props.session.detectedCurrency ?? "—"}
          hint={`${props.session.currencyConfidence}%`}
        />
        <WorkspaceMetricCard
          label={props.labels.sheet}
          value={props.session.selectedSheetName ?? "—"}
          hint={`${props.session.sheetConfidence}%`}
        />
        <WorkspaceMetricCard
          label={props.labels.mapping}
          value={`${props.session.mappingConfidence}%`}
        />
      </div>

      <WorkspacePanel>
        <h2 className="mb-4 text-lg font-medium">{props.labels.sheetsTitle}</h2>
        <WorkspaceTable
          columns={[
            { id: "name", header: props.labels.sheet, cell: (row) => row.name },
            { id: "score", header: props.labels.confidence, cell: (row) => `${row.score}%` },
            { id: "rows", header: props.labels.rowCount, cell: (row) => String(row.rowCount) },
          ]}
          rows={props.session.sheetScores}
          keyFn={(row) => row.name}
          emptyTitle={props.labels.sheetsTitle}
          emptyDescription={props.labels.detectionDescription}
        />
      </WorkspacePanel>

      <WorkspacePanel>
        <h2 className="mb-2 text-lg font-medium">{props.labels.mappingTitle}</h2>
        <p className="mb-4 text-sm text-muted-foreground">{props.labels.mappingDescription}</p>

        {props.session.sheetScores.length > 1 && props.canUpdate ? (
          <div className="mb-4 max-w-sm space-y-2">
            <Label htmlFor="uaie-sheet">{props.labels.sheet}</Label>
            <Select
              id="uaie-sheet"
              value={sheetName}
              onChange={(event) => setSheetName(event.target.value)}
            >
              {props.session.sheetScores.map((sheet) => (
                <option key={sheet.name} value={sheet.name}>
                  {sheet.name} ({sheet.score}%)
                </option>
              ))}
            </Select>
          </div>
        ) : null}

        <div className="space-y-3">
          {mappingColumns.map((mapping) => (
            <div
              key={mapping.sourceColumnIndex}
              className="grid gap-2 rounded-lg border border-border/60 p-3 sm:grid-cols-[1fr_1fr_auto] sm:items-center"
            >
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {props.labels.sourceColumn}
                </p>
                <p className="font-medium">
                  {mapping.sourceHeader?.trim() || `Column ${mapping.sourceColumnIndex + 1}`}
                </p>
                <p className="text-xs text-muted-foreground">{mapping.confidence}%</p>
              </div>
              <div className="space-y-1">
                <Label htmlFor={`map-${mapping.sourceColumnIndex}`}>
                  {props.labels.canonicalField}
                </Label>
                <Select
                  id={`map-${mapping.sourceColumnIndex}`}
                  disabled={!props.canUpdate || isPending}
                  value={draftMappings[mapping.sourceColumnIndex] ?? mapping.canonicalField}
                  onChange={(event) => {
                    const value = event.target.value as UaieCanonicalField;
                    setDraftMappings((current) => ({
                      ...current,
                      [mapping.sourceColumnIndex]: value,
                    }));
                  }}
                >
                  {UAIE_CANONICAL_FIELDS.map((field) => (
                    <option key={field} value={field}>
                      {props.labels.fields[field] ?? field}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          ))}
        </div>

        {props.canUpdate ? (
          <div className="mt-4">
            <Button
              type="button"
              disabled={isPending}
              onClick={() =>
                runAction(() =>
                  applyUaieMappingAction({
                    sessionId: props.session.id,
                    preferredSheetName: sheetName || props.session.selectedSheetName,
                    mappings: Object.entries(draftMappings).map(([index, field]) => ({
                      sourceColumnIndex: Number(index),
                      canonicalField: field,
                    })),
                  }),
                )
              }
            >
              {isPending ? props.labels.applying : props.labels.applyMapping}
            </Button>
          </div>
        ) : null}
      </WorkspacePanel>

      <WorkspacePanel>
        <h2 className="mb-4 text-lg font-medium">{props.labels.validationTitle}</h2>
        <WorkspaceTable
          columns={[
            {
              id: "severity",
              header: props.labels.severity,
              cell: (row) => <WorkspaceStatusBadge label={row.severity} variant="outline" />,
            },
            { id: "message", header: props.labels.message, cell: (row) => row.message },
            {
              id: "account",
              header: props.labels.accountCode,
              cell: (row) => row.accountCode ?? (row.rowNumber != null ? `#${row.rowNumber}` : "—"),
            },
          ]}
          rows={props.session.issues}
          keyFn={(row) =>
            `${row.issueCode}-${row.rowNumber ?? "x"}-${row.accountCode ?? ""}-${row.message}`
          }
          emptyTitle={props.labels.validationTitle}
          emptyDescription="—"
        />
      </WorkspacePanel>

      <WorkspacePanel>
        <h2 className="mb-4 text-lg font-medium">{props.labels.summaryTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <WorkspaceMetricCard label={props.labels.rowCount} value={String(rowCount)} />
          <WorkspaceMetricCard label={props.labels.validRows} value={String(validRowCount)} />
          <WorkspaceMetricCard label={props.labels.debitTotal} value={debitTotal.toLocaleString()} />
          <WorkspaceMetricCard
            label={props.labels.creditTotal}
            value={creditTotal.toLocaleString()}
          />
        </div>
      </WorkspacePanel>

      <WorkspacePanel>
        <h2 className="mb-4 text-lg font-medium">{props.labels.datasetTitle}</h2>
        <WorkspaceTable
          columns={[
            { id: "code", header: props.labels.accountCode, cell: (row) => row.accountCode ?? "—" },
            { id: "name", header: props.labels.accountName, cell: (row) => row.accountName ?? "—" },
            {
              id: "debit",
              header: props.labels.debit,
              cell: (row) => (row.debit == null ? "—" : row.debit.toLocaleString()),
            },
            {
              id: "credit",
              header: props.labels.credit,
              cell: (row) => (row.credit == null ? "—" : row.credit.toLocaleString()),
            },
            {
              id: "balance",
              header: props.labels.balance,
              cell: (row) => (row.balance == null ? "—" : row.balance.toLocaleString()),
            },
          ]}
          rows={props.session.rows}
          keyFn={(row) => String(row.rowNumber)}
          emptyTitle={props.labels.datasetTitle}
          emptyDescription="—"
        />
      </WorkspacePanel>

      <div className="flex flex-wrap gap-3">
        {props.canValidate &&
        (props.session.importStatus === "validated" || props.session.importStatus === "mapped") ? (
          <Button
            type="button"
            disabled={isPending}
            onClick={() =>
              runAction(() => confirmUaieStageAction({ sessionId: props.session.id }))
            }
          >
            {isPending ? props.labels.staging : props.labels.stageAction}
          </Button>
        ) : null}
        {props.canUpdate &&
        !["cancelled", "archived", "staged"].includes(props.session.importStatus) ? (
          <Button
            type="button"
            variant="secondary"
            disabled={isPending}
            onClick={() =>
              runAction(() => cancelUaieSessionAction({ sessionId: props.session.id }))
            }
          >
            {props.labels.cancelAction}
          </Button>
        ) : null}
        {props.canArchive && props.session.importStatus !== "archived" ? (
          <Button
            type="button"
            variant="ghost"
            disabled={isPending}
            onClick={() =>
              runAction(() => archiveUaieSessionAction({ sessionId: props.session.id }))
            }
          >
            {props.labels.archiveAction}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
