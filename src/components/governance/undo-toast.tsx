"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

type UndoToastProps = {
  message: string;
  undoLabel: string;
  seconds?: number;
  onUndo: () => Promise<void> | void;
  onDismiss?: () => void;
};

/**
 * Premium Undo after soft delete — calls the same restore workflow.
 * No alternate restore path.
 */
export function GovernanceUndoToast({
  message,
  undoLabel,
  seconds = 30,
  onUndo,
  onDismiss,
}: UndoToastProps) {
  const [remaining, setRemaining] = useState(seconds);
  const [pending, startTransition] = useTransition();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return;
    if (remaining <= 0) {
      setVisible(false);
      onDismiss?.();
      return;
    }
    const id = window.setTimeout(() => setRemaining((v) => v - 1), 1000);
    return () => window.clearTimeout(id);
  }, [remaining, visible, onDismiss]);

  if (!visible) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto flex max-w-lg flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-lg sm:left-auto sm:right-6 sm:flex-row sm:items-center"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{message}</p>
        <p className="text-xs text-muted-foreground">{remaining}s</p>
      </div>
      <Button
        type="button"
        size="sm"
        className="min-h-11 shrink-0"
        loading={pending}
        onClick={() => {
          startTransition(async () => {
            await onUndo();
            setVisible(false);
            onDismiss?.();
          });
        }}
      >
        {undoLabel}
      </Button>
    </div>
  );
}
