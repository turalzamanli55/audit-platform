export type ErrorCode =
  | "VALIDATION_ERROR"
  | "AUTHENTICATION_ERROR"
  | "AUTHORIZATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "DATABASE_ERROR"
  | "INFRASTRUCTURE_ERROR"
  | "INTERNAL_SERVER_ERROR"
  | "BUSINESS_RULE_VIOLATION"
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

export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "VALIDATION_ERROR", 400, context);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication required", context?: Record<string, unknown>) {
    super(message, "AUTHENTICATION_ERROR", 401, context);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Permission denied", context?: Record<string, unknown>) {
    super(message, "AUTHORIZATION_ERROR", 403, context);
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found", context?: Record<string, unknown>) {
    super(message, "NOT_FOUND", 404, context);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource conflict", context?: Record<string, unknown>) {
    super(message, "CONFLICT", 409, context);
    this.name = "ConflictError";
  }
}

export class DatabaseError extends AppError {
  constructor(message = "Database operation failed", context?: Record<string, unknown>) {
    super(message, "DATABASE_ERROR", 500, context, false);
    this.name = "DatabaseError";
  }
}

export class InfrastructureError extends AppError {
  constructor(message = "Infrastructure error", context?: Record<string, unknown>) {
    super(message, "INFRASTRUCTURE_ERROR", 503, context, false);
    this.name = "InfrastructureError";
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Internal server error", context?: Record<string, unknown>) {
    super(message, "INTERNAL_SERVER_ERROR", 500, context, false);
    this.name = "InternalServerError";
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
