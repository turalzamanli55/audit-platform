"use client";

import { useCompanyIdentity } from "@/lib/company/use-company-identity";
import { formatDate, formatDateTime } from "@/lib/company/format-company-workspace";
import type { Dictionary } from "@/i18n/get-dictionary";
import { CompanyInfoList, CompanyInfoRow } from "@/components/company";
import { CompanySettingsGroup } from "@/components/company/settings";
import { CompanyWorkspaceSectionShell } from "@/components/company/workspace";

type CompanyIdentityVersionSectionProps = {
  locale: string;
  labels: Dictionary["companies"]["identity"];
  companiesLabels: Dictionary["companies"];
};

export function CompanyIdentityVersionSection({
  locale,
  labels,
  companiesLabels,
}: CompanyIdentityVersionSectionProps) {
  const { company } = useCompanyIdentity();
  const section = labels.sections.version;

  return (
    <CompanyWorkspaceSectionShell
      title={section.title}
      description={section.description}
      headingId="company-identity-version"
    >
      <CompanySettingsGroup title={section.groupTitle}>
        <div className="px-4 py-2 sm:px-5">
          <CompanyInfoList>
            <CompanyInfoRow
              label={section.recordVersion}
              value={String(company.version)}
            />
            <CompanyInfoRow
              label={section.settingsVersion}
              value={String(company.settingsVersion)}
            />
            <CompanyInfoRow
              label={labels.createdLabel}
              value={formatDate(company.createdAt, locale)}
            />
            <CompanyInfoRow
              label={companiesLabels.columnUpdated}
              value={formatDate(company.updatedAt, locale)}
            />
            <CompanyInfoRow
              label={labels.archivedLabel}
              value={
                company.deletedAt
                  ? formatDateTime(company.deletedAt, locale)
                  : labels.notArchived
              }
            />
            <CompanyInfoRow
              label={labels.restoredLabel}
              value={labels.restoredHint}
            />
          </CompanyInfoList>
        </div>
      </CompanySettingsGroup>
    </CompanyWorkspaceSectionShell>
  );
}
