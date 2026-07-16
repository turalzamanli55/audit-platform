import type { EngagementLifecycleStatus } from "@/types/engagement";
import { ValidationError } from "@/lib/errors";

/**
 * Engagement lifecycle state machine (PROJECT_BIBLE §13.2 Audit).
 * Forward path: draft → planning → fieldwork → review → completed → closed.
 * Controlled regressions allow returning work to the previous stage;
 * closed engagements are terminal.
 */
export const ENGAGEMENT_LIFECYCLE_TRANSITIONS: Record<
  EngagementLifecycleStatus,
  EngagementLifecycleStatus[]
> = {
  draft: ["planning"],
  planning: ["fieldwork", "draft"],
  fieldwork: ["review", "planning"],
  review: ["completed", "fieldwork"],
  completed: ["closed", "review"],
  closed: [],
};

export function nextEngagementLifecycleStatuses(
  from: EngagementLifecycleStatus,
): EngagementLifecycleStatus[] {
  return ENGAGEMENT_LIFECYCLE_TRANSITIONS[from] ?? [];
}

export function canTransitionEngagementLifecycle(
  from: EngagementLifecycleStatus,
  to: EngagementLifecycleStatus,
): boolean {
  return nextEngagementLifecycleStatuses(from).includes(to);
}

export function isTerminalEngagementLifecycleStatus(
  status: EngagementLifecycleStatus,
): boolean {
  return nextEngagementLifecycleStatuses(status).length === 0;
}

export function assertEngagementLifecycleTransition(
  from: EngagementLifecycleStatus,
  to: EngagementLifecycleStatus,
): void {
  if (from === to) {
    throw new ValidationError(`Engagement is already in "${from}"`);
  }
  if (!canTransitionEngagementLifecycle(from, to)) {
    const allowed = nextEngagementLifecycleStatuses(from);
    throw new ValidationError(
      allowed.length === 0
        ? `Engagement lifecycle "${from}" is terminal — no further transitions allowed`
        : `Invalid engagement lifecycle transition "${from}" → "${to}". Allowed: ${allowed.join(", ")}`,
    );
  }
}

/** Regressions (backward moves) require a documented reason. */
export function isRegressiveEngagementLifecycleTransition(
  from: EngagementLifecycleStatus,
  to: EngagementLifecycleStatus,
): boolean {
  const order: EngagementLifecycleStatus[] = [
    "draft",
    "planning",
    "fieldwork",
    "review",
    "completed",
    "closed",
  ];
  return order.indexOf(to) < order.indexOf(from);
}

export function assertEngagementLifecycleReason(
  from: EngagementLifecycleStatus,
  to: EngagementLifecycleStatus,
  reason: string | null | undefined,
): void {
  if (isRegressiveEngagementLifecycleTransition(from, to) && !reason?.trim()) {
    throw new ValidationError(
      `Returning an engagement from "${from}" to "${to}" requires a documented reason`,
    );
  }
}
