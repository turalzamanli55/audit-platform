export type EngagementRef = {
  id: string;
  slug?: string;
  companyId?: string;
};

const RESERVED_ENGAGEMENT_PATH_SEGMENTS = new Set(["new"]);

function extractEngagementPathSegment(pathname: string): string | null {
  const match = pathname.match(/\/app\/engagements\/([^/]+)/);
  return match?.[1] ?? null;
}

export function resolveEngagementSlugFromPath(pathname: string): string | null {
  const segment = extractEngagementPathSegment(pathname);
  if (!segment || RESERVED_ENGAGEMENT_PATH_SEGMENTS.has(segment)) {
    return null;
  }
  return segment;
}

export function resolveActiveEngagement<T extends EngagementRef>(
  engagements: T[],
  pathname: string,
  preferredSlug?: string | null,
  companyId?: string | null,
): T | null {
  const scopedEngagements =
    companyId != null
      ? engagements.filter((engagement) => engagement.companyId === companyId)
      : engagements;

  const pathSlug = resolveEngagementSlugFromPath(pathname);
  const rawSegment = extractEngagementPathSegment(pathname);

  if (pathSlug) {
    const fromPath = scopedEngagements.find((engagement) => engagement.slug === pathSlug);
    if (fromPath) {
      return fromPath;
    }

    const fromPathAnyCompany = engagements.find((engagement) => engagement.slug === pathSlug);
    if (fromPathAnyCompany) {
      return fromPathAnyCompany;
    }
  }

  if (rawSegment && !RESERVED_ENGAGEMENT_PATH_SEGMENTS.has(rawSegment)) {
    return null;
  }

  if (preferredSlug) {
    const fromPreference = scopedEngagements.find((engagement) => engagement.slug === preferredSlug);
    if (fromPreference) {
      return fromPreference;
    }
  }

  return scopedEngagements[0] ?? engagements[0] ?? null;
}
