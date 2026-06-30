import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter } from "../base/repository-helpers";
import {
  unwrapSupabaseList,
  unwrapSupabaseMaybeSingle,
} from "@/utils/supabase-result";

export type PermissionRecord = Tables<"permissions">;

export class PermissionRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async findById(id: string): Promise<PermissionRecord | null> {
    const result = await applyActiveFilter(
      this.client.from("permissions").select("*").eq("id", id),
    ).maybeSingle();

    return unwrapSupabaseMaybeSingle(result);
  }

  async findByCode(code: string): Promise<PermissionRecord | null> {
    const result = await applyActiveFilter(
      this.client.from("permissions").select("*").eq("code", code),
    ).maybeSingle();

    return unwrapSupabaseMaybeSingle(result);
  }

  async listAll(): Promise<PermissionRecord[]> {
    const result = await applyActiveFilter(
      this.client.from("permissions").select("*").order("code", { ascending: true }),
    );

    return unwrapSupabaseList(result);
  }

  async listByResource(resource: string): Promise<PermissionRecord[]> {
    const result = await applyActiveFilter(
      this.client
        .from("permissions")
        .select("*")
        .eq("resource", resource)
        .order("code", { ascending: true }),
    );

    return unwrapSupabaseList(result);
  }

  async listForRole(roleId: string): Promise<PermissionRecord[]> {
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
}
