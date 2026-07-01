import type { ReactNode } from "react";
import { IconAlertCircle, IconCheck, IconInfo } from "./icons";
import { cn } from "@/lib/ui/cn";

type AlertVariant = "error" | "success" | "info" | "warning";

type AlertProps = {
  variant?: AlertVariant;
  children: ReactNode;
  title?: string;
  className?: string;
};

const variantClasses: Record<AlertVariant, string> = {
  error: "border-destructive/25 bg-destructive/5 text-foreground",
  success: "border-success/25 bg-success/5 text-foreground",
  warning: "border-warning/25 bg-warning/5 text-foreground",
  info: "border-info/25 bg-info/5 text-foreground",
};

function variantIcon(variant: AlertVariant) {
  switch (variant) {
    case "success":
      return <IconCheck className="text-success" />;
    case "error":
      return <IconAlertCircle className="text-destructive" />;
    case "warning":
      return <IconAlertCircle className="text-warning" />;
    default:
      return <IconInfo className="text-info" />;
  }
}

export function Alert({ variant = "info", children, title, className }: AlertProps) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border px-4 py-3.5 text-sm",
        variantClasses[variant],
        className,
      )}
      role="alert"
    >
      <div className="mt-0.5 shrink-0">{variantIcon(variant)}</div>
      <div className="min-w-0">
        {title ? <p className="font-medium">{title}</p> : null}
        <div className={title ? "mt-1 text-muted-foreground" : ""}>{children}</div>
      </div>
    </div>
  );
}
