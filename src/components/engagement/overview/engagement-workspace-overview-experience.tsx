"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateEngagementAction } from "@/lib/actions/engagement/update-engagement";
import { useEngagementWorkspace } from "@/lib/engagement/use-engagement-workspace";
import type { PlanningWorkspaceView } from "@/lib/planning/planning-workspace-view";
import type { FieldworkWorkspaceView } from "@/lib/fieldwork/fieldwork-workspace-view";
import type { RiskAssessmentWorkspaceView } from "@/lib/risk-assessment/risk-assessment-workspace-view";
import type { Dictionary } from "@/i18n/get-dictionary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui";
import {
  buildClientInformationItems,
  buildEngagementInformationItems,
  buildFieldworkSummaryItems,
  buildOverviewMetadataItems,
  buildOverviewSummaryCards,
  buildPlanningSummaryItems,
  buildRiskAssessmentSummaryItems,
  computeLifecycleProgress,
} from "@/lib/engagement/engagement-workspace-display";
import { formatLifecycleStatusLabel, formatOptionalText } from "@/lib/engagement/format-engagement-workspace";
import {
  EngagementWorkspaceClientPanel,
  EngagementWorkspaceLifecycleProgress,
  EngagementWorkspaceMetadataPanel,
  EngagementWorkspaceSectionShell,
  EngagementWorkspaceSummaryCards,
} from "@/components/engagement/workspace";

type EngagementWorkspaceOverviewExperienceProps = {
  locale: string;
  canUpdate: boolean;
  plan: PlanningWorkspaceView | null;
  riskAssessment: RiskAssessmentWorkspaceView | null;
  fieldwork: FieldworkWorkspaceView | null;
  labels: Dictionary["engagements"]["workspace"];
  engagementsLabels: Dictionary["engagements"];
  overviewLabels: Dictionary["engagements"]["overview"];
  planningLabels: Dictionary["planning"];
  riskLabels: Dictionary["riskAssessment"];
  fieldworkLabels: Dictionary["fieldwork"];
};

export function EngagementWorkspaceOverviewExperience({
  locale,
  canUpdate,
  plan,
  riskAssessment,
  fieldwork,
  labels,
  engagementsLabels,
  overviewLabels,
  planningLabels,
  riskLabels,
  fieldworkLabels,
}: EngagementWorkspaceOverviewExperienceProps) {
  const router = useRouter();
  const { engagement, refreshEngagement } = useEngagementWorkspace();
  const [editingDescription, setEditingDescription] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const description = isEditing
    ? (editingDescription ?? "")
    : (engagement.description ?? "");

  const summaryCards = buildOverviewSummaryCards(engagement, locale, labels, engagementsLabels);
  const metadataItems = buildOverviewMetadataItems(engagement, locale, labels, engagementsLabels);
  const planningItems = buildPlanningSummaryItems(
    engagement,
    locale,
    labels,
    engagementsLabels,
    plan,
    planningLabels,
  );
  const fieldworkItems = buildFieldworkSummaryItems(
    engagement,
    locale,
    labels,
    engagementsLabels,
    fieldwork,
    fieldworkLabels,
  );
  const riskAssessmentItems = buildRiskAssessmentSummaryItems(
    engagement,
    locale,
    labels,
    engagementsLabels,
    riskAssessment,
    riskLabels,
  );
  const clientItems = buildClientInformationItems(engagement, locale, labels);
  const informationItems = buildEngagementInformationItems(
    engagement,
    locale,
    labels,
    engagementsLabels,
  );
  const lifecycleProgress = computeLifecycleProgress(
    engagement.lifecycleStatus,
    riskAssessment?.assessmentStatus,
  );
  const lifecycleLabel = formatLifecycleStatusLabel(
    engagement.lifecycleStatus,
    engagementsLabels.lifecycleStatuses,
  );
  const isDirty = isEditing && editingDescription !== (engagement.description ?? "");
  const canEdit = canUpdate && !engagement.isArchived;

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

      refreshEngagement({
        ...engagement,
        description: description.trim() || null,
        version: result.data.version,
        updatedAt: new Date().toISOString(),
      });
      setIsEditing(false);
      setEditingDescription(null);
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
        title={labels.status.title}
        description={labels.status.description}
        headingId="engagement-workspace-status"
      >
        <EngagementWorkspaceLifecycleProgress
          lifecycleStatus={engagement.lifecycleStatus}
          lifecycleLabel={lifecycleLabel}
          progressLabel={labels.status.progressLabel}
          percent={lifecycleProgress}
        />
      </EngagementWorkspaceSectionShell>

      <EngagementWorkspaceSectionShell
        title={labels.planning.title}
        description={labels.planning.description}
        headingId="engagement-workspace-planning"
      >
        <EngagementWorkspaceMetadataPanel title={labels.planning.title} items={planningItems} embedded />
        <div className="mt-4">
          <Link
            href={`/${locale}/app/engagements/${engagement.slug}/planning`}
            className="inline-flex h-10 items-center rounded-xl border border-border/60 bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {labels.planning.openPlanning}
          </Link>
        </div>
      </EngagementWorkspaceSectionShell>

      <EngagementWorkspaceSectionShell
        title={labels.riskAssessment.title}
        description={labels.riskAssessment.description}
        headingId="engagement-workspace-risk-assessment"
      >
        <EngagementWorkspaceMetadataPanel
          title={labels.riskAssessment.title}
          items={riskAssessmentItems}
          embedded
        />
        <div className="mt-4">
          <Link
            href={`/${locale}/app/engagements/${engagement.slug}/risk-assessment`}
            className="inline-flex h-10 items-center rounded-xl border border-border/60 bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {labels.riskAssessment.openRiskAssessment}
          </Link>
        </div>
      </EngagementWorkspaceSectionShell>

      <EngagementWorkspaceSectionShell
        title={labels.fieldwork.title}
        description={labels.fieldwork.description}
        headingId="engagement-workspace-fieldwork"
      >
        <EngagementWorkspaceMetadataPanel title={labels.fieldwork.title} items={fieldworkItems} embedded />
        <div className="mt-4">
          <Link
            href={`/${locale}/app/engagements/${engagement.slug}/fieldwork`}
            className="inline-flex h-10 items-center rounded-xl border border-border/60 bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {labels.fieldwork.openFieldwork}
          </Link>
        </div>
      </EngagementWorkspaceSectionShell>

      <EngagementWorkspaceSectionShell
        title={labels.client.title}
        description={labels.client.description}
        headingId="engagement-workspace-client"
      >
        <EngagementWorkspaceClientPanel
          locale={locale}
          title={labels.client.title}
          description={labels.client.description}
          items={clientItems}
          companySlug={engagement.companySlug}
          companyName={engagement.companyName}
          viewClientLabel={labels.client.viewClient}
        />
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
                onChange={(event) => setEditingDescription(event.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={saveDescription} disabled={isPending || !isDirty}>
                  {overviewLabels.saveDescription}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setEditingDescription(null);
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
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setEditingDescription(engagement.description ?? "");
                    setIsEditing(true);
                  }}
                >
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
        title={labels.information.title}
        description={labels.information.description}
        items={informationItems}
      />

      <EngagementWorkspaceMetadataPanel
        title={labels.metadataTitle}
        description={labels.metadataDescription}
        items={metadataItems}
      />
    </div>
  );
}
