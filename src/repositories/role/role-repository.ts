import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter, requireRow } from "../base/repository-helpers";
import {
  unwrapSupabaseList,
  unwrapSupabaseMaybeSingle,
} from "@/utils/supabase-result";

export type RoleRecord = Tables<"roles">;
export type PermissionRecord = Tables<"permissions">;

export class RoleRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async findById(id: string): Promise<RoleRecord | null> {
    const result = await applyActiveFilter(
      this.client.from("roles").select("*").eq("id", id),
    ).maybeSingle();

    return unwrapSupabaseMaybeSingle(result);
  }

  async findBySlug(slug: string, organizationId?: string | null): Promise<RoleRecord | null> {
    let query = applyActiveFilter(this.client.from("roles").select("*").eq("slug", slug));

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    } else {
      query = query.is("organization_id", null).eq("scope", "platform");
    }

    const result = await query.maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async listPlatformRoles(): Promise<RoleRecord[]> {
    const result = await applyActiveFilter(
      this.client
        .from("roles")
        .select("*")
        .eq("scope", "platform")
        .is("organization_id", null)
        .order("name", { ascending: true }),
    );

    return unwrapSupabaseList(result);
  }

  async listByOrganization(organizationId: string): Promise<RoleRecord[]> {
    const result = await applyActiveFilter(
      this.client
        .from("roles")
        .select("*")
        .eq("organization_id", organizationId)
        .order("name", { ascending: true }),
    );

    return unwrapSupabaseList(result);
  }

  async listPermissionsForRole(roleId: string): Promise<PermissionRecord[]> {
    const result = await applyActiveFilter(
      this.client
        .from("role_permissions")
        .select("permissions(*)")
        .eq("role_id", roleId),
    );

    const rows = unwrapSupabaseList(result);
    return rows
      .map((row) => row.permissions)
      .filter((permission): permission is PermissionRecord => permission !== null);
  }

  async getRoleWithPermissions(roleId: string): Promise<{ role: RoleRecord; permissions: PermissionRecord[] }> {
    const role = requireRow(await this.findById(roleId), "Role", roleId);
    const permissions = await this.listPermissionsForRole(roleId);
    return { role, permissions };
  }
}
