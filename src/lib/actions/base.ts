import { createRequestLogContext } from "@/lib/logger/context";
import { createLogger } from "@/lib/logger";
import { normalizeError, toActionError } from "@/lib/errors";
import type {
  ActionContext,
  ActionHandler,
  ActionOptions,
  ActionResult,
} from "./types";

async function executeAction<TInput, TOutput>(
  options: ActionOptions,
  handler: ActionHandler<TInput, TOutput>,
  input: TInput,
): Promise<ActionResult<TOutput>> {
  const requestContext = await createRequestLogContext();
  const context: ActionContext = {
    ...requestContext,
    module: options.module,
  };
  const log = createLogger(context);

  try {
    log.info("action.start", { module: options.module });
    const data = await handler(input, context);
    log.info("action.success", { module: options.module });
    return { success: true, data };
  } catch (error) {
    const normalized = normalizeError(error);
    log.error("action.failure", normalized, { module: options.module });
    return toActionError(normalized);
  }
}

export function createAction<TInput, TOutput>(
  options: ActionOptions,
  handler: ActionHandler<TInput, TOutput>,
) {
  return (input: TInput) => executeAction(options, handler, input);
}

export { executeAction };
