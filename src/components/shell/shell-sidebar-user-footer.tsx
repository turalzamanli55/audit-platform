"use client";

import { useAuth } from "@/providers";
import { Avatar } from "@/components/ui/avatar";
import { useShell } from "./shell-provider";
import { Button } from "@/components/ui/button";
import { IconPanelLeft } from "@/components/ui/icons";
import { cn } from "@/lib/ui/cn";

type ShellSidebarUserFooterProps = {
  className?: string;
  expandLabel: string;
  collapseLabel: string;
};

export function ShellSidebarUserFooter({
  className,
  expandLabel,
  collapseLabel,
}: ShellSidebarUserFooterProps) {
  const { session } = useAuth();
  const { sidebarCollapsed, toggleSidebar } = useShell();

  if (session.status !== "authenticated" || !session.user) {
    return null;
  }

  const displayName = session.user.displayName || session.user.email;

  return (
    <div className={cn("flex items-center gap-2", sidebarCollapsed && "flex-col gap-3", className)}>
      <Avatar name={displayName} size="sm" />
      {!sidebarCollapsed ? (
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-sidebar-foreground">{displayName}</p>
          <p className="truncate text-xs text-sidebar-muted">{session.user.email}</p>
        </div>
      ) : null}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="shrink-0 text-sidebar-muted hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
        aria-label={sidebarCollapsed ? expandLabel : collapseLabel}
      >
        <IconPanelLeft />
      </Button>
    </div>
  );
}
