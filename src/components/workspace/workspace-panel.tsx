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

export type WorkspaceSummaryItem = {
  id: string;
  label: string;
  value: ReactNode;
  hint?: string;
};

export function WorkspaceSummaryGrid({
  items,
  className,
  ariaLabel,
}: {
  items: WorkspaceSummaryItem[];
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <div className={className} role="list" aria-label={ariaLabel}>
      <div className={workspaceTokens.kpiGrid}>
        {items.map((item) => (
          <div key={item.id} role="listitem">
            <WorkspacePanel padding="md" className="space-y-3 h-full">
              <p className={workspaceTokens.kpiLabel}>{item.label}</p>
              <div className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                {item.value}
              </div>
              {item.hint ? <p className={workspaceTokens.kpiHint}>{item.hint}</p> : null}
            </WorkspacePanel>
          </div>
        ))}
      </div>
    </div>
  );
}
