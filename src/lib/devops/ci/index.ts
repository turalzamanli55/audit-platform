import type { CiCdBlueprint, CiProvider, PipelineStageId } from "@/lib/devops/types";

const PIPELINE_STAGES: PipelineStageId[] = [
  "source_validation",
  "migration_validation",
  "sql_foundation_validation",
  "schema_validation",
  "supabase_types_validation",
  "repository_validation",
  "localization_validation",
  "capability_validation",
  "project_bible_sync",
  "platform_readiness_sync",
  "build_validation",
  "unit_tests",
  "integration_tests",
  "governance_validation",
  "ai_validation",
  "release_validation",
];

const SHARED_COMMANDS = [
  "npm ci",
  "npm run validate:database",
  "npx tsx scripts/validate-devops.mts",
  "npm run lint",
  "npm run test",
  "npm run build",
];

/**
 * CI blueprints — vendor-neutral stage mapping for GitHub Actions, Azure DevOps, GitLab, self-hosted.
 */
export function buildCiBlueprint(provider: CiProvider): CiCdBlueprint {
  const notesByProvider: Record<CiProvider, string[]> = {
    github_actions: [
      "Map stages to jobs with needs: dependencies",
      "Use actions/checkout + setup-node",
      "Cache npm via actions/cache",
      "Fail job when validate-devops exits non-zero",
    ],
    azure_devops: [
      "Use multi-stage YAML pipeline",
      "Gate production with environment approvals",
      "Publish artifacts from DevOps report output",
    ],
    gitlab_ci: [
      "Define stages matching PIPELINE_STAGES order",
      "Use artifacts: paths for reports/",
      "Protect main with merge request pipeline required",
    ],
    self_hosted: [
      "Runner must have Node 20+, Docker optional for supabase reset",
      "Store secrets outside repo",
      "Invoke same npm scripts — no vendor-specific logic in EDRP",
    ],
  };

  return {
    provider,
    stages: [...PIPELINE_STAGES],
    commands: [...SHARED_COMMANDS],
    notes: notesByProvider[provider],
  };
}

export function formatCiBlueprint(blueprint: CiCdBlueprint): string {
  return [
    `CI Blueprint — ${blueprint.provider}`,
    "",
    "Stages:",
    ...blueprint.stages.map((s) => `  - ${s}`),
    "",
    "Commands:",
    ...blueprint.commands.map((c) => `  $ ${c}`),
    "",
    "Notes:",
    ...blueprint.notes.map((n) => `  - ${n}`),
  ].join("\n");
}

export { PIPELINE_STAGES };
