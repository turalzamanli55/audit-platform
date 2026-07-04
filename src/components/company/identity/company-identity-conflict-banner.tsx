"use client";

import { Button } from "@/components/ui/button";
import { WorkspacePanel } from "@/components/workspace";
import { useCompanyIdentity } from "@/lib/company/use-company-identity";

type CompanyIdentityConflictBannerProps = {
  title: string;
  description: string;
  refreshLabel: string;
  discardLabel: string;
};

export function CompanyIdentityConflictBanner({
  title,
  description,
  refreshLabel,
  discardLabel,
}: CompanyIdentityConflictBannerProps) {
  const { hasConflict, dismissConflict, discardChanges } = useCompanyIdentity();

  if (!hasConflict) {
    return null;
  }

  return (
    <div role="alert">
      <WorkspacePanel variant="muted" padding="sm" className="border-warning/25 bg-warning/10">
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
      </WorkspacePanel>
    </div>
  );
}
