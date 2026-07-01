import type { ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

type AuthEmptyStateProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
};

export function AuthEmptyState({ title, description, children, className }: AuthEmptyStateProps) {
  return (
    <div className={cn("space-y-4 py-4 text-center", className)}>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
        {description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
