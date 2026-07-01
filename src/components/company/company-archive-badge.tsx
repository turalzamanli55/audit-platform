type CompanyArchiveBadgeProps = {
  label?: string;
  className?: string;
};

/**
 * Distinct archived indicator for company identity surfaces.
 */
export function CompanyArchiveBadge({
  label = "Archived",
  className = "",
}: CompanyArchiveBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground ${className}`}
    >
      <ArchiveIcon />
      <span>{label}</span>
    </span>
  );
}

function ArchiveIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="shrink-0 opacity-70"
    >
      <rect x="2" y="3" width="8" height="2" rx="0.5" stroke="currentColor" strokeWidth="1" />
      <path
        d="M3.5 5.5h5v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path d="M5 3V2.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5V3" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
