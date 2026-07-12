/**
 * Retry policy — network, timeout, and rate-limit aware exponential backoff.
 */

export type LlmRetryOptions = {
  maxAttempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  /** Abort overall retry loop. */
  signal?: AbortSignal;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
};

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason ?? new Error("aborted"));
      return;
    }
    const timer = setTimeout(resolve, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(signal?.reason ?? new Error("aborted"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

export function defaultShouldRetry(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const record = error as {
    code?: string;
    status?: number;
    statusCode?: number;
    name?: string;
  };
  const status = record.status ?? record.statusCode;
  if (status === 429 || status === 408 || status === 500 || status === 502 || status === 503) {
    return true;
  }
  if (record.code === "ETIMEDOUT" || record.code === "ECONNRESET" || record.code === "provider_rate_limited") {
    return true;
  }
  if (record.name === "AbortError" || record.name === "TimeoutError") return true;
  return false;
}

export async function withLlmRetry<T>(
  operation: (attempt: number) => Promise<T>,
  options: LlmRetryOptions = {},
): Promise<{ value: T; attempts: number }> {
  const maxAttempts = Math.max(1, options.maxAttempts ?? 3);
  const baseDelayMs = options.baseDelayMs ?? 250;
  const maxDelayMs = options.maxDelayMs ?? 4_000;
  const shouldRetry = options.shouldRetry ?? ((error) => defaultShouldRetry(error));

  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const value = await operation(attempt);
      return { value, attempts: attempt };
    } catch (error) {
      lastError = error;
      if (attempt >= maxAttempts || !shouldRetry(error, attempt)) {
        throw error;
      }
      const delay = Math.min(maxDelayMs, baseDelayMs * 2 ** (attempt - 1));
      const jitter = Math.floor(Math.random() * 50);
      await sleep(delay + jitter, options.signal);
    }
  }
  throw lastError;
}
