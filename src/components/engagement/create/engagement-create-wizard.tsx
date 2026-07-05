"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition, type KeyboardEvent, type ReactNode } from "react";
import {
  ENGAGEMENT_REPORTING_FRAMEWORKS,
  ENGAGEMENT_TYPES,
} from "@/constants/engagement";
import { createEngagementAction } from "@/lib/actions/engagement/create-engagement";
import {
  draftToCreateEngagementInput,
  type EngagementWizardDraft,
  type EngagementWizardStep,
} from "@/lib/engagement/engagement-wizard-draft";
import { useEngagementWizardDraft } from "@/lib/engagement/use-engagement-wizard-draft";
import {
  hasWizardFieldErrors,
  validateWizardStep,
  type WizardFieldErrors,
} from "@/lib/engagement/wizard-step-validation";
import { EngagementBreadcrumb, EngagementPageShell } from "@/components/engagement";
import { EngagementTeamStep } from "@/components/engagement/create/engagement-team-step";
import type { WorkspaceMemberDirectoryItem } from "@/lib/engagement/load-workspace-member-directory";
import { Input } from "@/components/ui";
import { WorkspaceNoticeBanner } from "@/components/workspace";
import {
  WizardField,
  WizardNavigation,
  WizardProgress,
  WizardShell,
  WizardStepPanel,
  type WizardStepDefinition,
} from "@/components/wizard";
import type { Dictionary } from "@/i18n/get-dictionary";
import {
  formatEngagementTypeLabel,
  formatFrameworkLabel,
} from "@/lib/engagement/format-engagement-workspace";

export type EngagementCreateLabels = Dictionary["engagements"]["create"];

type CompanyOption = {
  id: string;
  name: string;
};

type EngagementCreateWizardProps = {
  locale: string;
  labels: EngagementCreateLabels;
  companyOptions: CompanyOption[];
  workspaceMembers: WorkspaceMemberDirectoryItem[];
  engagementsLabels: Dictionary["engagements"];
};

export function EngagementCreateWizard({
  locale,
  labels,
  companyOptions,
  workspaceMembers,
  engagementsLabels,
}: EngagementCreateWizardProps) {
  const router = useRouter();
  const { draft, updateDraft, clearDraft } = useEngagementWizardDraft();
  const [errors, setErrors] = useState<WizardFieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const steps: WizardStepDefinition[] = useMemo(
    () => [
      { id: "general", label: labels.stepGeneral },
      { id: "client", label: labels.stepClient },
      { id: "reporting", label: labels.stepReporting },
      { id: "team", label: labels.stepTeam },
      { id: "dates", label: labels.stepDates },
      { id: "notes", label: labels.stepNotes },
      { id: "review", label: labels.stepReview },
    ],
    [labels],
  );

  const basePath = `/${locale}/app/engagements`;

  const setField = <K extends keyof EngagementWizardDraft>(
    key: K,
    value: EngagementWizardDraft[K],
  ) => {
    updateDraft({ [key]: value });
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      delete next.submit;
      return next;
    });
  };

  const goToStep = (step: EngagementWizardStep) => {
    updateDraft({ step });
    setErrors({});
    setSubmitError(null);
  };

  const validateCurrentStep = (step: EngagementWizardStep = draft.step) => {
    const nextErrors = validateWizardStep(step, draft);
    setErrors(nextErrors);
    return !hasWizardFieldErrors(nextErrors);
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (draft.step < 7) {
      goToStep((draft.step + 1) as EngagementWizardStep);
    }
  };

  const handleBack = () => {
    if (draft.step > 1) {
      goToStep((draft.step - 1) as EngagementWizardStep);
    }
  };

  const handleSubmit = () => {
    if (!validateCurrentStep(7)) {
      return;
    }

    startTransition(async () => {
      setSubmitError(null);
      const result = await createEngagementAction(draftToCreateEngagementInput(draft));

      if (!result.success) {
        setSubmitError(result.error.message);
        return;
      }

      clearDraft();
      router.push(`${basePath}/${result.data.slug}`);
      router.refresh();
    });
  };

  const handleWizardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && draft.step < 7) {
      event.preventDefault();
      handleNext();
    }
    if (event.key === "Escape" && draft.step > 1) {
      event.preventDefault();
      handleBack();
    }
  };

  const selectedCompany = companyOptions.find((company) => company.id === draft.companyId);

  return (
    <EngagementPageShell>
      <EngagementBreadcrumb
        items={[
          { label: labels.breadcrumbEngagements, href: basePath },
          { label: labels.breadcrumbCreate },
        ]}
        className="mb-4"
      />

      <WizardShell
        title={labels.title}
        description={labels.subtitle}
        footer={
          <WizardNavigation
            backLabel={labels.back}
            nextLabel={draft.step === 7 ? labels.createEngagement : labels.continue}
            onBack={draft.step > 1 ? handleBack : undefined}
            onNext={draft.step === 7 ? handleSubmit : handleNext}
            loading={isPending}
            secondaryAction={
              <Link
                href={basePath}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {labels.cancel}
              </Link>
            }
          />
        }
      >
        <WizardProgress
          steps={steps}
          currentStep={draft.step}
          onStepSelect={(step) => {
            if (step < draft.step) {
              goToStep(step as EngagementWizardStep);
            }
          }}
        />

        {submitError ? <WorkspaceNoticeBanner variant="error" description={submitError} role="alert" /> : null}
        {errors.submit ? <WorkspaceNoticeBanner variant="error" description={errors.submit} role="alert" /> : null}

        <div className="relative" onKeyDown={handleWizardKeyDown}>
          <WizardStepPanel
            title={labels.stepGeneralTitle}
            description={labels.stepGeneralDescription}
            visible={draft.step === 1}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <WizardField label={labels.name} htmlFor="name" error={errors.name}>
                <Input
                  id="name"
                  name="name"
                  value={draft.name}
                  onChange={(event) => setField("name", event.target.value)}
                  error={errors.name}
                  autoFocus
                />
              </WizardField>
              <WizardField
                label={labels.engagementCode}
                htmlFor="engagementCode"
                hint={labels.optional}
              >
                <Input
                  id="engagementCode"
                  value={draft.engagementCode}
                  onChange={(event) => setField("engagementCode", event.target.value)}
                />
              </WizardField>
              <WizardField label={labels.engagementType} htmlFor="engagementType">
                <select
                  id="engagementType"
                  value={draft.engagementType}
                  onChange={(event) =>
                    setField("engagementType", event.target.value as EngagementWizardDraft["engagementType"])
                  }
                  className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                >
                  {ENGAGEMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {labels.engagementTypes[type]}
                    </option>
                  ))}
                </select>
              </WizardField>
            </div>
          </WizardStepPanel>

          <WizardStepPanel
            title={labels.stepClientTitle}
            description={labels.stepClientDescription}
            visible={draft.step === 2}
          >
            <WizardField label={labels.clientCompany} htmlFor="companyId" error={errors.companyId}>
              <select
                id="companyId"
                value={draft.companyId}
                onChange={(event) => setField("companyId", event.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              >
                <option value="">{labels.selectClient}</option>
                {companyOptions.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </WizardField>
          </WizardStepPanel>

          <WizardStepPanel
            title={labels.stepReportingTitle}
            description={labels.stepReportingDescription}
            visible={draft.step === 3}
          >
            <WizardField label={labels.reportingFramework} htmlFor="reportingFramework">
              <select
                id="reportingFramework"
                value={draft.reportingFramework}
                onChange={(event) =>
                  setField(
                    "reportingFramework",
                    event.target.value as EngagementWizardDraft["reportingFramework"],
                  )
                }
                className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              >
                {ENGAGEMENT_REPORTING_FRAMEWORKS.map((framework) => (
                  <option key={framework} value={framework}>
                    {labels.frameworks[framework]}
                  </option>
                ))}
              </select>
            </WizardField>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <WizardField label={labels.periodStart} htmlFor="periodStart" hint={labels.optional}>
                <Input
                  id="periodStart"
                  type="date"
                  value={draft.periodStart}
                  onChange={(event) => setField("periodStart", event.target.value)}
                />
              </WizardField>
              <WizardField label={labels.periodEnd} htmlFor="periodEnd" hint={labels.optional}>
                <Input
                  id="periodEnd"
                  type="date"
                  value={draft.periodEnd}
                  onChange={(event) => setField("periodEnd", event.target.value)}
                />
              </WizardField>
            </div>
          </WizardStepPanel>

          <WizardStepPanel
            title={labels.stepTeamTitle}
            description={labels.stepTeamDescription}
            visible={draft.step === 4}
          >
            <EngagementTeamStep
              draft={draft}
              members={workspaceMembers}
              labels={labels}
              onChange={(teamMembers) => setField("teamMembers", teamMembers)}
            />
          </WizardStepPanel>

          <WizardStepPanel
            title={labels.stepDatesTitle}
            description={labels.stepDatesDescription}
            visible={draft.step === 5}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <WizardField
                label={labels.plannedStart}
                htmlFor="plannedStart"
                error={errors.plannedStart}
                hint={labels.optional}
              >
                <Input
                  id="plannedStart"
                  type="date"
                  value={draft.plannedStart}
                  onChange={(event) => setField("plannedStart", event.target.value)}
                  error={errors.plannedStart}
                />
              </WizardField>
              <WizardField
                label={labels.plannedEnd}
                htmlFor="plannedEnd"
                error={errors.plannedEnd}
                hint={labels.optional}
              >
                <Input
                  id="plannedEnd"
                  type="date"
                  value={draft.plannedEnd}
                  onChange={(event) => setField("plannedEnd", event.target.value)}
                  error={errors.plannedEnd}
                />
              </WizardField>
            </div>
          </WizardStepPanel>

          <WizardStepPanel
            title={labels.stepNotesTitle}
            description={labels.stepNotesDescription}
            visible={draft.step === 6}
          >
            <div className="space-y-4">
              <WizardField label={labels.description} htmlFor="description" hint={labels.optional}>
                <Input
                  id="description"
                  value={draft.description}
                  onChange={(event) => setField("description", event.target.value)}
                />
              </WizardField>
              <WizardField label={labels.notes} htmlFor="notes" hint={labels.optional}>
                <textarea
                  id="notes"
                  value={draft.notes}
                  onChange={(event) => setField("notes", event.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-input bg-card px-3 py-2 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                />
              </WizardField>
            </div>
          </WizardStepPanel>

          <WizardStepPanel
            title={labels.stepReviewTitle}
            description={labels.stepReviewDescription}
            visible={draft.step === 7}
          >
            <dl className="divide-y divide-border/40">
              <ReviewRow label={labels.name} value={draft.name} />
              <ReviewRow
                label={labels.engagementType}
                value={formatEngagementTypeLabel(draft.engagementType, labels.engagementTypes)}
              />
              <ReviewRow label={labels.clientCompany} value={selectedCompany?.name ?? "—"} />
              <ReviewRow
                label={labels.teamReviewLabel}
                value={
                  draft.teamMembers.length === 0
                    ? labels.teamReviewEmpty
                    : draft.teamMembers
                        .map((member) => {
                          const person = workspaceMembers.find((item) => item.userId === member.userId);
                          const roleLabel = labels.teamRoles[member.memberRole] ?? member.memberRole;
                          return `${person?.displayName ?? member.userId} (${roleLabel})`;
                        })
                        .join(", ")
                }
              />
              <ReviewRow
                label={labels.reportingFramework}
                value={formatFrameworkLabel(draft.reportingFramework, engagementsLabels)}
              />
              <ReviewRow label={labels.periodStart} value={draft.periodStart || "—"} />
              <ReviewRow label={labels.periodEnd} value={draft.periodEnd || "—"} />
              <ReviewRow label={labels.plannedStart} value={draft.plannedStart || "—"} />
              <ReviewRow label={labels.plannedEnd} value={draft.plannedEnd || "—"} />
            </dl>
            <p className="mt-4 text-sm text-muted-foreground">{labels.autosaveHint}</p>
          </WizardStepPanel>
        </div>
      </WizardShell>
    </EngagementPageShell>
  );
}

function ReviewRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground sm:text-right">{value}</dd>
    </div>
  );
}
