import type { CompanySettings } from "@/types/company";
import {
  draftToCompanySettings,
  type CompanySettingsDraft,
} from "@/lib/company/company-settings-draft";
import { validateCompanySettings } from "@/lib/company/validation";

export function validateSettingsDraft(
  draft: CompanySettingsDraft,
  baselineValidation: CompanySettings["validation"],
): CompanySettings {
  const merged = draftToCompanySettings(draft, baselineValidation);
  return validateCompanySettings(merged);
}
