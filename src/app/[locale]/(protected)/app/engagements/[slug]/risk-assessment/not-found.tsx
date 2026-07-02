import { getDictionary, type Locale } from "@/i18n";
import { RiskAssessmentWorkspaceError } from "@/components/risk-assessment";

export default async function RiskAssessmentNotFound({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const dictionary = await getDictionary(localeParam as Locale);
  return (
    <RiskAssessmentWorkspaceError
      title={dictionary.riskAssessment.notFoundTitle}
      description={dictionary.riskAssessment.notFoundDescription}
    />
  );
}
