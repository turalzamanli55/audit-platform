import {
  CompanyArchiveBadge,
  CompanyAvatar,
  CompanyBreadcrumb,
  CompanyRestoreBanner,
  CompanyStatusBadge,
} from "@/components/company";
import { Badge } from "@/components/ui/badge";
import { WorkspaceHero } from "@/components/workspace";
import type { CompanyWorkspaceView } from "@/lib/company/company-workspace-view";
import { formatOptionalText } from "@/lib/company/format-company-workspace";
import type { Dictionary } from "@/i18n/get-dictionary";

export type CompanyWorkspaceHeroLabels = {
  breadcrumbRoot: string;
  eyebrow: string;
  tradeName: string;
  statusActive: string;
  statusInactive: string;
  statusArchived: string;
  statusSuspended: string;
  archivedTitle: string;
  archivedDescription: string;
  backToLabel: string;
};

type CompanyWorkspaceHeroProps = {
  locale: string;
  company: CompanyWorkspaceView;
  labels: CompanyWorkspaceHeroLabels;
  companiesLabels?: Dictionary["companies"];
  className?: string;
};

function statusLabel(
  status: CompanyWorkspaceView["status"],
  labels: CompanyWorkspaceHeroLabels,
): string {
  switch (status) {
    case "active":
      return labels.statusActive;
    case "inactive":
      return labels.statusInactive;
    case "archived":
      return labels.statusArchived;
    case "suspended":
      return labels.statusSuspended;
    default:
      return status;
  }
}

export function CompanyWorkspaceHero({
  locale,
  company,
  labels,
  companiesLabels,
  className,
}: CompanyWorkspaceHeroProps) {
  const basePath = `/${locale}/app/companies`;
  const tradeName = company.settings.branding?.trade_name;
  const description =
    company.description?.trim() ||
    (tradeName && tradeName !== company.name ? `${labels.tradeName}: ${tradeName}` : null);

  return (
    <WorkspaceHero
      className={className}
      breadcrumb={
        <CompanyBreadcrumb
          backToLabel={labels.backToLabel}
          items={[
            { label: labels.breadcrumbRoot, href: basePath },
            { label: company.name },
          ]}
        />
      }
      alerts={
        company.isArchived ? (
          <CompanyRestoreBanner
            title={labels.archivedTitle}
            description={labels.archivedDescription}
          />
        ) : null
      }
      leading={<CompanyAvatar name={company.name} size="lg" className="h-14 w-14 sm:h-16 sm:w-16" />}
      eyebrow={labels.eyebrow}
      title={company.name}
      subtitle={formatOptionalText(company.legalName)}
      description={description ?? undefined}
      badges={
        <>
          {company.isArchived ? (
            <CompanyArchiveBadge label={labels.statusArchived} />
          ) : (
            <CompanyStatusBadge
              status={company.status}
              label={statusLabel(company.status, labels)}
            />
          )}
          {companiesLabels ? (
            <>
              <Badge variant="secondary" className="rounded-full text-xs">
                {companiesLabels.create.frameworks[company.settings.reporting_framework]}
              </Badge>
              <Badge variant="secondary" className="rounded-full text-xs">
                {company.settings.functional_currency}
              </Badge>
              <Badge variant="secondary" className="rounded-full text-xs">
                {company.settings.jurisdiction}
              </Badge>
            </>
          ) : null}
        </>
      }
    />
  );
}
