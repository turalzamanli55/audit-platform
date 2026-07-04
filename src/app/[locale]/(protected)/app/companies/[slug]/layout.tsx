import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { CompanyWorkspaceError, CompanyWorkspaceLayout } from "@/components/company/workspace";
import { getDictionary, type Locale } from "@/i18n";
import { readCompanySlugCookie } from "@/lib/auth/tenant-cookies";
import {
  buildCompanyWorkspaceNavItems,
  buildWorkspaceHeroLabels,
} from "@/lib/company/company-workspace-display";
import { loadCompanyWorkspacePage } from "@/lib/company/company-workspace-page";

type CompanyWorkspaceLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string; slug: string }>;
};

export default async function CompanyWorkspaceRouteLayout({
  children,
  params,
}: CompanyWorkspaceLayoutProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const labels = dictionary.companies.workspace;
  const [preferredCompanySlug, result] = await Promise.all([
    readCompanySlugCookie(),
    loadCompanyWorkspacePage(slug),
  ]);

  if (!result.ok) {
    if (result.reason === "not_found") {
      notFound();
    }

    const companiesLabels = dictionary.companies;

    if (result.reason === "forbidden") {
      return (
        <CompanyWorkspaceError
          title={companiesLabels.forbiddenTitle}
          description={companiesLabels.forbiddenDescription}
        />
      );
    }

    if (result.reason === "no_workspace") {
      return (
        <CompanyWorkspaceError
          title={companiesLabels.noWorkspaceTitle}
          description={companiesLabels.noWorkspaceDescription}
        />
      );
    }

    return (
      <CompanyWorkspaceError
        title={labels.errorTitle}
        description={labels.errorDescription}
      />
    );
  }

  const { company } = result;

  return (
    <CompanyWorkspaceLayout
      locale={locale}
      company={company}
      preferredCompanySlug={preferredCompanySlug}
      heroLabels={buildWorkspaceHeroLabels(labels, dictionary.companies)}
      navItems={buildCompanyWorkspaceNavItems(locale, company.slug, labels)}
      navAriaLabel={labels.navAriaLabel}
      companiesLabels={dictionary.companies}
    >
      {children}
    </CompanyWorkspaceLayout>
  );
}
