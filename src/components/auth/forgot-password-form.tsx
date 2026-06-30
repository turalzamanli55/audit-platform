"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { forgotPasswordAction } from "@/lib/actions/auth/forgot-password";
import { Button, Input, Label, Alert } from "@/components/ui";
import { AUTH_ROUTES } from "@/config/auth";

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
};

export function ForgotPasswordForm({ locale, labels }: ForgotPasswordFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      setError(null);
      setSuccess(null);

      const result = await forgotPasswordAction({
        email: String(formData.get("email") ?? ""),
        locale,
      });

      if (!result.success) {
        setError(result.error.message ?? labels.error);
        return;
      }

      setSuccess(labels.success);
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">{labels.title}</h1>
        <p className="text-sm text-muted-foreground">{labels.subtitle}</p>
      </div>

      {error ? <Alert variant="error">{error}</Alert> : null}
      {success ? <Alert variant="success">{success}</Alert> : null}

      <div className="space-y-2">
        <Label htmlFor="email" required>
          {labels.email}
        </Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>

      <Button type="submit" className="w-full" loading={isPending}>
        {labels.submit}
      </Button>

      <Link href={`/${locale}${AUTH_ROUTES.login}`} className="block text-center text-sm text-primary hover:underline">
        {labels.backToLogin}
      </Link>
    </form>
  );
}
