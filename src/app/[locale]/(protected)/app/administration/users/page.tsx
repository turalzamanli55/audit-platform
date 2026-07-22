import type { Metadata } from "next";
import { getDictionary, type Locale } from "@/i18n";
import { loadCompanyAdministration } from "@/lib/company-administration/load-company-administration";
import {
  CompanyAdministrationExperience,
  type CompanyAdministrationLabels,
} from "@/components/company-administration/company-administration-experience";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const labels = dictionary.companyAdmin;

  return {
    title: `${labels.title} | ${dictionary.common.appName}`,
    description: labels.subtitle,
  };
}

export default async function CompanyAdministrationUsersPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const labels = dictionary.companyAdmin as CompanyAdministrationLabels;
  const result = await loadCompanyAdministration();

  if (!result.ok) {
    if (result.reason === "unauthenticated") {
      return (
        <div className="mx-auto max-w-3xl px-4 py-16 text-sm text-muted-foreground">
          {dictionary.common.signInRequired}
        </div>
      );
    }
    if (result.reason === "forbidden") {
      return (
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-xl font-semibold">{dictionary.common.permissionDenied}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {dictionary.common.permissionDeniedDescription}
          </p>
        </div>
      );
    }
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-xl font-semibold">{dictionary.common.error}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{labels.subtitle}</p>
      </div>
    );
  }

  return <CompanyAdministrationExperience data={result.data} labels={labels} />;
}
