"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CompanyWorkspaceError } from "@/components/company/workspace";

type CompanyWorkspaceRouteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function CompanyWorkspaceRouteError({
  error,
  reset,
}: CompanyWorkspaceRouteErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <CompanyWorkspaceError
      action={
        <Button type="button" variant="secondary" onClick={reset}>
          Retry
        </Button>
      }
    />
  );
}
