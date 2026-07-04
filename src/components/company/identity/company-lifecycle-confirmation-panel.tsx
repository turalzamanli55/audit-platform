"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkspacePanel } from "@/components/workspace";

type CompanyLifecycleConfirmationPanelProps = {
  title: string;
  description: string;
  reasonLabel: string;
  reasonPlaceholder: string;
  confirmLabel: string;
  cancelLabel: string;
  isPending: boolean;
  variant?: "destructive" | "default";
  onConfirm: (reason: string) => void;
  onCancel: () => void;
};

export function CompanyLifecycleConfirmationPanel({
  title,
  description,
  reasonLabel,
  reasonPlaceholder,
  confirmLabel,
  cancelLabel,
  isPending,
  variant = "default",
  onConfirm,
  onCancel,
}: CompanyLifecycleConfirmationPanelProps) {
  const [reason, setReason] = useState("");

  return (
    <WorkspacePanel variant="muted" className="space-y-4">
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-2">
        <label htmlFor="lifecycle-reason" className="text-sm font-medium text-foreground">
          {reasonLabel}
        </label>
        <Input
          id="lifecycle-reason"
          name="lifecycle-reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder={reasonPlaceholder}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isPending}
          className={
            variant === "destructive"
              ? "border-destructive/30 text-destructive hover:bg-destructive/10"
              : undefined
          }
        >
          {cancelLabel}
        </Button>
        <Button
          type="button"
          onClick={() => onConfirm(reason)}
          disabled={isPending}
          className={
            variant === "destructive"
              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              : undefined
          }
        >
          {confirmLabel}
        </Button>
      </div>
    </WorkspacePanel>
  );
}
