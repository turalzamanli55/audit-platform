"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ENGAGEMENT_LIFECYCLE_STATUSES,
  ENGAGEMENT_REPORTING_FRAMEWORKS,
  ENGAGEMENT_TYPES,
} from "@/constants/engagement";
import { archiveEngagementAction } from "@/lib/actions/engagement/archive-engagement";
import { restoreEngagementAction } from "@/lib/actions/engagement/restore-engagement";
import { updateEngagementAction } from "@/lib/actions/engagement/update-engagement";
import type { EngagementReportingFramework } from "@/types/engagement";
import type { EngagementWorkspaceView } from "@/lib/engagement/engagement-workspace-view";
import { useEngagementWorkspace } from "@/lib/engagement/use-engagement-workspace";
import type { Dictionary } from "@/i18n/get-dictionary";
import { Alert, Input } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { EngagementWorkspaceSectionShell } from "@/components/engagement/workspace/engagement-workspace-section-shell";

type EngagementSettingsExperienceProps = {
  canUpdate: boolean;
  canArchive: boolean;
  labels: Dictionary["engagements"]["settings"];
  engagementsLabels: Dictionary["engagements"];
};

type SettingsFormState = {
  name: string;
  engagementCode: string;
  engagementType: EngagementWorkspaceView["engagementType"];
  lifecycleStatus: EngagementWorkspaceView["lifecycleStatus"];
  reportingFramework: EngagementReportingFramework;
  periodStart: string;
  periodEnd: string;
  plannedStart: string;
  plannedEnd: string;
  description: string;
  notes: string;
};

function toFormState(engagement: EngagementWorkspaceView): SettingsFormState {
  return {
    name: engagement.name,
    engagementCode: engagement.engagementCode ?? "",
    engagementType: engagement.engagementType,
    lifecycleStatus: engagement.lifecycleStatus,
    reportingFramework: engagement.reportingFramework as EngagementReportingFramework,
    periodStart: engagement.periodStart ?? "",
    periodEnd: engagement.periodEnd ?? "",
    plannedStart: engagement.plannedStart ?? "",
    plannedEnd: engagement.plannedEnd ?? "",
    description: engagement.description ?? "",
    notes: engagement.notes ?? "",
  };
}

function SettingsGroup({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="space-y-1 px-1">
        <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          {title}
        </h3>
        {description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/80 shadow-xs">
        <div className="space-y-4 p-5 sm:p-6">{children}</div>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

export function EngagementSettingsExperience({
  canUpdate,
  canArchive,
  labels,
  engagementsLabels,
}: EngagementSettingsExperienceProps) {
  const { engagement } = useEngagementWorkspace();

  return (
    <EngagementSettingsForm
      key={`${engagement.id}:${engagement.version}:${engagement.isArchived}`}
      canUpdate={canUpdate}
      canArchive={canArchive}
      labels={labels}
      engagementsLabels={engagementsLabels}
    />
  );
}

function EngagementSettingsForm({
  canUpdate,
  canArchive,
  labels,
  engagementsLabels,
}: EngagementSettingsExperienceProps) {
  const router = useRouter();
  const { engagement, refreshEngagement } = useEngagementWorkspace();
  const [form, setForm] = useState<SettingsFormState>(() => toFormState(engagement));
  const [error, setError] = useState<string | null>(null);
  const [lifecycleMode, setLifecycleMode] = useState<"idle" | "archive" | "restore">("idle");
  const [archiveReason, setArchiveReason] = useState("");
  const [isPending, startTransition] = useTransition();

  const readOnly = !canUpdate || engagement.isArchived;
  const baseline = toFormState(engagement);
  const isDirty = JSON.stringify(form) !== JSON.stringify(baseline);

  const setField = <K extends keyof SettingsFormState>(key: K, value: SettingsFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError(null);
  };

  const saveSettings = () => {
    startTransition(async () => {
      setError(null);
      const result = await updateEngagementAction({
        engagementId: engagement.id,
        version: engagement.version,
        name: form.name,
        engagementCode: form.engagementCode.trim() || null,
        engagementType: form.engagementType,
        lifecycleStatus: form.lifecycleStatus,
        reportingFramework: form.reportingFramework,
        periodStart: form.periodStart || null,
        periodEnd: form.periodEnd || null,
        plannedStart: form.plannedStart || null,
        plannedEnd: form.plannedEnd || null,
        description: form.description.trim() || null,
        notes: form.notes.trim() || null,
      });

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      refreshEngagement({
        ...engagement,
        name: form.name,
        slug: result.data.slug,
        engagementCode: form.engagementCode.trim() || null,
        engagementType: form.engagementType,
        lifecycleStatus: form.lifecycleStatus,
        reportingFramework: form.reportingFramework,
        periodStart: form.periodStart || null,
        periodEnd: form.periodEnd || null,
        plannedStart: form.plannedStart || null,
        plannedEnd: form.plannedEnd || null,
        description: form.description.trim() || null,
        notes: form.notes.trim() || null,
        version: result.data.version,
        updatedAt: new Date().toISOString(),
      });
      router.refresh();
    });
  };

  const handleArchive = () => {
    startTransition(async () => {
      setError(null);
      const result = await archiveEngagementAction({
        engagementId: engagement.id,
        version: engagement.version,
        archiveReason: archiveReason.trim() || null,
      });

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      const archivedAt = new Date().toISOString();
      const next = {
        ...engagement,
        isArchived: true,
        status: result.data.status as EngagementWorkspaceView["status"],
        version: result.data.version,
        deletedAt: archivedAt,
        updatedAt: archivedAt,
      };
      refreshEngagement(next);
      setForm(toFormState(next));
      setLifecycleMode("idle");
      setArchiveReason("");
      router.refresh();
    });
  };

  const handleRestore = () => {
    startTransition(async () => {
      setError(null);
      const result = await restoreEngagementAction({
        engagementId: engagement.id,
        version: engagement.version,
      });

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      const restoredAt = new Date().toISOString();
      const next = {
        ...engagement,
        isArchived: false,
        status: result.data.status as EngagementWorkspaceView["status"],
        version: result.data.version,
        deletedAt: null,
        updatedAt: restoredAt,
      };
      refreshEngagement(next);
      setForm(toFormState(next));
      setLifecycleMode("idle");
      router.refresh();
    });
  };

  return (
    <div className="space-y-10">
      <EngagementWorkspaceSectionShell
        title={labels.title}
        description={labels.description}
        headingId="engagement-settings"
      >
        {readOnly && !engagement.isArchived ? (
          <p className="rounded-2xl border border-border/50 bg-muted/20 px-5 py-4 text-sm text-muted-foreground">
            {labels.readOnlyNotice}
          </p>
        ) : null}

        {error ? <Alert variant="error">{error}</Alert> : null}

        <div className="space-y-8">
          <SettingsGroup title={labels.sections.general.title} description={labels.sections.general.description}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={engagementsLabels.create.name} htmlFor="settings-name">
                <Input
                  id="settings-name"
                  value={form.name}
                  onChange={(event) => setField("name", event.target.value)}
                  disabled={readOnly}
                />
              </Field>
              <Field label={engagementsLabels.create.engagementCode} htmlFor="settings-code">
                <Input
                  id="settings-code"
                  value={form.engagementCode}
                  onChange={(event) => setField("engagementCode", event.target.value)}
                  disabled={readOnly}
                />
              </Field>
              <Field label={engagementsLabels.create.engagementType} htmlFor="settings-type">
                <select
                  id="settings-type"
                  value={form.engagementType}
                  onChange={(event) =>
                    setField("engagementType", event.target.value as SettingsFormState["engagementType"])
                  }
                  disabled={readOnly}
                  className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:opacity-60"
                >
                  {ENGAGEMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {engagementsLabels.create.engagementTypes[type]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={engagementsLabels.create.lifecycleStatus} htmlFor="settings-lifecycle">
                <select
                  id="settings-lifecycle"
                  value={form.lifecycleStatus}
                  onChange={(event) =>
                    setField(
                      "lifecycleStatus",
                      event.target.value as SettingsFormState["lifecycleStatus"],
                    )
                  }
                  disabled={readOnly}
                  className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:opacity-60"
                >
                  {ENGAGEMENT_LIFECYCLE_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {engagementsLabels.lifecycleStatuses[status]}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </SettingsGroup>

          <SettingsGroup title={labels.sections.client.title} description={labels.sections.client.description}>
            <p className="text-sm text-foreground">{engagement.companyName}</p>
          </SettingsGroup>

          <SettingsGroup
            title={labels.sections.reporting.title}
            description={labels.sections.reporting.description}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={engagementsLabels.create.reportingFramework} htmlFor="settings-framework">
                <select
                  id="settings-framework"
                  value={form.reportingFramework}
                  onChange={(event) =>
                    setField("reportingFramework", event.target.value as EngagementReportingFramework)
                  }
                  disabled={readOnly}
                  className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:opacity-60"
                >
                  {ENGAGEMENT_REPORTING_FRAMEWORKS.map((framework) => (
                    <option key={framework} value={framework}>
                      {engagementsLabels.create.frameworks[framework]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={engagementsLabels.create.periodStart} htmlFor="settings-period-start">
                <Input
                  id="settings-period-start"
                  type="date"
                  value={form.periodStart}
                  onChange={(event) => setField("periodStart", event.target.value)}
                  disabled={readOnly}
                />
              </Field>
              <Field label={engagementsLabels.create.periodEnd} htmlFor="settings-period-end">
                <Input
                  id="settings-period-end"
                  type="date"
                  value={form.periodEnd}
                  onChange={(event) => setField("periodEnd", event.target.value)}
                  disabled={readOnly}
                />
              </Field>
            </div>
          </SettingsGroup>

          <SettingsGroup title={labels.sections.dates.title} description={labels.sections.dates.description}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={engagementsLabels.create.plannedStart} htmlFor="settings-planned-start">
                <Input
                  id="settings-planned-start"
                  type="date"
                  value={form.plannedStart}
                  onChange={(event) => setField("plannedStart", event.target.value)}
                  disabled={readOnly}
                />
              </Field>
              <Field label={engagementsLabels.create.plannedEnd} htmlFor="settings-planned-end">
                <Input
                  id="settings-planned-end"
                  type="date"
                  value={form.plannedEnd}
                  onChange={(event) => setField("plannedEnd", event.target.value)}
                  disabled={readOnly}
                />
              </Field>
            </div>
          </SettingsGroup>

          <SettingsGroup title={labels.sections.notes.title} description={labels.sections.notes.description}>
            <div className="space-y-4">
              <Field label={engagementsLabels.create.description} htmlFor="settings-description">
                <Input
                  id="settings-description"
                  value={form.description}
                  onChange={(event) => setField("description", event.target.value)}
                  disabled={readOnly}
                />
              </Field>
              <Field label={engagementsLabels.create.notes} htmlFor="settings-notes">
                <textarea
                  id="settings-notes"
                  value={form.notes}
                  onChange={(event) => setField("notes", event.target.value)}
                  disabled={readOnly}
                  rows={4}
                  className="w-full rounded-xl border border-input bg-card px-3 py-2 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:opacity-60"
                />
              </Field>
            </div>
          </SettingsGroup>

          {!readOnly ? (
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={saveSettings} disabled={isPending || !isDirty}>
                {isPending ? labels.savingLabel : labels.saveLabel}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setForm(toFormState(engagement))}
                disabled={isPending || !isDirty}
              >
                {labels.discardLabel}
              </Button>
            </div>
          ) : null}
        </div>
      </EngagementWorkspaceSectionShell>

      {canArchive ? (
        <EngagementWorkspaceSectionShell
          title={labels.lifecycle.title}
          description={labels.lifecycle.description}
          headingId="engagement-settings-lifecycle"
        >
          {lifecycleMode === "idle" ? (
            <div className="rounded-2xl border border-border/50 bg-card/80 p-5 sm:p-6">
              {engagement.isArchived ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">{labels.lifecycle.restorePrompt}</p>
                  <Button type="button" onClick={() => setLifecycleMode("restore")} disabled={isPending}>
                    {labels.lifecycle.restoreAction}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">{labels.lifecycle.archivePrompt}</p>
                  <Button
                    type="button"
                    variant="secondary"
                    className="border-destructive/30 text-destructive hover:bg-destructive/10"
                    onClick={() => setLifecycleMode("archive")}
                    disabled={isPending}
                  >
                    {labels.lifecycle.archiveAction}
                  </Button>
                </div>
              )}
            </div>
          ) : null}

          {lifecycleMode === "archive" ? (
            <div className="space-y-4 rounded-2xl border border-border/60 bg-muted/20 p-5 sm:p-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{labels.lifecycle.archiveConfirmTitle}</p>
                <p className="text-sm text-muted-foreground">{labels.lifecycle.archiveConfirmDescription}</p>
              </div>
              <Field label={labels.lifecycle.reasonLabel} htmlFor="archive-reason">
                <Input
                  id="archive-reason"
                  value={archiveReason}
                  onChange={(event) => setArchiveReason(event.target.value)}
                  placeholder={labels.lifecycle.archiveReasonPlaceholder}
                />
              </Field>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="secondary" onClick={() => setLifecycleMode("idle")} disabled={isPending}>
                  {labels.lifecycle.cancelAction}
                </Button>
                <Button
                  type="button"
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleArchive}
                  disabled={isPending}
                >
                  {labels.lifecycle.archiveConfirmAction}
                </Button>
              </div>
            </div>
          ) : null}

          {lifecycleMode === "restore" ? (
            <div className="space-y-4 rounded-2xl border border-border/60 bg-muted/20 p-5 sm:p-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{labels.lifecycle.restoreConfirmTitle}</p>
                <p className="text-sm text-muted-foreground">{labels.lifecycle.restoreConfirmDescription}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="secondary" onClick={() => setLifecycleMode("idle")} disabled={isPending}>
                  {labels.lifecycle.cancelAction}
                </Button>
                <Button type="button" onClick={handleRestore} disabled={isPending}>
                  {labels.lifecycle.restoreConfirmAction}
                </Button>
              </div>
            </div>
          ) : null}
        </EngagementWorkspaceSectionShell>
      ) : null}
    </div>
  );
}
