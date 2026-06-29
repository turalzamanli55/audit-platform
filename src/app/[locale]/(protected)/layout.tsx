import type { ReactNode } from "react";
import { ProtectedRouteGuard } from "@/components/auth";
import { AppShell } from "@/components/layout";

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <ProtectedRouteGuard>
      <AppShell>{children}</AppShell>
    </ProtectedRouteGuard>
  );
}
