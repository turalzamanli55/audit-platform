import type { ParsedMigration } from "@/lib/database-governance/types";
import { extractCreatedFunctions } from "@/lib/sql-foundation/audit";
import {
  SQL_FOUNDATION_ENUMS,
  SQL_FOUNDATION_EXTENSIONS,
  SQL_FOUNDATION_REQUIRED_HELPERS,
} from "@/lib/sql-foundation/catalog";
import type { SqlFoundationCoverage } from "@/lib/sql-foundation/types";

export function calculateFoundationCoverage(
  migrations: ParsedMigration[],
): SqlFoundationCoverage {
  const present = new Set(
    migrations.flatMap((migration) => extractCreatedFunctions(migration.sql)),
  );
  const requiredHelpers = [...SQL_FOUNDATION_REQUIRED_HELPERS];
  const presentHelpers = requiredHelpers.filter((helper) => present.has(helper));
  const missingHelpers = requiredHelpers.filter((helper) => !present.has(helper));
  const coveragePct =
    requiredHelpers.length === 0
      ? 100
      : Number(((presentHelpers.length / requiredHelpers.length) * 100).toFixed(2));

  return {
    requiredHelpers,
    presentHelpers,
    missingHelpers,
    coveragePct,
  };
}

export function listFoundationArtifacts(migrations: ParsedMigration[]): {
  helpers: string[];
  extensions: string[];
  enums: string[];
  foundationMigrationId: string | null;
} {
  const foundation =
    migrations.find((migration) =>
      migration.filename.includes("enterprise_sql_foundation"),
    ) ?? null;

  const helpers = migrations.flatMap((migration) =>
    extractCreatedFunctions(migration.sql),
  );
  const uniqueHelpers = [...new Set(helpers)].sort();

  return {
    helpers: uniqueHelpers.filter((helper) =>
      (SQL_FOUNDATION_REQUIRED_HELPERS as readonly string[]).includes(helper),
    ),
    extensions: [...SQL_FOUNDATION_EXTENSIONS],
    enums: [...SQL_FOUNDATION_ENUMS],
    foundationMigrationId: foundation?.id ?? null,
  };
}
