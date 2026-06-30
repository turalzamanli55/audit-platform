import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert, TablesUpdate } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import {
  applyActiveFilter,
  DEFAULT_ORGANIZATION_SETTINGS,
  requireRow,
} from "../base/repository-helpers";
import {
  unwrapSupabaseList,
  unwrapSupabaseMaybeSingle,
  unwrapSupabaseResult,
} from "@/utils/supabase-result";

export type Organization = Tables<"organizations">;
export type CreateOrganizationInput = Pick<TablesInsert<"organizations">, "name" | "slug" | "legal_name" | "description">;
export type UpdateOrganizationInput = Pick<TablesUpdate<"organizations">, "name" | "legal_name" | "description" | "status">;

export class OrganizationRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async findById(id: string): Promise<Organization | null> {
    const result = await applyActiveFilter(
      this.client.from("organizations").select("*").eq("id", id),
    ).maybeSingle();

    return unwrapSupabaseMaybeSingle(result);
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    const result = await applyActiveFilter(
      this.client.from("organizations").select("*").eq("slug", slug),
    ).maybeSingle();

    return unwrapSupabaseMaybeSingle(result);
  }

  async listForCurrentUser(): Promise<Organization[]> {
    const result = await applyActiveFilter(
      this.client.from("organizations").select("*").order("name", { ascending: true }),
    );

    return unwrapSupabaseList(result);
  }

  async create(input: CreateOrganizationInput): Promise<Organization> {
    const result = await this.client
      .from("organizations")
      .insert({
        name: input.name,
        slug: input.slug,
        legal_name: input.legal_name ?? null,
        description: input.description ?? null,
      })
      .select("*")
      .single();

    const organization = requireRow(unwrapSupabaseResult(result), "Organization");

    await this.client.from("organization_settings").insert({
      organization_id: organization.id,
      settings: { ...DEFAULT_ORGANIZATION_SETTINGS },
    });

    return organization;
  }

  async update(id: string, expectedVersion: number, input: UpdateOrganizationInput): Promise<Organization> {
    const result = await applyActiveFilter(
      this.client
        .from("organizations")
        .update(input)
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    return requireRow(unwrapSupabaseMaybeSingle(result), "Organization", id);
  }

  async softDelete(id: string, expectedVersion: number): Promise<Organization> {
    const deletedAt = new Date().toISOString();
    const result = await applyActiveFilter(
      this.client
        .from("organizations")
        .update({
          deleted_at: deletedAt,
          deleted_by: this.userId,
          status: "archived",
        })
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    return requireRow(unwrapSupabaseMaybeSingle(result), "Organization", id);
  }
}
