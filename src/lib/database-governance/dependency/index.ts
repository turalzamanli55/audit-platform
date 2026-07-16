import type {
  MigrationDependency,
  MigrationFinding,
  ParsedMigration,
} from "@/lib/database-governance/types";

const KNOWN_PROVIDERS: Array<{
  migrationIncludes: string;
  provides: string[];
  layerHint: string;
}> = [
  {
    migrationIncludes: "extensions_and_common",
    provides: ["record_status", "permission_scope", "role_scope", "utc_now", "is_service_role"],
    layerHint: "foundation enums/helpers",
  },
  {
    migrationIncludes: "foundation_tables",
    provides: [
      "organizations",
      "workspaces",
      "companies",
      "roles",
      "permissions",
      "role_permissions",
      "memberships",
      "audit_logs",
    ],
    layerHint: "foundation tables",
  },
  {
    migrationIncludes: "rls_policies",
    provides: ["foundation_rls"],
    layerHint: "foundation RLS",
  },
  {
    migrationIncludes: "engagement_foundation",
    provides: ["engagements", "engagement_members", "engagement_activity"],
    layerHint: "engagements",
  },
  {
    migrationIncludes: "planning_foundation",
    provides: ["audit_plans", "planning_activity"],
    layerHint: "audit planning",
  },
  {
    migrationIncludes: "fieldwork_foundation",
    provides: ["fieldwork_packages", "audit_procedures", "working_papers"],
    layerHint: "fieldwork",
  },
  {
    migrationIncludes: "risk_assessment_foundation",
    provides: ["risk_assessments"],
    layerHint: "risk assessment",
  },
  {
    migrationIncludes: "materiality_foundation",
    provides: ["materiality_packages"],
    layerHint: "materiality",
  },
  {
    migrationIncludes: "review_foundation",
    provides: ["review_packages"],
    layerHint: "review",
  },
  {
    migrationIncludes: "completion_foundation",
    provides: ["completion_packages"],
    layerHint: "completion",
  },
  {
    migrationIncludes: "reporting_foundation",
    provides: ["reporting_packages"],
    layerHint: "reporting",
  },
  {
    migrationIncludes: "opinion_foundation",
    provides: ["opinion_packages"],
    layerHint: "opinion",
  },
  {
    migrationIncludes: "financial_statements_foundation",
    provides: ["financial_statement_packages"],
    layerHint: "financial statements",
  },
  {
    migrationIncludes: "uaie_foundation",
    provides: ["uaie_import_sessions"],
    layerHint: "import engine",
  },
  {
    migrationIncludes: "trial_balance_foundation",
    provides: ["trial_balance_packages"],
    layerHint: "trial balance",
  },
  {
    migrationIncludes: "fs_mapping_foundation",
    provides: ["financial_statement_mapping_sets"],
    layerHint: "FS mapping",
  },
  {
    migrationIncludes: "fs_rendering_foundation",
    provides: ["financial_statement_presentations"],
    layerHint: "FS rendering",
  },
  {
    migrationIncludes: "ifrs_notes_foundation",
    provides: ["ifrs_note_packages"],
    layerHint: "IFRS notes",
  },
  {
    migrationIncludes: "enterprise_sql_foundation",
    provides: [
      "user_can_access_workspace",
      "has_permission",
      "current_user_id",
      "soft_delete",
      "restore_deleted",
      "policy_workspace_read",
      "policy_workspace_write",
    ],
    layerHint: "SQL foundation helpers",
  },
  {
    migrationIncludes: "permissions_schema_compatibility",
    provides: ["permissions.module", "permissions.scope_default"],
    layerHint: "permissions compatibility",
  },
];

/**
 * Build explicit migration dependency edges.
 */
export function buildMigrationDependencyGraph(
  migrations: ParsedMigration[],
): MigrationDependency[] {
  const byId = new Map(migrations.map((migration) => [migration.id, migration]));
  const providerByObject = new Map<string, string>();

  for (const migration of migrations) {
    for (const table of migration.creates.tables) {
      providerByObject.set(table, migration.id);
    }
    for (const fn of migration.creates.functions) {
      providerByObject.set(fn, migration.id);
    }
    for (const en of migration.creates.enums) {
      providerByObject.set(en, migration.id);
    }
    for (const col of migration.alters.addColumns) {
      providerByObject.set(`${col.table}.${col.column}`, migration.id);
    }
    for (const known of KNOWN_PROVIDERS) {
      if (migration.filename.includes(known.migrationIncludes)) {
        for (const objectName of known.provides) {
          providerByObject.set(objectName, migration.id);
        }
      }
    }
  }

  const edges: MigrationDependency[] = [];
  const seen = new Set<string>();

  function addEdge(from: string, to: string, reason: string) {
    if (from === to) return;
    if (!byId.has(from) || !byId.has(to)) return;
    const key = `${from}→${to}→${reason}`;
    if (seen.has(key)) return;
    seen.add(key);
    edges.push({ migrationId: from, requiresMigrationId: to, reason });
  }

  // Chronological prerequisite: each migration depends on previous foundation chain milestones
  const foundation = migrations.filter((migration) => migration.layer === "foundation");
  for (let index = 1; index < foundation.length; index += 1) {
    addEdge(
      foundation[index]!.id,
      foundation[index - 1]!.id,
      "Foundation chronological prerequisite",
    );
  }

  for (const migration of migrations) {
    for (const table of migration.requiredTables) {
      const provider = providerByObject.get(table);
      if (provider && provider !== migration.id) {
        // Only if provider is earlier
        if (provider.localeCompare(migration.id) < 0) {
          addEdge(migration.id, provider, `Requires table/object "${table}"`);
        }
      }
    }
    for (const fn of migration.requiredFunctions) {
      const provider = providerByObject.get(fn);
      if (provider && provider !== migration.id && provider.localeCompare(migration.id) < 0) {
        addEdge(migration.id, provider, `Requires function "${fn}"`);
      }
    }
    for (const insert of migration.permissionInserts) {
      if (insert.columns.includes("module")) {
        const provider = providerByObject.get("permissions.module");
        if (provider) {
          addEdge(
            migration.id,
            provider,
            "Requires permissions.module column (compatibility)",
          );
        }
      }
    }
    if (migration.filename.includes("role_permissions_backfill")) {
      const permissionsProvider = providerByObject.get("permissions");
      const rolesProvider = providerByObject.get("roles");
      if (permissionsProvider) {
        addEdge(migration.id, permissionsProvider, "Requires permissions catalog");
      }
      if (rolesProvider) {
        addEdge(migration.id, rolesProvider, "Requires roles catalog");
      }
    }
  }

  // Explicit layer ladder
  const ladder: Array<{ needs: string; before: string; reason: string }> = [
    { needs: "engagement_foundation", before: "company_foundation", reason: "Engagements require companies" },
    { needs: "planning_foundation", before: "engagement_foundation", reason: "Planning requires engagements" },
    { needs: "fieldwork_foundation", before: "planning_foundation", reason: "Fieldwork requires audit plans" },
    { needs: "risk_assessment_foundation", before: "planning_foundation", reason: "Risk requires audit plans" },
    { needs: "materiality_foundation", before: "planning_foundation", reason: "Materiality requires audit plans" },
    { needs: "review_foundation", before: "fieldwork_foundation", reason: "Review requires fieldwork" },
    { needs: "completion_foundation", before: "review_foundation", reason: "Completion requires review" },
    { needs: "reporting_foundation", before: "completion_foundation", reason: "Reporting follows completion" },
    { needs: "opinion_foundation", before: "reporting_foundation", reason: "Opinion follows reporting" },
    {
      needs: "financial_statements_foundation",
      before: "engagement_foundation",
      reason: "Financial statements require engagements",
    },
    { needs: "uaie_foundation", before: "company_foundation", reason: "Import engine requires companies" },
    {
      needs: "trial_balance_foundation",
      before: "uaie_foundation",
      reason: "Trial balance follows import engine",
    },
    {
      needs: "fs_mapping_foundation",
      before: "trial_balance_foundation",
      reason: "FS mapping requires trial balance",
    },
    {
      needs: "fs_mapping_foundation",
      before: "enterprise_sql_foundation",
      reason: "FS mapping RLS requires user_can_access_workspace",
    },
    {
      needs: "fs_mapping_foundation",
      before: "permissions_schema_compatibility",
      reason: "FS mapping permission inserts require module column",
    },
    {
      needs: "fs_rendering_foundation",
      before: "fs_mapping_foundation",
      reason: "FS rendering requires mapping sets",
    },
    {
      needs: "ifrs_notes_foundation",
      before: "fs_mapping_foundation",
      reason: "IFRS notes require mapping sets",
    },
  ];

  for (const rule of ladder) {
    const dependent = migrations.find((migration) =>
      migration.filename.includes(rule.needs),
    );
    const prerequisite = migrations.find((migration) =>
      migration.filename.includes(rule.before),
    );
    if (dependent && prerequisite) {
      addEdge(dependent.id, prerequisite.id, rule.reason);
    }
  }

  return edges.sort((a, b) =>
    `${a.migrationId}:${a.requiresMigrationId}`.localeCompare(
      `${b.migrationId}:${b.requiresMigrationId}`,
    ),
  );
}

export function detectCircularDependencies(
  dependencies: MigrationDependency[],
): MigrationFinding[] {
  const graph = new Map<string, string[]>();
  for (const edge of dependencies) {
    const list = graph.get(edge.migrationId) ?? [];
    list.push(edge.requiresMigrationId);
    graph.set(edge.migrationId, list);
  }

  const findings: MigrationFinding[] = [];
  const visiting = new Set<string>();
  const visited = new Set<string>();

  function dfs(node: string, stack: string[]) {
    if (visiting.has(node)) {
      findings.push({
        code: "circular_dependency",
        severity: "error",
        migrationId: node,
        message: `Circular dependency detected: ${[...stack, node].join(" → ")}`,
      });
      return;
    }
    if (visited.has(node)) return;
    visiting.add(node);
    for (const next of graph.get(node) ?? []) {
      dfs(next, [...stack, node]);
    }
    visiting.delete(node);
    visited.add(node);
  }

  for (const node of graph.keys()) {
    dfs(node, []);
  }
  return findings;
}
