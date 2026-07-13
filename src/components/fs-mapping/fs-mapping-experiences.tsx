"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  approveFsMappingSetAction,
  archiveFsMappingSetAction,
  createFsMappingSetAction,
  publishFsMappingSetAction,
  rebuildFsMappingDatasetAction,
  validateFsMappingSetAction,
} from "@/lib/actions/fs-mapping";
import { useFsMappingWorkspace } from "@/lib/fs-mapping/provider";
import type {
  FsMappingHistoryRecord,
  FsMappingLine,
  FsMappingRule,
  FsMappingVersion,
  FsValidationReport,
} from "@/types/fs-mapping";
import type { FsHierarchyNode } from "@/lib/fs-mapping/hierarchy";

export function FsMappingOverviewExperience(props: {
  engagementId: string;
  hasSet: boolean;
  mapped: number;
  unmapped: number;
  errors: number;
  warnings: number;
  versions: number;
}) {
  const host = useFsMappingWorkspace();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const mappingSetId = host.mappingSet?.id ?? null;
  const status = host.mappingSet?.setStatus;

  function run(action: () => Promise<{ success: boolean; error?: { message?: string } | null }>, success: string) {
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
        <h2 className="text-lg font-semibold tracking-tight">Mapping Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Coverage, mapped accounts, validation posture, and version health for the mapping layer.
        </p>
      </section>
      {!props.hasSet ? (
        <div className="space-y-3 rounded-lg border border-border/60 bg-muted/30 px-4 py-4">
          <p className="text-sm">
            No mapping set yet. Create one from an approved trial balance to begin classification and
            statement mapping.
          </p>
          <Button
            type="button"
            size="sm"
            disabled={isPending}
            onClick={() =>
              run(
                () =>
                  createFsMappingSetAction({
                    engagementId: props.engagementId,
                    name: "Financial statement mapping",
                    standard: "ifrs",
                    seedDefaultRules: true,
                  }),
                "Mapping set created",
              )
            }
          >
            {isPending ? "Creating…" : "Create mapping set"}
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Metric label="Coverage" value={`${host.metrics?.coveragePct.toFixed(1) ?? 0}%`} />
            <Metric label="Mapped accounts" value={String(props.mapped)} />
            <Metric label="Unmapped accounts" value={String(props.unmapped)} />
            <Metric label="Validation errors" value={String(props.errors)} />
            <Metric label="Warnings" value={String(props.warnings)} />
            <Metric label="Versions" value={String(props.versions)} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPending || !mappingSetId}
              onClick={() =>
                mappingSetId &&
                run(
                  () => rebuildFsMappingDatasetAction({ mappingSetId }),
                  "Dataset rebuilt",
                )
              }
            >
              Rebuild dataset
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPending || !mappingSetId || (status !== "draft" && status !== "validated")}
              onClick={() =>
                mappingSetId &&
                run(
                  () => validateFsMappingSetAction({ mappingSetId }),
                  "Mapping validated",
                )
              }
            >
              Validate
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPending || !mappingSetId || status !== "validated"}
              onClick={() =>
                mappingSetId &&
                run(() => approveFsMappingSetAction({ mappingSetId }), "Mapping approved")
              }
            >
              Approve
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isPending || !mappingSetId || status !== "approved"}
              onClick={() =>
                mappingSetId &&
                run(
                  () =>
                    publishFsMappingSetAction({
                      mappingSetId,
                      changeSummary: "Published mapping version",
                    }),
                  "Mapping published",
                )
              }
            >
              Publish
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={isPending || !mappingSetId || status === "archived"}
              onClick={() =>
                mappingSetId &&
                run(() => archiveFsMappingSetAction({ mappingSetId }), "Mapping archived")
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

export function FsMappingExplorerExperience(props: { rules: FsMappingRule[]; lines: FsMappingLine[] }) {
  return (
    <div className="space-y-6 p-6">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">Mapping Explorer</h2>
        <p className="text-sm text-muted-foreground">Rules and account-to-line assignments.</p>
      </header>
      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rules</h3>
        <ul className="divide-y divide-border/40 rounded-xl border border-border/50">
          {props.rules.map((rule) => (
            <li key={rule.id} className="flex items-start justify-between gap-3 px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{rule.ruleName}</p>
                <p className="text-muted-foreground">
                  {rule.ruleCode} · {rule.ruleType} · {rule.targetLineCode}
                </p>
              </div>
              <Badge variant="outline" size="sm">
                {rule.classification.replaceAll("_", " ")}
              </Badge>
            </li>
          ))}
          {props.rules.length === 0 ? (
            <li className="px-4 py-6 text-sm text-muted-foreground">No mapping rules configured.</li>
          ) : null}
        </ul>
      </section>
      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Account mappings
        </h3>
        <ul className="max-h-[28rem] divide-y divide-border/40 overflow-y-auto rounded-xl border border-border/50">
          {props.lines.map((line) => (
            <li key={line.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
              <div>
                <p className="font-medium">
                  {line.accountCode} · {line.accountName}
                </p>
                <p className="text-muted-foreground">
                  {line.isMapped ? `→ ${line.targetLineCode}` : "Unmapped"}
                </p>
              </div>
              <Badge variant={line.isMapped ? "success" : "warning"} size="sm">
                {line.classification.replaceAll("_", " ")}
              </Badge>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export function FsMappingHierarchyExperience(props: { hierarchy: FsHierarchyNode[] }) {
  return (
    <div className="space-y-4 p-6">
      <h2 className="text-lg font-semibold">Hierarchy Explorer</h2>
      <Tree nodes={props.hierarchy} />
    </div>
  );
}

export function FsMappingStatementTreeExperience(props: { tree: FsHierarchyNode[] }) {
  return (
    <div className="space-y-4 p-6">
      <h2 className="text-lg font-semibold">Statement Tree</h2>
      <p className="text-sm text-muted-foreground">
        Normalized statement structure from aggregation — not a generated report.
      </p>
      <Tree nodes={props.tree} />
    </div>
  );
}

function Tree({ nodes, depth = 0 }: { nodes: FsHierarchyNode[]; depth?: number }) {
  if (nodes.length === 0) {
    return <p className="text-sm text-muted-foreground">No hierarchy nodes yet.</p>;
  }
  return (
    <ul className="space-y-1">
      {nodes.map((node) => (
        <li key={`${node.code}-${depth}`} className="text-sm">
          <div
            className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2"
            style={{ marginLeft: depth * 12 }}
          >
            <span className="font-medium">
              {node.label}
              <span className="ml-2 text-muted-foreground">{node.code}</span>
            </span>
            <span className="tabular-nums text-muted-foreground">{node.amount.toFixed(2)}</span>
          </div>
          {node.children.length > 0 ? <Tree nodes={node.children} depth={depth + 1} /> : null}
        </li>
      ))}
    </ul>
  );
}

export function FsMappingValidationExperience(props: { validation: FsValidationReport | null }) {
  const issues = [...(props.validation?.errors ?? []), ...(props.validation?.warnings ?? [])];
  return (
    <div className="space-y-4 p-6">
      <h2 className="text-lg font-semibold">Validation Center</h2>
      <p className="text-sm text-muted-foreground">
        Missing mappings, duplicates, orphans, formulas, circularity, negatives, and section imbalance.
      </p>
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

export function FsMappingVersionsExperience(props: { versions: FsMappingVersion[] }) {
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

export function FsMappingHistoryExperience(props: { history: FsMappingHistoryRecord[] }) {
  return (
    <div className="space-y-4 p-6">
      <h2 className="text-lg font-semibold">History</h2>
      <ul className="divide-y divide-border/40 rounded-xl border border-border/50">
        {props.history.map((entry) => (
          <li key={entry.id} className="px-4 py-3 text-sm">
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

export function FsMappingSearchExperience(props: {
  results: Array<{ kind: "rule" | "line"; id: string; label: string; meta: string }>;
  query: string;
}) {
  return (
    <div className="space-y-4 p-6">
      <h2 className="text-lg font-semibold">Search</h2>
      <p className="text-sm text-muted-foreground">
        Query: {props.query ? `"${props.query}"` : "Provide ?q= to search rules and accounts."}
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
