import { getDictionary, type Locale } from "@/i18n";
import { UserCard } from "@/components/dashboard/user-card";
import { DashboardStat, DashboardStatsGrid } from "@/components/dashboard/dashboard-stats";
import { PermissionGuard } from "@/components/auth";

type DashboardPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{dictionary.dashboard.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{dictionary.dashboard.subtitle}</p>
      </div>

      <DashboardStatsGrid>
        <DashboardStat
          label={dictionary.dashboard.statsOrganizations}
          value="1"
          hint={dictionary.dashboard.statsPlaceholder}
        />
        <DashboardStat
          label={dictionary.dashboard.statsWorkspaces}
          value="1"
          hint={dictionary.dashboard.statsPlaceholder}
        />
        <DashboardStat
          label={dictionary.dashboard.statsMembers}
          value="—"
          hint={dictionary.dashboard.statsPlaceholder}
        />
        <DashboardStat
          label={dictionary.dashboard.statsActivity}
          value="—"
          hint={dictionary.dashboard.statsPlaceholder}
        />
      </DashboardStatsGrid>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <PermissionGuard permissionCode="organization.read">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold">{dictionary.dashboard.welcomeTitle}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{dictionary.dashboard.welcomeDescription}</p>
          </div>
        </PermissionGuard>

        <UserCard
          labels={{
            title: dictionary.dashboard.userCardTitle,
            roles: dictionary.dashboard.roles,
            permissions: dictionary.dashboard.permissions,
            signOut: dictionary.auth.signOut,
          }}
        />
      </div>
    </div>
  );
}
