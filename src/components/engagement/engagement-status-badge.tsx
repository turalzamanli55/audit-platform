"use client";

import type { Database } from "@/types/supabase";

type RecordStatus = Database["public"]["Enums"]["record_status"];

type EngagementStatusBadgeProps = {
  status: RecordStatus | string;
  label: string;
  className?: string;
};

const STATUS_STYLES: Record<RecordStatus, string> = {
  active: "border-success/20 bg-success/10 text-success",
  inactive: "border-border/60 bg-muted text-muted-foreground",
  archived: "border-border/60 bg-muted/80 text-muted-foreground",
  suspended: "border-warning/25 bg-warning/10 text-warning",
};

function resolveStatus(status: string): RecordStatus | null {
  if (status in STATUS_STYLES) {
    return status as RecordStatus;
  }
  return null;
}

export function EngagementStatusBadge({ status, label, className = "" }: EngagementStatusBadgeProps) {
  const resolved = resolveStatus(status);
  const styles = resolved ? STATUS_STYLES[resolved] : "border-border/60 bg-muted text-muted-foreground";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles} ${className}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-80" />
      <span>{label}</span>
    </span>
  );
}
