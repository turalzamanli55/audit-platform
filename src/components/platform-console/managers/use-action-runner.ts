"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui";
import type { ActionResult } from "@/lib/actions/types";

/**
 * Shared runner for Platform Console admin actions: tracks a per-item pending
 * state, surfaces success/error toasts, and refreshes server data on success.
 */
export function useActionRunner() {
  const router = useRouter();
  const { toast } = useToast();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const run = useCallback(
    async <T,>(
      id: string,
      action: () => Promise<ActionResult<T>>,
      opts: { success: string; onSuccess?: (data: T) => void },
    ): Promise<boolean> => {
      setPendingId(id);
      try {
        const result = await action();
        if (result.success) {
          toast({ title: opts.success, variant: "success" });
          opts.onSuccess?.(result.data);
          router.refresh();
          return true;
        }
        toast({ title: "Action failed", description: result.error.message, variant: "error" });
        return false;
      } catch (error) {
        toast({
          title: "Unexpected error",
          description: error instanceof Error ? error.message : "Please try again.",
          variant: "error",
        });
        return false;
      } finally {
        setPendingId(null);
      }
    },
    [router, toast],
  );

  return { run, pendingId };
}
