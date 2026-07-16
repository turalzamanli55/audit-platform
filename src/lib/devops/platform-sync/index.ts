import { platformRegistryEngine } from "@/lib/platform-registry/engine";

/**
 * Platform Sync adapter — reuses Platform Registry. Does not reimplement.
 */
export function synchronizePlatform() {
  return platformRegistryEngine.buildReport();
}

export function getPlatformCompletionPct(): number {
  return platformRegistryEngine.getPlatformCompletion();
}

export function formatPlatformSyncArtifact(): string {
  const report = synchronizePlatform();
  return [
    "Platform Readiness Synchronization Report",
    "",
    `OK: ${report.validation.ok}`,
    `Platform Completion: ${report.platformCompletionPct}%`,
    `Modules: ${report.modules.length}`,
    `Validation Errors: ${report.validation.errors.length}`,
  ].join("\n");
}
