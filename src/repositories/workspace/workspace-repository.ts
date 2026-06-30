import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert, TablesUpdate } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import {
  applyActiveFilter,
  DEFAULT_WORKSPACE_SETTINGS,
  requireRow,
} from "../base/repository-helpers";
import {
  unwrapSupabaseList,
  unwrapSupabaseMaybeSingle,
  unwrapSupabaseResult,
} from "@/utils/supabase-result";

export type Workspace = Tables<"workspaces">;
export type CreateWorkspaceInput = Pick<
  TablesInsert<"workspaces">,
  "organization_id" | "name" | "slug" | "description"
>;
export type UpdateWorkspaceInput = Pick<TablesUpdate<"workspaces">, "name" | "description" | "status">;

export class WorkspaceRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async findById(id: string): Promise<Workspace | null> {
    const result = await applyActiveFilter(
      this.client.from("workspaces").select("*").eq("id", id),
    ).maybeSingle();

    return unwrapSupabaseMaybeSingle(result);
  }

  async findBySlug(organizationId: string, slug: string): Promise<Workspace | null> {
    const result = await applyActiveFilter(
      this.client
        .from("workspaces")
        .select("*")
        .eq("organization_id", organizationId)
        .eq("slug", slug),
    ).maybeSingle();

    return unwrapSupabaseMaybeSingle(result);
  }

  async listByOrganization(organizationId: string): Promise<Workspace[]> {
    const result = await applyActiveFilter(
      this.client
        .from("workspaces")
        .select("*")
        .eq("organization_id", organizationId)
        .order("name", { ascending: true }),
    );

    return unwrapSupabaseList(result);
  }

  async create(input: CreateWorkspaceInput): Promise<Workspace> {
    const result = await this.client
      .from("workspaces")
      .insert({
        organization_id: input.organization_id,
        name: input.name,
        slug: input.slug,
        description: input.description ?? null,
      })
      .select("*")
      .single();

    const workspace = requireRow(unwrapSupabaseResult(result), "Workspace");

    await this.client.from("workspace_settings").insert({
      workspace_id: workspace.id,
      settings: { ...DEFAULT_WORKSPACE_SETTINGS },
    });

    return workspace;
  }

  async update(id: string, expectedVersion: number, input: UpdateWorkspaceInput): Promise<Workspace> {
    const result = await applyActiveFilter(
      this.client
        .from("workspaces")
        .update(input)
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    return requireRow(unwrapSupabaseMaybeSingle(result), "Workspace", id);
  }

  async softDelete(id: string, expectedVersion: number): Promise<Workspace> {
    const result = await applyActiveFilter(
      this.client
        .from("workspaces")
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by: this.userId,
          status: "archived",
        })
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    return requireRow(unwrapSupabaseMaybeSingle(result), "Workspace", id);
  }
}
