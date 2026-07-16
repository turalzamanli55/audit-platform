import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  validateUnitTests,
  validateIntegrationTests,
} from "@/lib/devops/validation";
import type { PipelineStageResult } from "@/lib/devops/types";

export type TestingReport = {
  ok: boolean;
  testFileCount: number;
  unit: PipelineStageResult;
  integration: PipelineStageResult;
};

function countTestFiles(dir: string): number {
  if (!existsSync(dir)) return 0;
  let count = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const absolute = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", ".next"].includes(entry.name)) continue;
      count += countTestFiles(absolute);
    } else if (entry.name.includes(".test.")) {
      count += 1;
    }
  }
  return count;
}

/**
 * Testing adapter — inventory + optional execution.
 */
export function runTestingValidation(
  cwd = process.cwd(),
  options?: { runUnitTests?: boolean; runIntegrationTests?: boolean },
): TestingReport {
  const unit = validateUnitTests(cwd, {
    cwd,
    runUnitTests: options?.runUnitTests,
  });
  const integration = validateIntegrationTests(cwd, {
    cwd,
    runIntegrationTests: options?.runIntegrationTests,
  });
  return {
    ok: unit.ok && integration.ok,
    testFileCount: countTestFiles(join(cwd, "src")),
    unit,
    integration,
  };
}

export function formatTestingArtifact(report: TestingReport): string {
  return [
    "Testing Report",
    "",
    `OK: ${report.ok}`,
    `Test files: ${report.testFileCount}`,
    `Unit: ${report.unit.message}`,
    `Integration: ${report.integration.message}`,
  ].join("\n");
}
