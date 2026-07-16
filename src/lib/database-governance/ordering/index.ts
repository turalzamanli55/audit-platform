import type {
  MigrationDependency,
  MigrationFinding,
  ParsedMigration,
} from "@/lib/database-governance/types";

/**
 * Validate chronological order and that dependencies precede dependents.
 */
export function validateMigrationOrdering(
  migrations: ParsedMigration[],
  dependencies: MigrationDependency[],
): MigrationFinding[] {
  const findings: MigrationFinding[] = [];
  const indexById = new Map(migrations.map((migration, index) => [migration.id, index]));

  for (let index = 1; index < migrations.length; index += 1) {
    const previous = migrations[index - 1]!;
    const current = migrations[index]!;
    if (current.timestamp < previous.timestamp) {
      findings.push({
        code: "chronological_order",
        severity: "error",
        migrationId: current.id,
        message: `Timestamp ${current.timestamp} sorts after ${previous.id} but is chronologically earlier`,
      });
    }
  }

  const duplicates = new Map<string, number>();
  for (const migration of migrations) {
    duplicates.set(migration.timestamp, (duplicates.get(migration.timestamp) ?? 0) + 1);
  }
  for (const [timestamp, count] of duplicates) {
    if (count > 1) {
      findings.push({
        code: "duplicate_timestamp",
        severity: "error",
        migrationId: timestamp,
        message: `Duplicate migration timestamp ${timestamp} appears ${count} times`,
      });
    }
  }

  for (const edge of dependencies) {
    const dependentIndex = indexById.get(edge.migrationId);
    const requiredIndex = indexById.get(edge.requiresMigrationId);
    if (dependentIndex == null || requiredIndex == null) continue;
    if (requiredIndex >= dependentIndex) {
      findings.push({
        code: "dependency_order",
        severity: "error",
        migrationId: edge.migrationId,
        message: `Depends on ${edge.requiresMigrationId} which does not run earlier (${edge.reason})`,
        details: { reason: edge.reason },
      });
    }
  }

  for (const migration of migrations) {
    if (migration.bytes === 0) {
      findings.push({
        code: "empty_migration",
        severity: "warning",
        migrationId: migration.id,
        message: "Migration file is empty",
      });
    }
  }

  return findings;
}
