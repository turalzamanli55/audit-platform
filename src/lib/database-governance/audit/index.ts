import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { migrationParser } from "@/lib/database-governance/parser";
import type { ParsedMigration } from "@/lib/database-governance/types";

/**
 * Load and parse every SQL migration from supabase/migrations
 * via the MigrationParser normalization pipeline.
 */
export function loadMigrations(cwd = process.cwd()): ParsedMigration[] {
  const dir = join(cwd, "supabase", "migrations");
  const files = readdirSync(dir)
    .filter((name) => name.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b));

  return files.map((filename) => {
    const absolutePath = join(dir, filename);
    const sql = readFileSync(absolutePath, "utf8");
    return migrationParser.parseFile(absolutePath, filename, sql);
  });
}
