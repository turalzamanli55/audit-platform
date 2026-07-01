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
  headerMobileSearch?: ReactNode;
  headerCenter?: ReactNode;
  headerRight?: ReactNode;
  sidebar: ReactNode;
  sidebarDesktopFooter?: ReactNode;
  mobileDrawerContext?: ReactNode;
  overlay?: ReactNode;
};

function AppShellInner({
  children,
  brand,
  headerMobileSearch,
  headerCenter,
  headerRight,
  sidebar,
  sidebarDesktopFooter,
  mobileDrawerContext,
  overlay,
}: AppShellProps) {
  const { sidebarCollapsed } = useShell();

  return (
    <>
      <div className="ds-shell-grid min-h-dvh bg-background">
        <AppHeader
          mobileSearch={headerMobileSearch}
          center={headerCenter}
          right={headerRight}
        />
        <div className="ds-app-grid min-h-0" data-sidebar-collapsed={sidebarCollapsed}>
          <AppSidebar
            brand={brand}
            desktopFooter={sidebarDesktopFooter}
            mobileDrawerContext={mobileDrawerContext}
          >
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
