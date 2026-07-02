export type CompanyRef = {
  id: string;
  slug?: string;
};

const RESERVED_COMPANY_PATH_SEGMENTS = new Set(["new"]);

function extractCompanyPathSegment(pathname: string): string | null {
  const match = pathname.match(/\/app\/companies\/([^/]+)/);
  return match?.[1] ?? null;
}

export function resolveCompanySlugFromPath(pathname: string): string | null {
  const segment = extractCompanyPathSegment(pathname);
  if (!segment || RESERVED_COMPANY_PATH_SEGMENTS.has(segment)) {
    return null;
  }
  return segment;
}

export function resolveActiveCompany<T extends CompanyRef>(
  companies: T[],
  pathname: string,
  preferredSlug?: string | null,
): T | null {
  const pathSlug = resolveCompanySlugFromPath(pathname);
  const rawSegment = extractCompanyPathSegment(pathname);

  if (pathSlug) {
    const fromPath = companies.find((company) => company.slug === pathSlug);
    if (fromPath) {
      return fromPath;
    }
  }

  if (
    rawSegment &&
    !RESERVED_COMPANY_PATH_SEGMENTS.has(rawSegment)
  ) {
    return null;
  }

  if (preferredSlug) {
    const fromPreference = companies.find((company) => company.slug === preferredSlug);
    if (fromPreference) {
      return fromPreference;
    }
  }

  return companies[0] ?? null;
}
