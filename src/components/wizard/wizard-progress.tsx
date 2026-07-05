"use client";

import { Fragment } from "react";
import { useUiLabels } from "@/i18n/use-shell-labels";
import type { WizardStepDefinition } from "./wizard-shell";

type WizardProgressProps = {
  steps: WizardStepDefinition[];
  currentStep: number;
  onStepSelect?: (index: number) => void;
};

export function WizardProgress({ steps, currentStep, onStepSelect }: WizardProgressProps) {
  const { wizardProgress } = useUiLabels();

  return (
    <nav aria-label={wizardProgress} className="mb-8 overflow-x-auto">
      <ol className="flex w-max min-w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isComplete = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const canSelect = onStepSelect && stepNumber < currentStep;

          return (
            <Fragment key={step.id}>
              <li className="flex shrink-0 items-center">
                <button
                  type="button"
                  disabled={!canSelect}
                  onClick={() => canSelect && onStepSelect?.(stepNumber)}
                  className={`flex items-center gap-2 rounded-xl px-2 py-1 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default ${
                    isCurrent ? "bg-accent/50" : "hover:bg-muted/60"
                  }`}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  <span
                    className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                      isComplete
                        ? "bg-primary text-primary-foreground"
                        : isCurrent
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isComplete ? "✓" : stepNumber}
                  </span>
                  <span
                    className={`whitespace-nowrap text-sm ${
                      isCurrent ? "font-medium text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </button>
              </li>
              {index < steps.length - 1 ? (
                <li aria-hidden className="hidden min-w-3 flex-1 items-center sm:flex">
                  <span className="block h-px w-full bg-border/60" />
                </li>
              ) : null}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
