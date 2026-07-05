import { getDictionary, type Locale } from "@/i18n";
import { getTenantBootstrap } from "@/lib/auth/server";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { WorkspacePanel } from "@/components/workspace";

type OnboardingPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function OnboardingPage({ params }: OnboardingPageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const bootstrap = await getTenantBootstrap();
  const resumeOrganizationId = bootstrap?.currentOrganizationId ?? null;
  const initialStep =
    bootstrap?.hasWorkspace ? 3
    : resumeOrganizationId ? 2
    : 1;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <WorkspacePanel>
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {dictionary.onboarding.title}
          </h1>
          <p className="text-sm text-muted-foreground">{dictionary.onboarding.subtitle}</p>
        </div>
        <OnboardingWizard
          locale={locale}
          initialStep={initialStep as 1 | 2 | 3}
          initialOrganizationId={resumeOrganizationId}
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
      </WorkspacePanel>
    </div>
  );
}
