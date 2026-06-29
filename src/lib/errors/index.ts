export type ErrorCode =
  | "VALIDATION_ERROR"
  | "AUTHORIZATION_ERROR"
  | "NOT_FOUND"
  | "BUSINESS_RULE_VIOLATION"
  | "INFRASTRUCTURE_ERROR"
  | "UNKNOWN_ERROR";

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;
  readonly isOperational: boolean;
  readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    code: ErrorCode = "UNKNOWN_ERROR",
    statusCode = 500,
    context?: Record<string, unknown>,
    isOperational = true,
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.context = context;
    this.isOperational = isOperational;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function getUserSafeMessage(error: unknown): string {
  if (isAppError(error) && error.isOperational) {
    return error.message;
  }
  return "An unexpected error occurred. Please try again.";
}

export function normalizeError(error: unknown): AppError {
  if (isAppError(error)) return error;

  if (error instanceof Error) {
    return new AppError(error.message, "UNKNOWN_ERROR", 500, undefined, false);
  }

  return new AppError("An unknown error occurred", "UNKNOWN_ERROR", 500, undefined, false);
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
