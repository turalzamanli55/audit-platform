"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { acceptUserProvisioningInvitationAction } from "@/lib/actions/user-provisioning/user-provisioning-actions";
import { Button } from "@/components/ui";
import { AuthCard, AuthError, AuthHeader, AuthPasswordInput } from "@/components/auth/ui";
import { AUTH_ROUTES } from "@/config/auth";

type InviteAcceptanceFormProps = {
  locale: string;
  invitationToken: string;
  labels: {
    title: string;
    subtitle: string;
    password: string;
    submit: string;
    error: string;
  };
};

export function InviteAcceptanceForm({
  locale,
  invitationToken,
  labels,
}: InviteAcceptanceFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      setError(null);
      const result = await acceptUserProvisioningInvitationAction({
        invitationToken: String(formData.get("invitationToken") ?? invitationToken),
        password: String(formData.get("password") ?? ""),
      });
      if (!result.success) {
        setError(result.error?.message ?? labels.error);
        return;
      }
      router.push(`/${locale}${AUTH_ROUTES.login}`);
    });
  }

  return (
    <AuthCard>
      <AuthHeader title={labels.title} subtitle={labels.subtitle} />
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input type="hidden" name="invitationToken" value={invitationToken} />
        <AuthPasswordInput
          name="password"
          label={labels.password}
          showLabel="Show password"
          hideLabel="Hide password"
          required
          minLength={12}
          autoComplete="new-password"
        />
        {error ? <AuthError message={error} /> : null}
        <Button type="submit" className="w-full" size="lg" loading={isPending}>
          {labels.submit}
        </Button>
      </form>
    </AuthCard>
  );
}
