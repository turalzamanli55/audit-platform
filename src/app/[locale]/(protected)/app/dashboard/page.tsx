import { DetailLayout, PageLayout } from "@/components/layout";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <PageLayout
      title={dictionary.dashboard.title}
      description={dictionary.dashboard.subtitle}
    >
      <div className="space-y-10">
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

        <DetailLayout
          aside={
            <UserCard
              labels={{
                title: dictionary.dashboard.userCardTitle,
                roles: dictionary.dashboard.roles,
                permissions: dictionary.dashboard.permissions,
                signOut: dictionary.auth.signOut,
              }}
            />
          }
        >
          <PermissionGuard permissionCode="organization.read">
            <Card>
              <CardHeader>
                <CardTitle>{dictionary.dashboard.welcomeTitle}</CardTitle>
                <CardDescription>{dictionary.dashboard.welcomeDescription}</CardDescription>
              </CardHeader>
            </Card>
          </PermissionGuard>
        </DetailLayout>
      </div>
    </PageLayout>
  );
}
