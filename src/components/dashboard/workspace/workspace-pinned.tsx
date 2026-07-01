import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { IconBriefcase, IconStar } from "@/components/ui/icons";
import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";
import type { DashboardWorkspaceCompany } from "@/lib/dashboard/load-dashboard-workspace";
import { WorkspacePanel, WorkspaceSection } from "./workspace-section";

type WorkspacePinnedProps = {
  locale: string;
  labels: DashboardWorkspaceLabels["pinned"];
  companies: DashboardWorkspaceCompany[];
};

function CompanyList({
  items,
  locale,
  empty,
}: {
  items: DashboardWorkspaceCompany[];
  locale: string;
  empty: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{empty}</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((company) => (
        <li key={company.id}>
          <Link
            href={`/${locale}/app/companies/${company.slug}`}
            className="flex items-center gap-3 rounded-2xl border border-border/40 bg-muted/10 px-3 py-2.5 transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Avatar name={company.name} size="sm" />
            <span className="truncate text-sm font-medium">{company.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function WorkspacePinned({ locale, labels, companies }: WorkspacePinnedProps) {
  const recent = companies.slice(0, 4);
  const favorites = companies.slice(0, 2);

  return (
    <WorkspaceSection title={labels.title}>
      <div className="grid gap-4 lg:grid-cols-3">
        <WorkspacePanel>
          <h3 className="mb-4 text-sm font-medium text-foreground">{labels.recentCompanies}</h3>
          <CompanyList items={recent} locale={locale} empty={labels.emptyRecent} />
        </WorkspacePanel>
        <WorkspacePanel>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
            <IconStar width={16} height={16} className="text-warning" />
            {labels.favoriteCompanies}
          </h3>
          <CompanyList items={favorites} locale={locale} empty={labels.emptyFavorites} />
        </WorkspacePanel>
        <WorkspacePanel>
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
      </div>
    </WorkspaceSection>
  );
}
