type CompanySettingsReadOnlyBadgeProps = {
  label: string;
  className?: string;
};

export function CompanySettingsReadOnlyBadge({
  label,
  className = "",
}: CompanySettingsReadOnlyBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-border/60 bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground ${className}`}
    >
      {label}
    </span>
  );
}
