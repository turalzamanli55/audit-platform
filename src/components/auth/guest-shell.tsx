import type { ReactNode } from "react";
import { GuestRouteGuard } from "@/components/auth/guest-route-guard";
import { PublicShell } from "@/components/layout";

type GuestShellProps = {
  children: ReactNode;
};

export function GuestShell({ children }: GuestShellProps) {
  return (
    <GuestRouteGuard>
      <PublicShell>{children}</PublicShell>
    </GuestRouteGuard>
  );
}
