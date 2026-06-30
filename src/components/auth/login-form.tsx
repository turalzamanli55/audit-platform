"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInAction } from "@/lib/actions/auth/sign-in";
import { Button, Input, Label, Alert } from "@/components/ui";
import { AUTH_ROUTES } from "@/config/auth";

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
};

export function LoginForm({ locale, labels }: LoginFormProps) {
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
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">{labels.title}</h1>
        <p className="text-sm text-muted-foreground">{labels.subtitle}</p>
      </div>

      {error ? <Alert variant="error">{error}</Alert> : null}

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
          autoComplete="current-password"
          required
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" name="rememberMe" className="rounded border-input" />
        {labels.rememberMe}
      </label>

      <Button type="submit" className="w-full" loading={isPending}>
        {labels.submit}
      </Button>

      <div className="flex items-center justify-between text-sm">
        <Link href={`/${locale}${AUTH_ROUTES.forgotPassword}`} className="text-primary hover:underline">
          {labels.forgotPassword}
        </Link>
        <span className="text-muted-foreground">
          {labels.registerPrompt}{" "}
          <Link href={`/${locale}${AUTH_ROUTES.register}`} className="text-primary hover:underline">
            {labels.registerLink}
          </Link>
        </span>
      </div>
    </form>
  );
}
