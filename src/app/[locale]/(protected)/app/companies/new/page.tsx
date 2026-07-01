import type { Metadata } from "next";
import Link from "next/link";
import { COMPANIES_PATH } from "@/config/dashboard-navigation";
import { PermissionGuard } from "@/components/auth";
import { CompanyCreateWizard } from "@/components/company/create/company-create-wizard";
import { CompanyEmptyState, CompanyPageShell } from "@/components/company";
import { getDictionary, type Locale } from "@/i18n";
import { loadCompanyList } from "@/lib/company/load-company-list";

type CompanyCreatePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: CompanyCreatePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);

  return {
    title: `${dictionary.companies.create.title} | ${dictionary.common.appName}`,
    description: dictionary.companies.create.subtitle,
  };
}

export default async function CompanyCreatePage({ params }: CompanyCreatePageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const labels = dictionary.companies.create;

  const listResult = await loadCompanyList();
  const parentOptions =
    listResult.ok === true
      ? listResult.items
          .filter((company) => !company.isArchived)
          .map((company) => ({ id: company.id, name: company.legalName }))
      : [];

  return (
    <PermissionGuard
      permissionCode="company.administer"
      fallback={
        <CompanyPageShell>
          <CompanyEmptyState
            title={labels.forbiddenTitle}
            description={labels.forbiddenDescription}
            action={
              <Link
                href={`/${locale}${COMPANIES_PATH}`}
                className="inline-flex h-11 items-center rounded-xl border border-border/60 bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                {dictionary.companies.breadcrumbRoot}
              </Link>
            }
          />
        </CompanyPageShell>
      }
    >
      <CompanyCreateWizard
        locale={locale}
        labels={labels}
        parentOptions={parentOptions}
      />
    </PermissionGuard>
  );
}
