import { UaieIntelligenceSectionPage } from "@/components/uaie/intelligence/uaie-intelligence-section-page";

type Props = { params: Promise<{ locale: string }> };

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <UaieIntelligenceSectionPage locale={locale} section="fingerprints" />;
}
