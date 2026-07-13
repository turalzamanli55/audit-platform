import type { PlatformModule, PlatformModuleStatus } from "@/lib/platform-registry/modules";

const STATUS_ORDER: PlatformModuleStatus[] = [
  "planned",
  "foundation",
  "partial",
  "production",
  "enterprise",
  "completed",
  "deprecated",
];

/**
 * Roadmap — ordered view of registered modules by completion ascending.
 */
export function buildPlatformRoadmap(modules: PlatformModule[]) {
  return [...modules]
    .filter((module) => module.status !== "deprecated")
    .sort((a, b) => {
      if (a.completionPct !== b.completionPct) return a.completionPct - b.completionPct;
      return STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status);
    })
    .map((module) => ({
      id: module.id,
      name: module.name,
      status: module.status,
      completionPct: module.completionPct,
      domain: module.domain,
      missingDimensions: Object.entries(module.evidence)
        .filter(([, satisfied]) => !satisfied)
        .map(([dimension]) => dimension),
    }));
}
