import type { InputHTMLAttributes, ReactNode } from "react";

type EngagementSearchProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: ReactNode;
  error?: string;
  onValueChange?: (value: string) => void;
};

export function EngagementSearch({
  label,
  error,
  className = "",
  id = "engagement-search",
  placeholder = "Search engagements…",
  onValueChange,
  onChange,
  ...props
}: EngagementSearchProps) {
  return (
    <div role="search" className={`w-full min-w-0 sm:max-w-sm lg:max-w-md ${className}`}>
      <label htmlFor={id} className="sr-only">
        {label ?? "Search engagements"}
      </label>
      <div className="relative space-y-1.5">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground"
        >
          <SearchIcon />
        </span>
        <input
          id={id}
          type="search"
          placeholder={placeholder}
          className={`h-10 w-full rounded-xl border bg-card pl-10 pr-3 text-sm text-foreground shadow-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 ${error ? "border-destructive" : "border-input"}`}
          onChange={(event) => {
            onChange?.(event);
            onValueChange?.(event.target.value);
          }}
          {...props}
        />
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 10.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
