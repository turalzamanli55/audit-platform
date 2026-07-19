import { notFound } from "next/navigation";
import Link from "next/link";
import { loadCompanyDetail } from "@/lib/platform-console/detail-data";
import { loadOrganizationOptions } from "@/lib/platform-console/data";
import { PlatformPageHeader } from "@/components/platform-console/platform-primitives";
import { CompanyDetail } from "@/components/platform-console/company-detail";
import { getPlatformLabels, fillPlatform } from "@/i18n/platform-labels";

export const dynamic = "force-dynamic";

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = getPlatformLabels(locale);
  const [company, organizations] = await Promise.all([loadCompanyDetail(id), loadOrganizationOptions()]);

  if (!company) {
    notFound();
  }

  const basePath = `/${locale}/app/platform`;

  return (
    <div className="space-y-6">
      <Link href={`${basePath}/tenants`} className="text-sm text-muted-foreground hover:text-foreground">
        {t.pages.companyDetailPage.back}
      </Link>
      <PlatformPageHeader
        eyebrow={t.eyebrow}
        title={company.name}
        description={fillPlatform(t.pages.companyDetailPage.description, { slug: company.slug })}
      />
      <CompanyDetail company={company} organizations={organizations} basePath={basePath} />
    </div>
  );
}
