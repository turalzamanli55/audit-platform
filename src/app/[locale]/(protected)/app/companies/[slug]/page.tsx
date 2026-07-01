import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CompanyArchiveBadge,
  CompanyAvatar,
  CompanyBreadcrumb,
  CompanyHeader,
  CompanyInfoCard,
  CompanyInfoList,
  CompanyInfoRow,
  CompanyPageShell,
  CompanySection,
  CompanyStatusBadge,
} from "@/components/company";
import { getDictionary, type Locale } from "@/i18n";
import { loadCompanyBySlug } from "@/lib/company/load-company-by-slug";

type CompanyDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

function frameworkLabel(
  framework: string,
  labels: { frameworkIfrs: string; frameworkLocalGaap: string; frameworkOther: string },
): string {
  switch (framework) {
    case "IFRS":
      return labels.frameworkIfrs;
    case "LOCAL_GAAP":
      return labels.frameworkLocalGaap;
    default:
      return labels.frameworkOther;
  }
}

export async function generateMetadata({ params }: CompanyDetailPageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const result = await loadCompanyBySlug(slug);

  if (!result.ok) {
    return {
      title: `${dictionary.companies.notFoundTitle} | ${dictionary.common.appName}`,
    };
  }

  return {
    title: `${result.company.name} | ${dictionary.common.appName}`,
    description: dictionary.companies.detail.subtitle,
  };
}

export default async function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const result = await loadCompanyBySlug(slug);

  if (!result.ok) {
    if (result.reason === "not_found") {
      notFound();
    }
    notFound();
  }

  const { company } = result;
  const basePath = `/${locale}/app/companies`;

  return (
    <CompanyPageShell>
      <CompanyBreadcrumb
        items={[
          { label: dictionary.companies.breadcrumbRoot, href: basePath },
          { label: company.name },
        ]}
        className="mb-4"
      />

      <CompanyHeader
        title={company.name}
        description={dictionary.companies.detail.subtitle}
        meta={
          company.isArchived ? (
            <CompanyArchiveBadge />
          ) : (
            <CompanyStatusBadge status={company.status} />
          )
        }
      />

      <CompanySection title={dictionary.companies.detail.profileSection}>
        <CompanyInfoCard
          title={company.legalName}
          leading={<CompanyAvatar name={company.name} size="lg" />}
        >
          <CompanyInfoList>
            <CompanyInfoRow
              label={dictionary.companies.columnLegalName}
              value={company.legalName}
            />
            <CompanyInfoRow
              label={dictionary.companies.columnCountry}
              value={company.jurisdiction}
            />
            <CompanyInfoRow
              label={dictionary.companies.columnFramework}
              value={frameworkLabel(company.reportingFramework, dictionary.companies)}
            />
            <CompanyInfoRow
              label={dictionary.companies.columnUpdated}
              value={new Intl.DateTimeFormat(locale, {
                year: "numeric",
                month: "short",
                day: "numeric",
              }).format(new Date(company.updatedAt))}
            />
          </CompanyInfoList>
        </CompanyInfoCard>
      </CompanySection>
    </CompanyPageShell>
  );
}
