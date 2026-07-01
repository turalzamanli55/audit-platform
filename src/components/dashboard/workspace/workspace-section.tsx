import type { ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

type WorkspaceSectionProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
};

export function WorkspaceSection({
  title,
  description,
  action,
  children,
  className,
  id,
}: WorkspaceSectionProps) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className={cn("space-y-5", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2
            id={id ? `${id}-title` : undefined}
            className="text-lg font-semibold tracking-tight text-foreground sm:text-xl"
          >
            {title}
          </h2>
          {description ? (
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

type WorkspacePanelProps = {
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "soft";
};

const panelVariants = {
  default: "border-border/50 bg-card/90 shadow-xs",
  elevated: "border-border/40 bg-surface-elevated shadow-sm",
  soft: "border-border/30 bg-muted/15 shadow-none",
};

export function WorkspacePanel({
  children,
  className,
  variant = "default",
}: WorkspacePanelProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border p-6 sm:p-7 ds-animate-fade-in motion-reduce:animate-none",
        panelVariants[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}
