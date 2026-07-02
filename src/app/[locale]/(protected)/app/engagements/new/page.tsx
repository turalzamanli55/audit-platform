import type { Metadata } from "next";
import Link from "next/link";
import { ENGAGEMENTS_PATH } from "@/config/dashboard-navigation";
import { PermissionGuard } from "@/components/auth";
import { EngagementCreateWizard } from "@/components/engagement/create/engagement-create-wizard";
import { EngagementEmptyState, EngagementPageShell } from "@/components/engagement";
import { ENGAGEMENT_PERMISSIONS } from "@/constants/engagement";
import { getDictionary, type Locale } from "@/i18n";
import { loadCompanyList } from "@/lib/company/load-company-list";
import { loadWorkspaceMemberDirectory } from "@/lib/engagement/load-workspace-member-directory";

type EngagementCreatePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: EngagementCreatePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);

  return {
    title: `${dictionary.engagements.create.title} | ${dictionary.common.appName}`,
    description: dictionary.engagements.create.subtitle,
  };
}

export default async function EngagementCreatePage({ params }: EngagementCreatePageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const labels = dictionary.engagements.create;

  const [listResult, memberDirectoryResult] = await Promise.all([
    loadCompanyList(),
    loadWorkspaceMemberDirectory(),
  ]);
  const companyOptions =
    listResult.ok === true
      ? listResult.items
          .filter((company) => !company.isArchived)
          .map((company) => ({ id: company.id, name: company.name }))
      : [];
  const workspaceMembers = memberDirectoryResult.ok ? memberDirectoryResult.items : [];

  return (
    <PermissionGuard
      permissionCode={ENGAGEMENT_PERMISSIONS.CREATE}
      fallback={
        <EngagementPageShell>
          <EngagementEmptyState
            title={labels.forbiddenTitle}
            description={labels.forbiddenDescription}
            action={
              <Link
                href={`/${locale}${ENGAGEMENTS_PATH}`}
                className="inline-flex h-11 items-center rounded-xl border border-border/60 bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                {dictionary.engagements.breadcrumbRoot}
              </Link>
            }
          />
        </EngagementPageShell>
      }
    >
      <EngagementCreateWizard
        locale={locale}
        labels={labels}
        companyOptions={companyOptions}
        workspaceMembers={workspaceMembers}
        engagementsLabels={dictionary.engagements}
      />
    </PermissionGuard>
  );
}
