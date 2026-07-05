"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { IconMenu } from "@/components/ui/icons";
import { useShell } from "./shell-provider";
import { useShellLabels } from "@/i18n/use-shell-labels";
import { cn } from "@/lib/ui/cn";

type AppHeaderProps = {
  mobileSearch?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  className?: string;
};

export function AppHeader({ mobileSearch, center, right, className }: AppHeaderProps) {
  const shell = useShellLabels();
  const { mobileNavOpen, setMobileNavOpen } = useShell();

  return (
    <header
      className={cn(
        "sticky top-0 z-[1100] flex h-[var(--ds-header-height)] min-w-0 items-center overflow-x-clip border-b border-border/60 bg-card/90 px-2 backdrop-blur-xl supports-[backdrop-filter]:bg-card/75 sm:px-4 ds-safe-top",
        className,
      )}
      role="banner"
    >
      <div className="flex w-full min-w-0 items-center gap-1.5 sm:gap-2 lg:gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 sm:h-10 sm:w-10 lg:hidden"
          onClick={() => setMobileNavOpen(true)}
          aria-label={shell.openNavigation}
          aria-expanded={mobileNavOpen}
          aria-controls="mobile-navigation"
        >
          <IconMenu />
        </Button>

        {mobileSearch ? <div className="min-w-0 flex-1 lg:hidden">{mobileSearch}</div> : null}

        <div className="hidden min-w-0 flex-1 justify-center px-2 lg:flex lg:px-4">{center}</div>

        <div className="ml-auto flex min-w-0 shrink items-center gap-0.5 sm:gap-1">{right}</div>
      </div>
    </header>
  );
}
