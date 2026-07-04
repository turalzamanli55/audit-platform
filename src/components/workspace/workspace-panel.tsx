import type { ReactNode } from "react";
import { cn } from "@/lib/ui/cn";
import { workspaceTokens } from "./workspace-tokens";

type WorkspacePanelProps = {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md";
  variant?: "default" | "muted" | "form";
};

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-5 sm:p-6",
};

const variantClasses = {
  default: workspaceTokens.card,
  muted: "rounded-2xl border border-border/50 bg-muted/10",
  form: "rounded-2xl border border-border/50 bg-card/90 shadow-xs",
};

export function WorkspacePanel({
  children,
  className,
  padding = "md",
  variant = "default",
}: WorkspacePanelProps) {
  return (
    <div className={cn(variantClasses[variant], paddingClasses[padding], className)}>
      {children}
    </div>
  );
}

export function WorkspaceFormPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <WorkspacePanel variant="form" className={cn("space-y-4", className)}>
      {children}
    </WorkspacePanel>
  );
}

export function WorkspaceMetricCard({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string;
  hint?: string | null;
  className?: string;
}) {
  return (
    <WorkspacePanel padding="md" className={className}>
      <p className={workspaceTokens.kpiLabel}>{label}</p>
      <p className={workspaceTokens.kpiValue}>{value}</p>
      {hint ? <p className={workspaceTokens.kpiHint}>{hint}</p> : null}
    </WorkspacePanel>
  );
}
