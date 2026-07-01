import type { ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

type AuthStatusPanelProps = {
  variant?: "info" | "success" | "warning" | "error";
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
};

const variantClasses = {
  info: "border-info/25 bg-info/5",
  success: "border-success/25 bg-success/5",
  warning: "border-warning/25 bg-warning/5",
  error: "border-destructive/25 bg-destructive/5",
};

export function AuthStatusPanel({
  variant = "info",
  title,
  description,
  children,
  className,
}: AuthStatusPanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-5 py-4 ds-animate-fade-in motion-reduce:animate-none",
        variantClasses[variant],
        className,
      )}
      role="status"
    >
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? (
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}
