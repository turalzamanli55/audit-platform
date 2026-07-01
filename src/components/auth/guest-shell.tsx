import type { ReactNode } from "react";
import { GuestRouteGuard } from "@/components/auth/guest-route-guard";
import { PublicAuthShell } from "@/components/public/public-auth-shell";

type GuestShellProps = {
  children: ReactNode;
  locale: string;
  wide?: boolean;
  chromeLabels: {
    language: string;
    theme: string;
    themeLight: string;
    themeDark: string;
  };
};

export function GuestShell({ children, locale, wide = false, chromeLabels }: GuestShellProps) {
  return (
    <GuestRouteGuard>
      <PublicAuthShell locale={locale} wide={wide} chromeLabels={chromeLabels}>
        {children}
      </PublicAuthShell>
    </GuestRouteGuard>
  );
}
