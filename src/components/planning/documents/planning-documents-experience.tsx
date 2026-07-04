"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addPlanningDocumentAction } from "@/lib/actions/planning";
import type { Dictionary } from "@/i18n/get-dictionary";
import { usePlanningWorkspace } from "@/lib/planning/use-planning-workspace";
import { Alert } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui";
import {
  WorkspaceEmptyPanel,
  WorkspaceFormPanel,
  WorkspaceList,
  WorkspaceListEntry,
  WorkspaceSectionShell,
} from "@/components/workspace";
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
    <WorkspaceSectionShell
      title={labels.title}
      description={labels.description}
      headingId="planning-documents"
    >
      {error ? <Alert variant="error">{error}</Alert> : null}

      {plan.documents.length === 0 ? (
        <WorkspaceEmptyPanel title={labels.emptyTitle} description={labels.emptyDescription} />
      ) : (
        <WorkspaceList>
          {plan.documents.map((document) => (
            <WorkspaceListEntry
              key={document.id}
              title={document.name}
              subtitle={
                labels.documentTypes[document.documentType as keyof typeof labels.documentTypes] ??
                document.documentType
              }
              meta={
                labels.statuses[document.status as keyof typeof labels.statuses] ?? document.status
              }
            />
          ))}
        </WorkspaceList>
      )}

      {canAdd ? (
        <WorkspaceFormPanel className="mt-6">
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
        </WorkspaceFormPanel>
      ) : null}
    </WorkspaceSectionShell>
  );
}
