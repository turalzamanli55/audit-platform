"use client";

import { useCompanyIdentity } from "@/lib/company/use-company-identity";
import { formatDate, formatDateTime } from "@/lib/company/format-company-workspace";
import type { Dictionary } from "@/i18n/get-dictionary";
import { CompanyInfoList, CompanyInfoRow } from "@/components/company";
import { WorkspaceCard, WorkspaceSectionShell } from "@/components/workspace";

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
    <WorkspaceSectionShell
      title={section.title}
      description={section.description}
      headingId="company-identity-version"
    >
      <WorkspaceCard title={section.groupTitle}>
        <CompanyInfoList>
          <CompanyInfoRow label={section.recordVersion} value={String(company.version)} />
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
          <CompanyInfoRow label={labels.restoredLabel} value={labels.restoredHint} />
        </CompanyInfoList>
      </WorkspaceCard>
    </WorkspaceSectionShell>
  );
}
