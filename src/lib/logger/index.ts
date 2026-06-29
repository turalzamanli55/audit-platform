export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogContext = {
  correlationId?: string;
  tenantId?: string;
  userId?: string;
  module?: string;
  [key: string]: unknown;
};

export type LogEntry = {
  level: LogLevel;
  message: string;
  timestamp: string;
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

function shouldLog(level: LogLevel, minLevel: LogLevel): boolean {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[minLevel];
}

function formatEntry(entry: LogEntry): string {
  return JSON.stringify(entry);
}

function createLogger(minLevel: LogLevel = "info") {
  const log = (level: LogLevel, message: string, context?: LogContext, error?: Error) => {
    if (!shouldLog(level, minLevel)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error: error
        ? { name: error.name, message: error.message, stack: error.stack }
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
  };
}

export const logger = createLogger(
  process.env.NODE_ENV === "development" ? "debug" : "info",
);

export { createLogger };
