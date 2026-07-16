"use server";

import { headers } from "next/headers";
import {
  IFRS_NOTES_AUDIT_RESOURCE_TYPE,
  IFRS_NOTES_PERMISSIONS,
} from "@/constants/ifrs-notes";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createIfrsNotesAction } from "@/lib/actions/ifrs-notes/ifrs-notes-action";
import { createServerClient } from "@/lib/supabase/server";
import { IfrsNotesRepository } from "@/repositories/ifrs-notes/ifrs-notes-repository";
import { FsMappingRepository } from "@/repositories/fs-mapping/fs-mapping-repository";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import type { RepositoryContext } from "@/types/context";
import { ifrsNotesEngine } from "@/lib/ifrs-notes/engine";
import { buildIfrsNoteHistoryRecord } from "@/lib/ifrs-notes/history";
import { mapMappingStandardToNoteStandard } from "@/lib/ifrs-notes/datasets";
import type { FsNormalizedDataset } from "@/types/fs-mapping";
import type { IfrsNoteStandard } from "@/types/ifrs-notes";
import { ValidationError } from "@/lib/errors";

function repoContext(
  userId: string,
  organizationId: string,
  workspaceId: string,
): RepositoryContext {
  return {
    userId,
    tenant: {
      organization: { organizationId, isResolved: true },
      workspace: { workspaceId, isResolved: true },
      company: { companyId: null, isResolved: false },
      permissions: { permissions: [], isResolved: false },
      roles: { roles: [], isResolved: false },
    },
  };
}

export type CreateIfrsNotePackageInput = {
  engagementId: string;
  name: string;
  description?: string | null;
  standard?: IfrsNoteStandard;
};

export const createIfrsNotePackageAction = createIfrsNotesAction<
  CreateIfrsNotePackageInput,
  { packageId: string }
>({ module: "ifrs_notes.create" }, IFRS_NOTES_PERMISSIONS.CREATE, async (input, context) => {
  if (!input.name.trim()) throw new ValidationError("Note package name is required");

  const supabase = await createServerClient();
  const ctx = repoContext(context.userId, context.organizationId, context.workspaceId);
  const engagements = new EngagementRepository(supabase, ctx);
  const engagement = await engagements.findById(input.engagementId);
  if (!engagement) throw new ValidationError("Engagement not found");
  if (engagement.workspace_id !== context.workspaceId) {
    throw new ValidationError("Engagement workspace mismatch");
  }

  const repo = new IfrsNotesRepository(supabase, ctx);
  const prior = await repo.findPackageByEngagementId(input.engagementId);
  if (prior) throw new ValidationError("An IFRS note package already exists for this engagement");

  const mappingRepo = new FsMappingRepository(supabase, ctx);
  const mappingSet = await mappingRepo.findSetByEngagementId(input.engagementId);
  const standard =
    input.standard ??
    (mappingSet ? mapMappingStandardToNoteStandard(mappingSet.standard) : "ifrs");

  const created = await repo.createPackage({
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    companyId: engagement.company_id,
    engagementId: input.engagementId,
    mappingSetId: mappingSet?.id ?? null,
    name: input.name.trim(),
    description: input.description ?? null,
    standard,
  });

  const dataset = (mappingSet?.datasetJson as FsNormalizedDataset | null) ?? null;
  const run = ifrsNotesEngine.run({ package: created, dataset });
  const persisted = await repo.replacePackageContents({
    packageId: created.id,
    sections: run.sectionDrafts,
    items: run.itemDrafts,
    crossReferences: run.crossReferenceDrafts,
  });

  const structure = {
    sections: persisted.sections.map((section) => ({
      ...section,
      items: persisted.items.filter((item) => item.sectionId === section.id),
    })),
    crossReferences: persisted.crossReferences,
  };

  await repo.updatePackage(created.id, {
    structure_json: structure,
    validation_json: run.validation,
    summary_json: run.metrics,
    required_note_count: run.validation.requiredCount,
    completed_note_count: run.validation.completedCount,
    missing_note_count: run.validation.missingCount,
    validation_error_count: run.validation.errors.length,
    validation_warning_count: run.validation.warnings.length,
    coverage_pct: run.validation.coveragePct,
  });

  await repo.insertHistory(
    buildIfrsNoteHistoryRecord({
      packageId: created.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      engagementId: input.engagementId,
      action: "created",
      actorUserId: context.userId,
      entityType: "package",
      entityId: created.id,
      summary: `Created IFRS note package "${created.name}"`,
    }),
  );

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.IFRS_NOTES_CREATED,
    resourceType: IFRS_NOTES_AUDIT_RESOURCE_TYPE,
    resourceId: created.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
  });

  return { packageId: created.id };
});
