import { TrialBalanceSectionPage } from "@/components/trial-balance";

type Props = { params: Promise<{ locale: string; slug: string }> };

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  return <TrialBalanceSectionPage locale={locale} engagementSlug={slug} section="validation" />;
}
