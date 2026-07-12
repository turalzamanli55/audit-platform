import type {
  AiHostActionBinding,
  AiHostActionDefinition,
  AiHostActionInvoker,
} from "@/lib/ai/host/types";
import { AI_HOST_ACTION_CATALOG } from "@/lib/ai/host/registry/catalog";

/**
 * Host Action Registry — registered server-action bindings only.
 * Invokers may be null on client; live invokers attached server-side.
 */
export class AiHostActionRegistry {
  private readonly bindings = new Map<string, AiHostActionBinding>();

  constructor(seed: readonly AiHostActionDefinition[] = AI_HOST_ACTION_CATALOG) {
    for (const definition of seed) {
      this.register({ ...definition, invoke: null });
    }
  }

  register(binding: AiHostActionBinding): void {
    this.bindings.set(binding.id, binding);
    this.bindings.set(binding.serverActionId, binding);
  }

  bindInvoker(idOrServerActionId: string, invoke: AiHostActionInvoker): void {
    const existing = this.require(idOrServerActionId);
    const next = { ...existing, invoke };
    this.bindings.set(existing.id, next);
    this.bindings.set(existing.serverActionId, next);
  }

  get(idOrServerActionId: string): AiHostActionBinding | undefined {
    return this.bindings.get(idOrServerActionId);
  }

  require(idOrServerActionId: string): AiHostActionBinding {
    const binding = this.get(idOrServerActionId);
    if (!binding) {
      throw new Error(`Host action "${idOrServerActionId}" is not registered.`);
    }
    return binding;
  }

  list(): AiHostActionBinding[] {
    const seen = new Set<string>();
    const out: AiHostActionBinding[] = [];
    for (const binding of this.bindings.values()) {
      if (seen.has(binding.id)) continue;
      seen.add(binding.id);
      out.push(binding);
    }
    return out;
  }

  findByToolHint(toolId: string): AiHostActionBinding | undefined {
    return this.list().find((binding) => binding.toolIdHints.includes(toolId));
  }

  findByEntityAndOperation(
    entityType: string,
    operation: string,
  ): AiHostActionBinding | undefined {
    const needle = `${entityType}.${operation}`.toLowerCase();
    return this.list().find((binding) => {
      const server = binding.serverActionId.toLowerCase();
      return (
        server === needle ||
        server.endsWith(`.${operation}`) &&
          binding.entityTypes.some((type) => type.toLowerCase() === entityType.toLowerCase())
      );
    });
  }
}

export function createPopulatedHostActionRegistry(): AiHostActionRegistry {
  return new AiHostActionRegistry();
}
