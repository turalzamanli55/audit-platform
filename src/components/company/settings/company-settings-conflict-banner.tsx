"use client";

import { Button } from "@/components/ui/button";
import { useCompanySettings } from "@/lib/company/use-company-settings";

type CompanySettingsConflictBannerProps = {
  title: string;
  description: string;
  refreshLabel: string;
  discardLabel: string;
};

export function CompanySettingsConflictBanner({
  title,
  description,
  refreshLabel,
  discardLabel,
}: CompanySettingsConflictBannerProps) {
  const { hasConflict, dismissConflict, discardChanges } = useCompanySettings();

  if (!hasConflict) {
    return null;
  }

  return (
    <div
      role="alert"
      className="rounded-2xl border border-warning/25 bg-warning/10 px-4 py-4 sm:px-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              discardChanges();
              dismissConflict();
            }}
          >
            {discardLabel}
          </Button>
          <Button type="button" onClick={dismissConflict}>
            {refreshLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
