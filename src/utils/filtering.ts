export type FilterOperator = "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "ilike" | "in";

export type FilterCondition = {
  field: string;
  operator: FilterOperator;
  value: string | number | boolean | Array<string | number>;
};

export type FilterGroup = {
  conditions: FilterCondition[];
  match?: "all" | "any";
};

export function normalizeFilterGroup(group?: FilterGroup | null): FilterGroup {
  if (!group || group.conditions.length === 0) {
    return { conditions: [], match: "all" };
  }

  return {
    conditions: group.conditions.filter((condition) => condition.field.length > 0),
    match: group.match === "any" ? "any" : "all",
  };
}

export function isEmptyFilterGroup(group: FilterGroup): boolean {
  return group.conditions.length === 0;
}
