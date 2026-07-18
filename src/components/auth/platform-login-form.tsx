"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { platformSignInAction } from "@/lib/actions/auth/platform-sign-in";
import { Button, Input, Label } from "@/components/ui";
import { AuthCard, AuthError, AuthHeader, AuthPasswordInput } from "@/components/auth/ui";
import { PLATFORM_DASHBOARD_PATH } from "@/config/auth";

export function PlatformLoginForm({ locale }: { locale: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      setError(null);
      const result = await platformSignInAction({
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      });

      if (!result.success) {
        setError(result.error.message ?? "Unable to sign in");
        return;
      }

      router.push(`/${locale}${PLATFORM_DASHBOARD_PATH}`);
      router.refresh();
    });
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <AuthCard>
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <AuthHeader
            title="Platform Owner Sign In"
            subtitle="Restricted access. Tenant users must sign in from the standard login."
          />

          {error ? <AuthError message={error} /> : null}

          <div className="space-y-2">
            <Label htmlFor="email" required>
              Email
            </Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>

          <AuthPasswordInput
            id="password"
            name="password"
            label="Password"
            showLabel="Show password"
            hideLabel="Hide password"
            autoComplete="current-password"
            required
          />

          <Button type="submit" className="w-full" size="lg" loading={isPending}>
            Sign in to Platform
          </Button>
        </form>
      </AuthCard>
    </div>
  );
}
