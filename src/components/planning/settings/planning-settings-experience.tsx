"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { archivePlanningAction } from "@/lib/actions/planning/archive-planning";
import { restorePlanningAction } from "@/lib/actions/planning/restore-planning";
import { usePlanningWorkspace } from "@/lib/planning/use-planning-workspace";
import type { Dictionary } from "@/i18n/get-dictionary";
import { Alert } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui";
import { WorkspaceFormPanel, WorkspaceSectionShell } from "@/components/workspace";
import { PlanningCreateExperience } from "@/components/planning/create/planning-create-experience";

type PlanningSettingsExperienceProps = {
  canCreate: boolean;
  canArchive: boolean;
  labels: Dictionary["planning"]["settings"];
  emptyLabels: Dictionary["planning"]["empty"];
};

export function PlanningSettingsExperience({
  canCreate,
  canArchive,
  labels,
  emptyLabels,
}: PlanningSettingsExperienceProps) {
  const router = useRouter();
  const { plan } = usePlanningWorkspace();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [archiveReason, setArchiveReason] = useState("");
  const [mode, setMode] = useState<"idle" | "archive" | "restore">("idle");

  if (!plan) {
    return <PlanningCreateExperience canCreate={canCreate} labels={emptyLabels} />;
  }

  const archive = () => {
    startTransition(async () => {
      setError(null);
      const result = await archivePlanningAction({
        planId: plan.id,
        version: plan.version,
        archiveReason: archiveReason || null,
      });

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
      const result = await restorePlanningAction({
        planId: plan.id,
        version: plan.version,
      });

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      setMode("idle");
      router.refresh();
    });
  };

  return (
    <WorkspaceSectionShell
      title={labels.title}
      description={labels.description}
      headingId="planning-settings"
    >
      {error ? <Alert variant="error">{error}</Alert> : null}

      <WorkspaceFormPanel>
        {plan.isArchived ? (
          <>
            <Alert variant="warning" title={labels.lifecycle.archivedBannerTitle}>
              {labels.lifecycle.archivedBannerDescription}
            </Alert>
            {canArchive ? (
              <>
                <p className="text-sm text-muted-foreground">{labels.lifecycle.restorePrompt}</p>
                {mode === "restore" ? (
                  <div className="flex flex-wrap gap-3">
                    <Button type="button" onClick={restore} disabled={isPending}>
                      {labels.lifecycle.restoreConfirmAction}
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => setMode("idle")}>
                      {labels.lifecycle.cancelAction}
                    </Button>
                  </div>
                ) : (
                  <Button type="button" onClick={() => setMode("restore")}>
                    {labels.lifecycle.restoreAction}
                  </Button>
                )}
              </>
            ) : null}
          </>
        ) : canArchive ? (
          <>
            <p className="text-sm text-muted-foreground">{labels.lifecycle.archivePrompt}</p>
            {mode === "archive" ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="archive-reason" className="text-sm font-medium text-foreground">
                    {labels.lifecycle.reasonLabel}
                  </label>
                  <Input
                    id="archive-reason"
                    value={archiveReason}
                    onChange={(event) => setArchiveReason(event.target.value)}
                    placeholder={labels.lifecycle.archiveReasonPlaceholder}
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button type="button" onClick={archive} disabled={isPending}>
                    {labels.lifecycle.archiveConfirmAction}
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setMode("idle")}>
                    {labels.lifecycle.cancelAction}
                  </Button>
                </div>
              </div>
            ) : (
              <Button type="button" variant="destructive" onClick={() => setMode("archive")}>
                {labels.lifecycle.archiveAction}
              </Button>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{labels.readOnlyNotice}</p>
        )}
      </WorkspaceFormPanel>
    </WorkspaceSectionShell>
  );
}
