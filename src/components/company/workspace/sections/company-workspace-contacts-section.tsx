import type { Dictionary } from "@/i18n/get-dictionary";
import type { CompanyWorkspaceView } from "@/lib/company/company-workspace-view";
import { formatContact, formatOptionalText } from "@/lib/company/format-company-workspace";
import { CompanyInfoCard, CompanyInfoList, CompanyInfoRow } from "@/components/company";
import { CompanyWorkspaceEmptySection } from "../company-workspace-empty-section";
import { CompanyWorkspaceSectionShell } from "../company-workspace-section-shell";

type CompanyWorkspaceContactsSectionProps = {
  company: CompanyWorkspaceView;
  labels: Dictionary["companies"]["workspace"];
  companiesLabels: Dictionary["companies"];
};

export function CompanyWorkspaceContactsSection({
  company,
  labels,
  companiesLabels,
}: CompanyWorkspaceContactsSectionProps) {
  const section = labels.sections.contacts;
  const finance = company.settings.primary_finance_contact;
  const auditor = company.settings.external_auditor_contact;
  const hasFinance = Boolean(formatContact(finance));
  const hasAuditor = Boolean(formatContact(auditor));

  return (
    <CompanyWorkspaceSectionShell
      title={section.title}
      description={section.description}
      headingId="company-workspace-contacts"
    >
      {hasFinance || hasAuditor ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <CompanyInfoCard title={companiesLabels.create.financeContactSection}>
            {hasFinance ? (
              <CompanyInfoList>
                <CompanyInfoRow
                  label={companiesLabels.create.contactName}
                  value={formatOptionalText(finance?.name)}
                />
                <CompanyInfoRow
                  label={companiesLabels.create.contactTitle}
                  value={formatOptionalText(finance?.title)}
                />
                <CompanyInfoRow
                  label={companiesLabels.create.contactEmail}
                  value={formatOptionalText(finance?.email)}
                />
                <CompanyInfoRow
                  label={companiesLabels.create.contactPhone}
                  value={formatOptionalText(finance?.phone)}
                />
              </CompanyInfoList>
            ) : (
              <CompanyWorkspaceEmptySection
                title={section.financeEmptyTitle}
                description={section.financeEmptyDescription}
                className="min-h-[10rem] border-0 bg-transparent"
              />
            )}
          </CompanyInfoCard>

          <CompanyInfoCard title={companiesLabels.create.auditorContactSection}>
            {hasAuditor ? (
              <CompanyInfoList>
                <CompanyInfoRow
                  label={companiesLabels.create.contactName}
                  value={formatOptionalText(auditor?.name)}
                />
                <CompanyInfoRow
                  label={companiesLabels.create.contactTitle}
                  value={formatOptionalText(auditor?.title)}
                />
                <CompanyInfoRow
                  label={companiesLabels.create.contactEmail}
                  value={formatOptionalText(auditor?.email)}
                />
                <CompanyInfoRow
                  label={companiesLabels.create.contactPhone}
                  value={formatOptionalText(auditor?.phone)}
                />
              </CompanyInfoList>
            ) : (
              <CompanyWorkspaceEmptySection
                title={section.auditorEmptyTitle}
                description={section.auditorEmptyDescription}
                className="min-h-[10rem] border-0 bg-transparent"
              />
            )}
          </CompanyInfoCard>
        </div>
      ) : (
        <CompanyWorkspaceEmptySection
          title={section.emptyTitle}
          description={section.emptyDescription}
        />
      )}
    </CompanyWorkspaceSectionShell>
  );
}
