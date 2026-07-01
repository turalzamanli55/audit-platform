"use client";

import type { ReactNode } from "react";
import { ShellProvider, useShell } from "@/components/shell";
import { AppHeader } from "@/components/shell/app-header";
import { AppSidebar } from "@/components/shell/app-sidebar";
import { ShellPreferencesBridge } from "@/components/shell/shell-preferences-bridge";
import { ContentArea } from "./content-area";

type AppShellProps = {
  children: ReactNode;
  brand: ReactNode;
  headerCenter?: ReactNode;
  headerRight?: ReactNode;
  sidebar: ReactNode;
  sidebarFooter?: ReactNode;
  overlay?: ReactNode;
};

function AppShellInner({
  children,
  brand,
  headerCenter,
  headerRight,
  sidebar,
  sidebarFooter,
  overlay,
}: AppShellProps) {
  const { sidebarCollapsed } = useShell();

  return (
    <>
      <div className="ds-shell-grid min-h-dvh bg-background">
        <AppHeader left={brand} center={headerCenter} right={headerRight} />
        <div className="ds-app-grid min-h-0" data-sidebar-collapsed={sidebarCollapsed}>
          <AppSidebar brand={brand} footer={sidebarFooter}>
            {sidebar}
          </AppSidebar>
          <ContentArea>{children}</ContentArea>
        </div>
      </div>
      <ShellPreferencesBridge />
      {overlay}
    </>
  );
}

export function AppShell(props: AppShellProps) {
  return (
    <ShellProvider>
      <AppShellInner {...props} />
    </ShellProvider>
  );
}
