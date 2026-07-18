/**
 * Platform Bootstrap module — provisions the single Platform Owner and the
 * platform-global catalogs (roles, permissions, plans, licenses, feature flags)
 * that sit ABOVE all tenants. PROJECT_BIBLE.md is the source of truth.
 *
 * Note: the server-only startup runner lives at
 * `@/lib/platform-bootstrap/startup` and must be imported directly so this
 * barrel stays runtime-agnostic (usable from tsx scripts).
 */

export * from "./types";
export * from "./constants";
export { platformBootstrapEngine } from "./engine";
export type { PlatformBootstrapEngine } from "./engine";
export { runPlatformBootstrap, readBootstrapStatus } from "./bootstrap";
export { validatePlatformBootstrap } from "./validation";
export { getPlatformHealth } from "./health";
export type {
  PlatformHealthModel,
  PlatformStatusLevel,
  PlatformRecentEvent,
} from "./health";
export { ensurePlatformOwner, getPlatformOwnerUserId } from "./owner";
export { runPlatformSeed } from "./seed";
