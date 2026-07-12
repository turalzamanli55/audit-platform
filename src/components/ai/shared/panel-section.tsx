import { workspaceTokens } from "@/components/workspace/workspace-tokens";
import { aiWorkspaceTokens } from "@/components/ai/shared/ai-tokens";
import { cn } from "@/lib/ui/cn";
import type { ReactNode } from "react";

export function AiPanelSection({
  title,
  children,
  className,
  actions,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}) {
  return (
    <section className={cn(aiWorkspaceTokens.panelSection, className)}>
      <div className="flex items-center justify-between gap-2">
        <h2 className={workspaceTokens.sectionEyebrow}>{title}</h2>
        {actions}
      </div>
      {children}
    </section>
  );
}

export function AiContextRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-2 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="truncate font-medium text-foreground" title={value}>
        {value || "—"}
      </dd>
    </div>
  );
}

export function AiStatusDot({
  tone,
  label,
}: {
  tone: "success" | "warning" | "danger" | "neutral";
  label: string;
}) {
  const color =
    tone === "success"
      ? "bg-emerald-500"
      : tone === "warning"
        ? "bg-amber-500"
        : tone === "danger"
          ? "bg-destructive"
          : "bg-muted-foreground";
  return (
    <span className={cn(aiWorkspaceTokens.chip, "gap-2")}>
      <span className={cn("h-2 w-2 shrink-0 rounded-full", color)} aria-hidden />
      <span className="truncate">{label}</span>
    </span>
  );
}
