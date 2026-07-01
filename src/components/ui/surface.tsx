import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

type SurfaceVariant = "default" | "elevated" | "muted" | "ghost";

type SurfaceProps = HTMLAttributes<HTMLDivElement> & {
  variant?: SurfaceVariant;
  children: ReactNode;
  interactive?: boolean;
};

const variantClasses: Record<SurfaceVariant, string> = {
  default: "bg-surface border border-border/60 shadow-xs",
  elevated: "bg-surface-elevated border border-border/50 shadow-sm",
  muted: "bg-muted/50 border border-border/40",
  ghost: "bg-transparent",
};

export function Surface({
  variant = "default",
  interactive = false,
  className,
  children,
  ...props
}: SurfaceProps) {
  return (
    <div
      className={cn(
        "rounded-2xl transition-colors duration-200",
        variantClasses[variant],
        interactive && "hover:border-border-strong hover:shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
