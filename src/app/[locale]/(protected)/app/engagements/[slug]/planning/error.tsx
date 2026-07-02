"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlanningWorkspaceError } from "@/components/planning";

type PlanningErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function PlanningError({ error, reset }: PlanningErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PlanningWorkspaceError
      action={
        <Button type="button" variant="secondary" onClick={reset}>
          Retry
        </Button>
      }
    />
  );
}
