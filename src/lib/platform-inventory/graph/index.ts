/**
 * Dependency view — ECIE dependency intelligence + EPBSE module edges.
 */
import type { EpireInputs } from "@/lib/platform-inventory/resolver";
import type { DependencyView } from "@/lib/platform-inventory/types";
import type { ModuleInventoryItem } from "@/lib/platform-inventory/types";

export function buildDependencyView(
  inputs: EpireInputs,
  modules: ModuleInventoryItem[],
): DependencyView {
  const dep = inputs.ecie.dependencies;
  const dependsOn = [
    ...dep.edges.map((e) => ({ from: e.from, to: e.to, kind: e.kind })),
    ...modules.flatMap((m) =>
      m.dependsOn.map((to) => ({ from: m.id, to, kind: "module" as const })),
    ),
  ];

  const blocks = modules.flatMap((m) =>
    m.blocks.map((to) => ({ from: m.id, to })),
  );

  const blockedBy = [
    ...Object.entries(dep.blockingReasons).map(([id, reasons]) => ({
      id,
      blockedBy: reasons,
    })),
    ...modules
      .filter((m) => m.blockedBy.length > 0)
      .map((m) => ({ id: m.id, blockedBy: m.blockedBy })),
  ];

  const criticalPath =
    inputs.eiie.repairPlan.criticalPath.length > 0
      ? inputs.eiie.repairPlan.criticalPath
      : dep.criticalPath.length > 0
        ? dep.criticalPath
        : inputs.ecie.roadmap.criticalPath;

  return { dependsOn, blocks, blockedBy, criticalPath };
}
