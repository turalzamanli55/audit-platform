import { loadUaieIntelligenceCenterCached } from "@/lib/uaie/intelligence/load-intelligence-center";
import { getDictionary, type Locale } from "@/i18n";
import { createServerClient } from "@/lib/supabase/server";
import { UaieIntelligenceExperience } from "@/components/uaie/intelligence/uaie-intelligence-experience";
import type { UaieIntelligenceSection } from "@/lib/uaie/intelligence/intelligence-workspace-display";
import { notFound, redirect } from "next/navigation";

export async function UaieIntelligenceSectionPage(props: {
  locale: string;
  section: UaieIntelligenceSection;
}) {
  const locale = props.locale as Locale;
  const dictionary = await getDictionary(locale);
  const result = await loadUaieIntelligenceCenterCached();
  if (!result.ok) {
    if (result.reason === "unauthenticated") redirect(`/${locale}/login`);
    notFound();
  }

  const companyIds = [
    ...new Set(
      [
        ...result.sessions.map((s) => s.company_id),
        ...result.profiles.map((p) => p.company_id),
        ...result.mappings.map((m) => m.company_id),
      ].filter(Boolean) as string[],
    ),
  ];
  const companyNames: Record<string, string> = {};
  if (companyIds.length > 0) {
    const supabase = await createServerClient();
    const companies = await supabase.from("companies").select("id, name").in("id", companyIds);
    for (const company of companies.data ?? []) {
      companyNames[company.id] = company.name;
    }
  }

  return (
    <UaieIntelligenceExperience
      section={props.section}
      labels={dictionary.uaie.intelligence.ui}
      capabilities={result.capabilities}
      analytics={result.analytics}
      sessions={result.sessions}
      unknowns={result.unknowns}
      dictionary={result.dictionary}
      fingerprints={result.fingerprints}
      profiles={result.profiles}
      mappings={result.mappings}
      timeline={result.timeline}
      audit={result.audit}
      companyNames={companyNames}
    />
  );
}
