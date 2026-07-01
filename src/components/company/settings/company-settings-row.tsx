"use client";

import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";

type CompanySettingsRowProps = {
  label: ReactNode;
  htmlFor: string;
  value: ReactNode;
  canEdit: boolean;
  editing?: boolean;
  onActivate?: () => void;
  error?: string;
  hint?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function CompanySettingsRow({
  label,
  htmlFor,
  value,
  canEdit,
  editing = false,
  onActivate,
  error,
  hint,
  children,
  className = "",
}: CompanySettingsRowProps) {
  const interactive = canEdit && onActivate && !editing;

  return (
    <div
      className={`px-4 py-3.5 transition-colors duration-200 sm:px-5 sm:py-4 ${
        interactive ? "cursor-pointer hover:bg-muted/30" : ""
      } ${className}`}
    >
      {editing && canEdit && children ? (
        <div className="space-y-2">
          <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
            {label}
          </label>
          {children}
          {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
          {error ? (
            <p className="text-xs text-destructive" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      ) : (
        <button
          type="button"
          id={interactive ? htmlFor : undefined}
          disabled={!interactive}
          onClick={interactive ? onActivate : undefined}
          className={`flex w-full flex-col gap-2 text-left sm:flex-row sm:items-center sm:justify-between sm:gap-6 ${
            interactive ? "" : "cursor-default"
          }`}
        >
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span
            className={`text-sm sm:max-w-[55%] sm:text-right ${
              value ? "text-muted-foreground" : "text-muted-foreground/70"
            }`}
          >
            {value || "—"}
          </span>
        </button>
      )}
      {!editing && error ? (
        <p className="mt-2 text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type CompanySettingsFieldRowProps = {
  label: ReactNode;
  htmlFor: string;
  canEdit: boolean;
  value: string;
  onChange?: (value: string) => void;
  error?: string;
  hint?: ReactNode;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
};

export function CompanySettingsFieldRow({
  label,
  htmlFor,
  canEdit,
  value,
  onChange,
  error,
  hint,
  type = "text",
  placeholder,
  autoComplete,
}: CompanySettingsFieldRowProps) {
  if (!canEdit) {
    return (
      <CompanySettingsRow label={label} htmlFor={htmlFor} value={value || "—"} canEdit={false} />
    );
  }

  return (
    <div className="space-y-2 px-4 py-3.5 sm:px-5 sm:py-4">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <Input
        id={htmlFor}
        name={htmlFor}
        type={type}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        error={error}
      />
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

type CompanySettingsSelectRowProps = {
  label: ReactNode;
  htmlFor: string;
  canEdit: boolean;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  error?: string;
};

export function CompanySettingsSelectRow({
  label,
  htmlFor,
  canEdit,
  value,
  onChange,
  options,
  error,
}: CompanySettingsSelectRowProps) {
  const display = (options.find((option) => option.value === value)?.label ?? value) || "—";

  if (!canEdit) {
    return (
      <CompanySettingsRow label={label} htmlFor={htmlFor} value={display} canEdit={false} />
    );
  }

  return (
    <div className="space-y-2 px-4 py-3.5 sm:px-5 sm:py-4">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <select
        id={htmlFor}
        name={htmlFor}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`h-11 w-full rounded-xl border bg-card px-3 text-sm text-foreground shadow-xs transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 ${
          error ? "border-destructive" : "border-input"
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
