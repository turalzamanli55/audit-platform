"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EngagementWorkspaceError } from "@/components/engagement/workspace";

type EngagementWorkspaceRouteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function EngagementWorkspaceRouteError({
  error,
  reset,
}: EngagementWorkspaceRouteErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <EngagementWorkspaceError
      action={
        <Button type="button" variant="secondary" onClick={reset}>
          Retry
        </Button>
      }
    />
  );
}
