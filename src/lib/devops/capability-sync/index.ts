import { capabilityRegistryEngine } from "@/lib/capability-registry/engine";

/**
 * Capability Sync adapter — reuses Capability Registry. Does not reimplement.
 */
export function synchronizeCapabilities(cwd = process.cwd()) {
  capabilityRegistryEngine.resyncFromDocumentation(cwd);
  return capabilityRegistryEngine.buildReport();
}

export function formatCapabilitySyncArtifact(cwd = process.cwd()): string {
  const report = synchronizeCapabilities(cwd);
  return [
    "Capability Synchronization Report",
    "",
    `OK: ${report.validation.ok}`,
    `Platform Completion: ${report.platformCompletionPct}%`,
    `Domains: ${report.domains.length}`,
    `Modules: ${report.modules.length}`,
    `Features: ${report.features.length}`,
    `Capabilities: ${report.capabilities.length}`,
    `Validation Errors: ${report.validation.errors.length}`,
  ].join("\n");
}
