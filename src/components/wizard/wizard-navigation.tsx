import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type WizardNavigationProps = {
  onBack?: () => void;
  onNext?: () => void;
  backLabel: string;
  nextLabel: string;
  loading?: boolean;
  disableNext?: boolean;
  secondaryAction?: ReactNode;
};

export function WizardNavigation({
  onBack,
  onNext,
  backLabel,
  nextLabel,
  loading = false,
  disableNext = false,
  secondaryAction,
}: WizardNavigationProps) {
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        {onBack ? (
          <Button type="button" variant="ghost" onClick={onBack} disabled={loading}>
            {backLabel}
          </Button>
        ) : null}
        {secondaryAction}
      </div>
      {onNext ? (
        <Button type="button" onClick={onNext} loading={loading} disabled={disableNext}>
          {nextLabel}
        </Button>
      ) : null}
    </div>
  );
}
