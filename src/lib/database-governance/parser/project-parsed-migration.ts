import type { NormalizedOperation } from "@/lib/database-governance/parser/types";
import type { ParsedMigration } from "@/lib/database-governance/types";
import { uniqueSorted } from "@/lib/database-governance/utils";
import { operationsOfKind } from "@/lib/database-governance/parser/operation-normalizer";

/**
 * Project normalized operations into the legacy ParsedMigration shape
 * so dependency/validation/engine stay unchanged.
 */
export function projectParsedFields(
  operations: NormalizedOperation[],
  staticView: string,
  extras: {
    foreignKeys: ParsedMigration["foreignKeys"];
    requiredTables: string[];
    requiredFunctions: string[];
    requiredEnums: string[];
  },
): Pick<
  ParsedMigration,
  | "creates"
  | "alters"
  | "foreignKeys"
  | "grants"
  | "permissionInserts"
  | "enablesRls"
  | "storageBuckets"
  | "requiredTables"
  | "requiredFunctions"
  | "requiredEnums"
> {
  const tables = names(operationsOfKind(operations, "CreateTable"));
  const enums = names(operationsOfKind(operations, "CreateEnum"));
  const functions = names(operationsOfKind(operations, "CreateFunction"));
  const views = names(operationsOfKind(operations, "CreateView"));
  const triggers = names(operationsOfKind(operations, "CreateTrigger"));
  const indexes = names(operationsOfKind(operations, "CreateIndex"));
  const policies = names(operationsOfKind(operations, "CreatePolicy"));
  const extensions = names(operationsOfKind(operations, "CreateExtension"));

  const addColumns = operationsOfKind(operations, "AddColumn").map((operation) => ({
    table: operation.table ?? "",
    column: operation.name ?? "",
  }));

  const permissionInserts = operationsOfKind(operations, "InsertPermissions").map(
    (operation) => ({
      columns: Array.isArray(operation.metadata.columns)
        ? (operation.metadata.columns as string[])
        : [],
    }),
  );

  const enablesRls = uniqueSorted(
    operationsOfKind(operations, "EnableRLS").map(
      (operation) => operation.table ?? operation.name ?? "",
    ),
  );

  const grants = uniqueSorted(
    operationsOfKind(operations, "Grant").map(
      (operation) => operation.table ?? operation.name ?? "",
    ),
  );

  const storageBuckets = uniqueSorted(
    operationsOfKind(operations, "ReferenceStorageBucket").map(
      (operation) => operation.name ?? "",
    ),
  );

  // Retain ALTER TABLE table names from static view for requiredTables parity.
  void staticView;

  return {
    creates: {
      extensions,
      enums,
      tables,
      functions,
      views,
      triggers,
      indexes,
      policies,
      types: enums,
    },
    alters: {
      tables: uniqueSorted(addColumns.map((entry) => entry.table)),
      addColumns,
    },
    foreignKeys: extras.foreignKeys,
    grants,
    permissionInserts,
    enablesRls,
    storageBuckets,
    requiredTables: extras.requiredTables,
    requiredFunctions: extras.requiredFunctions,
    requiredEnums: extras.requiredEnums,
  };
}

function names(operations: NormalizedOperation[]): string[] {
  return uniqueSorted(operations.map((operation) => operation.name ?? "").filter(Boolean));
}
