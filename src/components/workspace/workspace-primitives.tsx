"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/ui/cn";
import { workspaceTokens, type WorkspaceKpiCard, type WorkspaceKpiVariant } from "./workspace-tokens";

const kpiVariants: Record<WorkspaceKpiVariant, string> = {
  default: "border-border/50 bg-card/90",
  warning: "border-warning/40 bg-warning/5",
  success: "border-success/40 bg-success/5",
  destructive: "border-destructive/40 bg-destructive/5",
};

export function WorkspaceKpiRow({ title, items }: { title: string; items: WorkspaceKpiCard[] }) {
  return (
    <section className={workspaceTokens.sectionGap}>
      {title ? <h2 className={workspaceTokens.sectionEyebrow}>{title}</h2> : null}
      <div className={workspaceTokens.kpiGrid}>
        {items.map((item) => {
          const panel = (
            <div
              className={cn(
                "group rounded-2xl border p-4 transition-all duration-200 hover:shadow-sm motion-reduce:transition-none",
                kpiVariants[item.variant ?? "default"],
              )}
            >
              <p className={workspaceTokens.kpiLabel}>{item.label}</p>
              <p className={workspaceTokens.kpiValue}>{item.value}</p>
              {item.hint ? <p className={workspaceTokens.kpiHint}>{item.hint}</p> : null}
            </div>
          );

          if (item.href) {
            return (
              <Link
                key={item.id}
                href={item.href}
                className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {panel}
              </Link>
            );
          }

          return <div key={item.id}>{panel}</div>;
        })}
      </div>
    </section>
  );
}

export function WorkspaceCard({
  title,
  description,
  action,
  children,
  className,
  id,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        workspaceTokens.card,
        "ds-animate-fade-in motion-reduce:animate-none",
        className,
      )}
    >
      {title || description || action ? (
        <div className={workspaceTokens.cardHeader}>
          <div className="min-w-0 space-y-0.5">
            {title ? (
              <h3 className="text-sm font-semibold tracking-tight text-foreground">{title}</h3>
            ) : null}
            {description ? (
              <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {action}
        </div>
      ) : null}
      <div className={title || description || action ? workspaceTokens.cardBody : "p-4 sm:p-5"}>
        {children}
      </div>
    </section>
  );
}

export function WorkspaceEmpty({ title, description }: { title: string; description?: string }) {
  return (
    <div className={workspaceTokens.emptyInline}>
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? (
        <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

export function WorkspaceListRow({
  href,
  title,
  subtitle,
  meta,
  badge,
  onClick,
}: {
  href?: string;
  title: string;
  subtitle?: string;
  meta?: string;
  badge?: ReactNode;
  onClick?: () => void;
}) {
  const inner = (
    <div className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-muted/30 -mx-2 px-2 rounded-lg">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-medium text-foreground">{title}</p>
          {badge}
        </div>
        {subtitle ? (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {meta ? <span className="shrink-0 text-xs text-muted-foreground">{meta}</span> : null}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
      >
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className="block w-full text-left">
      {inner}
    </button>
  );
}

export function WorkspaceModuleBadge({ label }: { label: string }) {
  return (
    <Badge variant="secondary" className="text-[10px] font-medium uppercase tracking-wide">
      {label}
    </Badge>
  );
}

export function WorkspacePriorityDot({ priority }: { priority: "high" | "medium" | "low" }) {
  const colors = {
    high: "bg-destructive",
    medium: "bg-warning",
    low: "bg-muted-foreground/50",
  } as const;

  return <span className={cn("h-2 w-2 shrink-0 rounded-full", colors[priority])} aria-hidden />;
}
