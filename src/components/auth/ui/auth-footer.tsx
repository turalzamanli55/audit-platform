import type { ReactNode } from "react";
import Link from "next/link";

type AuthFooterProps = {
  children: ReactNode;
};

export function AuthFooter({ children }: AuthFooterProps) {
  return <div className="pt-2 text-center text-sm text-muted-foreground">{children}</div>;
}

type AuthTermsReminderProps = {
  prefix: string;
  termsLink: string;
  privacyLink: string;
  and: string;
  locale: string;
};

export function AuthTermsReminder({
  prefix,
  termsLink,
  privacyLink,
  and,
  locale,
}: AuthTermsReminderProps) {
  return (
    <p className="text-center text-xs leading-relaxed text-muted-foreground">
      {prefix}{" "}
      <Link href={`/${locale}/terms`} className="text-foreground underline-offset-4 hover:underline">
        {termsLink}
      </Link>{" "}
      {and}{" "}
      <Link href={`/${locale}/privacy`} className="text-foreground underline-offset-4 hover:underline">
        {privacyLink}
      </Link>
      .
    </p>
  );
}
