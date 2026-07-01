import type { Metadata } from "next";
import { COMPANIES_NEW_PATH } from "@/config/dashboard-navigation";
import { getDictionary, type Locale } from "@/i18n";
import { applyCompanyListQuery, parseCompanyListQuery } from "@/lib/company/apply-list-query";
import { loadCompanyList } from "@/lib/company/load-company-list";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { COMPANY_PERMISSIONS } from "@/constants/company";
import { CompanyListExperience } from "@/components/company/company-list-experience";
import { CompanyEmptyState, CompanyErrorState, CompanyPageShell } from "@/components/company";

type CompaniesPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: CompaniesPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);

  return {
    title: `${dictionary.companies.title} | ${dictionary.common.appName}`,
    description: dictionary.companies.subtitle,
  };
}

export default async function CompaniesPage({ params, searchParams }: CompaniesPageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const labels = dictionary.companies;
  const resolvedSearchParams = await searchParams;
  const query = parseCompanyListQuery(resolvedSearchParams);
  const result = await loadCompanyList();

  if (!result.ok) {
    if (result.reason === "forbidden") {
      return (
        <CompanyPageShell>
          <CompanyErrorState
            title={labels.forbiddenTitle}
            description={labels.forbiddenDescription}
          />
        </CompanyPageShell>
      );
    }

    if (result.reason === "no_workspace") {
      return (
        <CompanyPageShell>
          <CompanyEmptyState
            title={labels.noWorkspaceTitle}
            description={labels.noWorkspaceDescription}
          />
        </CompanyPageShell>
      );
    }

    return (
      <CompanyPageShell>
        <CompanyErrorState title={labels.errorTitle} description={labels.errorDescription} />
      </CompanyPageShell>
    );
  }

  const pagination = applyCompanyListQuery(result.items, query);
  const user = await getCurrentUser();
  const canCreate = user
    ? authorizePermissionCodes(user.permissionCodes, COMPANY_PERMISSIONS.ADMINISTER)
    : false;

  return (
    <CompanyListExperience
      locale={locale}
      labels={labels}
      items={pagination.items}
      pagination={pagination}
      query={query}
      createHref={canCreate ? `/${locale}${COMPANIES_NEW_PATH}` : null}
    />
  );
}
