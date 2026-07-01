import type { CompanyListItem } from "./company-list-item";

export type CompanyListQuery = {
  q?: string;
  status?: "all" | "active" | "inactive" | "archived" | "suspended";
  sort?: "name" | "updated";
  order?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

export type CompanyListPageResult = {
  items: CompanyListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const DEFAULT_PAGE_SIZE = 10;

export function parseCompanyListQuery(
  searchParams: Record<string, string | string[] | undefined>,
): CompanyListQuery {
  const read = (key: string): string | undefined => {
    const value = searchParams[key];
    if (Array.isArray(value)) {
      return value[0];
    }
    return value;
  };

  const status = read("status");
  const sort = read("sort");
  const order = read("order");
  const page = Number.parseInt(read("page") ?? "1", 10);

  return {
    q: read("q")?.trim() || undefined,
    status:
      status === "active" ||
      status === "inactive" ||
      status === "archived" ||
      status === "suspended"
        ? status
        : "all",
    sort: sort === "updated" ? "updated" : "name",
    order: order === "desc" ? "desc" : "asc",
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: DEFAULT_PAGE_SIZE,
  };
}

export function applyCompanyListQuery(
  items: CompanyListItem[],
  query: CompanyListQuery,
): CompanyListPageResult {
  const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
  let filtered = [...items];

  if (query.q) {
    const needle = query.q.toLowerCase();
    filtered = filtered.filter((item) => {
      return (
        item.name.toLowerCase().includes(needle) ||
        item.legalName.toLowerCase().includes(needle) ||
        item.jurisdiction.toLowerCase().includes(needle) ||
        item.slug.toLowerCase().includes(needle)
      );
    });
  }

  if (query.status && query.status !== "all") {
    filtered = filtered.filter((item) => {
      if (query.status === "archived") {
        return item.isArchived || item.status === "archived";
      }
      return item.status === query.status && !item.isArchived;
    });
  }

  const sortField = query.sort ?? "name";
  const sortOrder = query.order ?? "asc";
  const direction = sortOrder === "desc" ? -1 : 1;

  filtered.sort((left, right) => {
    if (sortField === "updated") {
      return (
        direction *
        (new Date(left.updatedAt).getTime() - new Date(right.updatedAt).getTime())
      );
    }

    return direction * left.name.localeCompare(right.name, undefined, { sensitivity: "base" });
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(query.page ?? 1, totalPages);
  const start = (page - 1) * pageSize;

  return {
    items: filtered.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    totalPages,
  };
}

export function buildCompanyListSearchParams(
  current: CompanyListQuery,
  patch: Partial<CompanyListQuery>,
): URLSearchParams {
  const next: CompanyListQuery = { ...current, ...patch };
  const params = new URLSearchParams();

  if (next.q) {
    params.set("q", next.q);
  }
  if (next.status && next.status !== "all") {
    params.set("status", next.status);
  }
  if (next.sort && next.sort !== "name") {
    params.set("sort", next.sort);
  }
  if (next.order && next.order !== "asc") {
    params.set("order", next.order);
  }
  if (next.page && next.page > 1) {
    params.set("page", String(next.page));
  }

  return params;
}
