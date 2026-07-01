"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateCompanyAction } from "@/lib/actions/company/update-company";
import type { CompanyWorkspaceView } from "@/lib/company/company-workspace-view";
import type { Dictionary } from "@/i18n/get-dictionary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui";
import {
  buildOverviewMetadataItems,
  buildOverviewSummaryCards,
} from "@/lib/company/company-workspace-display";
import { formatOptionalText } from "@/lib/company/format-company-workspace";
import { CompanyWorkspaceMetadataPanel } from "@/components/company/workspace/company-workspace-metadata-panel";
import { CompanyWorkspaceSectionShell } from "@/components/company/workspace/company-workspace-section-shell";
import { CompanyWorkspaceSummaryCards } from "@/components/company/workspace/company-workspace-summary-cards";

type CompanyWorkspaceOverviewExperienceProps = {
  company: CompanyWorkspaceView;
  locale: string;
  canAdminister: boolean;
  labels: Dictionary["companies"]["workspace"];
  companiesLabels: Dictionary["companies"];
  overviewLabels: Dictionary["companies"]["overview"];
};

export function CompanyWorkspaceOverviewExperience({
  company: initialCompany,
  locale,
  canAdminister,
  labels,
  companiesLabels,
  overviewLabels,
}: CompanyWorkspaceOverviewExperienceProps) {
  const router = useRouter();
  const [company, setCompany] = useState(initialCompany);
  const [description, setDescription] = useState(initialCompany.description ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const summaryCards = buildOverviewSummaryCards(company, locale, labels, companiesLabels);
  const metadataItems = buildOverviewMetadataItems(company, locale, labels, companiesLabels);
  const isDirty = description !== (company.description ?? "");
  const canEdit = canAdminister && !company.isArchived;

  const saveDescription = () => {
    startTransition(async () => {
      setError(null);
      const result = await updateCompanyAction({
        companyId: company.id,
        version: company.version,
        description: description.trim() || null,
      });

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      setCompany((current) => ({
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
      <CompanyWorkspaceSectionShell
        title={labels.sections.overview.title}
        description={labels.sections.overview.description}
        headingId="company-workspace-overview"
      >
        <CompanyWorkspaceSummaryCards cards={summaryCards} />
      </CompanyWorkspaceSectionShell>

      <CompanyWorkspaceSectionShell
        title={labels.sections.overview.highlightsTitle}
        description={labels.sections.overview.highlightsDescription}
        headingId="company-workspace-highlights"
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
                {companiesLabels.create.description}
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
                    setDescription(company.description ?? "");
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
                {company.description?.trim()
                  ? company.description
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
                {companiesLabels.create.tradeName}
              </dt>
              <dd className="text-sm text-foreground">
                {formatOptionalText(company.settings.branding?.trade_name)}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {labels.summaryIndustry}
              </dt>
              <dd className="text-sm text-foreground">
                {companiesLabels.create.industries[company.settings.industry_classification]}
              </dd>
            </div>
          </dl>
        </div>
      </CompanyWorkspaceSectionShell>

      <CompanyWorkspaceMetadataPanel
        title={labels.metadataTitle}
        description={labels.metadataDescription}
        items={metadataItems}
      />
    </div>
  );
}
