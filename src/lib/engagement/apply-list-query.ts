import type { EngagementListItem } from "./engagement-list-item";

export type EngagementListQuery = {
  q?: string;
  status?: "all" | "active" | "inactive" | "archived" | "suspended";
  lifecycle?: "all" | EngagementListItem["lifecycleStatus"];
  companyId?: string;
  sort?: "name" | "updated";
  order?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

export type EngagementListPageResult = {
  items: EngagementListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const DEFAULT_PAGE_SIZE = 10;

export function parseEngagementListQuery(
  searchParams: Record<string, string | string[] | undefined>,
): EngagementListQuery {
  const read = (key: string): string | undefined => {
    const value = searchParams[key];
    if (Array.isArray(value)) return value[0];
    return value;
  };

  const status = read("status");
  const lifecycle = read("lifecycle");
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
    lifecycle:
      lifecycle === "draft" ||
      lifecycle === "planning" ||
      lifecycle === "fieldwork" ||
      lifecycle === "review" ||
      lifecycle === "completed" ||
      lifecycle === "closed"
        ? lifecycle
        : "all",
    companyId: read("company")?.trim() || undefined,
    sort: sort === "updated" ? "updated" : "name",
    order: order === "desc" ? "desc" : "asc",
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: DEFAULT_PAGE_SIZE,
  };
}

export function applyEngagementListQuery(
  items: EngagementListItem[],
  query: EngagementListQuery,
): EngagementListPageResult {
  const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
  let filtered = [...items];

  if (query.q) {
    const needle = query.q.toLowerCase();
    filtered = filtered.filter((item) => {
      return (
        item.name.toLowerCase().includes(needle) ||
        item.companyName.toLowerCase().includes(needle) ||
        (item.engagementCode?.toLowerCase().includes(needle) ?? false) ||
        item.slug.toLowerCase().includes(needle)
      );
    });
  }

  if (query.companyId) {
    filtered = filtered.filter((item) => item.companyId === query.companyId);
  }

  if (query.status && query.status !== "all") {
    filtered = filtered.filter((item) => {
      if (query.status === "archived") {
        return item.isArchived || item.status === "archived";
      }
      return item.status === query.status && !item.isArchived;
    });
  }

  if (query.lifecycle && query.lifecycle !== "all") {
    filtered = filtered.filter((item) => item.lifecycleStatus === query.lifecycle);
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

export function buildEngagementListSearchParams(
  current: EngagementListQuery,
  patch: Partial<EngagementListQuery>,
): URLSearchParams {
  const next: EngagementListQuery = { ...current, ...patch };
  const params = new URLSearchParams();

  if (next.q) params.set("q", next.q);
  if (next.status && next.status !== "all") params.set("status", next.status);
  if (next.lifecycle && next.lifecycle !== "all") params.set("lifecycle", next.lifecycle);
  if (next.companyId) params.set("company", next.companyId);
  if (next.sort && next.sort !== "name") params.set("sort", next.sort);
  if (next.order && next.order !== "asc") params.set("order", next.order);
  if (next.page && next.page > 1) params.set("page", String(next.page));

  return params;
}
