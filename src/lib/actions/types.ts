import type { RequestLogContext } from "@/lib/logger/context";

export type ActionSuccess<T> = {
  success: true;
  data: T;
};

export type ActionFailure = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

export type ActionResult<T> = ActionSuccess<T> | ActionFailure;

export type ActionContext = RequestLogContext & {
  module: string;
};

export type ActionHandler<TInput, TOutput> = (
  input: TInput,
  context: ActionContext,
) => Promise<TOutput>;

export type ActionOptions = {
  module: string;
};
