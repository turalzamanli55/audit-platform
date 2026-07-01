"use client";

import { useId, useState } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/ui/cn";

type AuthPasswordInputProps = {
  id?: string;
  name: string;
  label: string;
  showLabel: string;
  hideLabel: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  error?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
};

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" width={18} height={18} fill="none" aria-hidden>
        <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7z" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" aria-hidden>
      <path d="M3 3l18 18M10.6 10.6A3 3 0 0012 15a3 3 0 002.4-1.4M6.7 6.7C4.6 8.1 3 10.2 3 12s3.5 7 9 7c1.8 0 3.4-.5 4.7-1.3M17 10.2c.6.8 1 1.7 1 1.8s-3.5 7-9 7c-.5 0-1-.1-1.5-.2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function AuthPasswordInput({
  id,
  name,
  label,
  showLabel,
  hideLabel,
  autoComplete,
  required,
  minLength,
  error,
  value,
  onValueChange,
  className,
}: AuthPasswordInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [visible, setVisible] = useState(false);

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={inputId} required={required}>
        {label}
      </Label>
      <div className="relative">
        <input
          id={inputId}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          value={value}
          onChange={onValueChange ? (event) => onValueChange(event.target.value) : undefined}
          className={cn(
            "h-10 w-full rounded-xl border bg-card px-3.5 pr-11 text-sm text-foreground shadow-xs transition-all duration-200 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25 hover:border-border-strong",
            error ? "border-destructive" : "border-input",
          )}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={visible ? hideLabel : showLabel}
          aria-pressed={visible}
        >
          <EyeIcon open={visible} />
        </button>
      </div>
      {error ? <p className="text-xs text-destructive" role="alert">{error}</p> : null}
    </div>
  );
}
