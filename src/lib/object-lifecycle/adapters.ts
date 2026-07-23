import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import type { DependencySummary, LifecycleObjectType, SoftDeletedRecord } from "./types";

type Service = SupabaseClient<Database>;

type TableName =
  | "organizations"
  | "companies"
  | "engagements"
  | "workspaces"
  | "memberships"
  | "working_papers"
  | "risk_assessments"
  | "financial_statement_packages"
  | "reporting_packages";

const TABLE_BY_TYPE: Partial<Record<LifecycleObjectType, TableName>> = {
  organization: "organizations",
  company: "companies",
  engagement: "engagements",
  workspace: "workspaces",
  membership: "memberships",
  working_paper: "working_papers",
  risk_assessment: "risk_assessments",
  financial_statement: "financial_statement_packages",
  report: "reporting_packages",
};

function nameFromRow(row: Record<string, unknown>, objectType: LifecycleObjectType): string {
  if (typeof row.name === "string" && row.name.trim()) return row.name;
  if (typeof row.email === "string") return row.email;
  if (typeof row.slug === "string") return row.slug;
  if (typeof row.title === "string") return row.title;
  return `${objectType}:${String(row.id).slice(0, 8)}`;
}

function mapRow(
  objectType: LifecycleObjectType,
  row: Record<string, unknown>,
): SoftDeletedRecord | null {
  if (!row.id || !row.deleted_at) return null;
  return {
    objectType,
    id: String(row.id),
    name: nameFromRow(row, objectType),
    organizationId:
      objectType === "organization"
        ? String(row.id)
        : typeof row.organization_id === "string"
          ? row.organization_id
          : null,
    workspaceId: typeof row.workspace_id === "string" ? row.workspace_id : null,
    parentType: null,
    parentId: null,
    deletedAt: String(row.deleted_at),
    deletedBy: typeof row.deleted_by === "string" ? row.deleted_by : null,
    status: typeof row.status === "string" ? row.status : null,
    version: typeof row.version === "number" ? row.version : null,
  };
}

export async function listSoftDeleted(
  client: Service,
  options: {
    objectTypes?: LifecycleObjectType[];
    organizationId?: string | null;
    limit?: number;
  } = {},
): Promise<SoftDeletedRecord[]> {
  const types = options.objectTypes ?? (Object.keys(TABLE_BY_TYPE) as LifecycleObjectType[]);
  const limit = options.limit ?? 200;
  const results: SoftDeletedRecord[] = [];

  for (const objectType of types) {
    const table = TABLE_BY_TYPE[objectType];
    if (!table) continue;

    let query = client
      .from(table)
      .select("*")
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false })
      .limit(limit);

    if (options.organizationId && objectType !== "organization") {
      // Dynamic table union — organization_id exists on all non-org adapters.
      query = (query as { eq: (column: string, value: string) => typeof query }).eq(
        "organization_id",
        options.organizationId,
      );
    }
    if (options.organizationId && objectType === "organization") {
      query = query.eq("id", options.organizationId);
    }

    const { data } = await query;
    for (const row of data ?? []) {
      const mapped = mapRow(objectType, row as Record<string, unknown>);
      if (mapped) results.push(mapped);
    }
  }

  return results
    .sort((a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime())
    .slice(0, limit);
}

export async function loadSoftDeletedRecord(
  client: Service,
  objectType: LifecycleObjectType,
  id: string,
): Promise<SoftDeletedRecord | null> {
  const table = TABLE_BY_TYPE[objectType];
  if (!table) return null;
  const { data } = await client.from(table).select("*").eq("id", id).maybeSingle();
  if (!data || !(data as { deleted_at?: string | null }).deleted_at) {
    // Allow restore preview of active? No — recycle bin only soft-deleted.
    if (!data) return null;
    // Still map if deleted_at set
  }
  const row = data as Record<string, unknown>;
  if (!row.deleted_at) return null;
  return mapRow(objectType, row);
}

export async function softDeleteRecord(
  client: Service,
  objectType: LifecycleObjectType,
  id: string,
  actorUserId: string,
): Promise<void> {
  const table = TABLE_BY_TYPE[objectType];
  if (!table) throw new Error(`Unsupported object type: ${objectType}`);

  const patch: Record<string, unknown> = {
    deleted_at: new Date().toISOString(),
    deleted_by: actorUserId,
  };
  if (objectType === "organization" || objectType === "company" || objectType === "workspace") {
    patch.status = "archived";
  }

  const { error } = await client
    .from(table)
    .update(patch as never)
    .eq("id", id)
    .is("deleted_at", null);
  if (error) throw new Error(error.message);
}

export async function restoreRecord(
  client: Service,
  objectType: LifecycleObjectType,
  id: string,
  actorUserId: string,
): Promise<void> {
  const table = TABLE_BY_TYPE[objectType];
  if (!table) throw new Error(`Unsupported object type: ${objectType}`);

  const patch: Record<string, unknown> = {
    deleted_at: null,
    deleted_by: null,
    updated_by: actorUserId,
  };
  if (objectType === "organization" || objectType === "company" || objectType === "workspace") {
    patch.status = "active";
  }

  const { error } = await client
    .from(table)
    .update(patch as never)
    .eq("id", id)
    .not("deleted_at", "is", null);
  if (error) throw new Error(error.message);
}

export async function permanentDeleteRecord(
  client: Service,
  objectType: LifecycleObjectType,
  id: string,
): Promise<void> {
  const table = TABLE_BY_TYPE[objectType];
  if (!table) throw new Error(`Unsupported object type: ${objectType}`);
  const { error } = await client.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function analyzeDependencies(
  client: Service,
  objectType: LifecycleObjectType,
  id: string,
): Promise<DependencySummary> {
  const empty: DependencySummary = {
    engagements: 0,
    users: 0,
    workspaces: 0,
    companies: 0,
    workingPapers: 0,
    reports: 0,
    documents: 0,
    evidence: 0,
    children: [],
  };

  if (objectType === "organization") {
    const [companies, workspaces, engagements, memberships, papers, reports] = await Promise.all([
      client.from("companies").select("id, name", { count: "exact" }).eq("organization_id", id),
      client.from("workspaces").select("id, name", { count: "exact" }).eq("organization_id", id),
      client.from("engagements").select("id, name", { count: "exact" }).eq("organization_id", id),
      client
        .from("memberships")
        .select("id", { count: "exact" })
        .eq("organization_id", id)
        .eq("membership_scope", "organization"),
      client.from("working_papers").select("id", { count: "exact" }).eq("organization_id", id),
      client.from("reporting_packages").select("id", { count: "exact" }).eq("organization_id", id),
    ]);

    const children: DependencySummary["children"] = [];
    for (const row of companies.data ?? []) {
      children.push({ objectType: "company", id: row.id, name: row.name });
    }
    for (const row of workspaces.data ?? []) {
      children.push({ objectType: "workspace", id: row.id, name: row.name });
    }
    for (const row of engagements.data ?? []) {
      children.push({ objectType: "engagement", id: row.id, name: row.name });
    }

    return {
      engagements: engagements.count ?? 0,
      users: memberships.count ?? 0,
      workspaces: workspaces.count ?? 0,
      companies: companies.count ?? 0,
      workingPapers: papers.count ?? 0,
      reports: reports.count ?? 0,
      documents: 0,
      evidence: 0,
      children: children.slice(0, 100),
    };
  }

  if (objectType === "company") {
    const engagements = await client
      .from("engagements")
      .select("id, name", { count: "exact" })
      .eq("company_id", id);
    return {
      ...empty,
      engagements: engagements.count ?? 0,
      children: (engagements.data ?? []).map((row) => ({
        objectType: "engagement" as const,
        id: row.id,
        name: row.name,
      })),
    };
  }

  if (objectType === "workspace") {
    const [memberships, companies] = await Promise.all([
      client.from("memberships").select("id", { count: "exact" }).eq("workspace_id", id),
      client.from("companies").select("id, name", { count: "exact" }).eq("workspace_id", id),
    ]);
    return {
      ...empty,
      users: memberships.count ?? 0,
      companies: companies.count ?? 0,
      children: (companies.data ?? []).map((row) => ({
        objectType: "company" as const,
        id: row.id,
        name: row.name,
      })),
    };
  }

  if (objectType === "engagement") {
    const [papers, reports] = await Promise.all([
      client.from("working_papers").select("id", { count: "exact" }).eq("engagement_id", id),
      client.from("reporting_packages").select("id", { count: "exact" }).eq("engagement_id", id),
    ]);
    return {
      ...empty,
      workingPapers: papers.count ?? 0,
      reports: reports.count ?? 0,
    };
  }

  return empty;
}

/** Soft-deleted children for hierarchy restore (same org / parent). */
export async function listDeletedChildren(
  client: Service,
  root: SoftDeletedRecord,
  mode: "with_children" | "hierarchy",
): Promise<SoftDeletedRecord[]> {
  if (!root.organizationId && root.objectType !== "organization") return [];

  const orgId = root.objectType === "organization" ? root.id : root.organizationId;
  if (!orgId) return [];

  if (mode === "hierarchy" || root.objectType === "organization") {
    const all = await listSoftDeleted(client, { organizationId: orgId, limit: 500 });
    return all.filter((row) => row.id !== root.id);
  }

  // with_children: immediate related soft-deleted only
  const deps = await analyzeDependencies(client, root.objectType, root.id);
  const out: SoftDeletedRecord[] = [];
  for (const child of deps.children) {
    const rec = await loadSoftDeletedRecord(client, child.objectType, child.id);
    if (rec) out.push(rec);
  }
  return out;
}

export function supportedObjectTypes(): LifecycleObjectType[] {
  return Object.keys(TABLE_BY_TYPE) as LifecycleObjectType[];
}
