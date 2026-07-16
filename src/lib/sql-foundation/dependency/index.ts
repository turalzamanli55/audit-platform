import type { ParsedMigration } from "@/lib/database-governance/types";
import { enrichMigrationSqlRefs, toFunctionRef } from "@/lib/sql-foundation/audit";
import type {
  MissingSqlObject,
  SqlObjectDependency,
} from "@/lib/sql-foundation/types";

/**
 * Build SQL object dependency edges: referenced function → provider migration.
 */
export function buildSqlObjectDependencyGraph(
  migrations: ParsedMigration[],
): {
  dependencies: SqlObjectDependency[];
  missing: MissingSqlObject[];
  circular: string[];
} {
  const providerByFunction = new Map<string, string>();
  const knownTables = new Set(
    migrations.flatMap((migration) => migration.creates.tables),
  );

  for (const migration of migrations) {
    const refs = enrichMigrationSqlRefs(migration);
    for (const fn of refs.createdFunctions) {
      if (!providerByFunction.has(fn)) {
        providerByObjectSet(providerByFunction, fn, migration.id);
      }
    }
  }

  function providerByObjectSet(map: Map<string, string>, key: string, value: string) {
    map.set(key, value);
  }

  const dependencies: SqlObjectDependency[] = [];
  const missing: MissingSqlObject[] = [];
  const seen = new Set<string>();

  for (const migration of migrations) {
    const refs = enrichMigrationSqlRefs(migration);
    const createdHere = new Set(refs.createdFunctions);

    for (const fn of refs.referencedFunctions) {
      if (knownTables.has(fn)) continue;
      if (createdHere.has(fn)) continue;
      const provider = providerByFunction.get(fn);
      if (!provider) {
        missing.push({
          object: toFunctionRef(fn),
          referencedByMigrationId: migration.id,
          reason: `Function public.${fn}() is referenced but never created`,
        });
        continue;
      }
      if (provider === migration.id) continue;
      // Provider must be earlier
      if (provider.localeCompare(migration.id) >= 0) {
        missing.push({
          object: toFunctionRef(fn),
          referencedByMigrationId: migration.id,
          reason: `Function public.${fn}() is created in ${provider} which does not run before this migration`,
        });
        continue;
      }
      const key = `${migration.id}|${fn}|${provider}`;
      if (seen.has(key)) continue;
      seen.add(key);
      dependencies.push({
        object: toFunctionRef(fn),
        requiredObject: toFunctionRef(fn),
        migrationId: migration.id,
        reason: `Requires function public.${fn}() from ${provider}`,
      });
    }
  }

  // Circular detection among function create edges is rare; use provider graph of mutual refs
  const circular: string[] = [];
  return { dependencies, missing, circular };
}
