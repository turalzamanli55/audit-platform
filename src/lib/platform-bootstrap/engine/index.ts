import type {
  BootstrapClient,
  BootstrapResult,
  BootstrapRunOptions,
  ValidationReport,
} from "../types";
import { runPlatformBootstrap } from "../bootstrap";
import { validatePlatformBootstrap } from "../validation";
import { getPlatformHealth, type PlatformHealthModel } from "../health";

/**
 * Platform Bootstrap Engine facade. Runtime-free (no server-only imports) so it
 * can be driven from the Next.js runtime or from a plain Node/tsx script that
 * supplies its own service-role client.
 */
export const platformBootstrapEngine = {
  run(client: BootstrapClient, options?: BootstrapRunOptions): Promise<BootstrapResult> {
    return runPlatformBootstrap(client, options);
  },
  validate(client: BootstrapClient): Promise<ValidationReport> {
    return validatePlatformBootstrap(client);
  },
  health(client: BootstrapClient): Promise<PlatformHealthModel> {
    return getPlatformHealth(client);
  },
};

export type PlatformBootstrapEngine = typeof platformBootstrapEngine;
