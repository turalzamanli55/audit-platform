import { stripSqlComments, uniqueSorted } from "@/lib/database-governance/utils";
import type { ParsedMigration } from "@/lib/database-governance/types";
import { PLATFORM_SQL_FUNCTIONS } from "@/lib/sql-foundation/catalog";
import type { SqlObjectRef } from "@/lib/sql-foundation/types";

const SQL_KEYWORDS = new Set([
  "select",
  "insert",
  "update",
  "delete",
  "from",
  "where",
  "and",
  "or",
  "not",
  "null",
  "true",
  "false",
  "case",
  "when",
  "then",
  "else",
  "end",
  "join",
  "left",
  "right",
  "inner",
  "outer",
  "on",
  "as",
  "in",
  "is",
  "between",
  "like",
  "ilike",
  "returning",
  "values",
  "set",
  "into",
  "with",
  "over",
  "partition",
  "order",
  "group",
  "having",
  "limit",
  "offset",
  "union",
  "all",
  "distinct",
  "exists",
  "any",
  "some",
  "array",
  "row",
  "cast",
  "filter",
]);

export function extractCreatedFunctions(sql: string): string[] {
  const cleaned = stripSqlComments(sql);
  return uniqueSorted(
    [...cleaned.matchAll(/CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\s+(?:public\.)?([a-zA-Z0-9_]+)/gi)].map(
      (match) => match[1]!.toLowerCase(),
    ),
  );
}

export function extractCreatedEnums(sql: string): string[] {
  const cleaned = stripSqlComments(sql);
  return uniqueSorted(
    [...cleaned.matchAll(/CREATE\s+TYPE\s+(?:public\.)?([a-zA-Z0-9_]+)\s+AS\s+ENUM/gi)].map(
      (match) => match[1]!.toLowerCase(),
    ),
  );
}

export function extractCreatedExtensions(sql: string): string[] {
  const cleaned = stripSqlComments(sql);
  return uniqueSorted(
    [
      ...cleaned.matchAll(
        /CREATE\s+EXTENSION\s+(?:IF\s+NOT\s+EXISTS\s+)?["']?([a-zA-Z0-9_]+)["']?/gi,
      ),
    ].map((match) => match[1]!.toLowerCase()),
  );
}

export function extractCreatedViews(sql: string): string[] {
  const cleaned = stripSqlComments(sql);
  return uniqueSorted(
    [
      ...cleaned.matchAll(
        /CREATE\s+(?:OR\s+REPLACE\s+)?(?:MATERIALIZED\s+)?VIEW\s+(?:public\.)?([a-zA-Z0-9_]+)/gi,
      ),
    ].map((match) => match[1]!.toLowerCase()),
  );
}

/**
 * Extract referenced public.* function calls from migration SQL.
 * Excludes table references such as REFERENCES public.organizations (
 */
export function extractReferencedFunctions(sql: string): string[] {
  const cleaned = stripSqlComments(sql);
  const refs = new Set<string>();

  for (const match of cleaned.matchAll(
    /(?<!(?:REFERENCES|FROM|JOIN|INTO|UPDATE|TABLE|INDEX|ON)\s+)\bpublic\.([a-zA-Z0-9_]+)\s*\(/gi,
  )) {
    refs.add(match[1]!.toLowerCase());
  }
  for (const match of cleaned.matchAll(
    /EXECUTE\s+FUNCTION\s+(?:public\.)?([a-zA-Z0-9_]+)\s*\(/gi,
  )) {
    refs.add(match[1]!.toLowerCase());
  }
  for (const match of cleaned.matchAll(
    /EXECUTE\s+PROCEDURE\s+(?:public\.)?([a-zA-Z0-9_]+)\s*\(/gi,
  )) {
    refs.add(match[1]!.toLowerCase());
  }

  // Exclude DEFAULT gen / type casts mistaken as calls — keep only helper-like names
  // or names that look like functions (contain underscore verb patterns / known prefixes).
  return [...refs]
    .filter((name) => !SQL_KEYWORDS.has(name))
    .filter((name) => !PLATFORM_SQL_FUNCTIONS.has(name))
    .filter((name) => !isLikelyRelationName(name))
    .sort();
}

function isLikelyRelationName(name: string): boolean {
  if (
    name.endsWith("_settings") ||
    name.endsWith("_logs") ||
    name.endsWith("_members") ||
    name.endsWith("_activity") ||
    name.endsWith("_comments") ||
    name.endsWith("_versions") ||
    name.endsWith("_packages") ||
    name.endsWith("_sessions") ||
    name.endsWith("_permissions") ||
    name.endsWith("_library") ||
    name.endsWith("_profiles") ||
    name.endsWith("_entries") ||
    name.endsWith("_issues") ||
    name.endsWith("_rows") ||
    name.endsWith("_scans") ||
    name.endsWith("_mappings") ||
    name.endsWith("_fingerprints") ||
    name.endsWith("_events") ||
    name.endsWith("_headers") ||
    name.endsWith("_sets") ||
    name.endsWith("_rules") ||
    name.endsWith("_lines") ||
    name.endsWith("_history") ||
    name.endsWith("_layouts") ||
    name.endsWith("_presentations") ||
    name.endsWith("_sections") ||
    name.endsWith("_items") ||
    name.endsWith("_references") ||
    name.endsWith("_benchmarks") ||
    name.endsWith("_calculations") ||
    name.endsWith("_programs") ||
    name.endsWith("_procedures") ||
    name.endsWith("_papers") ||
    name.endsWith("_evidence") ||
    name.endsWith("_findings") ||
    name.endsWith("_notes") ||
    name.endsWith("_groups") ||
    name.endsWith("_exports") ||
    name.endsWith("_values") ||
    name.endsWith("_adjustments") ||
    name.endsWith("_periods") ||
    name.endsWith("_assessments") ||
    name.endsWith("_responses") ||
    name.endsWith("_factors") ||
    name.endsWith("_assertions") ||
    name.endsWith("_links") ||
    name.endsWith("_plans")
  ) {
    return true;
  }
  const relationExact = new Set([
    "organizations",
    "workspaces",
    "companies",
    "roles",
    "permissions",
    "memberships",
    "engagements",
    "users",
    "buckets",
    "objects",
  ]);
  return relationExact.has(name);
}

export function extractReferencedEnums(sql: string): string[] {
  const cleaned = stripSqlComments(sql);
  return uniqueSorted(
    [...cleaned.matchAll(/\bpublic\.([a-zA-Z0-9_]+)\b/gi)]
      .map((match) => match[1]!.toLowerCase())
      .filter((name) => name.endsWith("_status") || name.endsWith("_type") || name.endsWith("_scope") || name.endsWith("_kind") || name.endsWith("_mode") || name.endsWith("_action") || name.includes("enum") || ["record_status", "role_scope", "permission_scope", "membership_scope"].includes(name)),
  );
}

export function toFunctionRef(name: string): SqlObjectRef {
  return { kind: "function", name: name.toLowerCase(), schema: "public" };
}

export function enrichMigrationSqlRefs(migration: ParsedMigration): {
  createdFunctions: string[];
  referencedFunctions: string[];
  createdEnums: string[];
  createdExtensions: string[];
  createdViews: string[];
} {
  return {
    createdFunctions: extractCreatedFunctions(migration.sql),
    referencedFunctions: extractReferencedFunctions(migration.sql),
    createdEnums: extractCreatedEnums(migration.sql),
    createdExtensions: extractCreatedExtensions(migration.sql),
    createdViews: extractCreatedViews(migration.sql),
  };
}
