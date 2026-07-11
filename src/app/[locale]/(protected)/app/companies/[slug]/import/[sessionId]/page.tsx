import { notFound, redirect } from "next/navigation";
import { UaieSessionWorkspace } from "@/components/uaie";
import { CompanyWorkspaceError } from "@/components/company/workspace";
import { UAIE_PERMISSIONS } from "@/constants/uaie";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { getDictionary, type Locale } from "@/i18n";
import { loadUaieSessionCached, loadUaieWorkspaceCached } from "@/lib/uaie/load-uaie-workspace";
import { generateCompanyWorkspaceMetadata } from "@/lib/company/company-workspace-metadata";

type PageProps = {
  params: Promise<{ locale: string; slug: string; sessionId: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  return generateCompanyWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function CompanyUaieSessionPage({ params }: PageProps) {
  const { locale: localeParam, slug, sessionId } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const labels = dictionary.uaie;

  const [workspace, sessionResult] = await Promise.all([
    loadUaieWorkspaceCached(slug),
    loadUaieSessionCached(sessionId),
  ]);

  if (!workspace.ok) {
    if (workspace.reason === "not_found") notFound();
    if (workspace.reason === "unauthenticated") redirect(`/${locale}/login`);
    return (
      <CompanyWorkspaceError title={labels.errorTitle} description={labels.errorDescription} />
    );
  }

  if (!sessionResult.ok) {
    if (sessionResult.reason === "not_found") notFound();
    if (sessionResult.reason === "unauthenticated") redirect(`/${locale}/login`);
    if (sessionResult.reason === "forbidden") {
      return (
        <CompanyWorkspaceError
          title={labels.forbiddenTitle}
          description={labels.forbiddenDescription}
        />
      );
    }
    return (
      <CompanyWorkspaceError title={labels.errorTitle} description={labels.errorDescription} />
    );
  }

  if (sessionResult.session.companyId !== workspace.companyId) {
    notFound();
  }

  const user = await getCurrentUser();
  const canUpdate = user
    ? authorizePermissionCodes(user.permissionCodes, UAIE_PERMISSIONS.UPDATE)
    : false;
  const canValidate = user
    ? authorizePermissionCodes(user.permissionCodes, UAIE_PERMISSIONS.VALIDATE)
    : false;
  const canArchive = user
    ? authorizePermissionCodes(user.permissionCodes, UAIE_PERMISSIONS.ARCHIVE)
    : false;

  return (
    <UaieSessionWorkspace
      locale={locale}
      companySlug={workspace.companySlug}
      session={sessionResult.session}
      canUpdate={canUpdate}
      canValidate={canValidate}
      canArchive={canArchive}
      labels={labels.session}
      statusLabels={labels.statuses}
      erpLabels={labels.erps}
    />
  );
}
