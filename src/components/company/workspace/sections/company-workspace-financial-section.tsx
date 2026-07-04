import type { Dictionary } from "@/i18n/get-dictionary";
import type { CompanyWorkspaceView } from "@/lib/company/company-workspace-view";
import {
  formatEntityTypeLabel,
  formatFiscalYearEnd,
  formatFrameworkLabel,
  formatIndustryLabel,
  formatOptionalText,
} from "@/lib/company/format-company-workspace";
import { CompanyInfoCard, CompanyInfoList, CompanyInfoRow } from "@/components/company";
import { WorkspaceSectionShell } from "@/components/workspace";

type CompanyWorkspaceFinancialSectionProps = {
  company: CompanyWorkspaceView;
  labels: Dictionary["companies"]["workspace"];
  companiesLabels: Dictionary["companies"];
};

export function CompanyWorkspaceFinancialSection({
  company,
  labels,
  companiesLabels,
}: CompanyWorkspaceFinancialSectionProps) {
  const { settings } = company;
  const section = labels.sections.financial;

  return (
    <WorkspaceSectionShell
      title={section.title}
      description={section.description}
      headingId="company-workspace-financial"
    >
      <CompanyInfoCard title={section.cardTitle} description={section.cardDescription}>
        <CompanyInfoList>
          <CompanyInfoRow
            label={companiesLabels.create.reportingFramework}
            value={formatFrameworkLabel(settings.reporting_framework, companiesLabels)}
          />
          <CompanyInfoRow
            label={companiesLabels.create.functionalCurrency}
            value={settings.functional_currency}
          />
          <CompanyInfoRow
            label={companiesLabels.create.presentationCurrency}
            value={formatOptionalText(settings.presentation_currency)}
          />
          <CompanyInfoRow
            label={companiesLabels.create.fiscalYearEnd}
            value={formatFiscalYearEnd(settings, companiesLabels.create.months)}
          />
          <CompanyInfoRow
            label={companiesLabels.create.industry}
            value={formatIndustryLabel(
              settings.industry_classification,
              companiesLabels.create.industries,
            )}
          />
          <CompanyInfoRow
            label={companiesLabels.create.entityType}
            value={formatEntityTypeLabel(settings.entity_type, companiesLabels.create.entityTypes)}
          />
        </CompanyInfoList>
      </CompanyInfoCard>
    </WorkspaceSectionShell>
  );
}
