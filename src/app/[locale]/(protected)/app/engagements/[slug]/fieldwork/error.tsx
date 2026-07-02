"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FieldworkWorkspaceError } from "@/components/fieldwork";

export default function FieldworkError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <FieldworkWorkspaceError
      action={
        <Button type="button" variant="secondary" onClick={reset}>
          Retry
        </Button>
      }
    />
  );
}
