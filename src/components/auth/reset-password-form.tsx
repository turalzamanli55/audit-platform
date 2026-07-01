"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { resetPasswordAction } from "@/lib/actions/auth/reset-password";
import { Button } from "@/components/ui";
import { AUTH_ROUTES } from "@/config/auth";
import type { AuthExperienceLabels } from "@/i18n/auth-experience-types";
import {
  AuthCard,
  AuthError,
  AuthFooter,
  AuthHeader,
  AuthPasswordInput,
  AuthPasswordRequirements,
  AuthPasswordStrength,
  AuthSuccess,
} from "@/components/auth/ui";

type ResetPasswordFormProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    password: string;
    confirmPassword: string;
    submit: string;
    success: string;
    backToLogin: string;
    error: string;
  };
  experience: AuthExperienceLabels;
};

export function ResetPasswordForm({ locale, labels, experience }: ResetPasswordFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const mismatch =
    confirmPassword.length > 0 && password !== confirmPassword
      ? experience.reset.mismatch
      : undefined;

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(() => {
      router.push(`/${locale}${AUTH_ROUTES.login}`);
      router.refresh();
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [success, locale, router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mismatch) {
      setError(mismatch);
      return;
    }

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      setError(null);
      const result = await resetPasswordAction({
        password: String(formData.get("password") ?? ""),
        confirmPassword: String(formData.get("confirmPassword") ?? ""),
      });

      if (!result.success) {
        setError(result.error.message ?? labels.error);
        return;
      }

      setSuccess(true);
    });
  }

  if (success) {
    return (
      <AuthCard>
        <AuthSuccess
          title={experience.reset.successTitle}
          description={experience.reset.successDescription}
        />
        <p className="mt-4 text-center text-sm text-muted-foreground">{experience.reset.redirecting}</p>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <AuthHeader title={labels.title} subtitle={labels.subtitle} />

        {error ? <AuthError message={error} /> : null}

        <div className="space-y-3">
          <AuthPasswordInput
            id="password"
            name="password"
            label={labels.password}
            showLabel={experience.common.showPassword}
            hideLabel={experience.common.hidePassword}
            autoComplete="new-password"
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

        <AuthPasswordInput
          id="confirmPassword"
          name="confirmPassword"
          label={labels.confirmPassword}
          showLabel={experience.common.showPassword}
          hideLabel={experience.common.hidePassword}
          autoComplete="new-password"
          required
          value={confirmPassword}
          onValueChange={setConfirmPassword}
          error={mismatch}
        />

        <Button type="submit" className="w-full" size="lg" loading={isPending} disabled={Boolean(mismatch)}>
          {labels.submit}
        </Button>

        <AuthFooter>
          <Link href={`/${locale}${AUTH_ROUTES.login}`} className="text-primary hover:underline">
            {labels.backToLogin}
          </Link>
        </AuthFooter>
      </form>
    </AuthCard>
  );
}
