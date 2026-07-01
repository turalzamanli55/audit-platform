import Link from "next/link";
import { getDictionary, type Locale } from "@/i18n";
import { CompanyEmptyState, CompanyPageShell } from "@/components/company";

type CompaniesNotFoundProps = {
  params: Promise<{ locale: string }>;
};

export default async function CompaniesNotFound({ params }: CompaniesNotFoundProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const labels = dictionary.companies;

  return (
    <CompanyPageShell>
      <CompanyEmptyState
        title={labels.notFoundTitle}
        description={labels.notFoundDescription}
        action={
          <Link
            href={`/${locale}/app/companies`}
            className="inline-flex h-11 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {labels.breadcrumbRoot}
          </Link>
        }
      />
    </CompanyPageShell>
  );
}
