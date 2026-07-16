"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  advanceIfrsNoteManagerReviewAction,
  advanceIfrsNotePartnerReviewAction,
  approveIfrsNotePackageAction,
  archiveIfrsNotePackageAction,
  createIfrsNotePackageAction,
  publishIfrsNotePackageAction,
  rebuildIfrsNotePackageAction,
  rollbackIfrsNoteVersionAction,
  submitIfrsNoteReviewAction,
  validateIfrsNotePackageAction,
} from "@/lib/actions/ifrs-notes";
import { useIfrsNotesWorkspace } from "@/lib/ifrs-notes/provider";
import { noteTypeLabel } from "@/lib/ifrs-notes/requirements";
import type {
  IfrsNoteCrossReference,
  IfrsNoteHistoryRecord,
  IfrsNoteStructure,
  IfrsNoteValidationReport,
  IfrsNoteVersion,
} from "@/types/ifrs-notes";

export function IfrsNotesOverviewExperience(props: {
  engagementId: string;
  hasPackage: boolean;
  requiredNotes: number;
  completedNotes: number;
  missingNotes: number;
  errors: number;
  warnings: number;
  coverage: number;
}) {
  const host = useIfrsNotesWorkspace();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const packageId = host.notePackage?.id ?? null;
  const status = host.notePackage?.packageStatus;

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
        <h2 className="text-lg font-semibold tracking-tight">IFRS Notes Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Required, completed, and missing notes with validation coverage from the FSME dataset.
        </p>
      </section>
      {!props.hasPackage ? (
        <div className="space-y-3 rounded-lg border border-border/60 bg-muted/30 px-4 py-4">
          <p className="text-sm">
            No IFRS note package yet. Create one to resolve disclosures and build structured editable
            notes from the normalized financial statement dataset.
          </p>
          <Button
            type="button"
            size="sm"
            disabled={isPending}
            onClick={() =>
              run(
                () =>
                  createIfrsNotePackageAction({
                    engagementId: props.engagementId,
                    name: "IFRS notes package",
                    standard: "ifrs",
                  }),
                "Note package created",
              )
            }
          >
            {isPending ? "Creating…" : "Create note package"}
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Metric label="Required notes" value={String(props.requiredNotes)} />
            <Metric label="Completed notes" value={String(props.completedNotes)} />
            <Metric label="Missing notes" value={String(props.missingNotes)} />
            <Metric label="Coverage" value={`${props.coverage.toFixed(1)}%`} />
            <Metric label="Validation errors" value={String(props.errors)} />
            <Metric label="Warnings" value={String(props.warnings)} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPending || !packageId}
              onClick={() =>
                packageId &&
                run(() => rebuildIfrsNotePackageAction({ packageId }), "Notes rebuilt")
              }
            >
              Rebuild notes
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPending || !packageId || (status !== "draft" && status !== "validated")}
              onClick={() =>
                packageId &&
                run(() => validateIfrsNotePackageAction({ packageId }), "Notes validated")
              }
            >
              Validate
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPending || !packageId || status !== "validated"}
              onClick={() =>
                packageId &&
                run(() => submitIfrsNoteReviewAction({ packageId }), "Submitted to reviewer")
              }
            >
              Submit review
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPending || !packageId || status !== "in_review"}
              onClick={() =>
                packageId &&
                run(
                  () => advanceIfrsNoteManagerReviewAction({ packageId }),
                  "Advanced to manager",
                )
              }
            >
              Manager review
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPending || !packageId || status !== "manager_review"}
              onClick={() =>
                packageId &&
                run(
                  () => advanceIfrsNotePartnerReviewAction({ packageId }),
                  "Advanced to partner",
                )
              }
            >
              Partner review
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={
                isPending ||
                !packageId ||
                (status !== "partner_review" && status !== "validated")
              }
              onClick={() =>
                packageId &&
                run(() => approveIfrsNotePackageAction({ packageId }), "Notes approved")
              }
            >
              Approve
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isPending || !packageId || status !== "approved"}
              onClick={() =>
                packageId &&
                run(
                  () =>
                    publishIfrsNotePackageAction({
                      packageId,
                      changeSummary: "Published IFRS notes version",
                    }),
                  "Notes published",
                )
              }
            >
              Publish
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={isPending || !packageId || status === "archived"}
              onClick={() =>
                packageId &&
                run(() => archiveIfrsNotePackageAction({ packageId }), "Notes archived")
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

export function IfrsNotesExplorerExperience(props: { structure: IfrsNoteStructure | null }) {
  if (!props.structure?.sections.length) {
    return <div className="p-6 text-sm text-muted-foreground">No notes structured yet.</div>;
  }
  return (
    <div className="space-y-6 p-6">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">Notes Explorer</h2>
        <p className="text-sm text-muted-foreground">
          Structured editable IFRS note sections, paragraphs, and tables.
        </p>
      </header>
      <div className="space-y-4">
        {props.structure.sections.map((section) => (
          <article
            key={section.id}
            className="space-y-3 rounded-xl border border-border/50 bg-card px-4 py-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">
                {section.noteCode} · {section.title}
              </h3>
              <Badge variant="outline">{noteTypeLabel(section.noteType)}</Badge>
              <Badge variant="secondary">{section.disclosureKind}</Badge>
              {section.isRequired ? <Badge>required</Badge> : null}
              {!section.isApplicable ? <Badge variant="outline">not applicable</Badge> : null}
              {section.isCompleted ? (
                <Badge variant="default">completed</Badge>
              ) : section.isRequired ? (
                <Badge variant="destructive">incomplete</Badge>
              ) : null}
            </div>
            <p className="text-xs text-muted-foreground">{section.standardRef}</p>
            <div className="space-y-3">
              {section.items.map((item) => (
                <div key={item.id} className="rounded-lg border border-border/40 px-3 py-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {item.itemKind} · {item.itemCode}
                  </p>
                  {item.title ? <p className="mt-1 text-sm font-medium">{item.title}</p> : null}
                  {item.bodyText ? (
                    <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                      {item.bodyText}
                    </p>
                  ) : null}
                  {item.itemKind === "table" && item.tableJson.length > 0 ? (
                    <ul className="mt-2 space-y-1 text-sm">
                      {item.tableJson.map((row, index) => {
                        const entry = row as { label?: string; amount?: number | null };
                        return (
                          <li key={`${item.id}-${index}`} className="flex justify-between gap-4">
                            <span>{entry.label ?? `Row ${index + 1}`}</span>
                            <span className="tabular-nums text-muted-foreground">
                              {entry.amount == null ? "—" : String(entry.amount)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function IfrsNotesDisclosuresExperience(props: { structure: IfrsNoteStructure | null }) {
  const sections = props.structure?.sections ?? [];
  return (
    <div className="space-y-4 p-6">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">Disclosure Center</h2>
        <p className="text-sm text-muted-foreground">
          Mandatory, conditional, optional, and custom disclosures resolved for the package.
        </p>
      </header>
      {sections.length === 0 ? (
        <p className="text-sm text-muted-foreground">No disclosures resolved yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-2 py-2 font-medium">Code</th>
                <th className="px-2 py-2 font-medium">Title</th>
                <th className="px-2 py-2 font-medium">Kind</th>
                <th className="px-2 py-2 font-medium">Standard</th>
                <th className="px-2 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => (
                <tr key={section.id} className="border-b border-border/40">
                  <td className="px-2 py-2 font-mono text-xs">{section.noteCode}</td>
                  <td className="px-2 py-2">{section.title}</td>
                  <td className="px-2 py-2">{section.disclosureKind}</td>
                  <td className="px-2 py-2 text-muted-foreground">{section.standardRef}</td>
                  <td className="px-2 py-2">
                    {!section.isApplicable
                      ? "unused"
                      : section.isCompleted
                        ? "completed"
                        : section.isRequired
                          ? "missing"
                          : "optional"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function IfrsNotesCrossReferencesExperience(props: {
  crossReferences: IfrsNoteCrossReference[];
}) {
  return (
    <div className="space-y-4 p-6">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">Cross Reference Explorer</h2>
        <p className="text-sm text-muted-foreground">
          Financial statement lines, notes, disclosures, related notes, and source accounts.
        </p>
      </header>
      {props.crossReferences.length === 0 ? (
        <p className="text-sm text-muted-foreground">No cross references yet.</p>
      ) : (
        <ul className="space-y-2">
          {props.crossReferences.map((reference) => (
            <li
              key={reference.id}
              className="rounded-lg border border-border/50 px-3 py-2 text-sm"
            >
              <p className="font-medium">{reference.referenceLabel}</p>
              <p className="text-xs text-muted-foreground">
                {[
                  reference.statementLineCode,
                  reference.disclosureCode,
                  reference.sourceAccountCode,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function IfrsNotesValidationExperience(props: {
  validation: IfrsNoteValidationReport | null;
}) {
  if (!props.validation) {
    return <div className="p-6 text-sm text-muted-foreground">No validation report yet.</div>;
  }
  return (
    <div className="space-y-6 p-6">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">Validation Center</h2>
        <p className="text-sm text-muted-foreground">
          Missing notes, duplicates, broken references, IFRS mapping, and disclosure gaps.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Coverage" value={`${props.validation.coveragePct.toFixed(1)}%`} />
        <Metric label="Required" value={String(props.validation.requiredCount)} />
        <Metric label="Errors" value={String(props.validation.errors.length)} />
        <Metric label="Warnings" value={String(props.validation.warnings.length)} />
      </div>
      <IssueList title="Errors" issues={props.validation.errors} />
      <IssueList title="Warnings" issues={props.validation.warnings} />
    </div>
  );
}

function IssueList({
  title,
  issues,
}: {
  title: string;
  issues: IfrsNoteValidationReport["errors"];
}) {
  if (issues.length === 0) {
    return (
      <section className="space-y-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">None.</p>
      </section>
    );
  }
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="space-y-2">
        {issues.map((issue, index) => (
          <li key={`${issue.code}-${index}`} className="rounded-lg border border-border/50 px-3 py-2">
            <p className="text-sm font-medium">
              {issue.code}
              {issue.noteCode ? ` · ${issue.noteCode}` : ""}
            </p>
            <p className="text-sm text-muted-foreground">{issue.message}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function IfrsNotesVersionsExperience(props: { versions: IfrsNoteVersion[] }) {
  const host = useIfrsNotesWorkspace();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const packageId = host.notePackage?.id ?? null;

  return (
    <div className="space-y-4 p-6">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">Version Center</h2>
        <p className="text-sm text-muted-foreground">
          Draft, in review, approved, published, archived, and rollback.
        </p>
      </header>
      {props.versions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No versions published yet.</p>
      ) : (
        <ul className="space-y-2">
          {props.versions.map((version) => (
            <li
              key={version.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/50 px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium">
                  Version {version.versionNumber} · {version.versionStatus}
                </p>
                <p className="text-xs text-muted-foreground">
                  {version.changeSummary ?? "No summary"}
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isPending || !packageId}
                onClick={() => {
                  if (!packageId) return;
                  setMessage(null);
                  startTransition(async () => {
                    const result = await rollbackIfrsNoteVersionAction({
                      packageId,
                      versionNumber: version.versionNumber,
                    });
                    if (!result.success) {
                      setMessage(result.error?.message ?? "Rollback failed");
                      return;
                    }
                    setMessage(`Rolled back to version ${version.versionNumber}`);
                    router.refresh();
                  });
                }}
              >
                Rollback
              </Button>
            </li>
          ))}
        </ul>
      )}
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}

export function IfrsNotesHistoryExperience(props: { history: IfrsNoteHistoryRecord[] }) {
  return (
    <div className="space-y-4 p-6">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">History</h2>
        <p className="text-sm text-muted-foreground">Package activity and workflow events.</p>
      </header>
      {props.history.length === 0 ? (
        <p className="text-sm text-muted-foreground">No history yet.</p>
      ) : (
        <ul className="space-y-2">
          {props.history.map((entry) => (
            <li key={entry.id} className="rounded-lg border border-border/50 px-3 py-2 text-sm">
              <p className="font-medium">{entry.summary}</p>
              <p className="text-xs text-muted-foreground">
                {entry.action} · {new Date(entry.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function IfrsNotesSearchExperience(props: {
  query: string;
  results: Array<{ kind: string; id: string; label: string; meta: string }>;
}) {
  return (
    <div className="space-y-4 p-6">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">Search</h2>
        <p className="text-sm text-muted-foreground">
          Search notes, items, cross references, and packages.
        </p>
      </header>
      <form method="get" className="flex gap-2">
        <input
          name="q"
          defaultValue={props.query}
          placeholder="Search notes…"
          className="h-9 flex-1 rounded-md border border-border bg-background px-3 text-sm"
        />
        <Button type="submit" size="sm">
          Search
        </Button>
      </form>
      {props.query && props.results.length === 0 ? (
        <p className="text-sm text-muted-foreground">No matches.</p>
      ) : null}
      <ul className="space-y-2">
        {props.results.map((result) => (
          <li key={`${result.kind}-${result.id}`} className="rounded-lg border border-border/50 px-3 py-2">
            <p className="text-sm font-medium">{result.label}</p>
            <p className="text-xs text-muted-foreground">
              {result.kind} · {result.meta}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
