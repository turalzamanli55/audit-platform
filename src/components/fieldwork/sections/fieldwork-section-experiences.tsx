"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  addFieldworkEvidenceAction,
  addFieldworkFindingAction,
  addFieldworkNoteAction,
  addWorkingPaperAction,
  updateFieldworkProcedureAction,
} from "@/lib/actions/fieldwork";
import type { FieldworkActivityView } from "@/lib/fieldwork/load-fieldwork-activity";
import type { FieldworkWorkspaceView } from "@/lib/fieldwork/fieldwork-workspace-view";
import { useFieldworkWorkspace } from "@/lib/fieldwork/use-fieldwork-workspace";
import { formatFieldworkActivityAction } from "@/lib/fieldwork/fieldwork-workspace-display";
import { formatDateTime } from "@/lib/engagement/format-engagement-workspace";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { FieldworkNoteType } from "@/types/fieldwork";
import { Alert } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui";
import { FieldworkCreateExperience } from "@/components/fieldwork/create/fieldwork-create-experience";
import { FieldworkWorkspaceSectionShell } from "@/components/fieldwork/workspace/fieldwork-workspace-section-shell";

function EmptyPanel({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/60 bg-card/40 px-6 py-10 text-center">
      <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

type SectionProps = {
  locale?: string;
  labels: { title: string; description: string; emptyTitle: string; emptyDescription: string };
  emptyLabels: Dictionary["fieldwork"]["empty"];
  fieldworkLabels: Dictionary["fieldwork"];
  planningApproved?: boolean;
  canCreate?: boolean;
};

function useFieldworkOrEmpty(props: SectionProps) {
  const { fieldwork, planningApproved } = useFieldworkWorkspace();
  if (!fieldwork) {
    return (
      <FieldworkCreateExperience
        canCreate={props.canCreate ?? false}
        planningApproved={props.planningApproved ?? planningApproved}
        labels={props.emptyLabels}
        gateLabels={props.fieldworkLabels.workspace}
      />
    );
  }
  return fieldwork;
}

export function FieldworkProgramExperience(props: SectionProps) {
  const fieldwork = useFieldworkOrEmpty(props);
  if (typeof fieldwork !== "object" || !("program" in fieldwork)) return fieldwork;
  const { labels, fieldworkLabels } = props;

  return (
    <FieldworkWorkspaceSectionShell title={labels.title} description={labels.description} headingId="fieldwork-program">
      {!fieldwork.program ? (
        <EmptyPanel title={labels.emptyTitle} description={labels.emptyDescription} />
      ) : (
        <div className="space-y-4 rounded-2xl border border-border/50 bg-card/80 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-foreground">{fieldwork.program.title}</h3>
            <span className="text-sm text-muted-foreground">
              {fieldworkLabels.programStatuses[fieldwork.program.programStatus]} · v
              {fieldwork.program.programVersion}
            </span>
          </div>
          {fieldwork.program.description ? (
            <p className="text-sm text-muted-foreground">{fieldwork.program.description}</p>
          ) : null}
          <p className="text-sm text-muted-foreground">
            {fieldwork.program.groups.length} procedure groups · {fieldwork.procedures.length} procedures
          </p>
        </div>
      )}
    </FieldworkWorkspaceSectionShell>
  );
}

export function FieldworkProcedureGroupsExperience(props: SectionProps) {
  const fieldwork = useFieldworkOrEmpty(props);
  if (typeof fieldwork !== "object" || !("procedureGroups" in fieldwork)) return fieldwork;

  return (
    <FieldworkWorkspaceSectionShell title={props.labels.title} description={props.labels.description} headingId="fieldwork-procedure-groups">
      {fieldwork.procedureGroups.length === 0 ? (
        <EmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      ) : (
        <ul className="divide-y divide-border/40 overflow-hidden rounded-2xl border border-border/50 bg-card/80">
          {fieldwork.procedureGroups.map((group) => (
            <li key={group.id} className="space-y-1 px-5 py-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-foreground">{group.name}</p>
                <span className="text-sm text-muted-foreground">{group.progressPct}%</span>
              </div>
              {group.description ? (
                <p className="text-sm text-muted-foreground">{group.description}</p>
              ) : null}
              <p className="text-xs text-muted-foreground">
                {group.procedures.length} procedures
              </p>
            </li>
          ))}
        </ul>
      )}
    </FieldworkWorkspaceSectionShell>
  );
}

export function FieldworkProceduresExperience(props: SectionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const fieldwork = useFieldworkOrEmpty(props);
  if (typeof fieldwork !== "object" || !("procedures" in fieldwork)) return fieldwork;

  const advance = (procedureId: string, procedureVersion: number, status: import("@/types/fieldwork").ProcedureStatus) => {
    startTransition(async () => {
      await updateFieldworkProcedureAction({
        packageId: fieldwork.id,
        procedureId,
        procedureVersion,
        procedureStatus: status,
      });
      router.refresh();
    });
  };

  return (
    <FieldworkWorkspaceSectionShell title={props.labels.title} description={props.labels.description} headingId="fieldwork-procedures">
      {fieldwork.procedures.length === 0 ? (
        <EmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      ) : (
        <ul className="divide-y divide-border/40 overflow-hidden rounded-2xl border border-border/50 bg-card/80">
          {fieldwork.procedures.map((procedure) => (
            <li key={procedure.id} className="space-y-2 px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-foreground">{procedure.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {props.fieldworkLabels.procedureTypes[procedure.procedureType]} ·{" "}
                    {props.fieldworkLabels.procedureStatuses[procedure.procedureStatus]}
                  </p>
                </div>
                <span className="text-sm font-medium">{procedure.completionPct}%</span>
              </div>
              {!fieldwork.isArchived ? (
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled={isPending}
                    onClick={() => advance(procedure.id, procedure.version, "in_progress")}
                  >
                    {props.fieldworkLabels.actions.start}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={isPending}
                    onClick={() => advance(procedure.id, procedure.version, "complete")}
                  >
                    {props.fieldworkLabels.actions.complete}
                  </Button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </FieldworkWorkspaceSectionShell>
  );
}

export function FieldworkWorkingPapersExperience(props: SectionProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [isPending, startTransition] = useTransition();
  const fieldwork = useFieldworkOrEmpty(props);
  if (typeof fieldwork !== "object" || !("workingPapers" in fieldwork)) return fieldwork;

  const addPaper = () => {
    const procedure = fieldwork.procedures[0];
    if (!procedure || !title.trim()) return;
    startTransition(async () => {
      await addWorkingPaperAction({
        packageId: fieldwork.id,
        procedureId: procedure.id,
        title: title.trim(),
      });
      setTitle("");
      router.refresh();
    });
  };

  return (
    <FieldworkWorkspaceSectionShell title={props.labels.title} description={props.labels.description} headingId="fieldwork-working-papers">
      {fieldwork.workingPapers.length === 0 ? (
        <EmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      ) : (
        <ul className="mb-6 divide-y divide-border/40 overflow-hidden rounded-2xl border border-border/50 bg-card/80">
          {fieldwork.workingPapers.map((paper) => (
            <li key={paper.id} className="px-5 py-4">
              <p className="font-medium text-foreground">{paper.title}</p>
              <p className="text-xs text-muted-foreground">
                {paper.procedureTitle} · {props.fieldworkLabels.workingPaperStatuses[paper.paperStatus]}
              </p>
              {paper.tickmarks.length > 0 ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {paper.tickmarks.length} tickmarks
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
      {!fieldwork.isArchived && fieldwork.procedures.length > 0 ? (
        <div className="space-y-3 rounded-2xl border border-border/50 bg-card/60 p-5">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Working paper title" />
          <Button type="button" onClick={addPaper} disabled={isPending || !title.trim()}>
            {props.fieldworkLabels.actions.addWorkingPaper}
          </Button>
        </div>
      ) : null}
    </FieldworkWorkspaceSectionShell>
  );
}

export function FieldworkEvidenceExperience(props: SectionProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();
  const fieldwork = useFieldworkOrEmpty(props);
  if (typeof fieldwork !== "object" || !("evidence" in fieldwork)) return fieldwork;

  const add = () => {
    if (!name.trim()) return;
    startTransition(async () => {
      await addFieldworkEvidenceAction({ packageId: fieldwork.id, name: name.trim() });
      setName("");
      router.refresh();
    });
  };

  return (
    <FieldworkWorkspaceSectionShell title={props.labels.title} description={props.labels.description} headingId="fieldwork-evidence">
      {fieldwork.evidence.length === 0 ? (
        <EmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      ) : (
        <ul className="mb-6 divide-y divide-border/40 overflow-hidden rounded-2xl border border-border/50 bg-card/80">
          {fieldwork.evidence.map((item) => (
            <li key={item.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.documentType}</p>
              </div>
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                {props.fieldworkLabels.evidenceStatuses[item.evidenceStatus]}
              </span>
            </li>
          ))}
        </ul>
      )}
      {!fieldwork.isArchived ? (
        <div className="space-y-3 rounded-2xl border border-border/50 bg-card/60 p-5">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Evidence reference name" />
          <Button type="button" onClick={add} disabled={isPending || !name.trim()}>
            {props.fieldworkLabels.actions.addEvidence}
          </Button>
        </div>
      ) : null}
    </FieldworkWorkspaceSectionShell>
  );
}

export function FieldworkFindingsExperience(props: SectionProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [isPending, startTransition] = useTransition();
  const fieldwork = useFieldworkOrEmpty(props);
  if (typeof fieldwork !== "object" || !("findings" in fieldwork)) return fieldwork;

  const add = () => {
    if (!title.trim()) return;
    startTransition(async () => {
      await addFieldworkFindingAction({ packageId: fieldwork.id, title: title.trim() });
      setTitle("");
      router.refresh();
    });
  };

  return (
    <FieldworkWorkspaceSectionShell title={props.labels.title} description={props.labels.description} headingId="fieldwork-findings">
      {fieldwork.findings.length === 0 ? (
        <EmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      ) : (
        <ul className="mb-6 divide-y divide-border/40 overflow-hidden rounded-2xl border border-border/50 bg-card/80">
          {fieldwork.findings.map((finding) => (
            <li key={finding.id} className="px-5 py-4">
              <p className="font-medium text-foreground">{finding.title}</p>
              <p className="text-xs text-muted-foreground">
                {finding.severity} · {props.fieldworkLabels.findingStatuses[finding.findingStatus]}
              </p>
            </li>
          ))}
        </ul>
      )}
      {!fieldwork.isArchived ? (
        <div className="space-y-3 rounded-2xl border border-border/50 bg-card/60 p-5">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Finding title" />
          <Button type="button" onClick={add} disabled={isPending || !title.trim()}>
            {props.fieldworkLabels.actions.addFinding}
          </Button>
        </div>
      ) : null}
    </FieldworkWorkspaceSectionShell>
  );
}

function FieldworkNotesSection({
  noteType,
  notes,
  props,
}: {
  noteType: FieldworkNoteType;
  notes: FieldworkWorkspaceView["notes"];
  props: SectionProps & { locale: string };
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fieldwork = useFieldworkOrEmpty(props);
  if (typeof fieldwork !== "object" || !("id" in fieldwork)) return fieldwork;

  const filtered = notes.filter((n) => n.noteType === noteType);

  const submit = () => {
    if (!body.trim()) return;
    startTransition(async () => {
      setError(null);
      const result = await addFieldworkNoteAction({
        packageId: fieldwork.id,
        body: body.trim(),
        noteType,
      });
      if (!result.success) {
        setError(result.error.message);
        return;
      }
      setBody("");
      router.refresh();
    });
  };

  return (
    <FieldworkWorkspaceSectionShell title={props.labels.title} description={props.labels.description} headingId={`fieldwork-notes-${noteType}`}>
      {error ? <Alert variant="error">{error}</Alert> : null}
      {filtered.length === 0 ? (
        <EmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      ) : (
        <ul className="mb-6 divide-y divide-border/40 overflow-hidden rounded-2xl border border-border/50 bg-card/80">
          {filtered.map((note) => (
            <li key={note.id} className="space-y-1 px-5 py-4">
              <time className="text-xs text-muted-foreground">
                {formatDateTime(note.createdAt, props.locale)}
              </time>
              <p className="text-sm text-foreground">{note.body}</p>
            </li>
          ))}
        </ul>
      )}
      {!fieldwork.isArchived ? (
        <div className="space-y-3 rounded-2xl border border-border/50 bg-card/60 p-5">
          <Input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Add a note" />
          <Button type="button" onClick={submit} disabled={isPending || !body.trim()}>
            {props.fieldworkLabels.actions.addNote}
          </Button>
        </div>
      ) : null}
    </FieldworkWorkspaceSectionShell>
  );
}

export function FieldworkNotesExperience(props: SectionProps & { locale: string }) {
  const { fieldwork } = useFieldworkWorkspace();
  if (!fieldwork) return <FieldworkCreateExperience canCreate={props.canCreate ?? false} planningApproved={props.planningApproved ?? false} labels={props.emptyLabels} gateLabels={props.fieldworkLabels.workspace} />;
  return <FieldworkNotesSection noteType="auditor" notes={fieldwork.notes} props={props} />;
}

export function FieldworkReviewNotesExperience(props: SectionProps & { locale: string }) {
  const { fieldwork } = useFieldworkWorkspace();
  if (!fieldwork) return <FieldworkCreateExperience canCreate={props.canCreate ?? false} planningApproved={props.planningApproved ?? false} labels={props.emptyLabels} gateLabels={props.fieldworkLabels.workspace} />;
  return <FieldworkNotesSection noteType="review" notes={fieldwork.notes} props={props} />;
}

export function FieldworkCommentsExperience(props: SectionProps & { locale: string }) {
  const { fieldwork } = useFieldworkWorkspace();
  if (!fieldwork) return <FieldworkCreateExperience canCreate={props.canCreate ?? false} planningApproved={props.planningApproved ?? false} labels={props.emptyLabels} gateLabels={props.fieldworkLabels.workspace} />;
  return <FieldworkNotesSection noteType="internal" notes={fieldwork.notes} props={props} />;
}

export function FieldworkHistoryExperience(
  props: SectionProps & {
    locale: string;
    plan: FieldworkWorkspaceView | null;
    activity: FieldworkActivityView;
  },
) {
  const fieldwork = props.plan;

  return (
    <FieldworkWorkspaceSectionShell title={props.labels.title} description={props.labels.description} headingId="fieldwork-history">
      {props.activity.entries.length === 0 ? (
        <EmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      ) : (
        <ul className="divide-y divide-border/40 overflow-hidden rounded-2xl border border-border/50 bg-card/80">
          {props.activity.entries.map((entry) => (
            <li key={entry.id} className="space-y-1 px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground">
                  {formatFieldworkActivityAction(entry.action, props.fieldworkLabels.history.actions)}
                </p>
                <time className="text-xs text-muted-foreground" dateTime={entry.createdAt}>
                  {formatDateTime(entry.createdAt, props.locale)}
                </time>
              </div>
              {entry.summary ? (
                <p className="text-sm text-muted-foreground">{entry.summary}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
      {fieldwork ? (
        <p className="text-sm text-muted-foreground">
          {props.fieldworkLabels.history.versionLabel}: {fieldwork.programVersion} ·{" "}
          {fieldwork.progressPct}%
        </p>
      ) : null}
    </FieldworkWorkspaceSectionShell>
  );
}

export function FieldworkSettingsExperience(
  props: {
    canCreate?: boolean;
    canArchive: boolean;
    planningApproved?: boolean;
    labels: Dictionary["fieldwork"]["settings"];
    emptyLabels: Dictionary["fieldwork"]["empty"];
    fieldworkLabels: Dictionary["fieldwork"];
  },
) {
  const router = useRouter();
  const { fieldwork } = useFieldworkWorkspace();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"idle" | "archive" | "restore">("idle");

  if (!fieldwork) {
    return (
      <FieldworkCreateExperience
        canCreate={props.canCreate ?? false}
        planningApproved={props.planningApproved ?? false}
        labels={props.emptyLabels}
        gateLabels={props.fieldworkLabels.workspace}
      />
    );
  }

  const archive = () => {
    startTransition(async () => {
      setError(null);
      const result = await import("@/lib/actions/fieldwork").then((m) =>
        m.archiveFieldworkAction({ packageId: fieldwork.id, version: fieldwork.version }),
      );
      if (!result.success) {
        setError(result.error.message);
        return;
      }
      setMode("idle");
      router.refresh();
    });
  };

  const restore = () => {
    startTransition(async () => {
      setError(null);
      const result = await import("@/lib/actions/fieldwork").then((m) =>
        m.restoreFieldworkAction({ packageId: fieldwork.id, version: fieldwork.version }),
      );
      if (!result.success) {
        setError(result.error.message);
        return;
      }
      setMode("idle");
      router.refresh();
    });
  };

  const lifecycle = props.fieldworkLabels.settings.lifecycle;

  return (
    <FieldworkWorkspaceSectionShell title={props.labels.title} description={props.labels.description} headingId="fieldwork-settings">
      {error ? <Alert variant="error">{error}</Alert> : null}
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/80 p-5">
        {fieldwork.isArchived ? (
          <>
            <Alert variant="warning" title={lifecycle.archivedBannerTitle}>
              {lifecycle.archivedBannerDescription}
            </Alert>
            {props.canArchive ? (
              <div className="mt-4 flex gap-3">
                {mode === "restore" ? (
                  <>
                    <Button type="button" onClick={restore} disabled={isPending}>
                      {lifecycle.restoreConfirmAction}
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => setMode("idle")}>
                      {lifecycle.cancelAction}
                    </Button>
                  </>
                ) : (
                  <Button type="button" onClick={() => setMode("restore")}>
                    {lifecycle.restoreAction}
                  </Button>
                )}
              </div>
            ) : null}
          </>
        ) : props.canArchive ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{lifecycle.archivePrompt}</p>
            {mode === "archive" ? (
              <div className="flex gap-3">
                <Button type="button" onClick={archive} disabled={isPending}>
                  {lifecycle.archiveConfirmAction}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setMode("idle")}>
                  {lifecycle.cancelAction}
                </Button>
              </div>
            ) : (
              <Button type="button" onClick={() => setMode("archive")}>
                {lifecycle.archiveAction}
              </Button>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{props.fieldworkLabels.settings.readOnlyNotice}</p>
        )}
      </div>
    </FieldworkWorkspaceSectionShell>
  );
}
