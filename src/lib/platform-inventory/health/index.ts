/**
 * Health — consumed directly from EPAC (no duplicated audits).
 */
import type { EpireInputs } from "@/lib/platform-inventory/resolver";
import type { PlatformHealth } from "@/lib/platform-inventory/types";

export function buildPlatformHealth(inputs: EpireInputs): PlatformHealth {
  const h = inputs.epac.health;
  return {
    architecture: h.architecture,
    database: h.database,
    backend: h.backend,
    frontend: h.frontend,
    ai: h.ai,
    security: h.security,
    testing: h.testing,
    localization: h.localization,
    devops: h.devops,
    documentation: h.documentationCoverage,
    overall: h.overall,
    source: "EPAC",
  };
}
