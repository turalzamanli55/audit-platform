"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import {
  addFieldworkEvidenceAction,
  addFieldworkFindingAction,
  addFieldworkNoteAction,
  addTickmarkLibraryEntryAction,
  addWorkingPaperAction,
  addWorkingPaperTickmarkAction,
  downloadFieldworkEvidenceAction,
  uploadFieldworkEvidenceAction,
} from "@/lib/actions/fieldwork";
import { FieldworkProcedureRow } from "@/components/fieldwork/procedures/fieldwork-procedure-row";
import { FieldworkWorkingPaperRow } from "@/components/fieldwork/working-papers/fieldwork-working-paper-row";
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
  canUpdate?: boolean;
  canAssign?: boolean;
  canReview?: boolean;
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

export function FieldworkProceduresExperience(props: SectionProps & { locale: string }) {
  const fieldwork = useFieldworkOrEmpty(props);
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("procedure");
  const rowRefs = useRef<Record<string, HTMLLIElement | null>>({});

  useEffect(() => {
    if (!highlightId || typeof fieldwork !== "object" || !("procedures" in fieldwork)) return;
    const node = rowRefs.current[highlightId];
    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "nearest" });
      node.classList.add("ring-2", "ring-primary/40");
      const timer = window.setTimeout(() => {
        node.classList.remove("ring-2", "ring-primary/40");
      }, 2400);
      return () => window.clearTimeout(timer);
    }
  }, [highlightId, fieldwork]);

  if (typeof fieldwork !== "object" || !("procedures" in fieldwork)) return fieldwork;

  return (
    <FieldworkWorkspaceSectionShell title={props.labels.title} description={props.labels.description} headingId="fieldwork-procedures">
      {fieldwork.procedures.length === 0 ? (
        <EmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      ) : (
        <ul className="divide-y divide-border/40 overflow-hidden rounded-2xl border border-border/50 bg-card/80">
          {fieldwork.procedures.map((procedure) => (
            <li
              key={procedure.id}
              ref={(node) => {
                rowRefs.current[procedure.id] = node;
              }}
              className="rounded-lg transition-shadow"
            >
              <FieldworkProcedureRow
                packageId={fieldwork.id}
                procedure={procedure}
                isArchived={fieldwork.isArchived}
                canAssign={props.canAssign ?? false}
                canUpdate={props.canUpdate ?? false}
                canReview={props.canReview ?? false}
                fieldworkLabels={props.fieldworkLabels}
              />
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
  const [procedureId, setProcedureId] = useState("");
  const [tickmarkSymbol, setTickmarkSymbol] = useState("");
  const [tickmarkMeaning, setTickmarkMeaning] = useState("");
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fieldwork = useFieldworkOrEmpty(props);
  if (typeof fieldwork !== "object" || !("workingPapers" in fieldwork)) return fieldwork;

  const wpLabels = props.fieldworkLabels.workingPapers;
  const workflowLabels = props.fieldworkLabels.workflow;

  const addPaper = () => {
    if (!procedureId || !title.trim()) return;
    startTransition(async () => {
      setError(null);
      const result = await addWorkingPaperAction({
        packageId: fieldwork.id,
        procedureId,
        title: title.trim(),
      });
      if (!result.success) {
        setError(result.error?.message ?? workflowLabels.errorGeneric);
        return;
      }
      setTitle("");
      router.refresh();
    });
  };

  const addTickmark = (paperId: string, paperVersion: number) => {
    if (!tickmarkSymbol.trim() || !tickmarkMeaning.trim()) return;
    startTransition(async () => {
      setError(null);
      const result = await addWorkingPaperTickmarkAction({
        packageId: fieldwork.id,
        workingPaperId: paperId,
        workingPaperVersion: paperVersion,
        symbol: tickmarkSymbol.trim(),
        meaning: tickmarkMeaning.trim(),
      });
      if (!result.success) {
        setError(result.error?.message ?? workflowLabels.errorGeneric);
        return;
      }
      setTickmarkSymbol("");
      setTickmarkMeaning("");
      setSelectedPaperId(null);
      router.refresh();
    });
  };

  const applyLibraryTickmark = (paperId: string, paperVersion: number, symbol: string, meaning: string) => {
    startTransition(async () => {
      setError(null);
      const result = await addWorkingPaperTickmarkAction({
        packageId: fieldwork.id,
        workingPaperId: paperId,
        workingPaperVersion: paperVersion,
        symbol,
        meaning,
      });
      if (!result.success) {
        setError(result.error?.message ?? workflowLabels.errorGeneric);
        return;
      }
      setSelectedPaperId(null);
      router.refresh();
    });
  };

  return (
    <FieldworkWorkspaceSectionShell title={props.labels.title} description={props.labels.description} headingId="fieldwork-working-papers">
      {error ? <Alert variant="error">{error}</Alert> : null}
      {fieldwork.workingPapers.length === 0 ? (
        <EmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      ) : (
        <div className="mb-6 divide-y divide-border/40 overflow-hidden rounded-2xl border border-border/50 bg-card/80">
          {fieldwork.workingPapers.map((paper) => (
            <div key={paper.id}>
              <FieldworkWorkingPaperRow
                packageId={fieldwork.id}
                paper={paper}
                isArchived={fieldwork.isArchived}
                canAssign={props.canAssign ?? false}
                canUpdate={props.canUpdate ?? false}
                canReview={props.canReview ?? false}
                fieldworkLabels={props.fieldworkLabels}
                onAddTickmark={() =>
                  setSelectedPaperId((current) => (current === paper.id ? null : paper.id))
                }
              />
              {selectedPaperId === paper.id ? (
                <div className="space-y-3 border-t border-border/40 bg-muted/20 px-5 py-4">
                  {fieldwork.tickmarkLibrary.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {fieldwork.tickmarkLibrary.map((entry) => (
                        <Button
                          key={entry.id}
                          type="button"
                          size="sm"
                          variant="secondary"
                          disabled={isPending}
                          onClick={() => applyLibraryTickmark(paper.id, paper.version, entry.symbol, entry.meaning)}
                        >
                          {entry.symbol}
                        </Button>
                      ))}
                    </div>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    <Input
                      value={tickmarkSymbol}
                      onChange={(e) => setTickmarkSymbol(e.target.value)}
                      placeholder={wpLabels.tickmarkSymbol}
                    />
                    <Input
                      value={tickmarkMeaning}
                      onChange={(e) => setTickmarkMeaning(e.target.value)}
                      placeholder={wpLabels.tickmarkMeaning}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addTickmark(paper.id, paper.version)}
                      disabled={isPending}
                    >
                      {props.fieldworkLabels.actions.addTickmark}
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
      {!fieldwork.isArchived && fieldwork.procedures.length > 0 ? (
        <div className="space-y-3 rounded-2xl border border-border/50 bg-card/60 p-5">
          <label className="text-sm font-medium text-foreground">{wpLabels.procedureLabel}</label>
          <select
            className="h-10 w-full rounded-lg border border-border/60 bg-background px-3 text-sm"
            value={procedureId}
            onChange={(event) => setProcedureId(event.target.value)}
          >
            <option value="">{wpLabels.procedureLabel}</option>
            {fieldwork.procedures.map((procedure) => (
              <option key={procedure.id} value={procedure.id}>
                {procedure.title}
              </option>
            ))}
          </select>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={wpLabels.titlePlaceholder}
          />
          <Button type="button" onClick={addPaper} disabled={isPending || !title.trim() || !procedureId}>
            {props.fieldworkLabels.actions.addWorkingPaper}
          </Button>
        </div>
      ) : null}
      {fieldwork.tickmarkLibrary.length > 0 ? (
        <div className="mt-6 rounded-2xl border border-border/50 bg-card/40 p-5">
          <h3 className="text-sm font-semibold text-foreground">{wpLabels.libraryTitle}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{wpLabels.libraryDescription}</p>
          <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
            {fieldwork.tickmarkLibrary.map((entry) => (
              <li key={entry.id}>
                <span className="font-medium text-foreground">{entry.symbol}</span> — {entry.meaning}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </FieldworkWorkspaceSectionShell>
  );
}

export function FieldworkEvidenceExperience(props: SectionProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [procedureId, setProcedureId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fieldwork = useFieldworkOrEmpty(props);
  if (typeof fieldwork !== "object" || !("evidence" in fieldwork)) return fieldwork;

  const evidenceLabels = props.fieldworkLabels.evidence;
  const workflowLabels = props.fieldworkLabels.workflow;

  const add = () => {
    if (!name.trim()) return;
    startTransition(async () => {
      setError(null);
      if (file) {
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = "";
        for (let i = 0; i < bytes.length; i += 1) {
          binary += String.fromCharCode(bytes[i] ?? 0);
        }
        const base64 = btoa(binary);
        const result = await uploadFieldworkEvidenceAction({
          packageId: fieldwork.id,
          name: name.trim(),
          procedureId: procedureId || null,
          fileName: file.name,
          fileBase64: base64,
          mimeType: file.type || "application/octet-stream",
          fileSize: file.size,
        });
        if (!result.success) {
          setError(result.error?.message ?? workflowLabels.errorGeneric);
          return;
        }
      } else {
        const result = await addFieldworkEvidenceAction({
          packageId: fieldwork.id,
          name: name.trim(),
          procedureId: procedureId || null,
        });
        if (!result.success) {
          setError(result.error?.message ?? workflowLabels.errorGeneric);
          return;
        }
      }
      setName("");
      setFile(null);
      setProcedureId("");
      router.refresh();
    });
  };

  const download = (evidenceId: string) => {
    startTransition(async () => {
      setDownloadError(null);
      const result = await downloadFieldworkEvidenceAction({
        packageId: fieldwork.id,
        evidenceId,
      });
      if (!result.success) {
        setDownloadError(result.error?.message ?? evidenceLabels.downloadError);
        return;
      }
      const anchor = document.createElement("a");
      anchor.href = result.data.signedUrl;
      anchor.download = result.data.fileName;
      anchor.rel = "noopener noreferrer";
      anchor.target = "_blank";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    });
  };

  return (
    <FieldworkWorkspaceSectionShell title={props.labels.title} description={props.labels.description} headingId="fieldwork-evidence">
      {error ? <Alert variant="error">{error}</Alert> : null}
      {downloadError ? <Alert variant="error">{downloadError}</Alert> : null}
      {fieldwork.evidence.length === 0 ? (
        <EmptyPanel title={props.labels.emptyTitle} description={props.labels.emptyDescription} />
      ) : (
        <ul className="mb-6 divide-y divide-border/40 overflow-hidden rounded-2xl border border-border/50 bg-card/80">
          {fieldwork.evidence.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.documentType}</p>
                {item.storagePath ? (
                  <p className="text-xs text-primary">{evidenceLabels.uploadedBadge}</p>
                ) : null}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  {props.fieldworkLabels.evidenceStatuses[item.evidenceStatus]}
                </span>
                {item.storagePath ? (
                  <Button type="button" size="sm" variant="secondary" disabled={isPending} onClick={() => download(item.id)}>
                    {evidenceLabels.downloadAction}
                  </Button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
      {!fieldwork.isArchived ? (
        <div className="space-y-3 rounded-2xl border border-border/50 bg-card/60 p-5">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={evidenceLabels.namePlaceholder}
          />
          <select
            className="h-10 w-full rounded-lg border border-border/60 bg-background px-3 text-sm"
            value={procedureId}
            onChange={(event) => setProcedureId(event.target.value)}
          >
            <option value="">{evidenceLabels.procedureLabel}</option>
            {fieldwork.procedures.map((procedure) => (
              <option key={procedure.id} value={procedure.id}>
                {procedure.title}
              </option>
            ))}
          </select>
          <label className="block text-sm font-medium text-foreground">
            {evidenceLabels.fileLabel}
            <input
              type="file"
              className="mt-2 block w-full text-sm text-muted-foreground"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </label>
          <Button type="button" onClick={add} disabled={isPending || !name.trim()}>
            {file ? props.fieldworkLabels.actions.uploadEvidence : props.fieldworkLabels.actions.addEvidence}
          </Button>
        </div>
      ) : null}
    </FieldworkWorkspaceSectionShell>
  );
}

export function FieldworkFindingsExperience(props: SectionProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fieldwork = useFieldworkOrEmpty(props);
  if (typeof fieldwork !== "object" || !("findings" in fieldwork)) return fieldwork;

  const add = () => {
    if (!title.trim()) return;
    startTransition(async () => {
      setError(null);
      const result = await addFieldworkFindingAction({ packageId: fieldwork.id, title: title.trim() });
      if (!result.success) {
        setError(result.error?.message ?? props.fieldworkLabels.workflow.errorGeneric);
        return;
      }
      setTitle("");
      router.refresh();
    });
  };

  return (
    <FieldworkWorkspaceSectionShell title={props.labels.title} description={props.labels.description} headingId="fieldwork-findings">
      {error ? <Alert variant="error">{error}</Alert> : null}
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
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={props.fieldworkLabels.findings.titlePlaceholder}
          />
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
          <Input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={props.fieldworkLabels.notes.bodyPlaceholder}
          />
          <Button type="button" onClick={submit} disabled={isPending || !body.trim()}>
            {props.fieldworkLabels.actions.addNote}
          </Button>
        </div>
      ) : null}
    </FieldworkWorkspaceSectionShell>
  );
}

function FieldworkNotesGate(props: SectionProps & { locale: string; children: ReactNode }) {
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
  return props.children;
}

export function FieldworkNotesExperience(props: SectionProps & { locale: string }) {
  const { fieldwork } = useFieldworkWorkspace();
  return (
    <FieldworkNotesGate {...props}>
      {fieldwork ? <FieldworkNotesSection noteType="auditor" notes={fieldwork.notes} props={props} /> : null}
    </FieldworkNotesGate>
  );
}

export function FieldworkReviewNotesExperience(props: SectionProps & { locale: string }) {
  const { fieldwork } = useFieldworkWorkspace();
  return (
    <FieldworkNotesGate {...props}>
      {fieldwork ? (
        <>
          <FieldworkNotesSection noteType="review" notes={fieldwork.notes} props={props} />
          {fieldwork.clearanceNotes.length > 0 ? (
            <FieldworkNotesSection
              noteType="clearance"
              notes={fieldwork.notes}
              props={{
                ...props,
                labels: {
                  ...props.labels,
                  title: props.fieldworkLabels.workflow.clearAction,
                  description: props.fieldworkLabels.workflow.clearanceNotesPlaceholder,
                  emptyTitle: props.labels.emptyTitle,
                  emptyDescription: props.labels.emptyDescription,
                },
              }}
            />
          ) : null}
        </>
      ) : null}
    </FieldworkNotesGate>
  );
}

export function FieldworkCommentsExperience(props: SectionProps & { locale: string }) {
  const { fieldwork } = useFieldworkWorkspace();
  return (
    <FieldworkNotesGate {...props}>
      {fieldwork ? <FieldworkNotesSection noteType="internal" notes={fieldwork.notes} props={props} /> : null}
    </FieldworkNotesGate>
  );
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
  const { fieldwork, planningApproved } = useFieldworkWorkspace();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"idle" | "archive" | "restore">("idle");
  const [symbol, setSymbol] = useState("");
  const [meaning, setMeaning] = useState("");

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

  const addLibraryTickmark = () => {
    if (!symbol.trim() || !meaning.trim()) return;
    startTransition(async () => {
      setError(null);
      const result = await addTickmarkLibraryEntryAction({
        symbol: symbol.trim(),
        meaning: meaning.trim(),
      });
      if (!result.success) {
        setError(result.error.message);
        return;
      }
      setSymbol("");
      setMeaning("");
      router.refresh();
    });
  };

  return (
    <FieldworkWorkspaceSectionShell title={props.labels.title} description={props.labels.description} headingId="fieldwork-settings">
      {error ? <Alert variant="error">{error}</Alert> : null}
      {!fieldwork.isArchived ? (
        <div className="mb-6 space-y-3 rounded-2xl border border-border/50 bg-card/80 p-5">
          <h3 className="text-sm font-semibold text-foreground">{props.labels.tickmarkLibraryTitle}</h3>
          <p className="text-sm text-muted-foreground">{props.labels.tickmarkLibraryDescription}</p>
          {fieldwork.tickmarkLibrary.length > 0 ? (
            <ul className="space-y-1 text-sm text-muted-foreground">
              {fieldwork.tickmarkLibrary.map((entry) => (
                <li key={entry.id}>
                  <span className="font-medium text-foreground">{entry.symbol}</span> — {entry.meaning}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder={props.labels.tickmarkSymbol} />
            <Input value={meaning} onChange={(e) => setMeaning(e.target.value)} placeholder={props.labels.tickmarkMeaning} />
            <Button type="button" onClick={addLibraryTickmark} disabled={isPending}>
              {props.labels.addTickmark}
            </Button>
          </div>
        </div>
      ) : null}
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
