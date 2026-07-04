"use client";

import type { PlanningWorkflowStep } from "@/types/planning-command-center";
import { cn } from "@/lib/ui/cn";
import { IconArrowRight } from "@/components/ui/icons";

type PlanningWorkflowPipelineProps = {
  steps: PlanningWorkflowStep[];
  currentStepId: string;
};

export function PlanningWorkflowPipeline({ steps, currentStepId }: PlanningWorkflowPipelineProps) {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-[48rem] items-stretch gap-1.5">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-1 items-stretch gap-1.5">
            <div
              className={cn(
                "flex min-w-[7rem] flex-1 flex-col rounded-xl border px-3 py-3 transition-all sm:min-w-[8rem] sm:px-4",
                step.status === "current"
                  ? "border-primary/50 bg-primary/5 shadow-xs"
                  : step.status === "complete"
                    ? "border-success/30 bg-success/5"
                    : "border-border/50 bg-muted/10",
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                    step.status === "current"
                      ? "bg-primary text-primary-foreground"
                      : step.status === "complete"
                        ? "bg-success text-success-foreground"
                        : "bg-muted text-muted-foreground",
                  )}
                  aria-current={step.id === currentStepId ? "step" : undefined}
                >
                  {step.status === "complete" ? "✓" : index + 1}
                </span>
                <p className="text-xs font-semibold text-foreground sm:text-sm">{step.label}</p>
              </div>
            </div>
            {index < steps.length - 1 ? (
              <div className="flex items-center text-muted-foreground/40" aria-hidden>
                <IconArrowRight width={14} height={14} />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
