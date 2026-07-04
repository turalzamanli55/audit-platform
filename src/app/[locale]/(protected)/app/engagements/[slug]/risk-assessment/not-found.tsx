import { getDictionary } from "@/i18n";
import { RiskAssessmentWorkspaceError } from "@/components/risk-assessment";
import { resolveRouteLocale } from "@/lib/i18n/resolve-route-locale";

export default async function RiskAssessmentNotFound({
  params,
}: {
  params?: Promise<{ locale: string }>;
}) {
  const { locale } = await resolveRouteLocale(params);
  const dictionary = await getDictionary(locale);
  return (
    <RiskAssessmentWorkspaceError
      title={dictionary.riskAssessment.notFoundTitle}
      description={dictionary.riskAssessment.notFoundDescription}
    />
  );
}
