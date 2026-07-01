import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/ui/cn";

type AuthCheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function AuthCheckbox({ label, className, ...props }: AuthCheckboxProps) {
  return (
    <label className={cn("flex cursor-pointer items-center gap-3 text-sm text-muted-foreground", className)}>
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-input text-primary focus-visible:ring-2 focus-visible:ring-ring"
        {...props}
      />
      <span>{label}</span>
    </label>
  );
}
