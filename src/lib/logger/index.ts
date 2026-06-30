import { isDevelopment, isProduction } from "@/lib/env";
import type { RequestLogContext } from "./context";

export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogContext = Partial<RequestLogContext> & {
  [key: string]: unknown;
};

export type LogEntry = {
  level: LogLevel;
  message: string;
  timestamp: string;
  environment: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
};

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const SECRET_PATTERNS = [
  /service_role/i,
  /supabase_service_role_key/i,
  /authorization:\s*bearer\s+/i,
  /eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/,
];

function shouldLog(level: LogLevel, minLevel: LogLevel): boolean {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[minLevel];
}

function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    return SECRET_PATTERNS.reduce(
      (acc, pattern) => acc.replace(pattern, "[REDACTED]"),
      value,
    );
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    return sanitizeContext(value as Record<string, unknown>);
  }

  return value;
}

function sanitizeContext(context: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(context)) {
    if (/key|secret|token|password|authorization/i.test(key)) {
      sanitized[key] = "[REDACTED]";
      continue;
    }
    sanitized[key] = sanitizeValue(value);
  }

  return sanitized;
}

function formatEntry(entry: LogEntry): string {
  return JSON.stringify(entry);
}

function resolveMinLevel(): LogLevel {
  return isDevelopment() ? "debug" : "info";
}

function createLogger(baseContext?: LogContext, minLevel: LogLevel = resolveMinLevel()) {
  const log = (level: LogLevel, message: string, context?: LogContext, error?: Error) => {
    if (!shouldLog(level, minLevel)) return;

    const mergedContext = sanitizeContext({
      ...baseContext,
      ...context,
    });

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      environment: isProduction() ? "production" : "development",
      context: Object.keys(mergedContext).length > 0 ? mergedContext : undefined,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: isDevelopment() ? error.stack : undefined,
          }
        : undefined,
    };

    const output = formatEntry(entry);

    switch (level) {
      case "error":
        console.error(output);
        break;
      case "warn":
        console.warn(output);
        break;
      case "debug":
        console.debug(output);
        break;
      default:
        console.log(output);
    }
  };

  return {
    debug: (message: string, context?: LogContext) => log("debug", message, context),
    info: (message: string, context?: LogContext) => log("info", message, context),
    warn: (message: string, context?: LogContext) => log("warn", message, context),
    error: (message: string, error?: Error, context?: LogContext) =>
      log("error", message, context, error),
    child: (context: LogContext) => createLogger({ ...baseContext, ...context }, minLevel),
  };
}

export const logger = createLogger();

export { createLogger };
