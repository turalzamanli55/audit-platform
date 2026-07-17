"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInAction } from "@/lib/actions/auth/sign-in";
import { Button, Input, Label } from "@/components/ui";
import { AUTH_ROUTES } from "@/config/auth";
import type { AuthExperienceLabels } from "@/i18n/auth-experience-types";
import {
  AuthBenefits,
  AuthCard,
  AuthCheckbox,
  AuthError,
  AuthFooter,
  AuthHeader,
  AuthPasswordInput,
  AuthQuote,
} from "@/components/auth/ui";

type LoginFormProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    email: string;
    password: string;
    rememberMe: string;
    submit: string;
    forgotPassword: string;
    registerPrompt: string;
    registerLink: string;
    error: string;
  };
  experience: AuthExperienceLabels;
};

export function LoginForm({ locale, labels, experience }: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      setError(null);
      const result = await signInAction({
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        rememberMe: formData.get("rememberMe") === "on",
      });

      if (!result.success) {
        setError(result.error.message ?? labels.error);
        return;
      }

      router.push(`/${locale}/app/dashboard`);
      router.refresh();
    });
  }

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-center lg:gap-16">
      <div className="hidden space-y-8 lg:block">
        <AuthBenefits items={experience.login.benefits} />
        <AuthQuote quote={experience.login.quote} author={experience.login.quoteAuthor} />
      </div>

      <AuthCard>
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <AuthHeader title={labels.title} subtitle={labels.subtitle} />

          {error ? <AuthError message={error} /> : null}

          <div className="space-y-2">
            <Label htmlFor="email" required>
              {labels.email}
            </Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>

          <AuthPasswordInput
            id="password"
            name="password"
            label={labels.password}
            showLabel={experience.common.showPassword}
            hideLabel={experience.common.hidePassword}
            autoComplete="current-password"
            required
          />

          <div className="flex items-center justify-between gap-4">
            <AuthCheckbox name="rememberMe" label={labels.rememberMe} />
            <Link
              href={`/${locale}${AUTH_ROUTES.forgotPassword}`}
              className="text-sm text-primary hover:underline"
            >
              {labels.forgotPassword}
            </Link>
          </div>

          <Button type="submit" className="w-full" size="lg" loading={isPending}>
            {labels.submit}
          </Button>

          <AuthFooter>
            Access is invitation-only.{" "}
            <Link href={`/${locale}/contact`} className="text-primary hover:underline">
              Contact sales
            </Link>
          </AuthFooter>
        </form>
      </AuthCard>
    </div>
  );
}
