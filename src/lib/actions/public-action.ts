"use server";

import { createAction } from "./base";
import type { ActionHandler, ActionOptions, ActionResult } from "./types";

export function createPublicAction<TInput, TOutput>(
  options: ActionOptions,
  handler: ActionHandler<TInput, TOutput>,
) {
  return createAction(options, handler) as (input: TInput) => Promise<ActionResult<TOutput>>;
}
