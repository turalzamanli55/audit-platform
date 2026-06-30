import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert, TablesUpdate } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import {
  applyActiveFilter,
  DEFAULT_COMPANY_SETTINGS,
  requireRow,
} from "../base/repository-helpers";
import {
  unwrapSupabaseList,
  unwrapSupabaseMaybeSingle,
  unwrapSupabaseResult,
} from "@/utils/supabase-result";

export type Company = Tables<"companies">;
export type CreateCompanyInput = Pick<
  TablesInsert<"companies">,
  "organization_id" | "workspace_id" | "name" | "legal_name" | "registration_number" | "description"
>;
export type UpdateCompanyInput = Pick<
  TablesUpdate<"companies">,
  "name" | "legal_name" | "registration_number" | "description" | "status"
>;

export class CompanyRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async findById(id: string): Promise<Company | null> {
    const result = await applyActiveFilter(
      this.client.from("companies").select("*").eq("id", id),
    ).maybeSingle();

    return unwrapSupabaseMaybeSingle(result);
  }

  async listByWorkspace(workspaceId: string): Promise<Company[]> {
    const result = await applyActiveFilter(
      this.client
        .from("companies")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("name", { ascending: true }),
    );

    return unwrapSupabaseList(result);
  }

  async listByOrganization(organizationId: string): Promise<Company[]> {
    const result = await applyActiveFilter(
      this.client
        .from("companies")
        .select("*")
        .eq("organization_id", organizationId)
        .order("name", { ascending: true }),
    );

    return unwrapSupabaseList(result);
  }

  async create(input: CreateCompanyInput): Promise<Company> {
    const result = await this.client
      .from("companies")
      .insert({
        organization_id: input.organization_id,
        workspace_id: input.workspace_id,
        name: input.name,
        legal_name: input.legal_name ?? null,
        registration_number: input.registration_number ?? null,
        description: input.description ?? null,
      })
      .select("*")
      .single();

    const company = requireRow(unwrapSupabaseResult(result), "Company");

    await this.client.from("company_settings").insert({
      company_id: company.id,
      settings: { ...DEFAULT_COMPANY_SETTINGS },
    });

    return company;
  }

  async update(id: string, expectedVersion: number, input: UpdateCompanyInput): Promise<Company> {
    const result = await applyActiveFilter(
      this.client
        .from("companies")
        .update(input)
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    return requireRow(unwrapSupabaseMaybeSingle(result), "Company", id);
  }

  async softDelete(id: string, expectedVersion: number): Promise<Company> {
    const result = await applyActiveFilter(
      this.client
        .from("companies")
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by: this.userId,
          status: "archived",
        })
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    return requireRow(unwrapSupabaseMaybeSingle(result), "Company", id);
  }
}
