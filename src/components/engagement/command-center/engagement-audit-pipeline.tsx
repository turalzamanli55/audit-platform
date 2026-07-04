"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { IconArrowRight } from "@/components/ui/icons";
import type { EngagementPipelinePhase } from "@/types/engagement-command-center";
import { cn } from "@/lib/ui/cn";

type EngagementAuditPipelineProps = {
  phases: EngagementPipelinePhase[];
  ownerLabel: string;
  lastUpdateLabel: string;
};

export function EngagementAuditPipeline({
  phases,
  ownerLabel,
  lastUpdateLabel,
}: EngagementAuditPipelineProps) {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-[56rem] gap-2">
        {phases.map((phase, index) => (
          <div key={phase.id} className="flex flex-1 items-stretch gap-2">
            <article
              className={cn(
                "flex min-w-[8.5rem] flex-1 flex-col rounded-xl border p-3.5 transition-all sm:min-w-[9.5rem] sm:p-4",
                phase.isActive
                  ? "border-primary/40 bg-primary/5 shadow-xs"
                  : "border-border/50 bg-card/80",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-xs font-semibold tracking-tight text-foreground sm:text-sm">
                  {phase.label}
                </h3>
                <Badge variant={phase.statusVariant} className="shrink-0 text-[10px]">
                  {phase.statusLabel}
                </Badge>
              </div>

              {phase.isEmpty ? (
                <p className="mt-3 flex-1 text-xs text-muted-foreground">—</p>
              ) : (
                <>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-foreground/75"
                      style={{ width: `${phase.progressPct}%` }}
                      role="progressbar"
                      aria-valuenow={phase.progressPct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] tabular-nums text-muted-foreground">
                    {phase.progressPct}%
                  </p>
                  <dl className="mt-2 space-y-1 text-[10px] text-muted-foreground">
                    {phase.owner ? (
                      <div>
                        <dt className="inline">{ownerLabel}: </dt>
                        <dd className="inline text-foreground">{phase.owner}</dd>
                      </div>
                    ) : null}
                    <div>
                      <dt className="inline">{lastUpdateLabel}: </dt>
                      <dd className="inline text-foreground">{phase.lastUpdateRelative}</dd>
                    </div>
                  </dl>
                </>
              )}

              <Link
                href={phase.href}
                className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
              >
                {phase.ctaLabel}
                <IconArrowRight width={10} height={10} />
              </Link>
            </article>

            {index < phases.length - 1 ? (
              <div className="flex items-center text-muted-foreground/50" aria-hidden>
                <IconArrowRight width={14} height={14} className="rotate-0" />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
