import type {
  ArtifactKind,
  DevOpsArtifact,
  PipelineRunReport,
  ReleaseCandidate,
  ReleaseChecklistReport,
  VersionManifest,
} from "@/lib/devops/types";
import { formatPipelineReport } from "@/lib/devops/pipeline";
import { formatMigrationArtifact } from "@/lib/devops/migration";
import { formatBuildArtifact, runBuildValidation } from "@/lib/devops/build";
import { formatTestingArtifact, runTestingValidation } from "@/lib/devops/testing";
import { formatSchemaArtifact } from "@/lib/devops/schema";
import { formatProjectSyncArtifact } from "@/lib/devops/project-sync";
import { formatCapabilitySyncArtifact } from "@/lib/devops/capability-sync";
import { formatPlatformSyncArtifact } from "@/lib/devops/platform-sync";
import { formatChecklistReport } from "@/lib/devops/checklists";
import { formatReleaseNotes } from "@/lib/devops/release";
import { formatVersionManifest } from "@/lib/devops/versioning";
import { validateLocalization } from "@/lib/devops/validation";

function artifact(
  kind: ArtifactKind,
  title: string,
  body: string,
  ok: boolean,
): DevOpsArtifact {
  return { kind, title, generatedAt: new Date().toISOString(), body, ok };
}

/**
 * Artifacts — automatically generated validation / release documents.
 */
export function generateArtifacts(input: {
  cwd?: string;
  pipeline: PipelineRunReport;
  checklist: ReleaseChecklistReport;
  versions: VersionManifest;
  release: ReleaseCandidate;
}): DevOpsArtifact[] {
  const cwd = input.cwd ?? process.cwd();
  const build = runBuildValidation(cwd);
  const testing = runTestingValidation(cwd);
  const localization = validateLocalization(cwd);

  return [
    artifact(
      "validation",
      "Validation Report",
      formatPipelineReport(input.pipeline),
      input.pipeline.ok,
    ),
    artifact(
      "migration",
      "Migration Report",
      formatMigrationArtifact(cwd),
      input.pipeline.stages.find((s) => s.id === "migration_validation")?.ok ?? false,
    ),
    artifact("build", "Build Report", formatBuildArtifact(build), build.ok),
    artifact(
      "testing",
      "Testing Report",
      formatTestingArtifact(testing),
      testing.ok,
    ),
    artifact(
      "coverage",
      "Coverage Report",
      [
        "Coverage Report",
        "",
        `Test files: ${testing.testFileCount}`,
        formatSchemaArtifact(cwd),
      ].join("\n\n"),
      testing.ok,
    ),
    artifact(
      "localization",
      "Localization Report",
      [
        "Localization Report",
        "",
        localization.message,
        JSON.stringify(localization.details ?? {}, null, 2),
      ].join("\n"),
      localization.ok,
    ),
    artifact(
      "platform_readiness",
      "Platform Readiness Report",
      [
        formatPlatformSyncArtifact(),
        "",
        formatCapabilitySyncArtifact(cwd),
        "",
        formatProjectSyncArtifact(cwd),
        "",
        formatVersionManifest(input.versions),
      ].join("\n"),
      input.checklist.items.find((i) => i.id === "platform_readiness")?.ok ?? false,
    ),
    artifact(
      "release",
      "Release Report",
      [
        formatReleaseNotes(input.release),
        "",
        formatChecklistReport(input.checklist),
      ].join("\n\n"),
      input.release.status === "validated",
    ),
  ];
}
