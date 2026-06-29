export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: ValidationError[] };

export type ValidationError = {
  field: string;
  message: string;
  code?: string;
};

export function success<T>(data: T): ValidationResult<T> {
  return { success: true, data };
}

export function failure<T>(errors: ValidationError[]): ValidationResult<T> {
  return { success: false, errors };
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateRequired(
  value: unknown,
  field: string,
  message = "This field is required",
): ValidationError | null {
  if (value === null || value === undefined) return { field, message, code: "REQUIRED" };
  if (typeof value === "string" && value.trim().length === 0) {
    return { field, message, code: "REQUIRED" };
  }
  return null;
}

export function combineResults<T>(...results: ValidationResult<T>[]): ValidationResult<T> {
  const errors = results.flatMap((r) => (r.success ? [] : r.errors));
  if (errors.length > 0) return failure(errors);
  const data = results.find((r) => r.success)?.data;
  if (data === undefined) return failure([{ field: "_", message: "No data" }]);
  return success(data);
}
