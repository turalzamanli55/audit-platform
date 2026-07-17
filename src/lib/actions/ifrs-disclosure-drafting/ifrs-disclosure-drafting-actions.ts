"use server";

import { FINANCIAL_REPORTING_PERMISSIONS } from "@/constants/financial-reporting";
import {
  createFinancialReportingAction,
  createFrRepositoryContext,
} from "@/lib/actions/financial-reporting/financial-reporting-action";
import {
  assertIfrsDisclosureDraftingTransition,
  type IfrsDisclosureDraftingStatus,
} from "@/lib/ifrs-disclosure-drafting/ifrs-disclosure-drafting";
import { createServerClient } from "@/lib/supabase/server";
import { IfrsDisclosureDraftingRepository } from "@/repositories/ifrs-disclosure-drafting/ifrs-disclosure-drafting-repository";
import { ValidationError } from "@/lib/errors";

export type DraftIfrsDisclosureInput = {
  engagementId: string;
  disclosureCode: string;
  disclosureTitle: string;
  draftBody?: string | null;
  ifrsNotePackageId?: string | null;
};

export type DraftIfrsDisclosureResult = {
  itemId: string;
  draftingStatus: string;
};

export const draftIfrsDisclosureAction = createFinancialReportingAction<
  DraftIfrsDisclosureInput,
  DraftIfrsDisclosureResult
>(
  { module: "financial-reporting.ifrs-disclosure-drafting.draft" },
  FINANCIAL_REPORTING_PERMISSIONS.IFRS_DISCLOSURE_DRAFT,
  async (input, context) => {
    if (!input.engagementId) throw new ValidationError("Engagement is required");
    if (!input.disclosureCode.trim() || !input.disclosureTitle.trim()) {
      throw new ValidationError("Disclosure code and title are required");
    }

    const supabase = await createServerClient();
    const repository = new IfrsDisclosureDraftingRepository(
      supabase,
      createFrRepositoryContext(context.userId, context.organizationId, context.workspaceId),
    );

    const item = await repository.createItem({
      organization_id: context.organizationId,
      workspace_id: context.workspaceId,
      engagement_id: input.engagementId,
      ifrs_note_package_id: input.ifrsNotePackageId ?? null,
      disclosure_code: input.disclosureCode.trim(),
      disclosure_title: input.disclosureTitle.trim(),
      draft_body: input.draftBody ?? null,
      drafting_status: "draft",
    });

    return { itemId: item.id, draftingStatus: item.drafting_status };
  },
);

export type AdvanceIfrsDisclosureDraftingInput = {
  fromStatus: IfrsDisclosureDraftingStatus;
  toStatus: IfrsDisclosureDraftingStatus;
  engagementId: string;
};

export const advanceIfrsDisclosureDraftingAction = createFinancialReportingAction<
  AdvanceIfrsDisclosureDraftingInput,
  { fromStatus: IfrsDisclosureDraftingStatus; toStatus: IfrsDisclosureDraftingStatus }
>(
  { module: "financial-reporting.ifrs-disclosure-drafting.advance" },
  FINANCIAL_REPORTING_PERMISSIONS.IFRS_DISCLOSURE_DRAFT,
  async (input) => {
    if (!input.engagementId) throw new ValidationError("Engagement is required");
    assertIfrsDisclosureDraftingTransition(input.fromStatus, input.toStatus);
    return { fromStatus: input.fromStatus, toStatus: input.toStatus };
  },
);
