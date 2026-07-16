import { projectSyncEngine } from "@/lib/project-sync/engine";
import type { SynchronizationResult } from "@/lib/project-sync/sync";

/**
 * Project Sync adapter — reuses EPBSE. Does not reimplement.
 */
export function synchronizeProject(cwd = process.cwd()): SynchronizationResult {
  return projectSyncEngine.synchronize({ cwd, persist: false });
}

export function formatProjectSyncArtifact(cwd = process.cwd()): string {
  const result = synchronizeProject(cwd);
  return [
    "Project Synchronization Report",
    "",
    `Domains: ${result.snapshot.domains.length}`,
    `Modules: ${result.snapshot.modules.length}`,
    `Features: ${result.snapshot.features.length}`,
    `Capabilities: ${result.snapshot.capabilities.length}`,
    `Platform Completion: ${result.snapshot.platformCompletionPct}%`,
    `Synced At: ${result.snapshot.timestamp}`,
    `Validation OK: ${result.report.validation.ok}`,
  ].join("\n");
}
