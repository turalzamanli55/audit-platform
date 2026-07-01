import {
  CompanyIdentityClassificationSection,
  CompanyIdentityExperience,
  CompanyIdentityLegalSection,
  CompanyIdentityLifecycleSection,
  CompanyIdentityRegistrationSection,
  CompanyIdentityStatusSection,
  CompanyIdentityVersionSection,
} from "@/components/company/identity";
import { COMPANY_PERMISSIONS } from "@/constants/company";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { getDictionary, type Locale } from "@/i18n";
import { loadCompanyList } from "@/lib/company/load-company-list";
import { requireCompanyWorkspace } from "@/lib/company/company-workspace-page";
import { generateCompanyWorkspaceMetadata } from "@/lib/company/company-workspace-metadata";

type CompanyIdentityPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: CompanyIdentityPageProps) {
  const { locale: localeParam, slug } = await params;
  return generateCompanyWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function CompanyIdentityPage({ params }: CompanyIdentityPageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const identityLabels = dictionary.companies.identity;
  const company = await requireCompanyWorkspace(slug);
  const user = await getCurrentUser();
  const canAdminister = user
    ? authorizePermissionCodes(user.permissionCodes, COMPANY_PERMISSIONS.ADMINISTER)
    : false;
  const canConfigure = user
    ? authorizePermissionCodes(user.permissionCodes, COMPANY_PERMISSIONS.CONFIGURE)
    : false;

  const listResult = await loadCompanyList();
  const parentOptions =
    listResult.ok === true
      ? listResult.items
          .filter((item) => !item.isArchived && item.id !== company.id)
          .map((item) => ({ id: item.id, name: item.legalName }))
      : [];

  return (
    <CompanyIdentityExperience
      company={company}
      locale={locale}
      canAdminister={canAdminister}
      canConfigure={canConfigure}
      parentOptions={parentOptions}
      labels={identityLabels}
    >
      <div className="space-y-10">
        <CompanyIdentityLegalSection
          labels={identityLabels}
          createLabels={dictionary.companies.create}
        />
        <CompanyIdentityRegistrationSection
          labels={identityLabels}
          createLabels={dictionary.companies.create}
        />
        <CompanyIdentityClassificationSection
          labels={identityLabels}
          createLabels={dictionary.companies.create}
        />
        <CompanyIdentityStatusSection
          labels={identityLabels}
          companiesLabels={dictionary.companies}
        />
        <CompanyIdentityVersionSection
          locale={locale}
          labels={identityLabels}
          companiesLabels={dictionary.companies}
        />
        <CompanyIdentityLifecycleSection labels={identityLabels} />
      </div>
    </CompanyIdentityExperience>
  );
}
