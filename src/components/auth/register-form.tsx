"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUpAction } from "@/lib/actions/auth/sign-up";
import { Button, Input, Label } from "@/components/ui";
import { AUTH_ROUTES } from "@/config/auth";
import type { AuthExperienceLabels } from "@/i18n/auth-experience-types";
import {
  AuthBenefits,
  AuthCard,
  AuthError,
  AuthFooter,
  AuthHeader,
  AuthPasswordInput,
  AuthPasswordRequirements,
  AuthPasswordStrength,
  AuthProgress,
  AuthStatusPanel,
  AuthSuccess,
  AuthTermsReminder,
} from "@/components/auth/ui";

type RegisterFormProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    fullName: string;
    email: string;
    password: string;
    submit: string;
    loginPrompt: string;
    loginLink: string;
    error: string;
    verification: string;
  };
  experience: AuthExperienceLabels;
};

export function RegisterForm({ locale, labels, experience }: RegisterFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      setError(null);
      setVerificationMessage(null);

      const result = await signUpAction({
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        fullName: String(formData.get("fullName") ?? ""),
        locale,
      });

      if (!result.success) {
        setError(result.error.message ?? labels.error);
        return;
      }

      if (result.data.requiresVerification) {
        setVerificationMessage(labels.verification);
        router.push(`/${locale}${AUTH_ROUTES.verifyEmail}?email=${encodeURIComponent(result.data.email)}`);
        return;
      }

      router.push(`/${locale}/app/onboarding`);
      router.refresh();
    });
  }

  return (
    <AuthCard className="w-full max-w-lg">
      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <AuthHeader
          title={labels.title}
          subtitle={labels.subtitle}
          eyebrow={experience.register.stepLabel}
        >
          <AuthProgress label={experience.register.stepLabel} value={50} max={100} />
        </AuthHeader>

        {error ? <AuthError message={error} /> : null}
        {verificationMessage ? <AuthSuccess title={experience.status.accountCreated} description={verificationMessage} /> : null}

        <div className="space-y-2">
          <Label htmlFor="fullName" required>
            {labels.fullName}
          </Label>
          <Input id="fullName" name="fullName" autoComplete="name" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" required>
            {labels.email}
          </Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>

        <div className="space-y-3">
          <AuthPasswordInput
            id="password"
            name="password"
            label={labels.password}
            showLabel={experience.common.showPassword}
            hideLabel={experience.common.hidePassword}
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onValueChange={setPassword}
          />
          <AuthPasswordStrength password={password} labels={experience.passwordStrength} />
          <AuthPasswordRequirements
            title={experience.register.requirementsTitle}
            items={experience.register.requirements}
            password={password}
          />
        </div>

        <AuthStatusPanel variant="info" title={experience.register.verificationNote} />

        <div className="rounded-2xl border border-border/40 bg-muted/15 p-4 lg:hidden">
          <AuthBenefits items={experience.register.benefits} />
        </div>

        <Button type="submit" className="w-full" size="lg" loading={isPending}>
          {labels.submit}
        </Button>

        <AuthTermsReminder
          prefix={experience.common.termsPrefix}
          termsLink={experience.common.termsLink}
          privacyLink={experience.common.privacyLink}
          and={experience.common.and}
          locale={locale}
        />

        <AuthFooter>
          {labels.loginPrompt}{" "}
          <Link href={`/${locale}${AUTH_ROUTES.login}`} className="text-primary hover:underline">
            {labels.loginLink}
          </Link>
        </AuthFooter>
      </form>
    </AuthCard>
  );
}
