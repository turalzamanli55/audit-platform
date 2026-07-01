"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CompanyErrorState, CompanyPageShell } from "@/components/company";

type CompaniesErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function CompaniesError({ error, reset }: CompaniesErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <CompanyPageShell>
      <CompanyErrorState
        action={
          <Button type="button" variant="secondary" onClick={reset}>
            Retry
          </Button>
        }
      />
    </CompanyPageShell>
  );
}
