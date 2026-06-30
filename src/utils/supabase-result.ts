import type { PostgrestError } from "@supabase/supabase-js";
import { DatabaseError } from "@/lib/errors";

export type SupabaseResult<T> = {
  data: T | null;
  error: PostgrestError | null;
};

export type NormalizedSupabaseResult<T> =
  | { success: true; data: T }
  | { success: false; error: DatabaseError };

export function normalizeSupabaseResult<T>(result: SupabaseResult<T>): NormalizedSupabaseResult<T> {
  if (result.error) {
    return {
      success: false,
      error: new DatabaseError(result.error.message, {
        code: result.error.code,
        details: result.error.details,
        hint: result.error.hint,
      }),
    };
  }

  if (result.data === null) {
    return {
      success: false,
      error: new DatabaseError("Expected data but received null"),
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

export function unwrapSupabaseResult<T>(result: SupabaseResult<T>): T {
  const normalized = normalizeSupabaseResult(result);
  if (!normalized.success) {
    throw normalized.error;
  }
  return normalized.data;
}

export function isSupabaseError(error: unknown): error is PostgrestError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error &&
    "details" in error
  );
}
