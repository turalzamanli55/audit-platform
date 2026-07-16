import type {
  PipelineRunReport,
  ReleaseChecklistReport,
  ChecklistItem,
  ChecklistItemId,
} from "@/lib/devops/types";

const CHECKLIST_LABELS: Record<ChecklistItemId, string> = {
  fresh_database_replay: "Fresh database replay",
  sql_foundation: "SQL Foundation",
  migration_replay: "Migration replay",
  supabase_types: "Supabase Types",
  build: "Build",
  tests: "Tests",
  localization: "Localization",
  capability_registry: "Capability Registry",
  project_sync: "Project Sync",
  platform_readiness: "Platform Readiness",
  governance: "Governance",
  release_health: "Release Health",
};

/**
 * Checklist Engine — any required failure blocks release.
 */
export function evaluateReleaseChecklist(
  pipeline: PipelineRunReport,
): ReleaseChecklistReport {
  const byId = new Map(pipeline.stages.map((s) => [s.id, s]));

  const map: Array<{
    id: ChecklistItemId;
    stageIds: string[];
    required: boolean;
  }> = [
    {
      id: "fresh_database_replay",
      stageIds: ["migration_validation"],
      required: true,
    },
    {
      id: "sql_foundation",
      stageIds: ["sql_foundation_validation"],
      required: true,
    },
    {
      id: "migration_replay",
      stageIds: ["migration_validation", "governance_validation"],
      required: true,
    },
    {
      id: "supabase_types",
      stageIds: ["supabase_types_validation"],
      required: true,
    },
    { id: "build", stageIds: ["build_validation"], required: true },
    {
      id: "tests",
      stageIds: ["unit_tests", "integration_tests"],
      required: true,
    },
    {
      id: "localization",
      stageIds: ["localization_validation"],
      required: true,
    },
    {
      id: "capability_registry",
      stageIds: ["capability_validation"],
      required: true,
    },
    {
      id: "project_sync",
      stageIds: ["project_bible_sync"],
      required: true,
    },
    {
      id: "platform_readiness",
      stageIds: ["platform_readiness_sync"],
      required: true,
    },
    {
      id: "governance",
      stageIds: ["governance_validation", "schema_validation"],
      required: true,
    },
    {
      id: "release_health",
      stageIds: ["release_validation"],
      required: true,
    },
  ];

  const items: ChecklistItem[] = map.map((entry) => {
    const stages = entry.stageIds
      .map((id) => byId.get(id as never))
      .filter(Boolean);
    const ok = stages.every((s) => s!.ok);
    const messages = stages.map((s) => s!.message).join("; ");
    return {
      id: entry.id,
      label: CHECKLIST_LABELS[entry.id],
      ok,
      required: entry.required,
      message: messages || "Stage missing",
    };
  });

  const failedRequired = items
    .filter((item) => item.required && !item.ok)
    .map((item) => item.id);

  return {
    ok: failedRequired.length === 0,
    items,
    failedRequired,
  };
}

export function formatChecklistReport(report: ReleaseChecklistReport): string {
  const lines = [
    "Release Checklist",
    "",
    `OK: ${report.ok}`,
    "",
  ];
  for (const item of report.items) {
    lines.push(`${item.ok ? "✓" : "✗"} ${item.label} — ${item.message}`);
  }
  if (report.failedRequired.length > 0) {
    lines.push("", `Failed required: ${report.failedRequired.join(", ")}`);
  }
  return lines.join("\n");
}
