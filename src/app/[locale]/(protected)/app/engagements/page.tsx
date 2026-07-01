import type { Metadata } from "next";
import { ENGAGEMENTS_NEW_PATH } from "@/config/dashboard-navigation";
import { getDictionary, type Locale } from "@/i18n";
import { applyEngagementListQuery, parseEngagementListQuery } from "@/lib/engagement/apply-list-query";
import { loadEngagementList } from "@/lib/engagement/load-engagement-list";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { ENGAGEMENT_PERMISSIONS } from "@/constants/engagement";
import { EngagementListExperience } from "@/components/engagement/engagement-list-experience";
import { EngagementEmptyState, EngagementErrorState, EngagementPageShell } from "@/components/engagement";

type EngagementsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: EngagementsPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);

  return {
    title: `${dictionary.engagements.title} | ${dictionary.common.appName}`,
    description: dictionary.engagements.subtitle,
  };
}

export default async function EngagementsPage({ params, searchParams }: EngagementsPageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const labels = dictionary.engagements;
  const resolvedSearchParams = await searchParams;
  const query = parseEngagementListQuery(resolvedSearchParams);
  const result = await loadEngagementList();

  if (!result.ok) {
    if (result.reason === "forbidden") {
      return (
        <EngagementPageShell>
          <EngagementErrorState
            title={labels.forbiddenTitle}
            description={labels.forbiddenDescription}
          />
        </EngagementPageShell>
      );
    }

    if (result.reason === "no_workspace") {
      return (
        <EngagementPageShell>
          <EngagementEmptyState
            title={labels.noWorkspaceTitle}
            description={labels.noWorkspaceDescription}
          />
        </EngagementPageShell>
      );
    }

    return (
      <EngagementPageShell>
        <EngagementErrorState title={labels.errorTitle} description={labels.errorDescription} />
      </EngagementPageShell>
    );
  }

  const pagination = applyEngagementListQuery(result.items, query);
  const user = await getCurrentUser();
  const canCreate = user
    ? authorizePermissionCodes(user.permissionCodes, ENGAGEMENT_PERMISSIONS.CREATE)
    : false;

  return (
    <EngagementListExperience
      locale={locale}
      labels={labels}
      items={pagination.items}
      pagination={pagination}
      query={query}
      createHref={canCreate ? `/${locale}${ENGAGEMENTS_NEW_PATH}` : null}
    />
  );
}
