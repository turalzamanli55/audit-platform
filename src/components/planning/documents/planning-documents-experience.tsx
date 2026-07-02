"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addPlanningDocumentAction } from "@/lib/actions/planning";
import type { Dictionary } from "@/i18n/get-dictionary";
import { usePlanningWorkspace } from "@/lib/planning/use-planning-workspace";
import { Alert } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui";
import { PlanningWorkspaceSectionShell } from "@/components/planning/workspace/planning-workspace-section-shell";
import { PlanningCreateExperience } from "@/components/planning/create/planning-create-experience";

type PlanningDocumentsExperienceProps = {
  canCreate: boolean;
  canUpdate: boolean;
  labels: Dictionary["planning"]["documents"];
  emptyLabels: Dictionary["planning"]["empty"];
};

const DOCUMENT_TYPES = [
  "planning_memorandum",
  "risk_assessment",
  "materiality_worksheet",
  "other",
] as const;

export function PlanningDocumentsExperience({
  canCreate,
  canUpdate,
  labels,
  emptyLabels,
}: PlanningDocumentsExperienceProps) {
  const router = useRouter();
  const { plan } = usePlanningWorkspace();
  const [name, setName] = useState("");
  const [documentType, setDocumentType] =
    useState<(typeof DOCUMENT_TYPES)[number]>("planning_memorandum");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!plan) {
    return <PlanningCreateExperience canCreate={canCreate} labels={emptyLabels} />;
  }

  const canAdd =
    canUpdate && !plan.isArchived && !plan.isLocked && plan.planningStatus !== "pending_review";

  const addDocument = () => {
    if (!name.trim()) return;

    startTransition(async () => {
      setError(null);
      const result = await addPlanningDocumentAction({
        planId: plan.id,
        version: plan.version,
        name: name.trim(),
        documentType,
      });

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      setName("");
      router.refresh();
    });
  };

  return (
    <PlanningWorkspaceSectionShell
      title={labels.title}
      description={labels.description}
      headingId="planning-documents"
    >
      {error ? <Alert variant="error">{error}</Alert> : null}

      {plan.documents.length === 0 ? (
        <div className="overflow-hidden rounded-2xl border border-dashed border-border/60 bg-card/40 px-6 py-12 text-center">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            {labels.emptyTitle}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            {labels.emptyDescription}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border/40 overflow-hidden rounded-2xl border border-border/50 bg-card/80">
          {plan.documents.map((document) => (
            <li key={document.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium text-foreground">{document.name}</p>
                <p className="text-xs text-muted-foreground">
                  {labels.documentTypes[document.documentType as keyof typeof labels.documentTypes] ??
                    document.documentType}
                </p>
              </div>
              <span className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
                {labels.statuses[document.status as keyof typeof labels.statuses] ?? document.status}
              </span>
            </li>
          ))}
        </ul>
      )}

      {canAdd ? (
        <div className="mt-6 space-y-4 rounded-2xl border border-border/50 bg-card/60 p-5">
          <p className="text-sm font-medium text-foreground">{labels.addTitle}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="document-name" className="text-sm text-muted-foreground">
                {labels.nameLabel}
              </label>
              <Input
                id="document-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={labels.namePlaceholder}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="document-type" className="text-sm text-muted-foreground">
                {labels.typeLabel}
              </label>
              <select
                id="document-type"
                value={documentType}
                onChange={(event) =>
                  setDocumentType(event.target.value as (typeof DOCUMENT_TYPES)[number])
                }
                className="flex h-10 w-full rounded-xl border border-border/60 bg-background px-3 text-sm text-foreground"
              >
                {DOCUMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {labels.documentTypes[type]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Button type="button" onClick={addDocument} disabled={isPending || !name.trim()}>
            {labels.addAction}
          </Button>
          <p className="text-xs text-muted-foreground">{labels.metadataNotice}</p>
        </div>
      ) : null}
    </PlanningWorkspaceSectionShell>
  );
}
