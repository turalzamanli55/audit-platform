import type { SelectHTMLAttributes } from "react";
import { IconChevronDown } from "./icons";
import { cn } from "@/lib/ui/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string;
};

export function Select({ className = "", error, children, ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      <div className="relative">
        <select
          className={cn(
            "h-11 w-full appearance-none rounded-xl border bg-card px-3.5 pr-10 text-sm text-foreground shadow-xs transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
            error ? "border-destructive" : "border-input",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <IconChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
