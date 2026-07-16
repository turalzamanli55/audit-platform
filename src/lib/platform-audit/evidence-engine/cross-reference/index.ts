/**
 * Cross-reference PROJECT_BIBLE → registries → sync → codebase.
 */
import { projectSyncEngine } from "@/lib/project-sync/engine";
import { capabilityRegistryEngine } from "@/lib/capability-registry/engine";
import { platformRegistryEngine } from "@/lib/platform-registry/engine";
import {
  discoverCodebaseRoots,
  normalizeIdentity,
  resolveModuleRoots,
} from "@/lib/platform-audit/evidence-engine/aliases";
import type { CrossReferenceReport } from "@/lib/platform-audit/evidence-engine/types";
import type { DocumentExtraction } from "@/lib/platform-audit/types";

export function buildCrossReference(
  extraction: DocumentExtraction,
  cwd: string,
): CrossReferenceReport {
  const sync = projectSyncEngine.synchronize({ cwd, persist: false });
  const capabilityReport = capabilityRegistryEngine.buildReport();
  const platformReport = platformRegistryEngine.buildReport();
  const roots = discoverCodebaseRoots(cwd);

  const unmatchedBibleModules: string[] = [];
  let matchedModules = 0;
  for (const module of extraction.modules) {
    const resolved = resolveModuleRoots(module.id, module.name, roots);
    if (resolved.matchedRoots.length > 0) matchedModules += 1;
    else unmatchedBibleModules.push(module.id);
  }

  const documentedNorm = new Set(
    extraction.modules.flatMap((m) =>
      resolveModuleRoots(m.id, m.name, roots).matchedRoots.map(normalizeIdentity),
    ),
  );
  const codebaseNormalized = [
    ...roots.lib,
    ...roots.repositories,
    ...roots.components,
  ].map(normalizeIdentity);
  const unmatchedCodeModules = [...new Set(codebaseNormalized)].filter(
    (name) => !documentedNorm.has(name),
  );

  const syncCaps = new Set(sync.snapshot.capabilities.map((c) => c.id));
  const registryCaps = new Set(capabilityReport.capabilities.map((c) => c.id));
  let matchedCapabilities = 0;
  for (const id of syncCaps) {
    if (registryCaps.has(id)) matchedCapabilities += 1;
  }

  return {
    bibleModules: extraction.modules.length,
    registryModules: capabilityReport.modules.length,
    platformModules: platformReport.modules.length,
    syncModules: sync.snapshot.modules.length,
    codebaseModules: new Set(codebaseNormalized).size,
    matchedModules,
    unmatchedBibleModules,
    unmatchedCodeModules: unmatchedCodeModules.slice(0, 40),
    capabilityRegistryCount: registryCaps.size,
    syncCapabilityCount: syncCaps.size,
    matchedCapabilities,
  };
}
