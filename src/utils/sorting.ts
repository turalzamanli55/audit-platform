export type SortDirection = "asc" | "desc";

export type SortInput = {
  field: string;
  direction?: SortDirection;
};

export type NormalizedSort = {
  field: string;
  direction: SortDirection;
};

const SORT_DIRECTIONS: SortDirection[] = ["asc", "desc"];

export function normalizeSort(
  input?: SortInput | null,
  defaultSort: NormalizedSort = { field: "created_at", direction: "desc" },
): NormalizedSort {
  if (!input?.field) return defaultSort;

  const direction = SORT_DIRECTIONS.includes(input.direction ?? "asc")
    ? (input.direction ?? "asc")
    : defaultSort.direction;

  return {
    field: input.field,
    direction,
  };
}

export function toOrderClause(sort: NormalizedSort): { column: string; ascending: boolean } {
  return {
    column: sort.field,
    ascending: sort.direction === "asc",
  };
}
