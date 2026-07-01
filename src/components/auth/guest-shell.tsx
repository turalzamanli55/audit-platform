import type { ReactNode } from "react";
import { GuestRouteGuard } from "@/components/auth/guest-route-guard";
import { PublicAuthShell } from "@/components/public/public-auth-shell";

type GuestShellProps = {
  children: ReactNode;
  locale: string;
};

export function GuestShell({ children, locale }: GuestShellProps) {
  return (
    <GuestRouteGuard>
      <PublicAuthShell locale={locale}>{children}</PublicAuthShell>
    </GuestRouteGuard>
  );
}
