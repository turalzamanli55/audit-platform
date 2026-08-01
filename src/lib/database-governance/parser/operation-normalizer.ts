import type {
  NormalizedOperation,
  NormalizedOperationKind,
  OperationSource,
  ResolvedSqlUnit,
} from "@/lib/database-governance/parser/types";

type DraftOp = Omit<NormalizedOperation, "migrationId">;

/**
 * Convert concrete SQL units into normalized governance operations.
 */
export function normalizeOperations(
  units: ResolvedSqlUnit[],
  migrationId: string,
): NormalizedOperation[] {
  const drafts: DraftOp[] = [];
  for (const unit of units) {
    drafts.push(...normalizeSqlText(unit.sql, unit.source));
  }
  return dedupeOperations(
    drafts.map((draft) => ({
      ...draft,
      migrationId,
      operation: draft.kind,
    })),
  );
}

export function normalizeSqlText(
  sql: string,
  source: OperationSource,
): DraftOp[] {
  const ops: DraftOp[] = [];
  const text = sql;

  pushMatches(
    ops,
    text,
    /ALTER\s+TABLE\s+(?:IF\s+EXISTS\s+)?(?:(public)\.)?([a-zA-Z0-9_]+)\s+ENABLE\s+ROW\s+LEVEL\s+SECURITY/gi,
    (m) =>
      op("EnableRLS", "table", m[1] ?? "public", {
        table: m[2]!.toLowerCase(),
        name: m[2]!.toLowerCase(),
        source,
      }),
  );

  pushMatches(
    ops,
    text,
    /ALTER\s+TABLE\s+(?:IF\s+EXISTS\s+)?(?:(public)\.)?([a-zA-Z0-9_]+)\s+DISABLE\s+ROW\s+LEVEL\s+SECURITY/gi,
    (m) =>
      op("DisableRLS", "table", m[1] ?? "public", {
        table: m[2]!.toLowerCase(),
        name: m[2]!.toLowerCase(),
        source,
      }),
  );

  pushMatches(
    ops,
    text,
    /GRANT\s+([\w\s,]+)\s+ON\s+(?:TABLE\s+)?(?:(public)\.)?([a-zA-Z0-9_]+)\s+TO\s+([a-zA-Z0-9_]+)/gi,
    (m) =>
      op("Grant", "grant", m[2] ?? "public", {
        table: m[3]!.toLowerCase(),
        name: m[3]!.toLowerCase(),
        source,
        metadata: {
          privileges: m[1]!.trim(),
          grantee: m[4]!.toLowerCase(),
        },
      }),
  );

  pushMatches(
    ops,
    text,
    /REVOKE\s+([\w\s,]+)\s+ON\s+(?:TABLE\s+)?(?:(public)\.)?([a-zA-Z0-9_]+)\s+FROM\s+([a-zA-Z0-9_]+)/gi,
    (m) =>
      op("Revoke", "grant", m[2] ?? "public", {
        table: m[3]!.toLowerCase(),
        name: m[3]!.toLowerCase(),
        source,
        metadata: {
          privileges: m[1]!.trim(),
          grantee: m[4]!.toLowerCase(),
        },
      }),
  );

  pushMatches(
    ops,
    text,
    /CREATE\s+POLICY\s+([a-zA-Z0-9_]+)\s+ON\s+(?:(public)\.)?([a-zA-Z0-9_]+)/gi,
    (m) =>
      op("CreatePolicy", "policy", m[2] ?? "public", {
        table: m[3]!.toLowerCase(),
        name: m[1]!.toLowerCase(),
        source,
      }),
  );

  pushMatches(
    ops,
    text,
    /DROP\s+POLICY\s+(?:IF\s+EXISTS\s+)?([a-zA-Z0-9_]+)\s+ON\s+(?:(public)\.)?([a-zA-Z0-9_]+)/gi,
    (m) =>
      op("DropPolicy", "policy", m[2] ?? "public", {
        table: m[3]!.toLowerCase(),
        name: m[1]!.toLowerCase(),
        source,
      }),
  );

  pushMatches(
    ops,
    text,
    /CREATE\s+(UNIQUE\s+)?INDEX\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_]+)/gi,
    (m) =>
      op("CreateIndex", "index", "public", {
        name: m[2]!.toLowerCase(),
        source,
        metadata: { unique: Boolean(m[1]) },
      }),
  );

  pushMatches(
    ops,
    text,
    /DROP\s+INDEX\s+(?:IF\s+EXISTS\s+)?(?:(public)\.)?([a-zA-Z0-9_]+)/gi,
    (m) =>
      op("DropIndex", "index", m[1] ?? "public", {
        name: m[2]!.toLowerCase(),
        source,
      }),
  );

  pushMatches(
    ops,
    text,
    /CREATE\s+(?:OR\s+REPLACE\s+)?TRIGGER\s+([a-zA-Z0-9_]+)/gi,
    (m) =>
      op("CreateTrigger", "trigger", "public", {
        name: m[1]!.toLowerCase(),
        source,
      }),
  );

  pushMatches(
    ops,
    text,
    /DROP\s+TRIGGER\s+(?:IF\s+EXISTS\s+)?([a-zA-Z0-9_]+)/gi,
    (m) =>
      op("DropTrigger", "trigger", "public", {
        name: m[1]!.toLowerCase(),
        source,
      }),
  );

  pushMatches(
    ops,
    text,
    /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:(public)\.)?([a-zA-Z0-9_]+)/gi,
    (m) =>
      op("CreateTable", "table", m[1] ?? "public", {
        table: m[2]!.toLowerCase(),
        name: m[2]!.toLowerCase(),
        source,
      }),
  );

  pushMatches(
    ops,
    text,
    /CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\s+(?:(public)\.)?([a-zA-Z0-9_]+)/gi,
    (m) =>
      op("CreateFunction", "function", m[1] ?? "public", {
        name: m[2]!.toLowerCase(),
        source,
      }),
  );

  pushMatches(
    ops,
    text,
    /CREATE\s+(?:OR\s+REPLACE\s+)?(?:MATERIALIZED\s+)?VIEW\s+(?:(public)\.)?([a-zA-Z0-9_]+)/gi,
    (m) =>
      op("CreateView", "view", m[1] ?? "public", {
        name: m[2]!.toLowerCase(),
        source,
      }),
  );

  pushMatches(
    ops,
    text,
    /CREATE\s+TYPE\s+(?:(public)\.)?([a-zA-Z0-9_]+)\s+AS\s+ENUM/gi,
    (m) =>
      op("CreateEnum", "enum", m[1] ?? "public", {
        name: m[2]!.toLowerCase(),
        source,
      }),
  );

  pushMatches(
    ops,
    text,
    /CREATE\s+EXTENSION\s+(?:IF\s+NOT\s+EXISTS\s+)?["']?([a-zA-Z0-9_]+)["']?/gi,
    (m) =>
      op("CreateExtension", "extension", "public", {
        name: m[1]!.toLowerCase(),
        source,
      }),
  );

  pushMatches(
    ops,
    text,
    /CREATE\s+SEQUENCE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:(public)\.)?([a-zA-Z0-9_]+)/gi,
    (m) =>
      op("CreateSequence", "sequence", m[1] ?? "public", {
        name: m[2]!.toLowerCase(),
        source,
      }),
  );

  pushMatches(
    ops,
    text,
    /ALTER\s+TABLE\s+(?:IF\s+EXISTS\s+)?(?:(public)\.)?([a-zA-Z0-9_]+)[\s\S]*?\bADD\s+COLUMN\s+(IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_]+)/gi,
    (m) =>
      op("AddColumn", "column", m[1] ?? "public", {
        table: m[2]!.toLowerCase(),
        name: m[4]!.toLowerCase(),
        source,
        metadata: { ifNotExists: Boolean(m[3]) },
      }),
  );

  pushMatches(
    ops,
    text,
    /ALTER\s+TABLE\s+(?:IF\s+EXISTS\s+)?(?:(public)\.)?([a-zA-Z0-9_]+)[\s\S]*?\bDROP\s+COLUMN\s+(?:IF\s+EXISTS\s+)?([a-zA-Z0-9_]+)/gi,
    (m) =>
      op("DropColumn", "column", m[1] ?? "public", {
        table: m[2]!.toLowerCase(),
        name: m[3]!.toLowerCase(),
        source,
      }),
  );

  pushMatches(
    ops,
    text,
    /DROP\s+TABLE\s+(IF\s+EXISTS\s+)?(?:(public)\.)?([a-zA-Z0-9_]+)/gi,
    (m) =>
      op("DropTable", "table", m[2] ?? "public", {
        table: m[3]!.toLowerCase(),
        name: m[3]!.toLowerCase(),
        source,
        metadata: { ifExists: Boolean(m[1]) },
      }),
  );

  pushMatches(
    ops,
    text,
    /(?:CONSTRAINT|ADD)\s+([a-zA-Z0-9_]+)\s+(PRIMARY\s+KEY|UNIQUE|CHECK|FOREIGN\s+KEY)/gi,
    (m) =>
      op("AddConstraint", "constraint", "public", {
        name: m[1]!.toLowerCase(),
        source,
        metadata: { constraintType: m[2]!.toLowerCase() },
      }),
  );

  pushMatches(
    ops,
    text,
    /INSERT\s+INTO\s+(?:(public)\.)?permissions\s*\(([^)]+)\)/gi,
    (m) =>
      op("InsertPermissions", "table", m[1] ?? "public", {
        table: "permissions",
        name: "permissions",
        source,
        metadata: {
          columns: m[2]!
            .split(",")
            .map((part) => part.trim().toLowerCase())
            .filter(Boolean),
        },
      }),
  );

  pushMatches(
    ops,
    text,
    /storage\.buckets[\s\S]*?'([a-zA-Z0-9_-]+)'/gi,
    (m) =>
      op("ReferenceStorageBucket", "storage_bucket", "storage", {
        name: m[1]!.toLowerCase(),
        source,
      }),
  );

  pushMatches(
    ops,
    text,
    /([a-zA-Z0-9_]+)\s+[a-zA-Z0-9_()]+\s+GENERATED\s+ALWAYS\s+AS/gi,
    (m) =>
      op("GeneratedColumn", "column", "public", {
        name: m[1]!.toLowerCase(),
        source,
      }),
  );

  for (const match of text.matchAll(
    /([a-zA-Z0-9_]+)\s+[a-zA-Z0-9_()]+\s+(?:NOT\s+NULL\s+)?DEFAULT\s+([^,\n;]+)/gi,
  )) {
    ops.push(
      op("ColumnDefault", "column", "public", {
        name: match[1]!.toLowerCase(),
        source,
        metadata: { expression: match[2]!.trim() },
      }),
    );
  }

  pushMatches(
    ops,
    text,
    /ON\s+CONFLICT\s*\(\s*([a-zA-Z0-9_]+)\s*\)/gi,
    (m) =>
      op("OnConflict", "constraint", "public", {
        name: m[1]!.toLowerCase(),
        source,
        metadata: { target: m[1]!.toLowerCase() },
      }),
  );

  pushMatches(
    ops,
    text,
    /\b([a-zA-Z0-9_]+)\s+(?:uuid|text|citext|integer|bigint|timestamptz|jsonb|boolean)[^\n,]*?REFERENCES\s+(?:(public)\.)?([a-zA-Z0-9_]+)/gi,
    (m) =>
      op("ForeignKey", "column", m[2] ?? "public", {
        name: m[1]!.toLowerCase(),
        table: "column",
        source,
        metadata: { references: m[3]!.toLowerCase(), column: m[1]!.toLowerCase() },
      }),
  );

  return ops;
}

function op(
  kind: NormalizedOperationKind,
  objectType: string,
  schema: string,
  init: {
    table?: string;
    name?: string;
    source: OperationSource;
    metadata?: Record<string, unknown>;
  },
): DraftOp {
  return {
    kind,
    objectType,
    schema: schema.toLowerCase(),
    table: init.table,
    name: init.name,
    operation: kind,
    metadata: init.metadata ?? {},
    source: init.source,
  };
}

function pushMatches(
  ops: DraftOp[],
  text: string,
  pattern: RegExp,
  build: (match: RegExpMatchArray) => DraftOp,
): void {
  for (const match of text.matchAll(pattern)) {
    ops.push(build(match));
  }
}

function dedupeOperations(ops: NormalizedOperation[]): NormalizedOperation[] {
  const seen = new Set<string>();
  const out: NormalizedOperation[] = [];
  for (const operation of ops) {
    const key = [
      operation.kind,
      operation.schema,
      operation.table ?? "",
      operation.name ?? "",
      JSON.stringify(operation.metadata),
    ].join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(operation);
  }
  return out;
}

/** Canonical fingerprint for equivalence tests (ignores source location). */
export function canonicalOperationFingerprint(
  ops: NormalizedOperation[],
): string[] {
  const fingerprints = ops.map((operation) =>
    [
      operation.kind,
      operation.schema,
      operation.table ?? "",
      operation.name ?? "",
      stableMeta(operation.metadata),
    ].join("|"),
  );
  return [...new Set(fingerprints)].sort((a, b) => a.localeCompare(b));
}

function stableMeta(metadata: Record<string, unknown>): string {
  const keys = Object.keys(metadata).sort();
  return keys.map((key) => `${key}=${JSON.stringify(metadata[key])}`).join(",");
}

export function operationsOfKind(
  ops: NormalizedOperation[],
  kind: NormalizedOperationKind,
): NormalizedOperation[] {
  return ops.filter((operation) => operation.kind === kind);
}
