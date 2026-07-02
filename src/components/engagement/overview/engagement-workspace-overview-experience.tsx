"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateEngagementAction } from "@/lib/actions/engagement/update-engagement";
import type { EngagementWorkspaceView } from "@/lib/engagement/engagement-workspace-view";
import type { Dictionary } from "@/i18n/get-dictionary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui";
import {
  buildOverviewMetadataItems,
  buildOverviewSummaryCards,
} from "@/lib/engagement/engagement-workspace-display";
import { formatOptionalText } from "@/lib/engagement/format-engagement-workspace";
import { EngagementWorkspaceMetadataPanel } from "@/components/engagement/workspace/engagement-workspace-metadata-panel";
import { EngagementWorkspaceSectionShell } from "@/components/engagement/workspace/engagement-workspace-section-shell";
import { EngagementWorkspaceSummaryCards } from "@/components/engagement/workspace/engagement-workspace-summary-cards";

type EngagementWorkspaceOverviewExperienceProps = {
  engagement: EngagementWorkspaceView;
  locale: string;
  canUpdate: boolean;
  labels: Dictionary["engagements"]["workspace"];
  engagementsLabels: Dictionary["engagements"];
  overviewLabels: Dictionary["engagements"]["overview"];
};

export function EngagementWorkspaceOverviewExperience({
  engagement: initialEngagement,
  locale,
  canUpdate,
  labels,
  engagementsLabels,
  overviewLabels,
}: EngagementWorkspaceOverviewExperienceProps) {
  const router = useRouter();
  const [engagement, setEngagement] = useState(initialEngagement);
  const [description, setDescription] = useState(initialEngagement.description ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const summaryCards = buildOverviewSummaryCards(engagement, locale, labels, engagementsLabels);
  const metadataItems = buildOverviewMetadataItems(engagement, locale, labels, engagementsLabels);
  const isDirty = description !== (engagement.description ?? "");
  const canEdit = canUpdate && !engagement.isArchived;

  const serverSyncKey = `${initialEngagement.id}:${initialEngagement.version}:${initialEngagement.updatedAt}:${initialEngagement.isArchived}`;
  const syncedKeyRef = useRef(serverSyncKey);

  useEffect(() => {
    if (syncedKeyRef.current === serverSyncKey) {
      return;
    }
    syncedKeyRef.current = serverSyncKey;
    setEngagement(initialEngagement);
    setDescription(initialEngagement.description ?? "");
    setIsEditing(false);
    setError(null);
  }, [initialEngagement, serverSyncKey]);

  const saveDescription = () => {
    startTransition(async () => {
      setError(null);
      const result = await updateEngagementAction({
        engagementId: engagement.id,
        version: engagement.version,
        description: description.trim() || null,
      });

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      setEngagement((current) => ({
        ...current,
        description: description.trim() || null,
        version: result.data.version,
        updatedAt: new Date().toISOString(),
      }));
      setIsEditing(false);
      router.refresh();
    });
  };

  return (
    <div className="space-y-10">
      <EngagementWorkspaceSectionShell
        title={labels.sections.overview.title}
        description={labels.sections.overview.description}
        headingId="engagement-workspace-overview"
      >
        <EngagementWorkspaceSummaryCards cards={summaryCards} />
      </EngagementWorkspaceSectionShell>

      <EngagementWorkspaceSectionShell
        title={labels.sections.overview.highlightsTitle}
        description={labels.sections.overview.highlightsDescription}
        headingId="engagement-workspace-highlights"
      >
        <div className="rounded-2xl border border-border/50 bg-muted/15 px-6 py-8 sm:px-8">
          {error ? (
            <div className="mb-4">
              <Alert variant="error">{error}</Alert>
            </div>
          ) : null}

          {isEditing && canEdit ? (
            <div className="space-y-4">
              <label htmlFor="overview-description" className="text-sm font-medium text-foreground">
                {engagementsLabels.create.description}
              </label>
              <Input
                id="overview-description"
                name="overview-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={saveDescription} disabled={isPending || !isDirty}>
                  {overviewLabels.saveDescription}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setDescription(engagement.description ?? "");
                    setIsEditing(false);
                    setError(null);
                  }}
                  disabled={isPending}
                >
                  {overviewLabels.cancelEdit}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
                {engagement.description?.trim()
                  ? engagement.description
                  : labels.sections.overview.noDescription}
              </p>
              {canEdit ? (
                <Button type="button" variant="secondary" onClick={() => setIsEditing(true)}>
                  {overviewLabels.editDescription}
                </Button>
              ) : null}
            </div>
          )}

          <dl className="mt-8 grid gap-6 border-t border-border/40 pt-8 sm:grid-cols-2">
            <div className="space-y-1">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {engagementsLabels.columnCode}
              </dt>
              <dd className="text-sm text-foreground">
                {formatOptionalText(engagement.engagementCode)}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {labels.summaryPlannedDates}
              </dt>
              <dd className="text-sm text-foreground">
                {formatOptionalText(
                  [engagement.plannedStart, engagement.plannedEnd].filter(Boolean).join(" – ") || null,
                )}
              </dd>
            </div>
          </dl>
        </div>
      </EngagementWorkspaceSectionShell>

      <EngagementWorkspaceMetadataPanel
        title={labels.metadataTitle}
        description={labels.metadataDescription}
        items={metadataItems}
      />
    </div>
  );
}
