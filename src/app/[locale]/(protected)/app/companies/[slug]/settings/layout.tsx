import type { ReactNode } from "react";
import { COMPANY_PERMISSIONS } from "@/constants/company";
import { CompanySettingsExperience } from "@/components/company/settings";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { buildCompanySettingsNavItems } from "@/lib/company/company-settings-display";
import { requireCompanyWorkspace } from "@/lib/company/company-workspace-page";
import { loadCompanyList } from "@/lib/company/load-company-list";
import { getDictionary, type Locale } from "@/i18n";

type CompanySettingsLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string; slug: string }>;
};

function buildLayoutLabels(
  labels: Awaited<ReturnType<typeof getDictionary>>["companies"]["settings"],
) {
  return {
    title: labels.title,
    description: labels.description,
    navAriaLabel: labels.navAriaLabel,
    readOnlyBadge: labels.readOnlyBadge,
    saveIdle: labels.saveIdle,
    saveSaving: labels.saveSaving,
    saveSaved: labels.saveSaved,
    saveError: labels.saveError,
    unsavedMessage: labels.unsavedMessage,
    discardLabel: labels.discardLabel,
    saveLabel: labels.saveLabel,
    savingLabel: labels.savingLabel,
    conflictTitle: labels.conflictTitle,
    conflictDescription: labels.conflictDescription,
    conflictRefresh: labels.conflictRefresh,
    conflictDiscard: labels.conflictDiscard,
  };
}

export default async function CompanySettingsRouteLayout({
  children,
  params,
}: CompanySettingsLayoutProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const settingsLabels = dictionary.companies.settings;
  const company = await requireCompanyWorkspace(slug);
  const user = await getCurrentUser();
  const canConfigure = user
    ? authorizePermissionCodes(user.permissionCodes, COMPANY_PERMISSIONS.CONFIGURE)
    : false;
  const canEdit = canConfigure && !company.isArchived;

  const listResult = await loadCompanyList();
  const parentOptions =
    listResult.ok === true
      ? listResult.items
          .filter((item) => !item.isArchived && item.id !== company.id)
          .map((item) => ({ id: item.id, name: item.legalName }))
      : [];

  return (
    <CompanySettingsExperience
      companyId={company.id}
      settingsVersion={company.settingsVersion}
      settings={company.settings}
      canEdit={canEdit}
      parentOptions={parentOptions}
      navItems={buildCompanySettingsNavItems(locale, company.slug, settingsLabels)}
      layoutLabels={buildLayoutLabels(settingsLabels)}
    >
      {children}
    </CompanySettingsExperience>
  );
}
