"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { IconMenu } from "@/components/ui/icons";
import { useShell } from "./shell-provider";
import { cn } from "@/lib/ui/cn";

type AppHeaderProps = {
  mobileSearch?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  className?: string;
};

export function AppHeader({ mobileSearch, center, right, className }: AppHeaderProps) {
  const { setMobileNavOpen } = useShell();

  return (
    <header
      className={cn(
        "sticky top-0 z-[1100] flex h-[var(--ds-header-height)] items-center border-b border-border/60 bg-card/80 px-3 backdrop-blur-xl supports-[backdrop-filter]:bg-card/70 sm:px-4 ds-safe-top",
        className,
      )}
      role="banner"
    >
      <div className="flex w-full min-w-0 items-center gap-2 lg:gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 shrink-0 lg:hidden"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open navigation"
        >
          <IconMenu />
        </Button>

        {mobileSearch ? <div className="min-w-0 flex-1 lg:hidden">{mobileSearch}</div> : null}

        <div className="hidden min-w-0 flex-1 justify-center px-2 lg:flex lg:px-4">{center}</div>

        <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1">{right}</div>
      </div>
    </header>
  );
}
