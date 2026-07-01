import {
  CompanyArchiveBadge,
  CompanyAvatar,
  CompanyBreadcrumb,
  CompanyRestoreBanner,
  CompanyStatusBadge,
} from "@/components/company";
import type { CompanyWorkspaceView } from "@/lib/company/company-workspace-view";
import { formatOptionalText } from "@/lib/company/format-company-workspace";

export type CompanyWorkspaceHeroLabels = {
  breadcrumbRoot: string;
  eyebrow: string;
  tradeName: string;
  statusActive: string;
  statusInactive: string;
  statusArchived: string;
  statusSuspended: string;
};

type CompanyWorkspaceHeroProps = {
  locale: string;
  company: CompanyWorkspaceView;
  labels: CompanyWorkspaceHeroLabels;
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

/**
 * Prominent workspace header — identity, status, and calm hierarchy.
 */
export function CompanyWorkspaceHero({
  locale,
  company,
  labels,
  className = "",
}: CompanyWorkspaceHeroProps) {
  const basePath = `/${locale}/app/companies`;
  const tradeName = company.settings.branding?.trade_name;
  const description =
    company.description?.trim() ||
    (tradeName && tradeName !== company.name ? `${labels.tradeName}: ${tradeName}` : null);

  return (
    <div className={`space-y-6 ${className}`}>
      <CompanyBreadcrumb
        items={[
          { label: labels.breadcrumbRoot, href: basePath },
          { label: company.name },
        ]}
      />

      {company.isArchived ? <CompanyRestoreBanner /> : null}

      <div className="flex flex-col gap-8 border-b border-border/50 pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-5 sm:gap-6">
          <CompanyAvatar name={company.name} size="lg" className="h-14 w-14 sm:h-16 sm:w-16" />
          <div className="min-w-0 flex-1 space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {labels.eyebrow}
            </p>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-[2rem] lg:leading-tight">
                {company.name}
              </h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                {formatOptionalText(company.legalName)}
              </p>
              {description ? (
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
                  {description}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {company.isArchived ? (
                <CompanyArchiveBadge />
              ) : (
                <CompanyStatusBadge
                  status={company.status}
                  label={statusLabel(company.status, labels)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
