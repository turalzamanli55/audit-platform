import type {
  EntityType,
  IndustryClassification,
} from "@/types/company";
import type { CompanyWorkspaceView } from "@/lib/company/company-workspace-view";
import type { UpdateCompanyActionInput } from "@/lib/actions/company/update-company";
import type { CompanySettings } from "@/types/company";

export type CompanyIdentityDraft = {
  name: string;
  legalName: string;
  registrationNumber: string;
  description: string;
  entityType: EntityType;
  parentCompanyId: string;
  industryClassification: IndustryClassification;
};

export function workspaceToIdentityDraft(company: CompanyWorkspaceView): CompanyIdentityDraft {
  return {
    name: company.name,
    legalName: company.legalName,
    registrationNumber: company.registrationNumber ?? "",
    description: company.description ?? "",
    entityType: company.settings.entity_type,
    parentCompanyId: company.settings.parent_company_id ?? "",
    industryClassification: company.settings.industry_classification,
  };
}

export function isIdentityDraftDirty(
  draft: CompanyIdentityDraft,
  baseline: CompanyIdentityDraft,
): boolean {
  return JSON.stringify(draft) !== JSON.stringify(baseline);
}

export function computeCompanyUpdateInput(
  draft: CompanyIdentityDraft,
  baseline: CompanyIdentityDraft,
  companyId: string,
  version: number,
): UpdateCompanyActionInput | null {
  const input: UpdateCompanyActionInput = { companyId, version };
  let hasChanges = false;

  if (draft.name !== baseline.name) {
    input.name = draft.name;
    hasChanges = true;
  }
  if (draft.legalName !== baseline.legalName) {
    input.legalName = draft.legalName;
    hasChanges = true;
  }
  if (draft.registrationNumber !== baseline.registrationNumber) {
    input.registrationNumber = draft.registrationNumber.trim() || null;
    hasChanges = true;
  }
  if (draft.description !== baseline.description) {
    input.description = draft.description.trim() || null;
    hasChanges = true;
  }

  return hasChanges ? input : null;
}

export function computeIdentitySettingsPatch(
  draft: CompanyIdentityDraft,
  baseline: CompanyIdentityDraft,
): Partial<CompanySettings> {
  const patch: Partial<CompanySettings> = {};

  if (draft.entityType !== baseline.entityType) {
    patch.entity_type = draft.entityType;
  }
  if (draft.parentCompanyId !== baseline.parentCompanyId) {
    patch.parent_company_id =
      draft.entityType === "subsidiary" && draft.parentCompanyId.trim()
        ? draft.parentCompanyId.trim()
        : null;
  }
  if (draft.industryClassification !== baseline.industryClassification) {
    patch.industry_classification = draft.industryClassification;
  }

  if (draft.entityType !== "subsidiary" && draft.entityType !== baseline.entityType) {
    patch.parent_company_id = null;
  }

  return patch;
}

export function mergeIdentityDraft(
  current: CompanyIdentityDraft,
  patch: Partial<CompanyIdentityDraft>,
): CompanyIdentityDraft {
  return { ...current, ...patch };
}
