import type { LifecycleObjectType } from "./types";
import type { EntityLifecycleAdapter } from "./registry-types";

const adapters = new Map<LifecycleObjectType, EntityLifecycleAdapter>();

/** Register (or replace) a metadata-only entity lifecycle adapter. */
export function registerEntityLifecycleAdapter(adapter: EntityLifecycleAdapter): void {
  adapters.set(adapter.objectType, adapter);
}

export function getEntityLifecycleAdapter(
  objectType: LifecycleObjectType,
): EntityLifecycleAdapter | null {
  return adapters.get(objectType) ?? null;
}

export function listRegisteredLifecycleTypes(): LifecycleObjectType[] {
  return [...adapters.keys()];
}

export function requireEntityLifecycleAdapter(
  objectType: LifecycleObjectType,
): EntityLifecycleAdapter {
  const adapter = getEntityLifecycleAdapter(objectType);
  if (!adapter) {
    throw new Error(`No EntityLifecycleAdapter registered for "${objectType}"`);
  }
  return adapter;
}
