import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert, TablesUpdate } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter, requireRow } from "../base/repository-helpers";
import { unwrapSupabaseResult } from "@/utils/supabase-result";

export type Membership = Tables<"memberships">;
export type CreateMembershipInput = Pick<
  TablesInsert<"memberships">,
  "user_id" | "organization_id" | "workspace_id" | "company_id" | "role_id" | "membership_scope"
>;
export type UpdateMembershipInput = Pick<TablesUpdate<"memberships">, "role_id" | "status">;

export class MembershipRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async findById(id: string): Promise<Membership | null> {
    const result = await applyActiveFilter(
      this.client.from("memberships").select("*").eq("id", id),
    ).maybeSingle();

    return unwrapSupabaseResult(result);
  }

  async listByOrganization(organizationId: string): Promise<Membership[]> {
    const result = await applyActiveFilter(
      this.client
        .from("memberships")
        .select("*")
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: true }),
    );

    return unwrapSupabaseResult(result);
  }

  async listByWorkspace(workspaceId: string): Promise<Membership[]> {
    const result = await applyActiveFilter(
      this.client
        .from("memberships")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: true }),
    );

    return unwrapSupabaseResult(result);
  }

  async listForUser(userId: string): Promise<Membership[]> {
    const result = await applyActiveFilter(
      this.client
        .from("memberships")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true }),
    );

    return unwrapSupabaseResult(result);
  }

  async create(input: CreateMembershipInput): Promise<Membership> {
    const result = await this.client
      .from("memberships")
      .insert({
        user_id: input.user_id,
        organization_id: input.organization_id,
        workspace_id: input.workspace_id ?? null,
        company_id: input.company_id ?? null,
        role_id: input.role_id,
        membership_scope: input.membership_scope,
      })
      .select("*")
      .single();

    return requireRow(unwrapSupabaseResult(result), "Membership");
  }

  async update(id: string, expectedVersion: number, input: UpdateMembershipInput): Promise<Membership> {
    const result = await applyActiveFilter(
      this.client
        .from("memberships")
        .update(input)
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    return requireRow(unwrapSupabaseResult(result), "Membership", id);
  }

  async softDelete(id: string, expectedVersion: number): Promise<Membership> {
    const result = await applyActiveFilter(
      this.client
        .from("memberships")
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by: this.userId,
          status: "inactive",
        })
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    return requireRow(unwrapSupabaseResult(result), "Membership", id);
  }
}
