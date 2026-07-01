import type { CompanyActivityView } from "@/lib/company/load-company-activity";
import type { CompanyWorkspaceView } from "@/lib/company/company-workspace-view";
import type { Dictionary } from "@/i18n/get-dictionary";
import { CompanyInfoCard, CompanyInfoList, CompanyInfoRow } from "@/components/company";
import { formatDate, formatDateTime } from "@/lib/company/format-company-workspace";
import { CompanyWorkspaceSectionShell } from "@/components/company/workspace";
import { CompanyAuditSummary } from "./company-audit-summary";
import { CompanyActivityTimeline } from "./company-activity-timeline";

type CompanyHistoryExperienceProps = {
  company: CompanyWorkspaceView;
  activity: CompanyActivityView;
  locale: string;
  labels: Dictionary["companies"]["history"];
  companiesLabels: Dictionary["companies"];
};

export function CompanyHistoryExperience({
  company,
  activity,
  locale,
  labels,
  companiesLabels,
}: CompanyHistoryExperienceProps) {
  return (
    <div className="space-y-10">
      <CompanyWorkspaceSectionShell
        title={labels.title}
        description={labels.description}
        headingId="company-workspace-history"
      >
        <CompanyAuditSummary summary={activity.summary} labels={labels.summary} />
      </CompanyWorkspaceSectionShell>

      <CompanyActivityTimeline
        entries={activity.entries}
        locale={locale}
        labels={labels.timeline}
      />

      <CompanyWorkspaceSectionShell
        title={labels.version.title}
        description={labels.version.description}
        headingId="company-history-version"
      >
        <CompanyInfoCard title={labels.version.cardTitle}>
          <CompanyInfoList>
            <CompanyInfoRow label={labels.version.recordVersion} value={String(company.version)} />
            <CompanyInfoRow
              label={labels.version.settingsVersion}
              value={String(company.settingsVersion)}
            />
            <CompanyInfoRow
              label={labels.version.created}
              value={formatDate(company.createdAt, locale)}
            />
            <CompanyInfoRow
              label={companiesLabels.columnUpdated}
              value={formatDate(company.updatedAt, locale)}
            />
            <CompanyInfoRow
              label={labels.version.archived}
              value={
                company.deletedAt
                  ? formatDateTime(company.deletedAt, locale)
                  : labels.version.notArchived
              }
            />
            <CompanyInfoRow
              label={labels.version.restored}
              value={labels.version.restoredHint}
            />
          </CompanyInfoList>
        </CompanyInfoCard>
      </CompanyWorkspaceSectionShell>
    </div>
  );
}
