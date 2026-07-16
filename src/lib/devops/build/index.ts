import { existsSync } from "node:fs";
import { join } from "node:path";
import { validateBuild } from "@/lib/devops/validation";
import type { PipelineStageResult } from "@/lib/devops/types";

export type BuildStructuralReport = {
  ok: boolean;
  hasNextConfig: boolean;
  hasTsconfig: boolean;
  hasEslint: boolean;
  hasAppRouter: boolean;
  stage: PipelineStageResult;
};

/**
 * Build validation — structural checks by default; optional full Next.js build.
 */
export function runBuildValidation(
  cwd = process.cwd(),
  runFullBuild = false,
): BuildStructuralReport {
  const hasNextConfig =
    existsSync(join(cwd, "next.config.ts")) ||
    existsSync(join(cwd, "next.config.js")) ||
    existsSync(join(cwd, "next.config.mjs"));
  const hasTsconfig = existsSync(join(cwd, "tsconfig.json"));
  const hasEslint =
    existsSync(join(cwd, "eslint.config.mjs")) ||
    existsSync(join(cwd, "eslint.config.js"));
  const hasAppRouter = existsSync(join(cwd, "src", "app"));
  const stage = validateBuild(cwd, { cwd, runBuild: runFullBuild });

  return {
    ok: stage.ok && hasNextConfig && hasTsconfig && hasAppRouter,
    hasNextConfig,
    hasTsconfig,
    hasEslint,
    hasAppRouter,
    stage,
  };
}

export function formatBuildArtifact(report: BuildStructuralReport): string {
  return [
    "Build Report",
    "",
    `OK: ${report.ok}`,
    `Next.js config: ${report.hasNextConfig}`,
    `TypeScript config: ${report.hasTsconfig}`,
    `ESLint config: ${report.hasEslint}`,
    `App Router: ${report.hasAppRouter}`,
    `Stage: ${report.stage.message}`,
  ].join("\n");
}
