import { AiToolRegistry } from "@/lib/ai/tools/registry";
import { AiToolResolver } from "@/lib/ai/tools/resolver";
import { AiToolExecutor } from "@/lib/ai/tools/executor";
import { createPopulatedAiToolRegistry, AI_TOOL_CATALOG } from "@/lib/ai/tools/catalog";
import type {
  AiToolExecuteRequest,
  AiToolLlmDefinition,
  AiToolResolveRequest,
  AiToolResolveResult,
  AiToolResult,
  AiToolTelemetrySnapshot,
} from "@/lib/ai/tools/types";

export const AI_TOOL_RUNTIME_VERSION = "1.0.0" as const;

/**
 * Enterprise Tool Runtime facade.
 * Default execution mode is dry_run. Live mode is configurable per request.
 * LLM receives listLlmDefinitions() only — never repositories or server actions.
 */
export class AiToolRuntime {
  readonly version = AI_TOOL_RUNTIME_VERSION;
  readonly registry: AiToolRegistry;
  readonly resolver: AiToolResolver;
  readonly executor: AiToolExecutor;

  constructor(registry: AiToolRegistry = createPopulatedAiToolRegistry()) {
    this.registry = registry;
    this.resolver = new AiToolResolver(registry);
    this.executor = new AiToolExecutor(registry);
  }

  listLlmDefinitions(): AiToolLlmDefinition[] {
    return this.registry.listLlmDefinitions();
  }

  resolve(request: AiToolResolveRequest): AiToolResolveResult {
    return this.resolver.resolve(request);
  }

  execute(request: AiToolExecuteRequest): AiToolResult {
    return this.executor.execute({
      ...request,
      executionMode: request.executionMode ?? "dry_run",
    });
  }

  telemetry(): AiToolTelemetrySnapshot {
    return this.executor.telemetry.snapshot();
  }

  stats() {
    return {
      version: this.version,
      toolCount: this.registry.count(),
      catalogCount: AI_TOOL_CATALOG.length,
      telemetry: this.telemetry(),
    };
  }
}

export function bootstrapAiToolRuntime(): AiToolRuntime {
  return new AiToolRuntime();
}
