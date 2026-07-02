"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EngagementErrorState, EngagementPageShell } from "@/components/engagement";

type EngagementsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function EngagementsError({ error, reset }: EngagementsErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <EngagementPageShell>
      <EngagementErrorState
        action={
          <Button type="button" variant="secondary" onClick={reset}>
            Retry
          </Button>
        }
      />
    </EngagementPageShell>
  );
}
