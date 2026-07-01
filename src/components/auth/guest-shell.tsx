import type { ReactNode } from "react";
import { GuestRouteGuard } from "@/components/auth/guest-route-guard";
import { PublicAuthShell } from "@/components/public/public-auth-shell";

type GuestShellProps = {
  children: ReactNode;
  locale: string;
  wide?: boolean;
};

export function GuestShell({ children, locale, wide = false }: GuestShellProps) {
  return (
    <GuestRouteGuard>
      <PublicAuthShell locale={locale} wide={wide}>
        {children}
      </PublicAuthShell>
    </GuestRouteGuard>
  );
}
