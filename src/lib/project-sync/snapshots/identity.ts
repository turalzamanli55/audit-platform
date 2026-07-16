import type { ImmutableIdentity, SyncEntityKind, SyncSnapshot } from "@/lib/project-sync/types";
import { nowIso, stableId } from "@/lib/project-sync/utils";

/**
 * Immutable identity store — rename preserves identity; IDs never regenerated.
 */
export function ensureIdentity(
  identities: ImmutableIdentity[],
  kind: SyncEntityKind,
  name: string,
  preferredId?: string,
): { identities: ImmutableIdentity[]; id: string } {
  const existing = identities.find(
    (identity) =>
      identity.kind === kind &&
      (identity.canonicalName.toLowerCase() === name.toLowerCase() ||
        identity.aliases.some((alias) => alias.toLowerCase() === name.toLowerCase()) ||
        (preferredId != null && identity.id === preferredId)),
  );
  if (existing) {
    if (existing.canonicalName !== name && !existing.aliases.includes(name)) {
      return {
        id: existing.id,
        identities: identities.map((identity) =>
          identity.id === existing.id
            ? {
                ...identity,
                aliases: [...new Set([...identity.aliases, existing.canonicalName])],
                canonicalName: name,
                updatedAt: nowIso(),
              }
            : identity,
        ),
      };
    }
    return { identities, id: existing.id };
  }

  const id = preferredId ?? stableId(kindPrefix(kind), name);
  const created: ImmutableIdentity = {
    id,
    kind,
    canonicalName: name,
    aliases: [],
    createdAt: nowIso(),
    updatedAt: nowIso(),
    deprecated: false,
  };
  return { identities: [...identities, created], id };
}

export function identitiesFromSnapshot(snapshot: SyncSnapshot | null): ImmutableIdentity[] {
  return snapshot?.identities ? [...snapshot.identities] : [];
}

function kindPrefix(kind: SyncEntityKind): string {
  switch (kind) {
    case "domain":
      return "dom";
    case "module":
      return "mod";
    case "feature":
      return "feat";
    case "capability":
      return "cap";
    case "requirement":
      return "req";
    default:
      return "ent";
  }
}
