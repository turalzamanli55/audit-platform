import { getDictionary, isValidLocale, type Locale } from "@/i18n";
import { notFound } from "next/navigation";
import {
  AiWorkspaceExperience,
  AiWorkspaceHostProvider,
} from "@/components/ai";
import { readCompanySlugCookie, readEngagementSlugCookie } from "@/lib/auth/tenant-cookies";
import { loadCompanyList } from "@/lib/company/load-company-list";
import { loadEngagementList } from "@/lib/engagement/load-engagement-list";

type AiPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AiWorkspacePage({ params }: AiPageProps) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) {
    notFound();
  }
  const locale = localeParam as Locale;
  const [dictionary, preferredCompanySlug, preferredEngagementSlug, companies, engagements] =
    await Promise.all([
      getDictionary(locale),
      readCompanySlugCookie(),
      readEngagementSlugCookie(),
      loadCompanyList(),
      loadEngagementList(),
    ]);

  const companyName = companies.ok
    ? (companies.items.find((item) => item.slug === preferredCompanySlug)?.name ?? "")
    : "";
  const engagementName = engagements.ok
    ? (engagements.items.find((item) => item.slug === preferredEngagementSlug)?.name ?? "")
    : "";

  return (
    <AiWorkspaceHostProvider
      labels={dictionary.aiWorkspace}
      companyName={companyName}
      engagementName={engagementName}
    >
      <AiWorkspaceExperience />
    </AiWorkspaceHostProvider>
  );
}
