import { buildPresentationBundle } from "@/lib/fs-rendering/presentation";

/**
 * Statement Renderer facade — thin orchestration around presentation engine.
 */
export function renderStatementBundle(
  ...args: Parameters<typeof buildPresentationBundle>
): ReturnType<typeof buildPresentationBundle> {
  return buildPresentationBundle(...args);
}
