import { getDictionary, type Locale } from "@/i18n";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui";

type OnboardingPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function OnboardingPage({ params }: OnboardingPageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>{dictionary.onboarding.title}</CardTitle>
          <CardDescription>{dictionary.onboarding.subtitle}</CardDescription>
        </CardHeader>
        <OnboardingWizard
          locale={locale}
          labels={{
            stepOrganization: dictionary.onboarding.stepOrganization,
            stepWorkspace: dictionary.onboarding.stepWorkspace,
            stepComplete: dictionary.onboarding.stepComplete,
            organizationName: dictionary.onboarding.organizationName,
            workspaceName: dictionary.onboarding.workspaceName,
            continue: dictionary.onboarding.continue,
            finish: dictionary.onboarding.finish,
            error: dictionary.common.error,
            completeTitle: dictionary.onboarding.completeTitle,
            completeDescription: dictionary.onboarding.completeDescription,
          }}
        />
      </Card>
    </div>
  );
}
