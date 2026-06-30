"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUpAction } from "@/lib/actions/auth/sign-up";
import { Button, Input, Label, Alert } from "@/components/ui";
import { AUTH_ROUTES } from "@/config/auth";

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
};

export function RegisterForm({ locale, labels }: RegisterFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
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
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">{labels.title}</h1>
        <p className="text-sm text-muted-foreground">{labels.subtitle}</p>
      </div>

      {error ? <Alert variant="error">{error}</Alert> : null}
      {verificationMessage ? <Alert variant="success">{verificationMessage}</Alert> : null}

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

      <div className="space-y-2">
        <Label htmlFor="password" required>
          {labels.password}
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      <Button type="submit" className="w-full" loading={isPending}>
        {labels.submit}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {labels.loginPrompt}{" "}
        <Link href={`/${locale}${AUTH_ROUTES.login}`} className="text-primary hover:underline">
          {labels.loginLink}
        </Link>
      </p>
    </form>
  );
}
