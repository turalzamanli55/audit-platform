import { notFound, redirect } from "next/navigation";
import { UaieUploadExperience } from "@/components/uaie";
import { CompanyWorkspaceError } from "@/components/company/workspace";
import { UAIE_PERMISSIONS } from "@/constants/uaie";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { getDictionary, type Locale } from "@/i18n";
import { loadUaieWorkspaceCached } from "@/lib/uaie/load-uaie-workspace";
import { generateCompanyWorkspaceMetadata } from "@/lib/company/company-workspace-metadata";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  return generateCompanyWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function CompanyUaieImportPage({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const labels = dictionary.uaie;
  const result = await loadUaieWorkspaceCached(slug);

  if (!result.ok) {
    if (result.reason === "not_found") notFound();
    if (result.reason === "unauthenticated") {
      redirect(`/${locale}/login`);
    }
    if (result.reason === "forbidden") {
      return (
        <CompanyWorkspaceError
          title={labels.forbiddenTitle}
          description={labels.forbiddenDescription}
        />
      );
    }
    if (result.reason === "no_workspace") {
      return (
        <CompanyWorkspaceError
          title={labels.noWorkspaceTitle}
          description={labels.noWorkspaceDescription}
        />
      );
    }
    return (
      <CompanyWorkspaceError title={labels.errorTitle} description={labels.errorDescription} />
    );
  }

  const user = await getCurrentUser();
  const canCreate = user
    ? authorizePermissionCodes(user.permissionCodes, UAIE_PERMISSIONS.CREATE)
    : false;

  return (
    <UaieUploadExperience
      locale={locale}
      companySlug={result.companySlug}
      companyId={result.companyId}
      canCreate={canCreate}
      sessions={result.sessions}
      labels={labels.upload}
      statusLabels={labels.statuses}
      erpLabels={labels.erps}
    />
  );
}
