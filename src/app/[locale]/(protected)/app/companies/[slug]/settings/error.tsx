"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CompanySettingsError } from "@/components/company/settings";

type CompanySettingsRouteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function CompanySettingsRouteError({
  error,
  reset,
}: CompanySettingsRouteErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <CompanySettingsError
      action={
        <Button type="button" variant="secondary" onClick={reset}>
          Retry
        </Button>
      }
    />
  );
}
