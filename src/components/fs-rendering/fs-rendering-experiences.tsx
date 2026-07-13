"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  approveFsPresentationAction,
  archiveFsPresentationAction,
  createFsPresentationAction,
  publishFsPresentationAction,
  rebuildFsPresentationAction,
  validateFsPresentationAction,
} from "@/lib/actions/fs-rendering";
import { useFsRenderingWorkspace } from "@/lib/fs-rendering/provider";
import { layoutModeLabel, standardLabel } from "@/lib/fs-rendering/layouts";
import { comparativeModeLabel, showsPreviousColumn } from "@/lib/fs-rendering/comparatives";
import type {
  FsRenderHistoryEntry,
  FsRenderLayout,
  FsRenderLayoutMode,
  FsRenderValidationReport,
  FsRenderVersion,
  FsRenderedStatementBundle,
} from "@/types/fs-rendering";

export function FsRenderingOverviewExperience(props: {
  engagementId: string;
  hasPresentation: boolean;
  renderedStatements: number;
  coverage: number;
  errors: number;
  warnings: number;
}) {
  const host = useFsRenderingWorkspace();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const presentationId = host.presentation?.id ?? null;
  const status = host.presentation?.presentationStatus;

  function run(
    action: () => Promise<{ success: boolean; error?: { message?: string } | null }>,
    success: string,
  ) {
    setMessage(null);
    startTransition(async () => {
      const result = await action();
      if (!result.success) {
        setMessage(result.error?.message ?? "Action failed");
        return;
      }
      setMessage(success);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6 p-6">
      <section className="space-y-2">
        <h2 className="text-lg font-semibold tracking-tight">Rendering Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Rendered statements, validation posture, and presentation coverage from the FSME dataset.
        </p>
      </section>
      {!props.hasPresentation ? (
        <div className="space-y-3 rounded-lg border border-border/60 bg-muted/30 px-4 py-4">
          <p className="text-sm">
            No presentation yet. Create one to render the normalized financial statement dataset into
            enterprise statement UI.
          </p>
          <Button
            type="button"
            size="sm"
            disabled={isPending}
            onClick={() =>
              run(
                () =>
                  createFsPresentationAction({
                    engagementId: props.engagementId,
                    name: "Financial statement presentation",
                    standard: "ifrs",
                  }),
                "Presentation created",
              )
            }
          >
            {isPending ? "Creating…" : "Create presentation"}
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Metric label="Rendered statements" value={String(props.renderedStatements)} />
            <Metric label="Presentation coverage" value={`${props.coverage.toFixed(1)}%`} />
            <Metric label="Validation status" value={host.metrics?.validationStatus ?? "empty"} />
            <Metric label="Rendering errors" value={String(props.errors)} />
            <Metric label="Warnings" value={String(props.warnings)} />
            <Metric
              label="Layout"
              value={host.presentation ? layoutModeLabel(host.presentation.layoutMode) : "—"}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPending || !presentationId}
              onClick={() =>
                presentationId &&
                run(() => rebuildFsPresentationAction({ presentationId }), "Render rebuilt")
              }
            >
              Rebuild render
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPending || !presentationId || (status !== "draft" && status !== "validated")}
              onClick={() =>
                presentationId &&
                run(() => validateFsPresentationAction({ presentationId }), "Presentation validated")
              }
            >
              Validate
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPending || !presentationId || status !== "validated"}
              onClick={() =>
                presentationId &&
                run(() => approveFsPresentationAction({ presentationId }), "Presentation approved")
              }
            >
              Approve
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isPending || !presentationId || status !== "approved"}
              onClick={() =>
                presentationId &&
                run(
                  () =>
                    publishFsPresentationAction({
                      presentationId,
                      changeSummary: "Published presentation version",
                    }),
                  "Presentation published",
                )
              }
            >
              Publish
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={isPending || !presentationId || status === "archived"}
              onClick={() =>
                presentationId &&
                run(() => archiveFsPresentationAction({ presentationId }), "Presentation archived")
              }
            >
              Archive
            </Button>
          </div>
        </>
      )}
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

export function FsRenderingExplorerExperience(props: { bundle: FsRenderedStatementBundle | null }) {
  if (!props.bundle) {
    return (
      <div className="p-6 text-sm text-muted-foreground">No rendered statements yet.</div>
    );
  }
  const showPrevious = showsPreviousColumn(props.bundle.comparativeMode);
  return (
    <div className="space-y-8 p-6">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">Statement Explorer</h2>
        <p className="text-sm text-muted-foreground">
          {standardLabel(props.bundle.standard)} · {layoutModeLabel(props.bundle.layoutMode)} ·{" "}
          {comparativeModeLabel(props.bundle.comparativeMode)}
        </p>
      </header>
      {props.bundle.statements.map((statement) => (
        <section key={statement.statementType} className="space-y-3">
          <h3 className="text-base font-semibold tracking-tight">{statement.title}</h3>
          <div className="overflow-hidden rounded-xl border border-border/50">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 font-medium">Line</th>
                  <th className="px-4 py-2 text-right font-medium">Current</th>
                  {showPrevious ? (
                    <th className="px-4 py-2 text-right font-medium">Comparative</th>
                  ) : null}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {statement.lines.map((line) => (
                  <tr key={`${statement.statementType}-${line.lineCode}`}>
                    <td className="px-4 py-2">
                      <span style={{ paddingLeft: line.indentation * 16 }} className={lineClass(line.style)}>
                        {line.label}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums">{line.formattedAmount}</td>
                    {showPrevious ? (
                      <td className="px-4 py-2 text-right tabular-nums text-muted-foreground">
                        {line.formattedPreviousAmount ?? "—"}
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-border/60 bg-muted/20">
                  <td className="px-4 py-2 font-semibold">Total</td>
                  <td className="px-4 py-2 text-right font-semibold tabular-nums">
                    {statement.totalFormatted}
                  </td>
                  {showPrevious ? (
                    <td className="px-4 py-2 text-right font-semibold tabular-nums">
                      {statement.previousTotalFormatted ?? "—"}
                    </td>
                  ) : null}
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}

function lineClass(style: string): string {
  if (style === "total" || style === "double_total") return "font-semibold";
  if (style === "bold" || style === "subtotal") return "font-medium";
  return "";
}

export function FsRenderingPresentationExperience(props: {
  standard: string | null;
  comparativeMode: string | null;
  currencyCode: string | null;
}) {
  return (
    <div className="space-y-4 p-6">
      <h2 className="text-lg font-semibold">Presentation Selector</h2>
      <dl className="grid gap-3 sm:grid-cols-3">
        <Info label="Standard" value={props.standard ?? "—"} />
        <Info label="Comparatives" value={props.comparativeMode ?? "—"} />
        <Info label="Currency" value={props.currencyCode ?? "—"} />
      </dl>
    </div>
  );
}

export function FsRenderingLayoutExperience(props: {
  layouts: FsRenderLayout[];
  activeMode: FsRenderLayoutMode | null;
  presentationId: string | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-lg font-semibold">Layout Selector</h2>
      <ul className="divide-y divide-border/40 rounded-xl border border-border/50">
        {props.layouts.map((layout) => (
          <li key={layout.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
            <div>
              <p className="font-medium">{layout.layoutName}</p>
              <p className="text-muted-foreground">
                {layout.layoutCode} · {layoutModeLabel(layout.layoutMode)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {props.activeMode === layout.layoutMode ? (
                <Badge variant="success" size="sm">
                  Active
                </Badge>
              ) : null}
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isPending || !props.presentationId}
                onClick={() => {
                  if (!props.presentationId) return;
                  setMessage(null);
                  startTransition(async () => {
                    const result = await rebuildFsPresentationAction({
                      presentationId: props.presentationId!,
                      layoutMode: layout.layoutMode,
                    });
                    if (!result.success) {
                      setMessage(result.error?.message ?? "Failed to apply layout");
                      return;
                    }
                    setMessage(`Applied ${layoutModeLabel(layout.layoutMode)}`);
                    router.refresh();
                  });
                }}
              >
                Apply
              </Button>
            </div>
          </li>
        ))}
        {props.layouts.length === 0 ? (
          <li className="px-4 py-6 text-sm text-muted-foreground">No layouts yet.</li>
        ) : null}
      </ul>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/50 px-4 py-3">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-medium">{value}</dd>
    </div>
  );
}

export function FsRenderingValidationExperience(props: {
  validation: FsRenderValidationReport | null;
}) {
  const issues = [...(props.validation?.errors ?? []), ...(props.validation?.warnings ?? [])];
  return (
    <div className="space-y-4 p-6">
      <h2 className="text-lg font-semibold">Validation Center</h2>
      <ul className="divide-y divide-border/40 rounded-xl border border-border/50">
        {issues.map((issue, index) => (
          <li key={`${issue.code}-${index}`} className="px-4 py-3 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant={issue.severity === "error" ? "destructive" : "warning"} size="sm">
                {issue.severity}
              </Badge>
              <span className="font-medium">{issue.code}</span>
            </div>
            <p className="mt-1 text-muted-foreground">{issue.message}</p>
          </li>
        ))}
        {issues.length === 0 ? (
          <li className="px-4 py-6 text-sm text-muted-foreground">No validation issues recorded.</li>
        ) : null}
      </ul>
    </div>
  );
}

export function FsRenderingVersionsExperience(props: { versions: FsRenderVersion[] }) {
  return (
    <div className="space-y-4 p-6">
      <h2 className="text-lg font-semibold">Version Center</h2>
      <ul className="divide-y divide-border/40 rounded-xl border border-border/50">
        {props.versions.map((version) => (
          <li key={version.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <div>
              <p className="font-medium">Version {version.versionNumber}</p>
              <p className="text-muted-foreground">{version.changeSummary ?? "No summary"}</p>
            </div>
            <Badge variant="outline" size="sm">
              {version.versionStatus}
            </Badge>
          </li>
        ))}
        {props.versions.length === 0 ? (
          <li className="px-4 py-6 text-sm text-muted-foreground">No published versions yet.</li>
        ) : null}
      </ul>
    </div>
  );
}

export function FsRenderingHistoryExperience(props: { history: FsRenderHistoryEntry[] }) {
  return (
    <div className="space-y-4 p-6">
      <h2 className="text-lg font-semibold">History</h2>
      <ul className="divide-y divide-border/40 rounded-xl border border-border/50">
        {props.history.map((entry, index) => (
          <li key={`${entry.createdAt}-${index}`} className="px-4 py-3 text-sm">
            <p className="font-medium">{entry.summary}</p>
            <p className="text-muted-foreground">
              {entry.action} · {new Date(entry.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
        {props.history.length === 0 ? (
          <li className="px-4 py-6 text-sm text-muted-foreground">No history yet.</li>
        ) : null}
      </ul>
    </div>
  );
}

export function FsRenderingSearchExperience(props: {
  results: Array<{ kind: "statement" | "line" | "layout"; id: string; label: string; meta: string }>;
  query: string;
}) {
  return (
    <div className="space-y-4 p-6">
      <h2 className="text-lg font-semibold">Search</h2>
      <p className="text-sm text-muted-foreground">
        Query: {props.query ? `"${props.query}"` : "Provide ?q= to search statements, lines, and layouts."}
      </p>
      <ul className="divide-y divide-border/40 rounded-xl border border-border/50">
        {props.results.map((result) => (
          <li key={`${result.kind}-${result.id}`} className="px-4 py-3 text-sm">
            <p className="font-medium">{result.label}</p>
            <p className="text-muted-foreground">
              {result.kind} · {result.meta}
            </p>
          </li>
        ))}
        {props.query && props.results.length === 0 ? (
          <li className="px-4 py-6 text-sm text-muted-foreground">No matches.</li>
        ) : null}
      </ul>
    </div>
  );
}
