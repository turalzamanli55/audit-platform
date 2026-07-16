/**
 * EPAC Phase 4 — Backend Audit.
 * Evidence from repositories, server actions, lib services — no invented completion.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  listImmediateChildren,
  walkFiles,
  toRepoPath,
} from "@/lib/platform-audit/utils";
import type { AuditFinding, PhaseHealth } from "@/lib/platform-audit/types";

export function auditBackend(cwd = process.cwd()): PhaseHealth {
  const started = Date.now();
  const findings: AuditFinding[] = [];

  const repoDirs = listImmediateChildren(join(cwd, "src", "repositories"));
  const actionDirs = listImmediateChildren(join(cwd, "src", "lib", "actions"));
  const actionAlt = existsSync(join(cwd, "src", "actions"))
    ? listImmediateChildren(join(cwd, "src", "actions"))
    : [];
  const libModules = listImmediateChildren(join(cwd, "src", "lib"));

  const repositoryFiles = walkFiles(join(cwd, "src", "repositories"), [".ts"]);
  const actionFiles = [
    ...walkFiles(join(cwd, "src", "lib", "actions"), [".ts"]),
    ...walkFiles(join(cwd, "src", "actions"), [".ts"]),
  ];

  if (repoDirs.length === 0) {
    findings.push({
      phase: "backend",
      code: "no_repositories",
      severity: "blocker",
      message: "No repositories discovered under src/repositories",
      rootCause: "Backend data-access layer missing",
    });
  }
  if (actionFiles.length === 0) {
    findings.push({
      phase: "backend",
      code: "no_server_actions",
      severity: "error",
      message: "No server actions discovered",
      rootCause: "Mutation/query action layer missing or empty",
    });
  }

  // Repositories without matching lib module (orphan risk)
  const libSet = new Set(libModules);
  const orphanRepos = repoDirs.filter(
    (name) => !libSet.has(name) && !["base", "membership", "organization", "permission", "role", "user", "workspace"].includes(name),
  );
  if (orphanRepos.length > 0) {
    findings.push({
      phase: "backend",
      code: "repository_without_lib_module",
      severity: "warning",
      message: `${orphanRepos.length} repositories lack matching src/lib module`,
      rootCause: "Repository/lib pairing incomplete",
      evidencePaths: orphanRepos.map((name) => `src/repositories/${name}`),
    });
  }

  const expectedPairs = Math.max(repoDirs.length, 1);
  const paired = repoDirs.filter((name) => libSet.has(name)).length;
  const scorePct = Number(
    (
      ((repositoryFiles.length > 0 ? 40 : 0) +
        (actionFiles.length > 0 ? 30 : 0) +
        (paired / expectedPairs) * 30)
    ).toFixed(2),
  );

  return {
    phase: "backend",
    label: "Backend Audit",
    ok: findings.every((finding) => finding.severity !== "blocker"),
    scorePct,
    findings,
    metrics: {
      repositoryModules: repoDirs.length,
      repositoryFiles: repositoryFiles.length,
      serverActionModules: new Set([...actionDirs, ...actionAlt]).size,
      serverActionFiles: actionFiles.length,
      libModules: libModules.length,
      pairedRepositoryLib: paired,
    },
    durationMs: Date.now() - started,
  };
}

export function listBackendEvidence(cwd = process.cwd()) {
  return {
    repositories: walkFiles(join(cwd, "src", "repositories"), [".ts"]).map((file) =>
      toRepoPath(cwd, file),
    ),
    serverActions: [
      ...walkFiles(join(cwd, "src", "lib", "actions"), [".ts"]),
      ...walkFiles(join(cwd, "src", "actions"), [".ts"]),
    ].map((file) => toRepoPath(cwd, file)),
    libModules: listImmediateChildren(join(cwd, "src", "lib")),
  };
}
