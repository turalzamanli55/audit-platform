import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { IconBriefcase, IconStar } from "@/components/ui/icons";
import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";
import type { DashboardWorkspaceCompany } from "@/lib/dashboard/load-dashboard-workspace";
import { WorkspacePanel, WorkspaceSection } from "./workspace-section";

type WorkspacePinnedProps = {
  locale: string;
  labels: DashboardWorkspaceLabels["pinned"];
  companies: DashboardWorkspaceCompany[];
  recentCompanies: DashboardWorkspaceCompany[];
  favoriteCompanies: DashboardWorkspaceCompany[];
  favoriteCompanyIds: string[];
  onToggleFavoriteCompany: (companyId: string) => void;
  onOpenCompany: (companyId: string) => void;
  personalizationLabels: DashboardWorkspaceLabels["personalization"];
  favoriteEngagementIds: string[];
  favoriteReportIds: string[];
};

function CompanyList({
  items,
  locale,
  empty,
  favoriteCompanyIds,
  onToggleFavoriteCompany,
  onOpenCompany,
  favoriteLabel,
  unfavoriteLabel,
}: {
  items: DashboardWorkspaceCompany[];
  locale: string;
  empty: string;
  favoriteCompanyIds: string[];
  onToggleFavoriteCompany: (companyId: string) => void;
  onOpenCompany: (companyId: string) => void;
  favoriteLabel: string;
  unfavoriteLabel: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{empty}</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((company) => {
        const isFavorite = favoriteCompanyIds.includes(company.id);
        return (
          <li key={company.id} className="flex items-center gap-2">
            <Link
              href={`/${locale}/app/companies/${company.slug}`}
              onClick={() => onOpenCompany(company.id)}
              className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-border/40 bg-muted/10 px-3 py-2.5 transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Avatar name={company.name} size="sm" />
              <span className="truncate text-sm font-medium">{company.name}</span>
            </Link>
            <Button
              type="button"
              size="icon"
              variant={isFavorite ? "primary" : "ghost"}
              aria-label={isFavorite ? unfavoriteLabel : favoriteLabel}
              onClick={() => onToggleFavoriteCompany(company.id)}
            >
              <IconStar width={16} height={16} />
            </Button>
          </li>
        );
      })}
    </ul>
  );
}

export function WorkspacePinned({
  locale,
  labels,
  companies,
  recentCompanies,
  favoriteCompanies,
  favoriteCompanyIds,
  onToggleFavoriteCompany,
  onOpenCompany,
  personalizationLabels,
  favoriteEngagementIds,
  favoriteReportIds,
}: WorkspacePinnedProps) {
  const recent = recentCompanies.length > 0 ? recentCompanies : companies.slice(0, 4);
  const favorites = favoriteCompanies;

  return (
    <WorkspaceSection title={labels.title}>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <WorkspacePanel className="workspace-panel">
          <h3 className="mb-4 text-sm font-medium text-foreground">{labels.recentCompanies}</h3>
          <CompanyList
            items={recent}
            locale={locale}
            empty={labels.emptyRecent}
            favoriteCompanyIds={favoriteCompanyIds}
            onToggleFavoriteCompany={onToggleFavoriteCompany}
            onOpenCompany={onOpenCompany}
            favoriteLabel={personalizationLabels.favorite}
            unfavoriteLabel={personalizationLabels.unfavorite}
          />
        </WorkspacePanel>
        <WorkspacePanel className="workspace-panel">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
            <IconStar width={16} height={16} className="text-warning" />
            {labels.favoriteCompanies}
          </h3>
          <CompanyList
            items={favorites}
            locale={locale}
            empty={labels.emptyFavorites}
            favoriteCompanyIds={favoriteCompanyIds}
            onToggleFavoriteCompany={onToggleFavoriteCompany}
            onOpenCompany={onOpenCompany}
            favoriteLabel={personalizationLabels.favorite}
            unfavoriteLabel={personalizationLabels.unfavorite}
          />
        </WorkspacePanel>
        <WorkspacePanel className="workspace-panel">
          <h3 className="mb-4 text-sm font-medium text-foreground">{labels.recentEngagements}</h3>
          {labels.engagements.length === 0 ? (
            <EmptyState title={labels.emptyEngagements} className="py-8" />
          ) : (
            <ul className="space-y-2">
              {labels.engagements.map((engagement) => (
                <li
                  key={engagement}
                  className="flex items-center gap-3 rounded-2xl border border-border/40 bg-muted/10 px-3 py-2.5 text-sm"
                >
                  <IconBriefcase width={16} height={16} className="text-muted-foreground" />
                  {engagement}
                </li>
              ))}
            </ul>
          )}
        </WorkspacePanel>
        <WorkspacePanel className="workspace-panel lg:col-span-2 xl:col-span-1">
          <h3 className="mb-4 text-sm font-medium text-foreground">
            {personalizationLabels.favoriteEngagements}
          </h3>
          <p className="text-sm text-muted-foreground">
            {favoriteEngagementIds.length > 0
              ? favoriteEngagementIds.join(", ")
              : personalizationLabels.engagementsPlaceholder}
          </p>
        </WorkspacePanel>
        <WorkspacePanel className="workspace-panel">
          <h3 className="mb-4 text-sm font-medium text-foreground">
            {personalizationLabels.favoriteReports}
          </h3>
          <p className="text-sm text-muted-foreground">
            {favoriteReportIds.length > 0
              ? favoriteReportIds.join(", ")
              : personalizationLabels.reportsPlaceholder}
          </p>
        </WorkspacePanel>
      </div>
    </WorkspaceSection>
  );
}
