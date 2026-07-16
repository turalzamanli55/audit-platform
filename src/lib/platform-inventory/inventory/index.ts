/**
 * Platform inventory — assemble counts from EPBSE + EPAC evidence index signals.
 */
import type { EpireInputs } from "@/lib/platform-inventory/resolver";
import type { InventoryCounts } from "@/lib/platform-inventory/types";

export function buildInventoryCounts(inputs: EpireInputs): InventoryCounts {
  const snap = inputs.epbse.snapshot;
  const evidence = snap.evidenceIndex;
  const eiie = inputs.eiie;

  return {
    domains: snap.domains.length,
    modules: snap.modules.length,
    features: snap.features.length,
    capabilities: snap.capabilities.length,
    migrations: evidence.migrations.length,
    repositories: evidence.repositories.length || eiie.repository.files,
    serverActions: evidence.serverActions.length || eiie.serverActions.exportedActions,
    routes: evidence.routes.length || evidence.pages.length,
    workspaces: evidence.pages.filter((p) => p.includes("workspace") || p.includes("/app/")).length,
    components: evidence.components.length,
    permissions: evidence.permissions.length || eiie.permissions.definitions,
    tests: evidence.tests.length || eiie.testing.unitTests + eiie.testing.integrationTests,
    locales: evidence.locales.length,
    aiArtifacts: countAiSignals(inputs),
    devopsArtifacts: inputs.epac.health.devops > 0 ? 1 : 0,
  };
}

function countAiSignals(inputs: EpireInputs): number {
  const aiCaps = inputs.ecie.capabilities.filter((c) => c.classes.includes("ai"));
  return aiCaps.length;
}
