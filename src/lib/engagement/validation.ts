import {
  ENGAGEMENT_LIFECYCLE_STATUSES,
  ENGAGEMENT_REPORTING_FRAMEWORKS,
  ENGAGEMENT_TYPES,
} from "@/constants/engagement";
import type {
  EngagementLifecycleStatus,
  EngagementReportingFramework,
  EngagementType,
} from "@/types/engagement";
import { ValidationError } from "@/lib/errors";
import { toSlug } from "@/utils/auth-validation";

export type CreateEngagementInput = {
  name: string;
  companyId: string;
  engagementCode?: string | null;
  engagementType: EngagementType;
  reportingFramework: EngagementReportingFramework;
  periodStart?: string | null;
  periodEnd?: string | null;
  plannedStart?: string | null;
  plannedEnd?: string | null;
  description?: string | null;
  notes?: string | null;
};

export type UpdateEngagementInput = {
  name?: string;
  engagementCode?: string | null;
  engagementType?: EngagementType;
  lifecycleStatus?: EngagementLifecycleStatus;
  reportingFramework?: EngagementReportingFramework;
  periodStart?: string | null;
  periodEnd?: string | null;
  plannedStart?: string | null;
  plannedEnd?: string | null;
  description?: string | null;
  notes?: string | null;
};

function assertEnumValue<T extends string>(value: string, allowed: readonly T[], field: string): T {
  if (!allowed.includes(value as T)) {
    throw new ValidationError(`Invalid ${field}`);
  }
  return value as T;
}

function normalizeOptionalText(value?: string | null): string | null {
  if (value === undefined || value === null) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function assertDateOrder(start?: string | null, end?: string | null, label = "date range"): void {
  if (start && end && start > end) {
    throw new ValidationError(`Invalid ${label}: start must be before end`);
  }
}

export function validateCreateEngagementInput(input: CreateEngagementInput) {
  const name = input.name.trim();
  if (!name) {
    throw new ValidationError("Engagement name is required");
  }

  if (!input.companyId?.trim()) {
    throw new ValidationError("Client company is required");
  }

  const engagementType = assertEnumValue(input.engagementType, ENGAGEMENT_TYPES, "engagement type");
  const reportingFramework = assertEnumValue(
    input.reportingFramework,
    ENGAGEMENT_REPORTING_FRAMEWORKS,
    "reporting framework",
  );

  const periodStart = normalizeOptionalText(input.periodStart);
  const periodEnd = normalizeOptionalText(input.periodEnd);
  const plannedStart = normalizeOptionalText(input.plannedStart);
  const plannedEnd = normalizeOptionalText(input.plannedEnd);

  assertDateOrder(periodStart, periodEnd, "reporting period");
  assertDateOrder(plannedStart, plannedEnd, "planned dates");

  const slug = toSlug(name);
  if (!slug) {
    throw new ValidationError("Engagement name must contain valid characters");
  }

  return {
    name,
    slug,
    companyId: input.companyId.trim(),
    engagementCode: normalizeOptionalText(input.engagementCode),
    engagementType,
    reportingFramework,
    periodStart,
    periodEnd,
    plannedStart,
    plannedEnd,
    description: normalizeOptionalText(input.description),
    notes: normalizeOptionalText(input.notes),
  };
}

export function validateUpdateEngagementInput(input: UpdateEngagementInput) {
  const patch: UpdateEngagementInput = {};

  if (input.name !== undefined) {
    const name = input.name.trim();
    if (!name) {
      throw new ValidationError("Engagement name is required");
    }
    patch.name = name;
  }

  if (input.engagementCode !== undefined) {
    patch.engagementCode = normalizeOptionalText(input.engagementCode);
  }

  if (input.engagementType !== undefined) {
    patch.engagementType = assertEnumValue(
      input.engagementType,
      ENGAGEMENT_TYPES,
      "engagement type",
    );
  }

  if (input.lifecycleStatus !== undefined) {
    patch.lifecycleStatus = assertEnumValue(
      input.lifecycleStatus,
      ENGAGEMENT_LIFECYCLE_STATUSES,
      "lifecycle status",
    );
  }

  if (input.reportingFramework !== undefined) {
    patch.reportingFramework = assertEnumValue(
      input.reportingFramework,
      ENGAGEMENT_REPORTING_FRAMEWORKS,
      "reporting framework",
    );
  }

  if (input.periodStart !== undefined) patch.periodStart = normalizeOptionalText(input.periodStart);
  if (input.periodEnd !== undefined) patch.periodEnd = normalizeOptionalText(input.periodEnd);
  if (input.plannedStart !== undefined) {
    patch.plannedStart = normalizeOptionalText(input.plannedStart);
  }
  if (input.plannedEnd !== undefined) patch.plannedEnd = normalizeOptionalText(input.plannedEnd);
  if (input.description !== undefined) {
    patch.description = normalizeOptionalText(input.description);
  }
  if (input.notes !== undefined) patch.notes = normalizeOptionalText(input.notes);

  assertDateOrder(
    patch.periodStart ?? undefined,
    patch.periodEnd ?? undefined,
    "reporting period",
  );
  assertDateOrder(
    patch.plannedStart ?? undefined,
    patch.plannedEnd ?? undefined,
    "planned dates",
  );

  return patch;
}
