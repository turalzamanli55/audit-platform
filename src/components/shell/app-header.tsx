"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { IconMenu } from "@/components/ui/icons";
import { useShell } from "./shell-provider";
import { cn } from "@/lib/ui/cn";

type AppHeaderProps = {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  className?: string;
};

export function AppHeader({ left, center, right, className }: AppHeaderProps) {
  const { setMobileNavOpen } = useShell();

  return (
    <header
      className={cn(
        "sticky top-0 z-[1100] flex h-[var(--ds-header-height)] items-center border-b border-border/60 bg-card/80 px-4 backdrop-blur-xl supports-[backdrop-filter]:bg-card/70 ds-safe-top",
        className,
      )}
      role="banner"
    >
      <div className="flex w-full items-center gap-4">
        <div className="flex min-w-0 items-center gap-3 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation"
          >
            <IconMenu />
          </Button>
          {left}
        </div>

        <div className="hidden min-w-0 items-center gap-4 lg:flex">{left}</div>

        <div className="hidden min-w-0 flex-1 justify-center px-2 sm:px-4 md:flex">{center}</div>

        <div className="ml-auto flex shrink-0 items-center gap-2">{right}</div>
      </div>
    </header>
  );
}
