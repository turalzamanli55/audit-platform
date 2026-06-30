import {
  AppError,
  AuthenticationError,
  AuthorizationError,
  ConflictError,
  DatabaseError,
  InternalServerError,
  NotFoundError,
  ValidationError,
  getUserSafeMessage,
  isAppError,
} from "./classes";
import { AuthError, PostgrestError } from "@supabase/supabase-js";

export function normalizeError(error: unknown): AppError {
  if (isAppError(error)) return error;

  if (error instanceof AuthError) {
    return new AuthenticationError(error.message, {
      status: error.status,
      code: error.code,
    });
  }

  if (isPostgrestError(error)) {
    return mapPostgrestError(error);
  }

  if (error instanceof Error) {
    return new InternalServerError(error.message, { cause: error.name });
  }

  return new InternalServerError("An unknown error occurred");
}

export function handleError(error: unknown, context?: Record<string, unknown>): AppError {
  const normalized = normalizeError(error);
  return new AppError(
    normalized.message,
    normalized.code,
    normalized.statusCode,
    { ...normalized.context, ...context },
    normalized.isOperational,
  );
}

export function toActionError(error: unknown): {
  success: false;
  error: { code: string; message: string };
} {
  const normalized = normalizeError(error);
  return {
    success: false,
    error: {
      code: normalized.code,
      message: getUserSafeMessage(normalized),
    },
  };
}

function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error &&
    "details" in error
  );
}

function mapPostgrestError(error: PostgrestError): AppError {
  const context = {
    code: error.code,
    details: error.details,
    hint: error.hint,
  };

  switch (error.code) {
    case "23505":
      return new ConflictError(error.message, context);
    case "42501":
      return new AuthorizationError(error.message, context);
    case "PGRST116":
      return new NotFoundError(error.message, context);
    case "22P02":
    case "23502":
    case "23503":
      return new ValidationError(error.message, context);
    default:
      return new DatabaseError(error.message, context);
  }
}

export {
  AppError,
  isAppError,
  getUserSafeMessage,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  DatabaseError,
  InfrastructureError,
  InternalServerError,
} from "./classes";
export type { ErrorCode } from "./classes";
