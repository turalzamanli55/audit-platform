/**
 * Deployment profiles — Cloud SaaS, Dedicated Cloud, On-Premise.
 * Business logic must remain profile-agnostic.
 */

export const DEPLOYMENT_PROFILES = ["cloud_saas", "dedicated_cloud", "on_premise"] as const;
export type DeploymentProfile = (typeof DEPLOYMENT_PROFILES)[number];

export function assertDeploymentProfile(profile: string): asserts profile is DeploymentProfile {
  if (!DEPLOYMENT_PROFILES.includes(profile as DeploymentProfile)) {
    throw new Error(`Unsupported deployment profile: ${profile}`);
  }
}
