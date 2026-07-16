import type {
  ExtractedDomain,
  ExtractedFeature,
  ExtractedModule,
  SyncDiffEntry,
  SynchronizedCapability,
} from "@/lib/project-sync/types";

/**
 * Diff Engine — incremental change detection between snapshots.
 */
export function diffSynchronization(input: {
  previous: {
    domains: ExtractedDomain[];
    modules: ExtractedModule[];
    features: ExtractedFeature[];
    capabilities: SynchronizedCapability[];
  } | null;
  next: {
    domains: ExtractedDomain[];
    modules: ExtractedModule[];
    features: ExtractedFeature[];
    capabilities: SynchronizedCapability[];
  };
}): SyncDiffEntry[] {
  if (!input.previous) {
    return [
      ...input.next.domains.map((entity) => added("domain", entity.id, entity.name, entity)),
      ...input.next.modules.map((entity) => added("module", entity.id, entity.name, entity)),
      ...input.next.features.map((entity) => added("feature", entity.id, entity.name, entity)),
      ...input.next.capabilities.map((entity) => added("capability", entity.id, entity.name, entity)),
    ];
  }

  return [
    ...diffCollection("domain", input.previous.domains, input.next.domains),
    ...diffCollection("module", input.previous.modules, input.next.modules),
    ...diffCollection("feature", input.previous.features, input.next.features),
    ...diffCollection("capability", input.previous.capabilities, input.next.capabilities),
  ];
}

function diffCollection<T extends { id: string; name: string }>(
  kind: SyncDiffEntry["kind"],
  previous: T[],
  next: T[],
): SyncDiffEntry[] {
  const prevMap = new Map(previous.map((entity) => [entity.id, entity]));
  const nextMap = new Map(next.map((entity) => [entity.id, entity]));
  const entries: SyncDiffEntry[] = [];

  for (const [id, entity] of nextMap) {
    const before = prevMap.get(id);
    if (!before) {
      // Possible rename: same name different id should not happen with immutable ids
      const renamedFrom = previous.find(
        (candidate) => candidate.name.toLowerCase() === entity.name.toLowerCase() && candidate.id !== id,
      );
      if (renamedFrom) {
        entries.push({
          kind,
          id,
          name: entity.name,
          change: "renamed",
          before: renamedFrom as unknown as Record<string, unknown>,
          after: entity as unknown as Record<string, unknown>,
        });
      } else {
        entries.push(added(kind, id, entity.name, entity));
      }
      continue;
    }
    if (JSON.stringify(before) !== JSON.stringify(entity)) {
      entries.push({
        kind,
        id,
        name: entity.name,
        change: "modified",
        before: before as unknown as Record<string, unknown>,
        after: entity as unknown as Record<string, unknown>,
      });
    } else {
      entries.push({
        kind,
        id,
        name: entity.name,
        change: "unchanged",
        before: before as unknown as Record<string, unknown>,
        after: entity as unknown as Record<string, unknown>,
      });
    }
  }

  for (const [id, entity] of prevMap) {
    if (!nextMap.has(id)) {
      entries.push({
        kind,
        id,
        name: entity.name,
        change: "removed",
        before: entity as unknown as Record<string, unknown>,
        after: null,
      });
    }
  }

  return entries;
}

function added(
  kind: SyncDiffEntry["kind"],
  id: string,
  name: string,
  entity: unknown,
): SyncDiffEntry {
  return {
    kind,
    id,
    name,
    change: "added",
    before: null,
    after: entity as Record<string, unknown>,
  };
}
