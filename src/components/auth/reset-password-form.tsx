"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { resetPasswordAction } from "@/lib/actions/auth/reset-password";
import { Button, Input, Label, Alert } from "@/components/ui";
import { AUTH_ROUTES } from "@/config/auth";

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
};

export function ResetPasswordForm({ locale, labels }: ResetPasswordFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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

      router.push(`/${locale}${AUTH_ROUTES.login}`);
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

      <div className="space-y-2">
        <Label htmlFor="password" required>
          {labels.password}
        </Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" required>
          {labels.confirmPassword}
        </Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
        />
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
