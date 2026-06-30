import { ConflictError, NotFoundError } from "@/lib/errors";

type ActiveFilterQuery = {
  is: (column: string, value: null) => ActiveFilterQuery;
};

export function applyActiveFilter<T extends ActiveFilterQuery>(query: T): T {
  return query.is("deleted_at", null) as T;
}

export function requireRow<T>(row: T | null, resource: string, id?: string): T {
  if (!row) {
    throw new NotFoundError(`${resource} not found`, id ? { id } : undefined);
  }
  return row;
}

export function assertVersionMatch(actualVersion: number, expectedVersion: number, resource: string): void {
  if (actualVersion !== expectedVersion) {
    throw new ConflictError(`${resource} version conflict`, {
      expectedVersion,
      actualVersion,
    });
  }
}

export const DEFAULT_ORGANIZATION_SETTINGS = {
  locale: "en",
  timezone: "UTC",
  date_format: "YYYY-MM-DD",
  currency_display: "symbol",
  notifications_enabled: true,
  security_mfa_required: false,
} as const;

export const DEFAULT_WORKSPACE_SETTINGS = {
  locale: "en",
  timezone: "UTC",
  fiscal_year_start_month: 1,
  default_engagement_visibility: "members",
} as const;

export const DEFAULT_COMPANY_SETTINGS = {
  reporting_currency: "USD",
  functional_currency: "USD",
  industry_code: null,
} as const;
