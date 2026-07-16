/**
 * Domain intelligence analyzers for EIIE reports.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  scanRepositoryMethods,
  scanServerActions,
} from "@/lib/implementation-intelligence/verification";
import type {
  DatabaseIntelligence,
  ImplementationContract,
  PermissionIntelligence,
  RepositoryIntelligence,
  ServerActionIntelligence,
  TestingIntelligence,
  WorkflowIntelligence,
} from "@/lib/implementation-intelligence/types";
import { walkFiles } from "@/lib/platform-audit/utils";

export function analyzeRepositories(
  cwd: string,
  contracts: ImplementationContract[],
): RepositoryIntelligence {
  const scan = scanRepositoryMethods(cwd);
  const expected = contracts
    .flatMap((c) => c.clauses.filter((cl) => cl.id === "repository" && cl.required))
    .flatMap((cl) => cl.expected);
  const missing = contracts
    .flatMap((c) => c.clauses.filter((cl) => cl.id === "repository" && cl.required && !cl.verified))
    .map((cl) => `${cl.id}:${cl.missing.join("|")}`);

  const methodNames = scan.methods.map((m) => m.split("#")[1] ?? m);
  const deprecated = methodNames.filter((m) => /deprecated|legacy|old/i.test(m));
  const unused = methodNames.filter((m) => /^_/.test(m)).slice(0, 20);

  return {
    files: scan.files.length,
    classes: scan.methods.filter((m) => /Repository/.test(m)).length,
    expectedMethods: [...new Set(expected)].slice(0, 40),
    existingMethods: scan.methods.slice(0, 80),
    missingMethods: [...new Set(missing)].slice(0, 40),
    deprecatedMethods: [...new Set(deprecated)].slice(0, 20),
    unusedMethods: unused,
  };
}

export function analyzeServerActions(
  cwd: string,
  contracts: ImplementationContract[],
): ServerActionIntelligence {
  const scan = scanServerActions(cwd);
  const missing = contracts
    .filter((c) => c.clauses.some((cl) => cl.id === "serverAction" && cl.required && !cl.verified))
    .map((c) => c.capabilityId);

  let registryHits = 0;
  for (const relative of ["src/lib/actions/index.ts", "src/lib/ai/host/registry/index.ts"]) {
    if (existsSync(join(cwd, relative))) registryHits += 1;
  }

  return {
    useServerFiles: scan.files.length,
    exportedActions: scan.actions.length,
    registryHits,
    missingActions: missing,
    existingActions: scan.actions.slice(0, 80),
  };
}

export function analyzeWorkflows(
  cwd: string,
  contracts: ImplementationContract[],
): WorkflowIntelligence {
  const engines = walkFiles(join(cwd, "src", "lib"), [".ts"]).filter((f) => /engine/i.test(f)).length;
  const stateSignals = walkFiles(join(cwd, "src", "lib"), [".ts"]).filter((f) =>
    /state|transition|lifecycle|workflow/i.test(f),
  ).length;
  const historySignals = walkFiles(join(cwd, "src", "lib"), [".ts"]).filter((f) =>
    /history/i.test(f),
  ).length;
  const notificationSignals = walkFiles(join(cwd, "src", "lib"), [".ts"]).filter((f) =>
    /notif/i.test(f),
  ).length;
  const missing = contracts
    .filter((c) => c.clauses.some((cl) => cl.id === "workflow" && cl.required && !cl.verified))
    .map((c) => c.capabilityId);

  return { engines, stateSignals, historySignals, notificationSignals, missing };
}

export function analyzePermissions(
  cwd: string,
  contracts: ImplementationContract[],
): PermissionIntelligence {
  const definitions = walkFiles(join(cwd, "src"), [".ts"]).filter((f) => /permission/i.test(f)).length;
  const roleMappings = existsSync(join(cwd, "src", "repositories", "role")) ? 1 : 0;
  const isolationSignals = walkFiles(join(cwd, "src", "lib"), [".ts"]).filter((f) =>
    /tenant|workspace|rls|isolation/i.test(f),
  ).length;
  const missing = contracts
    .filter((c) => c.clauses.some((cl) => cl.id === "permission" && cl.required && !cl.verified))
    .map((c) => c.capabilityId);
  return { definitions, roleMappings, isolationSignals, missing };
}

export function analyzeDatabase(
  cwd: string,
  contracts: ImplementationContract[],
): DatabaseIntelligence {
  const migrationsDir = join(cwd, "supabase", "migrations");
  const migrations = existsSync(migrationsDir)
    ? readdirSync(migrationsDir).filter((n) => n.endsWith(".sql")).length
    : 0;
  let policySignals = 0;
  let tablesReferenced = 0;
  if (existsSync(migrationsDir)) {
    for (const name of readdirSync(migrationsDir).filter((n) => n.endsWith(".sql"))) {
      const source = readFileSync(join(migrationsDir, name), "utf8");
      if (/CREATE POLICY|ENABLE ROW LEVEL SECURITY/i.test(source)) policySignals += 1;
      tablesReferenced += (source.match(/CREATE TABLE/gi) ?? []).length;
    }
  }
  const missing = contracts
    .filter((c) =>
      c.clauses.some(
        (cl) => (cl.id === "migration" || cl.id === "database") && cl.required && !cl.verified,
      ),
    )
    .map((c) => c.capabilityId);
  return { migrations, tablesReferenced, policySignals, missing };
}

export function analyzeTesting(
  cwd: string,
  contracts: ImplementationContract[],
): TestingIntelligence {
  const tests = walkFiles(join(cwd, "src"), [".test.ts", ".test.tsx"]);
  const missing = contracts
    .filter((c) => c.clauses.some((cl) => cl.id === "tests" && cl.required && !cl.verified))
    .map((c) => c.capabilityId);
  return {
    unitTests: tests.length,
    integrationTests: tests.filter((f) => /integrat|e2e|lifecycle/i.test(f)).length,
    repositoryTests: tests.filter((f) => /repositor/i.test(f)).length,
    workflowTests: tests.filter((f) => /workflow|engine|pipeline/i.test(f)).length,
    permissionTests: tests.filter((f) => /permission|auth|security/i.test(f)).length,
    missing,
  };
}
