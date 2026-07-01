import type { WizardStepDefinition } from "./wizard-shell";

type WizardProgressProps = {
  steps: WizardStepDefinition[];
  currentStep: number;
  onStepSelect?: (index: number) => void;
};

export function WizardProgress({ steps, currentStep, onStepSelect }: WizardProgressProps) {
  return (
    <nav aria-label="Wizard progress" className="mb-8">
      <ol className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isComplete = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const canSelect = onStepSelect && stepNumber < currentStep;

          return (
            <li key={step.id} className="flex min-w-0 flex-1 items-center gap-3">
              <button
                type="button"
                disabled={!canSelect}
                onClick={() => canSelect && onStepSelect?.(stepNumber)}
                className={`flex min-w-0 flex-1 items-center gap-3 rounded-xl px-2 py-1 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default ${
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
                  className={`truncate text-sm ${
                    isCurrent ? "font-medium text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </button>
              {index < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="hidden h-px flex-1 bg-border/60 sm:block"
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
