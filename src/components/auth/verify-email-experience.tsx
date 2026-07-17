"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { resendVerificationAction } from "@/lib/actions/auth/resend-verification";
import { Button } from "@/components/ui";
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

type VerifyEmailExperienceProps = {
  locale: string;
  email?: string;
  status?: string;
  labels: {
    title: string;
    subtitle: string;
    sent: string;
    generic: string;
    backToLogin: string;
  };
  experience: AuthExperienceLabels;
};

const RESEND_COOLDOWN_SECONDS = 60;

export function VerifyEmailExperience({
  locale,
  email,
  status,
  labels,
  experience,
}: VerifyEmailExperienceProps) {
  const [error, setError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  const handleResend = useCallback(() => {
    if (!email || secondsLeft > 0) return;

    startTransition(async () => {
      setError(null);
      setResent(false);

      const result = await resendVerificationAction({ email, locale });

      if (!result.success) {
        setError(result.error.message ?? experience.verify.resendError);
        return;
      }

      setResent(true);
      setSecondsLeft(RESEND_COOLDOWN_SECONDS);
    });
  }, [email, experience.verify.resendError, locale, secondsLeft]);

  if (status === "verified") {
    return (
      <AuthCard>
        <AuthSuccess
          title={experience.verify.verifiedTitle}
          description={experience.verify.verifiedDescription}
        />
        <AuthFooter>
          <Link href={`/${locale}${AUTH_ROUTES.login}`} className="text-primary hover:underline">
            {labels.backToLogin}
          </Link>
        </AuthFooter>
      </AuthCard>
    );
  }

  if (status === "expired") {
    return (
      <AuthCard>
        <AuthHeader title={experience.verify.expiredTitle} subtitle={experience.verify.expiredDescription} />
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
      <div className="space-y-6">
        <AuthHeader
          title={labels.title}
          subtitle={labels.subtitle}
          eyebrow={experience.verify.pendingTitle}
        />

        <AuthStatusPanel variant="info" title={email ? labels.sent.replace("{email}", email) : labels.generic} />

        {error ? <AuthError message={error} /> : null}
        {resent ? <AuthSuccess title={experience.verify.resendSuccess} /> : null}

        <div className="rounded-2xl border border-border/50 bg-muted/15 p-5">
          <p className="text-sm font-medium text-foreground">{experience.verify.tipsTitle}</p>
          <ul className="mt-3 space-y-2">
            {experience.verify.tips.map((tip) => (
              <li key={tip} className="text-sm leading-relaxed text-muted-foreground">
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {email ? (
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={handleResend}
            disabled={secondsLeft > 0 || isPending}
            loading={isPending}
          >
            {secondsLeft > 0
              ? experience.verify.resendIn.replace("{seconds}", String(secondsLeft))
              : experience.verify.resend}
          </Button>
        ) : null}

        <AuthFooter>
          <Link href={`/${locale}${AUTH_ROUTES.login}`} className="text-primary hover:underline">
            {labels.backToLogin}
          </Link>
        </AuthFooter>
      </div>
    </AuthCard>
  );
}
