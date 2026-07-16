import { createHash } from "node:crypto";
import type { MigrationLayer } from "@/lib/database-governance/types";

export function hashSql(sql: string): string {
  return createHash("sha256").update(sql).digest("hex");
}

export function parseMigrationFilename(filename: string): {
  timestamp: string;
  name: string;
  id: string;
} | null {
  const match = filename.match(/^(\d{14})_(.+)\.sql$/);
  if (!match) return null;
  return {
    timestamp: match[1]!,
    name: match[2]!,
    id: filename.replace(/\.sql$/, ""),
  };
}

export function stripSqlComments(sql: string): string {
  return sql
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/--[^\n]*/g, " ");
}

export function uniqueSorted(values: Iterable<string>): string[] {
  return [...new Set([...values].map((value) => value.toLowerCase()))].sort();
}

export function classifyMigrationLayer(filename: string, sql: string): MigrationLayer {
  const lower = `${filename} ${sql}`.toLowerCase();
  if (lower.includes("compatibility") || lower.includes("schema_compat")) {
    return "compatibility";
  }
  if (
    lower.includes("extensions_and_common") ||
    lower.includes("foundation_tables") ||
    lower.includes("rls_policies") ||
    lower.includes("initial_foundation") ||
    lower.includes("enterprise_sql_foundation")
  ) {
    return "foundation";
  }
  if (lower.includes("role_permissions") || lower.includes("permissions_backfill")) {
    return "rbac";
  }
  if (lower.includes("company_foundation") || /\bcompanies\b/.test(lower) && lower.includes("slug")) {
    return "companies";
  }
  if (lower.includes("engagement_foundation") || lower.includes("engagement_table")) {
    return "engagements";
  }
  if (lower.includes("uaie_intelligence") || lower.includes("learning_events")) {
    return "ai";
  }
  if (lower.includes("uaie_") || lower.includes("import_session")) {
    return "import_engine";
  }
  if (
    lower.includes("trial_balance") ||
    lower.includes("financial_statement") ||
    lower.includes("fs_mapping") ||
    lower.includes("fs_rendering") ||
    lower.includes("ifrs_notes") ||
    lower.includes("reporting_foundation") ||
    lower.includes("opinion_foundation")
  ) {
    return "financial_reporting";
  }
  if (
    lower.includes("planning") ||
    lower.includes("fieldwork") ||
    lower.includes("risk_assessment") ||
    lower.includes("materiality") ||
    lower.includes("review_") ||
    lower.includes("completion_")
  ) {
    return "audit";
  }
  if (lower.includes("organization")) return "organizations";
  if (lower.includes("workspace")) return "workspaces";
  if (lower.includes("trial_balance") || lower.includes("general_ledger")) return "accounting";
  return "other";
}

export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
}

export function clampPct(value: number): number {
  return Math.max(0, Math.min(100, Number(value.toFixed(2))));
}
