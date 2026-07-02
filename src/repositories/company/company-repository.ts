import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert, TablesUpdate } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import type { CompanySettings } from "@/types/company";
import { AuthenticatedRepository } from "../base/base-repository";
import {
  applyActiveFilter,
  assertVersionMatch,
  requireRow,
} from "../base/repository-helpers";
import {
  companySettingsToJson,
  DEFAULT_COMPANY_SETTINGS,
  mergeCompanySettings,
  parseCompanySettings,
} from "@/lib/company/settings";
import {
  detectUniquenessConflicts,
  normalizeLegalName,
} from "@/lib/company/validation";
import { AuthorizationError, NotFoundError, ValidationError } from "@/lib/errors";
import { toSlug } from "@/utils/auth-validation";
import {
  unwrapSupabaseList,
  unwrapSupabaseMaybeSingle,
  unwrapSupabaseResult,
} from "@/utils/supabase-result";

export type Company = Tables<"companies">;
export type CompanySettingsRow = Tables<"company_settings">;

export type CreateCompanyInput = Pick<
  TablesInsert<"companies">,
  | "organization_id"
  | "workspace_id"
  | "name"
  | "legal_name"
  | "slug"
  | "registration_number"
  | "description"
> & {
  settings?: Partial<CompanySettings>;
};

export type UpdateCompanyInput = Pick<
  TablesUpdate<"companies">,
  "name" | "legal_name" | "slug" | "registration_number" | "description" | "status"
>;

export type CompanyWithSettings = {
  company: Company;
  settings: CompanySettings;
  settingsRow: CompanySettingsRow;
};

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

  async findByIdAnyState(id: string): Promise<Company | null> {
    const result = await this.client.from("companies").select("*").eq("id", id).maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async findBySlug(workspaceId: string, slug: string): Promise<Company | null> {
    const result = await applyActiveFilter(
      this.client
        .from("companies")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("slug", slug),
    ).maybeSingle();

    return unwrapSupabaseMaybeSingle(result);
  }

  async findBySlugInWorkspace(workspaceId: string, slug: string): Promise<Company | null> {
    const active = await this.findBySlug(workspaceId, slug);
    if (active) {
      return active;
    }

    const companies = await this.listByWorkspace(workspaceId, { includeArchived: true });
    return companies.find((row) => row.slug === slug) ?? null;
  }

  async listByWorkspace(workspaceId: string, options?: { includeArchived?: boolean }): Promise<Company[]> {
    let query = this.client
      .from("companies")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("name", { ascending: true });

    if (!options?.includeArchived) {
      query = applyActiveFilter(query);
    }

    const result = await query;
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

  async create(input: CreateCompanyInput): Promise<CompanyWithSettings> {
    await this.validateUniqueness(input.workspace_id, {
      legalName: input.legal_name ?? input.name,
      registrationNumber: input.registration_number,
      slug: input.slug,
    });

    const result = await this.client
      .from("companies")
      .insert({
        organization_id: input.organization_id,
        workspace_id: input.workspace_id,
        name: input.name,
        legal_name: input.legal_name ?? null,
        slug: input.slug,
        registration_number: input.registration_number ?? null,
        description: input.description ?? null,
      })
      .select("*")
      .single();

    const company = requireRow(unwrapSupabaseResult(result), "Company");

    const settings = mergeCompanySettings(DEFAULT_COMPANY_SETTINGS, input.settings ?? {});
    const settingsResult = await this.client
      .from("company_settings")
      .insert({
        company_id: company.id,
        settings: companySettingsToJson(settings),
      })
      .select("*")
      .single();

    const settingsRow = requireRow(unwrapSupabaseResult(settingsResult), "CompanySettings");

    return { company, settings, settingsRow };
  }

  async update(id: string, expectedVersion: number, input: UpdateCompanyInput): Promise<Company> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Company not found", { id });
    }

    this.validateOptimisticLock(existing, expectedVersion);
    await this.validateWorkspaceOwnership(id, existing.workspace_id);

    if (input.legal_name || input.name || input.registration_number || input.slug) {
      await this.validateUniqueness(existing.workspace_id, {
        legalName: input.legal_name ?? existing.legal_name ?? existing.name,
        registrationNumber:
          input.registration_number !== undefined
            ? input.registration_number
            : existing.registration_number,
        slug: input.slug ?? existing.slug,
        excludeCompanyId: id,
      });
    }

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

  async getSettings(companyId: string): Promise<CompanySettingsRow | null> {
    const result = await applyActiveFilter(
      this.client.from("company_settings").select("*").eq("company_id", companyId),
    ).maybeSingle();

    return unwrapSupabaseMaybeSingle(result);
  }

  async updateSettings(
    companyId: string,
    expectedVersion: number,
    patch: Partial<CompanySettings>,
  ): Promise<{ settingsRow: CompanySettingsRow; settings: CompanySettings }> {
    const company = await this.findById(companyId);
    if (!company) {
      throw new NotFoundError("Company not found", { id: companyId });
    }

    const settingsRow = await this.getSettings(companyId);
    if (!settingsRow) {
      throw new NotFoundError("Company settings not found", { id: companyId });
    }

    this.validateOptimisticLock(settingsRow, expectedVersion, "CompanySettings");

    const current = parseCompanySettings(settingsRow.settings);
    const merged = mergeCompanySettings(current, patch);

    const result = await applyActiveFilter(
      this.client
        .from("company_settings")
        .update({ settings: companySettingsToJson(merged) })
        .eq("company_id", companyId)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const updatedRow = requireRow(
      unwrapSupabaseMaybeSingle(result),
      "CompanySettings",
      companyId,
    );

    return {
      settingsRow: updatedRow,
      settings: parseCompanySettings(updatedRow.settings),
    };
  }

  async archive(id: string, expectedVersion: number): Promise<Company> {
    return this.softDelete(id, expectedVersion);
  }

  async restore(id: string, expectedVersion: number): Promise<Company> {
    const existing = await this.findByIdAnyState(id);
    if (!existing) {
      throw new NotFoundError("Company not found", { id });
    }

    if (!existing.deleted_at && existing.status !== "archived") {
      throw new ValidationError("Company is not archived");
    }

    this.validateOptimisticLock(existing, expectedVersion);

    const result = await this.client
      .from("companies")
      .update({
        deleted_at: null,
        deleted_by: null,
        status: "active",
      })
      .eq("id", id)
      .eq("version", expectedVersion)
      .select("*")
      .maybeSingle();

    return requireRow(unwrapSupabaseMaybeSingle(result), "Company", id);
  }

  async softDelete(id: string, expectedVersion: number): Promise<Company> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Company not found", { id });
    }

    this.validateOptimisticLock(existing, expectedVersion);

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

  async validateUniqueness(
    workspaceId: string,
    input: {
      legalName?: string;
      registrationNumber?: string | null;
      slug?: string;
      excludeCompanyId?: string;
    },
  ): Promise<void> {
    const companies = await this.listByWorkspace(workspaceId);
    detectUniquenessConflicts(companies, input);
  }

  async validateWorkspaceOwnership(companyId: string, workspaceId: string): Promise<Company> {
    const company = await this.findByIdAnyState(companyId);
    if (!company) {
      throw new NotFoundError("Company not found", { id: companyId });
    }

    if (company.workspace_id !== workspaceId) {
      throw new AuthorizationError("Company does not belong to the active workspace", {
        companyId,
        workspaceId,
      });
    }

    return company;
  }

  validateOptimisticLock(
    record: { version: number },
    expectedVersion: number,
    resource = "Company",
  ): void {
    assertVersionMatch(record.version, expectedVersion, resource);
  }

  async resolveUniqueSlug(
    workspaceId: string,
    baseSlug: string,
    excludeCompanyId?: string,
  ): Promise<string> {
    let slug = baseSlug;
    let suffix = 1;

    while (true) {
      const existing = await this.findBySlug(workspaceId, slug);
      if (!existing || (excludeCompanyId && existing.id === excludeCompanyId)) {
        return slug;
      }
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }
  }

  async resolveSlugForLegalName(workspaceId: string, legalName: string): Promise<string> {
    const baseSlug = toSlug(legalName);
    if (!baseSlug) {
      throw new ValidationError("Legal name must contain valid characters");
    }

    return this.resolveUniqueSlug(workspaceId, baseSlug);
  }

  getNormalizedLegalName(company: Company): string {
    return normalizeLegalName(company.legal_name ?? company.name);
  }
}
