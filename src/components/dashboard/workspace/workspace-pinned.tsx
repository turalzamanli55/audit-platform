import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { WorkspaceEmpty } from "@/components/workspace";
import { IconBriefcase, IconStar } from "@/components/ui/icons";
import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";
import type { DashboardEngagementPreview } from "@/lib/dashboard/load-dashboard-feed";
import type { DashboardWorkspaceCompany } from "@/lib/dashboard/load-dashboard-workspace";
import { workspaceTokens } from "@/components/workspace";
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
  recentEngagements: DashboardEngagementPreview[];
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
              className={workspaceTokens.listRow}
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
  recentEngagements,
}: WorkspacePinnedProps) {
  const recent = recentCompanies.length > 0 ? recentCompanies : companies.slice(0, 4);
  const favorites = favoriteCompanies;
  const recentLabel =
    recentCompanies.length > 0 ? labels.recentCompanies : labels.allCompanies ?? labels.recentCompanies;

  return (
    <WorkspaceSection title={labels.title}>
      <div className="grid gap-4 lg:grid-cols-3">
        <WorkspacePanel className="workspace-panel">
          <h3 className="mb-4 text-sm font-medium text-foreground">{recentLabel}</h3>
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
          {recentEngagements.length === 0 ? (
            <WorkspaceEmpty title={labels.emptyEngagements} />
          ) : (
            <ul className="space-y-2">
              {recentEngagements.map((engagement) => (
                <li key={engagement.id}>
                  <Link
                    href={`/${locale}/app/engagements/${engagement.slug}`}
                    className={workspaceTokens.listRow}
                  >
                    <IconBriefcase width={16} height={16} className="shrink-0 text-muted-foreground" />
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-foreground">{engagement.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">{engagement.companyName}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </WorkspacePanel>
      </div>
    </WorkspaceSection>
  );
}
