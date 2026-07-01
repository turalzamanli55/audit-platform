import type { Dictionary } from "@/i18n/get-dictionary";
import type { CompanyWorkspaceView } from "@/lib/company/company-workspace-view";
import {
  buildOverviewMetadataItems,
  buildOverviewSummaryCards,
} from "@/lib/company/company-workspace-display";
import { formatOptionalText } from "@/lib/company/format-company-workspace";
import { CompanyWorkspaceMetadataPanel } from "./company-workspace-metadata-panel";
import { CompanyWorkspaceSectionShell } from "./company-workspace-section-shell";
import { CompanyWorkspaceSummaryCards } from "./company-workspace-summary-cards";

type CompanyWorkspaceOverviewProps = {
  company: CompanyWorkspaceView;
  locale: string;
  labels: Dictionary["companies"]["workspace"];
  companiesLabels: Dictionary["companies"];
};

/**
 * Primary workspace overview — summary cards, highlights, and metadata.
 */
export function CompanyWorkspaceOverview({
  company,
  locale,
  labels,
  companiesLabels,
}: CompanyWorkspaceOverviewProps) {
  const summaryCards = buildOverviewSummaryCards(company, locale, labels, companiesLabels);
  const metadataItems = buildOverviewMetadataItems(company, locale, labels, companiesLabels);

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
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
            {company.description?.trim()
              ? company.description
              : labels.sections.overview.noDescription}
          </p>
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
