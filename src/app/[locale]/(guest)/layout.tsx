import type { ReactNode } from "react";
import { GuestRouteGuard } from "@/components/auth";
import { PublicShell } from "@/components/layout";

type GuestLayoutProps = {
  children: ReactNode;
};

export default function GuestLayout({ children }: GuestLayoutProps) {
  return (
    <GuestRouteGuard>
      <PublicShell>{children}</PublicShell>
    </GuestRouteGuard>
  );
}
