import type { ReactNode } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";

type FieldworkWorkspaceErrorProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
};

export function FieldworkWorkspaceError({
  title = "Unable to load fieldwork workspace",
  description = "Something went wrong while loading audit fieldwork.",
  action,
}: FieldworkWorkspaceErrorProps) {
  return (
    <div className="mx-auto max-w-lg space-y-3 px-4 py-16 text-center">
      <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}

type FieldworkWorkspaceEmptyProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  isPending?: boolean;
  canCreate?: boolean;
  gateDescription?: string;
  labels: Dictionary["fieldwork"]["empty"];
};

export function FieldworkWorkspaceEmpty({
  title,
  description,
  actionLabel,
  onAction,
  isPending = false,
  canCreate = false,
  gateDescription,
  labels,
}: FieldworkWorkspaceEmptyProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-dashed border-border/60 bg-card/40 px-6 py-12 text-center sm:px-10">
      <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {gateDescription ? (
        <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">{gateDescription}</p>
      ) : null}
      {!canCreate ? (
        <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
          {labels.forbiddenDescription}
        </p>
      ) : null}
      {canCreate && actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          disabled={isPending}
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? labels.creating : actionLabel}
        </button>
      ) : null}
    </div>
  );
}
