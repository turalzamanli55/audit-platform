import { loadTrialBalanceWorkspaceCached } from "@/lib/trial-balance/load-trial-balance-workspace";
import { getDictionary, type Locale } from "@/i18n";
import { TrialBalanceExperience } from "@/components/trial-balance/trial-balance-experience";
import type { TrialBalanceWorkspaceSection } from "@/types/trial-balance";
import { notFound, redirect } from "next/navigation";

export async function TrialBalanceSectionPage(props: {
  locale: string;
  engagementSlug: string;
  section: TrialBalanceWorkspaceSection;
}) {
  const locale = props.locale as Locale;
  const dictionary = await getDictionary(locale);
  const result = await loadTrialBalanceWorkspaceCached(props.engagementSlug);

  if (!result.ok) {
    if (result.reason === "unauthenticated") redirect(`/${locale}/login`);
    if (result.reason === "not_found") notFound();
    notFound();
  }

  return (
    <TrialBalanceExperience
      section={props.section}
      engagementId={result.engagementId}
      labels={dictionary.trialBalance.ui}
      capabilities={result.capabilities}
      package={result.package}
      lines={result.lines}
      adjustments={result.adjustments}
      mappings={result.mappings}
      periods={result.periods}
      versions={result.versions}
      activity={result.activity}
      stagedImports={result.stagedImports}
    />
  );
}
