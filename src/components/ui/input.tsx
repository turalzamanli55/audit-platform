import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/ui/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  hint?: string;
};

export function Input({ className = "", error, hint, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      <input
        className={cn(
          "h-10 w-full rounded-xl border bg-card px-3.5 text-sm text-foreground shadow-xs transition-all duration-200 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25 hover:border-border-strong",
          error ? "border-destructive" : "border-input",
          className,
        )}
        {...props}
      />
      {hint && !error ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {error ? <p className="text-xs text-destructive" role="alert">{error}</p> : null}
    </div>
  );
}
