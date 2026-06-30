export type PaginationInput = {
  page: number;
  pageSize: number;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  offset: number;
  limit: number;
};

export type PaginatedResult<T> = {
  data: T[];
  meta: PaginationMeta;
};

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

export function normalizePagination(input?: Partial<PaginationInput>): PaginationMeta {
  const page = Math.max(input?.page ?? DEFAULT_PAGE, 1);
  const pageSize = Math.min(Math.max(input?.pageSize ?? DEFAULT_PAGE_SIZE, 1), MAX_PAGE_SIZE);
  const offset = (page - 1) * pageSize;

  return {
    page,
    pageSize,
    offset,
    limit: pageSize,
  };
}

export function createPaginatedResult<T>(data: T[], meta: PaginationMeta): PaginatedResult<T> {
  return { data, meta };
}
