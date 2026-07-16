/**
 * EPAC Phase 10 — Testing Audit.
 */
import { join } from "node:path";
import { walkFiles, toRepoPath } from "@/lib/platform-audit/utils";
import type { AuditFinding, PhaseHealth } from "@/lib/platform-audit/types";

export function auditTesting(cwd = process.cwd()): PhaseHealth {
  const started = Date.now();
  const findings: AuditFinding[] = [];

  const testFiles = [
    ...walkFiles(join(cwd, "src"), [".test.ts", ".test.tsx", ".spec.ts", ".spec.tsx"]),
  ];
  const governanceTests = testFiles.filter((file) =>
    /database-governance|sql-foundation|devops|project-sync|capability-registry|platform-registry|platform-audit/i.test(
      file,
    ),
  );
  const repositoryTests = testFiles.filter((file) => /repositories/i.test(file));
  const migrationTests = testFiles.filter((file) => /migration|database-lifecycle/i.test(file));

  if (testFiles.length === 0) {
    findings.push({
      phase: "testing",
      code: "no_tests",
      severity: "blocker",
      message: "No unit/integration test files discovered",
      rootCause: "Test suite absent",
    });
  }
  if (governanceTests.length === 0) {
    findings.push({
      phase: "testing",
      code: "no_governance_tests",
      severity: "error",
      message: "No governance engine tests discovered",
      rootCause: "Platform governance lacks automated verification",
    });
  }
  if (repositoryTests.length === 0) {
    findings.push({
      phase: "testing",
      code: "no_repository_tests",
      severity: "warning",
      message: "No repository-scoped tests discovered",
      rootCause: "Data-access layer lacks direct test evidence",
    });
  }

  const scorePct = Number(
    (
      (testFiles.length > 0 ? 40 : 0) +
      (governanceTests.length > 0 ? 30 : 0) +
      (migrationTests.length > 0 ? 20 : 0) +
      (repositoryTests.length > 0 ? 10 : 0)
    ).toFixed(2),
  );

  return {
    phase: "testing",
    label: "Testing Audit",
    ok: findings.every((finding) => finding.severity !== "blocker"),
    scorePct,
    findings,
    metrics: {
      testFiles: testFiles.length,
      governanceTests: governanceTests.length,
      repositoryTests: repositoryTests.length,
      migrationTests: migrationTests.length,
      sampleTests: testFiles.slice(0, 10).map((file) => toRepoPath(cwd, file)).join(","),
    },
    durationMs: Date.now() - started,
  };
}
