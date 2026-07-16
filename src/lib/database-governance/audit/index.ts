import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  classifyMigrationLayer,
  hashSql,
  parseMigrationFilename,
  stripSqlComments,
  uniqueSorted,
} from "@/lib/database-governance/utils";
import type { ParsedMigration } from "@/lib/database-governance/types";

function matchAll(sql: string, pattern: RegExp): string[] {
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  const re = new RegExp(pattern.source, flags);
  const out: string[] = [];
  for (const match of sql.matchAll(re)) {
    if (match[1]) out.push(match[1]);
  }
  return uniqueSorted(out);
}

/**
 * Load and parse every SQL migration from supabase/migrations.
 */
export function loadMigrations(cwd = process.cwd()): ParsedMigration[] {
  const dir = join(cwd, "supabase", "migrations");
  const files = readdirSync(dir)
    .filter((name) => name.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b));

  return files.map((filename) => {
    const absolutePath = join(dir, filename);
    const sql = readFileSync(absolutePath, "utf8");
    const meta = parseMigrationFilename(filename);
    if (!meta) {
      throw new Error(`Invalid migration filename: ${filename}`);
    }
    const cleaned = stripSqlComments(sql);
    const layer = classifyMigrationLayer(filename, sql);

    const createsTables = matchAll(
      cleaned,
      /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?([a-zA-Z0-9_]+)/gi,
    );
    const createsEnums = matchAll(
      cleaned,
      /CREATE\s+TYPE\s+(?:public\.)?([a-zA-Z0-9_]+)\s+AS\s+ENUM/gi,
    );
    const createsFunctions = matchAll(
      cleaned,
      /CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\s+(?:public\.)?([a-zA-Z0-9_]+)/gi,
    );
    const createsViews = matchAll(
      cleaned,
      /CREATE\s+(?:OR\s+REPLACE\s+)?(?:MATERIALIZED\s+)?VIEW\s+(?:public\.)?([a-zA-Z0-9_]+)/gi,
    );
    const createsTriggers = matchAll(
      cleaned,
      /CREATE\s+(?:OR\s+REPLACE\s+)?TRIGGER\s+([a-zA-Z0-9_]+)/gi,
    );
    const createsIndexes = matchAll(
      cleaned,
      /CREATE\s+(?:UNIQUE\s+)?INDEX\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_]+)/gi,
    );
    const createsPolicies = matchAll(
      cleaned,
      /CREATE\s+POLICY\s+([a-zA-Z0-9_]+)/gi,
    );
    const createsExtensions = matchAll(
      cleaned,
      /CREATE\s+EXTENSION\s+(?:IF\s+NOT\s+EXISTS\s+)?["']?([a-zA-Z0-9_]+)["']?/gi,
    );

    const addColumns: Array<{ table: string; column: string }> = [];
    for (const match of cleaned.matchAll(
      /ALTER\s+TABLE\s+(?:IF\s+EXISTS\s+)?(?:public\.)?([a-zA-Z0-9_]+)\s+([\s\S]*?)(?=;)/gi,
    )) {
      const table = match[1]!.toLowerCase();
      const body = match[2] ?? "";
      for (const col of body.matchAll(
        /ADD\s+COLUMN\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_]+)/gi,
      )) {
        addColumns.push({ table, column: col[1]!.toLowerCase() });
      }
    }

    const foreignKeys: ParsedMigration["foreignKeys"] = [];
    for (const match of cleaned.matchAll(
      /(?:public\.)?([a-zA-Z0-9_]+)\s+[a-zA-Z0-9_()\s]+REFERENCES\s+(?:public\.)?([a-zA-Z0-9_]+)/gi,
    )) {
      foreignKeys.push({
        table: "inferred",
        column: match[1]!.toLowerCase(),
        references: match[2]!.toLowerCase(),
      });
    }
    // More precise: column_name type REFERENCES table
    for (const match of cleaned.matchAll(
      /\b([a-zA-Z0-9_]+)\s+(?:uuid|text|citext|integer|bigint|timestamptz|jsonb|boolean)[^\n,]*?REFERENCES\s+(?:public\.)?([a-zA-Z0-9_]+)/gi,
    )) {
      foreignKeys.push({
        table: "column",
        column: match[1]!.toLowerCase(),
        references: match[2]!.toLowerCase(),
      });
    }

    const permissionInserts: ParsedMigration["permissionInserts"] = [];
    for (const match of cleaned.matchAll(
      /INSERT\s+INTO\s+(?:public\.)?permissions\s*\(([^)]+)\)/gi,
    )) {
      const columns = match[1]!
        .split(",")
        .map((part) => part.trim().toLowerCase())
        .filter(Boolean);
      permissionInserts.push({ columns });
    }

    const enablesRls = matchAll(
      cleaned,
      /ALTER\s+TABLE\s+(?:public\.)?([a-zA-Z0-9_]+)\s+ENABLE\s+ROW\s+LEVEL\s+SECURITY/gi,
    );
    const grants = matchAll(cleaned, /GRANT\s+[\w\s,]+\s+ON\s+(?:TABLE\s+)?(?:public\.)?([a-zA-Z0-9_]+)/gi);
    const storageBuckets = matchAll(
      cleaned,
      /storage\.buckets[\s\S]*?'([a-zA-Z0-9_-]+)'/gi,
    );

    const requiredTables = uniqueSorted([
      ...foreignKeys.map((fk) => fk.references),
      ...matchAll(cleaned, /FROM\s+(?:public\.)?([a-zA-Z0-9_]+)/gi),
      ...matchAll(cleaned, /JOIN\s+(?:public\.)?([a-zA-Z0-9_]+)/gi),
      ...matchAll(cleaned, /UPDATE\s+(?:public\.)?([a-zA-Z0-9_]+)/gi),
      ...matchAll(cleaned, /ALTER\s+TABLE\s+(?:IF\s+EXISTS\s+)?(?:public\.)?([a-zA-Z0-9_]+)/gi),
    ]).filter(
      (table) =>
        ![
          "auth",
          "storage",
          "information_schema",
          "pg_catalog",
          "select",
          "insert",
          "update",
          "delete",
          "values",
          "set",
          "where",
        ].includes(table),
    );

    const requiredFunctions = matchAll(
      cleaned,
      /(?:public\.)?([a-zA-Z0-9_]+)\s*\(/gi,
    ).filter((name) =>
      [
        "user_belongs_to_organization",
        "user_belongs_to_workspace",
        "user_can_access_engagement",
        "user_can_access_audit_plan",
        "user_can_access_fieldwork_package",
        "user_can_access_risk_assessment",
        "user_can_access_trial_balance_package",
        "is_service_role",
        "utc_now",
      ].includes(name),
    );

    const requiredEnums = matchAll(
      cleaned,
      /public\.([a-zA-Z0-9_]+)\s+NOT\s+NULL/gi,
    );

    return {
      id: meta.id,
      filename,
      absolutePath,
      timestamp: meta.timestamp,
      name: meta.name,
      bytes: statSync(absolutePath).size,
      hash: hashSql(sql),
      sql,
      layer,
      creates: {
        extensions: createsExtensions,
        enums: createsEnums,
        tables: createsTables,
        functions: createsFunctions,
        views: createsViews,
        triggers: createsTriggers,
        indexes: createsIndexes,
        policies: createsPolicies,
        types: createsEnums,
      },
      alters: {
        tables: uniqueSorted(addColumns.map((entry) => entry.table)),
        addColumns,
      },
      foreignKeys,
      grants,
      permissionInserts,
      enablesRls,
      storageBuckets,
      requiredTables,
      requiredFunctions,
      requiredEnums,
    };
  });
}
