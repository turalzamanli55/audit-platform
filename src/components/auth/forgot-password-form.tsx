"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { forgotPasswordAction } from "@/lib/actions/auth/forgot-password";
import { Button, Input, Label } from "@/components/ui";
import { AUTH_ROUTES } from "@/config/auth";
import type { AuthExperienceLabels } from "@/i18n/auth-experience-types";
import {
  AuthCard,
  AuthError,
  AuthFooter,
  AuthHeader,
  AuthStatusPanel,
  AuthSuccess,
} from "@/components/auth/ui";

type ForgotPasswordFormProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    email: string;
    submit: string;
    success: string;
    backToLogin: string;
    error: string;
  };
  experience: AuthExperienceLabels;
};

export function ForgotPasswordForm({ locale, labels, experience }: ForgotPasswordFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      setError(null);
      setSuccess(false);

      const result = await forgotPasswordAction({
        email: String(formData.get("email") ?? ""),
        locale,
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
        <AuthSuccess title={experience.forgot.successTitle} description={labels.success} />
        <AuthFooter>
          <Link href={`/${locale}${AUTH_ROUTES.login}`} className="text-primary hover:underline">
            {labels.backToLogin}
          </Link>
        </AuthFooter>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <AuthHeader title={labels.title} subtitle={labels.subtitle} />

        <AuthStatusPanel variant="info" title={experience.forgot.explanation} />

        {error ? <AuthError message={error} /> : null}

        <div className="space-y-2">
          <Label htmlFor="email" required>
            {labels.email}
          </Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>

        <Button type="submit" className="w-full" size="lg" loading={isPending}>
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
