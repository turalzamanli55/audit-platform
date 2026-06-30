import { headers } from "next/headers";
import { generateUuid } from "@/utils/uuid";

export type RequestLogContext = {
  correlationId: string;
  requestId: string;
  sessionId?: string;
  userId?: string;
  tenantId?: string;
  module?: string;
  environment: string;
  [key: string]: unknown;
};

const CORRELATION_HEADER = "x-correlation-id";
const REQUEST_HEADER = "x-request-id";
const SESSION_HEADER = "x-session-id";

export async function createRequestLogContext(
  overrides?: Partial<RequestLogContext>,
): Promise<RequestLogContext> {
  const headerStore = await headers();
  const correlationId =
    headerStore.get(CORRELATION_HEADER) ?? headerStore.get(REQUEST_HEADER) ?? generateUuid();
  const requestId = headerStore.get(REQUEST_HEADER) ?? correlationId;
  const sessionId = headerStore.get(SESSION_HEADER) ?? undefined;

  return {
    correlationId,
    requestId,
    sessionId,
    environment: process.env.NODE_ENV ?? "development",
    ...overrides,
  };
}

export function createStaticLogContext(
  overrides?: Partial<RequestLogContext>,
): RequestLogContext {
  return {
    correlationId: generateUuid(),
    requestId: generateUuid(),
    environment: process.env.NODE_ENV ?? "development",
    ...overrides,
  };
}

export { CORRELATION_HEADER, REQUEST_HEADER, SESSION_HEADER };
