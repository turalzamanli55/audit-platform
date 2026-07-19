/** Platform Console version, kept in sync with package.json. */
export const PLATFORM_VERSION = "0.1.0";

/**
 * Build metadata surfaced in the "About Platform" dialog. These are read from
 * the environment when available (CI/hosting providers populate them) and are
 * treated as optional — the UI shows "Not available" when a value is empty.
 */
export const BUILD_DATE: string =
  process.env.NEXT_PUBLIC_BUILD_DATE ?? process.env.BUILD_DATE ?? "";

export const GIT_COMMIT: string =
  process.env.NEXT_PUBLIC_GIT_COMMIT ??
  process.env.VERCEL_GIT_COMMIT_SHA ??
  process.env.GIT_COMMIT ??
  "";
