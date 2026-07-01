import { CompanyWorkspaceOverviewExperience } from "@/components/company/overview/company-workspace-overview-experience";
import { COMPANY_PERMISSIONS } from "@/constants/company";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { getDictionary, type Locale } from "@/i18n";
import { requireCompanyWorkspace } from "@/lib/company/company-workspace-page";
import { generateCompanyWorkspaceMetadata } from "@/lib/company/company-workspace-metadata";

type CompanyWorkspaceOverviewPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: CompanyWorkspaceOverviewPageProps) {
  const { locale: localeParam, slug } = await params;
  return generateCompanyWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function CompanyWorkspaceOverviewPage({
  params,
}: CompanyWorkspaceOverviewPageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const company = await requireCompanyWorkspace(slug);
  const user = await getCurrentUser();
  const canAdminister = user
    ? authorizePermissionCodes(user.permissionCodes, COMPANY_PERMISSIONS.ADMINISTER)
    : false;

  return (
    <CompanyWorkspaceOverviewExperience
      company={company}
      locale={locale}
      canAdminister={canAdminister}
      labels={dictionary.companies.workspace}
      companiesLabels={dictionary.companies}
      overviewLabels={dictionary.companies.overview}
    />
  );
}
