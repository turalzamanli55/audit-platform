"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { IconX } from "@/components/ui/icons";
import { useShell } from "./shell-provider";
import { cn } from "@/lib/ui/cn";
import { Portal } from "@/components/ui/portal";

type AppSidebarProps = {
  children: ReactNode;
  brand: ReactNode;
  desktopFooter?: ReactNode;
  mobileDrawerContext?: ReactNode;
};

function SidebarNav({ children }: { children: ReactNode }) {
  return <div className="flex flex-1 flex-col overflow-y-auto px-3 py-4">{children}</div>;
}

export function AppSidebar({
  children,
  brand,
  desktopFooter,
  mobileDrawerContext,
}: AppSidebarProps) {
  const { sidebarCollapsed, mobileNavOpen, setMobileNavOpen } = useShell();

  return (
    <>
      <aside
        className="hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex lg:flex-col"
        style={{
          width: sidebarCollapsed
            ? "var(--ds-sidebar-width-collapsed)"
            : "var(--ds-sidebar-width)",
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div
          className={cn(
            "flex h-[var(--ds-header-height)] shrink-0 items-center border-b border-sidebar-border px-4",
            sidebarCollapsed ? "justify-center px-2" : "justify-between",
          )}
        >
          <div className={cn("min-w-0", sidebarCollapsed ? "flex justify-center" : "flex-1")}>
            {brand}
          </div>
        </div>
        <SidebarNav>{children}</SidebarNav>
        {desktopFooter ? (
          <div
            className={cn(
              "shrink-0 border-t border-sidebar-border p-3",
              sidebarCollapsed && "px-2",
            )}
          >
            {desktopFooter}
          </div>
        ) : null}
      </aside>

      {mobileNavOpen ? (
        <Portal>
          <div className="fixed inset-0 z-[1300] lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-overlay"
              aria-label="Close navigation overlay"
              onClick={() => setMobileNavOpen(false)}
            />
            <aside
              className="absolute inset-y-0 left-0 flex w-[min(100%,18rem)] flex-col bg-sidebar text-sidebar-foreground shadow-xl ds-animate-slide-up ds-safe-top ds-safe-bottom"
              role="navigation"
              aria-label="Main navigation"
            >
              <div className="flex h-[var(--ds-header-height)] shrink-0 items-center justify-between border-b border-sidebar-border px-4">
                <div className="min-w-0 flex-1">{brand}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileNavOpen(false)}
                  className="text-sidebar-muted hover:bg-sidebar-accent/60"
                  aria-label="Close navigation"
                >
                  <IconX />
                </Button>
              </div>
              <SidebarNav>{children}</SidebarNav>
              {mobileDrawerContext ? (
                <div className="shrink-0 border-t border-sidebar-border p-4">{mobileDrawerContext}</div>
              ) : null}
            </aside>
          </div>
        </Portal>
      ) : null}
    </>
  );
}
