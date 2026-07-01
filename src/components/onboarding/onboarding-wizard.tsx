"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createOrganizationAction } from "@/lib/actions/onboarding/create-organization";
import { createWorkspaceAction } from "@/lib/actions/onboarding/create-workspace";
import { Button, Input, Label, Alert } from "@/components/ui";

type OnboardingWizardProps = {
  locale: string;
  initialStep?: 1 | 2 | 3;
  initialOrganizationId?: string | null;
  labels: {
    stepOrganization: string;
    stepWorkspace: string;
    stepComplete: string;
    organizationName: string;
    workspaceName: string;
    continue: string;
    finish: string;
    error: string;
    completeTitle: string;
    completeDescription: string;
  };
};

export function OnboardingWizard({
  locale,
  initialStep = 1,
  initialOrganizationId = null,
  labels,
}: OnboardingWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(initialStep);
  const [organizationId, setOrganizationId] = useState<string | null>(initialOrganizationId);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleOrganizationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      setError(null);
      const result = await createOrganizationAction({
        name: String(formData.get("organizationName") ?? ""),
      });

      if (!result.success) {
        setError(result.error.message ?? labels.error);
        return;
      }

      setOrganizationId(result.data.organizationId);
      setStep(2);
    });
  }

  function handleWorkspaceSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!organizationId) return;
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      setError(null);
      const result = await createWorkspaceAction({
        organizationId,
        name: String(formData.get("workspaceName") ?? ""),
      });

      if (!result.success) {
        setError(result.error.message ?? labels.error);
        return;
      }

      setStep(3);
    });
  }

  function handleComplete() {
    router.push(`/${locale}/app/dashboard`);
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className={step === 1 ? "font-semibold text-foreground" : ""}>1. {labels.stepOrganization}</span>
        <span>→</span>
        <span className={step === 2 ? "font-semibold text-foreground" : ""}>2. {labels.stepWorkspace}</span>
        <span>→</span>
        <span className={step === 3 ? "font-semibold text-foreground" : ""}>3. {labels.stepComplete}</span>
      </div>

      {error ? <Alert variant="error">{error}</Alert> : null}

      {step === 1 ? (
        <form className="space-y-4" onSubmit={handleOrganizationSubmit}>
          <div className="space-y-2">
            <Label htmlFor="organizationName" required>
              {labels.organizationName}
            </Label>
            <Input id="organizationName" name="organizationName" required />
          </div>
          <Button type="submit" loading={isPending}>
            {labels.continue}
          </Button>
        </form>
      ) : null}

      {step === 2 ? (
        <form className="space-y-4" onSubmit={handleWorkspaceSubmit}>
          <div className="space-y-2">
            <Label htmlFor="workspaceName" required>
              {labels.workspaceName}
            </Label>
            <Input id="workspaceName" name="workspaceName" required />
          </div>
          <Button type="submit" loading={isPending}>
            {labels.continue}
          </Button>
        </form>
      ) : null}

      {step === 3 ? (
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">{labels.completeTitle}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{labels.completeDescription}</p>
          </div>
          <Button onClick={handleComplete}>{labels.finish}</Button>
        </div>
      ) : null}
    </div>
  );
}
