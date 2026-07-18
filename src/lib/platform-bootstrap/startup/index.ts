import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { isProduction } from "@/lib/env";
import { runPlatformBootstrap } from "../bootstrap";
import { BOOTSTRAP_PASSWORD_ENV_KEY } from "../constants";
import type { BootstrapResult } from "../types";

let startupPromise: Promise<BootstrapResult | null> | null = null;

/**
 * Development-only startup bootstrap. On first server start, if no Platform
 * Owner exists, one is created automatically using BOOTSTRAP_OWNER_PASSWORD.
 * Never runs in production and never recreates the owner once complete.
 * Guarded so concurrent requests trigger a single run.
 */
export function bootstrapPlatformOnStartup(): Promise<BootstrapResult | null> {
  if (startupPromise) return startupPromise;

  startupPromise = (async () => {
    if (isProduction()) {
      return null;
    }

    const ownerPassword = process.env[BOOTSTRAP_PASSWORD_ENV_KEY];

    try {
      const client = createAdminClient();
      const result = await runPlatformBootstrap(client, {
        ownerPassword,
        environment: "development",
      });

      if (!result.ok) {
        const failed = result.steps.filter((step) => step.status === "failed");
        if (failed.length > 0) {
          console.warn(
            "[platform-bootstrap] startup bootstrap incomplete:",
            failed.map((step) => `${step.key}: ${step.detail}`).join("; "),
          );
        }
      }

      return result;
    } catch (error) {
      console.warn("[platform-bootstrap] startup bootstrap error:", (error as Error).message);
      return null;
    }
  })();

  return startupPromise;
}
