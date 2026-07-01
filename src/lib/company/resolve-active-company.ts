export type CompanyRef = {
  id: string;
  slug?: string;
};

export function resolveCompanySlugFromPath(pathname: string): string | null {
  const match = pathname.match(/\/app\/companies\/([^/]+)/);
  return match?.[1] ?? null;
}

export function resolveActiveCompany<T extends CompanyRef>(
  companies: T[],
  pathname: string,
  preferredSlug?: string | null,
): T | null {
  const pathSlug = resolveCompanySlugFromPath(pathname);
  if (pathSlug) {
    const fromPath = companies.find((company) => company.slug === pathSlug);
    if (fromPath) return fromPath;
  }

  if (preferredSlug) {
    const fromPreference = companies.find((company) => company.slug === preferredSlug);
    if (fromPreference) return fromPreference;
  }

  return companies[0] ?? null;
}
