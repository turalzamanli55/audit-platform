"use server";

import { FINANCIAL_REPORTING_PERMISSIONS } from "@/constants/financial-reporting";
import {
  createFinancialReportingAction,
  createFrRepositoryContext,
} from "@/lib/actions/financial-reporting/financial-reporting-action";
import {
  assertIfrsNoteManagementPackage,
  nextIfrsNoteManagementVersion,
} from "@/lib/ifrs-note-management/ifrs-note-management";
import { createServerClient } from "@/lib/supabase/server";
import { IfrsNoteManagementRepository } from "@/repositories/ifrs-note-management/ifrs-note-management-repository";
import { ValidationError } from "@/lib/errors";

export type LinkIfrsNoteManagementInput = {
  engagementId: string;
  packageId: string;
  packageVersion: number;
  noteCount: number;
  mappingSetId?: string | null;
  presentationId?: string | null;
  linkRole?: "source_dataset" | "presentation" | "opinion_input" | "reporting_input";
};

export type LinkIfrsNoteManagementResult = {
  linkId: string;
  nextVersion: number;
};

export const linkIfrsNoteManagementAction = createFinancialReportingAction<
  LinkIfrsNoteManagementInput,
  LinkIfrsNoteManagementResult
>(
  { module: "financial-reporting.ifrs-note-management.link" },
  FINANCIAL_REPORTING_PERMISSIONS.IFRS_NOTE_MANAGE,
  async (input, context) => {
    if (!input.engagementId) throw new ValidationError("Engagement is required");
    assertIfrsNoteManagementPackage({
      packageId: input.packageId,
      packageVersion: input.packageVersion,
      mappingSetId: input.mappingSetId,
      presentationId: input.presentationId,
      noteCount: input.noteCount,
    });

    const supabase = await createServerClient();
    const repository = new IfrsNoteManagementRepository(
      supabase,
      createFrRepositoryContext(context.userId, context.organizationId, context.workspaceId),
    );

    const link = await repository.createLink({
      organization_id: context.organizationId,
      workspace_id: context.workspaceId,
      engagement_id: input.engagementId,
      ifrs_note_package_id: input.packageId,
      mapping_set_id: input.mappingSetId ?? null,
      presentation_id: input.presentationId ?? null,
      link_role: input.linkRole ?? "source_dataset",
    });

    return {
      linkId: link.id,
      nextVersion: nextIfrsNoteManagementVersion(input.packageVersion),
    };
  },
);
