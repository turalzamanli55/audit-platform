import {
  buildStaticView,
} from "@/lib/database-governance/parser/statement-extractor";
import { resolveDynamicSql } from "@/lib/database-governance/parser/dynamic-sql-resolver";
import {
  canonicalOperationFingerprint,
  normalizeOperations,
  normalizeSqlText,
} from "@/lib/database-governance/parser/operation-normalizer";
import { projectParsedFields } from "@/lib/database-governance/parser/project-parsed-migration";
import type { MigrationParseResult, NormalizedOperation } from "@/lib/database-governance/parser/types";
import type { ParsedMigration } from "@/lib/database-governance/types";
import {
  classifyMigrationLayer,
  hashSql,
  parseMigrationFilename,
  stripSqlComments,
  uniqueSorted,
} from "@/lib/database-governance/utils";
import { extractReferencedFunctions } from "@/lib/sql-foundation/audit";
import { statSync } from "node:fs";

/**
 * MigrationParser
 *   → StatementExtractor (via buildStaticView / segments)
 *   → DynamicSqlResolver
 *   → NormalizedOperations
 *   → project → ParsedMigration (engine-compatible)
 */
export class MigrationParser {
  parseSql(
    sql: string,
    meta: {
      id: string;
      filename: string;
      absolutePath: string;
      timestamp: string;
      name: string;
    },
  ): ParsedMigration & { operations: NormalizedOperation[] } {
    const cleaned = stripSqlComments(sql);
    const result = this.runPipeline(cleaned, meta.id);
    const extras = this.extractHeuristicRequirements(cleaned, sql, result.staticView);
    const projected = projectParsedFields(result.operations, result.staticView, extras);

    return {
      id: meta.id,
      filename: meta.filename,
      absolutePath: meta.absolutePath,
      timestamp: meta.timestamp,
      name: meta.name,
      bytes: 0,
      hash: hashSql(sql),
      sql,
      layer: classifyMigrationLayer(meta.filename, sql),
      operations: result.operations,
      ...projected,
    };
  }

  parseFile(
    absolutePath: string,
    filename: string,
    sql: string,
  ): ParsedMigration & { operations: NormalizedOperation[] } {
    const meta = parseMigrationFilename(filename);
    if (!meta) {
      throw new Error(`Invalid migration filename: ${filename}`);
    }
    const parsed = this.parseSql(sql, {
      id: meta.id,
      filename,
      absolutePath,
      timestamp: meta.timestamp,
      name: meta.name,
    });
    parsed.bytes = statSync(absolutePath).size;
    return parsed;
  }

  /**
   * Pipeline: extract → resolve dynamic SQL → normalize operations.
   */
  runPipeline(cleanedSql: string, migrationId: string): MigrationParseResult {
    const staticView = buildStaticView(cleanedSql);
    const units = resolveDynamicSql(cleanedSql);
    const operations = normalizeOperations(units, migrationId);
    return { operations, staticView, units };
  }

  /**
   * Verify static SQL and an equivalent dynamic wrapper produce identical
   * normalized governance operations (intent equivalence).
   */
  assertStaticDynamicEquivalence(
    staticSql: string,
    dynamicSql: string,
    migrationId = "equivalence",
  ): { ok: boolean; staticFingerprints: string[]; dynamicFingerprints: string[] } {
    const staticOps = normalizeOperations(
      [{ sql: stripSqlComments(staticSql), source: { mode: "static", location: "static" } }],
      migrationId,
    );
    const dynamicResult = this.runPipeline(stripSqlComments(dynamicSql), migrationId);
    const governanceKinds = new Set([
      "EnableRLS",
      "DisableRLS",
      "Grant",
      "Revoke",
      "CreatePolicy",
      "DropPolicy",
      "CreateIndex",
      "DropIndex",
      "CreateTrigger",
      "DropTrigger",
    ]);
    const filter = (ops: NormalizedOperation[]) =>
      ops.filter((operation) => governanceKinds.has(operation.kind));

    const staticFingerprints = canonicalOperationFingerprint(filter(staticOps));
    const dynamicFingerprints = canonicalOperationFingerprint(
      filter(dynamicResult.operations),
    );

    const ok =
      staticFingerprints.length === dynamicFingerprints.length &&
      staticFingerprints.every((value, index) => value === dynamicFingerprints[index]);

    return { ok, staticFingerprints, dynamicFingerprints };
  }

  /** Normalize a single concrete statement (test helper). */
  normalizeStatement(sql: string, migrationId = "stmt"): NormalizedOperation[] {
    return normalizeSqlText(sql, { mode: "static", location: "stmt" }).map(
      (draft) => ({
        ...draft,
        migrationId,
        operation: draft.kind,
      }),
    );
  }

  private extractHeuristicRequirements(
    cleaned: string,
    rawSql: string,
    staticView: string,
  ): {
    foreignKeys: ParsedMigration["foreignKeys"];
    requiredTables: string[];
    requiredFunctions: string[];
    requiredEnums: string[];
  } {
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
    for (const match of cleaned.matchAll(
      /\b([a-zA-Z0-9_]+)\s+(?:uuid|text|citext|integer|bigint|timestamptz|jsonb|boolean)[^\n,]*?REFERENCES\s+(?:public\.)?([a-zA-Z0-9_]+)/gi,
    )) {
      foreignKeys.push({
        table: "column",
        column: match[1]!.toLowerCase(),
        references: match[2]!.toLowerCase(),
      });
    }

    const requiredTables = uniqueSorted([
      ...foreignKeys.map((fk) => fk.references),
      ...matchGroup(staticView, /FROM\s+(?:public\.)?([a-zA-Z0-9_]+)/gi),
      ...matchGroup(staticView, /JOIN\s+(?:public\.)?([a-zA-Z0-9_]+)/gi),
      ...matchGroup(staticView, /UPDATE\s+(?:public\.)?([a-zA-Z0-9_]+)/gi),
      ...matchGroup(
        staticView,
        /ALTER\s+TABLE\s+(?:IF\s+EXISTS\s+)?(?:public\.)?([a-zA-Z0-9_]+)/gi,
      ),
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

    const requiredFunctions = uniqueSorted([
      ...extractReferencedFunctions(rawSql),
      ...matchGroup(
        staticView,
        /(?:public\.)?(user_belongs_to_organization|user_belongs_to_workspace|user_can_access_engagement|user_can_access_audit_plan|user_can_access_fieldwork_package|user_can_access_risk_assessment|user_can_access_trial_balance_package|user_can_access_workspace|has_permission|is_service_role|utc_now|auth_user_id)\s*\(/gi,
      ),
    ]);

    const requiredEnums = matchGroup(
      staticView,
      /public\.([a-zA-Z0-9_]+)\s+NOT\s+NULL/gi,
    );

    return { foreignKeys, requiredTables, requiredFunctions, requiredEnums };
  }
}

function matchGroup(sql: string, pattern: RegExp): string[] {
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  const re = new RegExp(pattern.source, flags);
  const out: string[] = [];
  for (const match of sql.matchAll(re)) {
    if (match[1]) out.push(match[1]);
  }
  return uniqueSorted(out);
}

export const migrationParser = new MigrationParser();
