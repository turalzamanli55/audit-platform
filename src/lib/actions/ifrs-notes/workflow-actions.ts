"use server";

import { IFRS_NOTES_PERMISSIONS } from "@/constants/ifrs-notes";
import { createIfrsNotesAction } from "@/lib/actions/ifrs-notes/ifrs-notes-action";
import { createServerClient } from "@/lib/supabase/server";
import { IfrsNotesRepository } from "@/repositories/ifrs-notes/ifrs-notes-repository";
import { FsMappingRepository } from "@/repositories/fs-mapping/fs-mapping-repository";
import type { RepositoryContext } from "@/types/context";
import { ifrsNotesEngine, nextIfrsNoteWorkflowStatus } from "@/lib/ifrs-notes/engine";
import { buildIfrsNoteHistoryRecord } from "@/lib/ifrs-notes/history";
import {
  createIfrsNoteVersionDraft,
  publishIfrsNoteVersion,
  rollbackIfrsNoteVersion,
} from "@/lib/ifrs-notes/versions";
import type { FsNormalizedDataset } from "@/types/fs-mapping";
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

async function loadContext(
  packageId: string,
  context: { userId: string; organizationId: string; workspaceId: string },
) {
  const supabase = await createServerClient();
  const ctx = repoContext(context.userId, context.organizationId, context.workspaceId);
  const repo = new IfrsNotesRepository(supabase, ctx);
  const notePackage = await repo.requirePackage(packageId);
  const mappingRepo = new FsMappingRepository(supabase, ctx);
  const mappingSet = await mappingRepo.findSetByEngagementId(notePackage.engagementId);
  const dataset = (mappingSet?.datasetJson as FsNormalizedDataset | null) ?? null;
  return { repo, notePackage, dataset };
}

async function persistEngineRun(
  repo: IfrsNotesRepository,
  packageId: string,
  run: ReturnType<typeof ifrsNotesEngine.run>,
) {
  const persisted = await repo.replacePackageContents({
    packageId,
    sections: run.sectionDrafts,
    items: run.itemDrafts,
    crossReferences: run.crossReferenceDrafts,
  });
  const structure = {
    sections: persisted.sections.map((section) => ({
      ...section,
      items: persisted.items
        .filter((item) => item.sectionId === section.id)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    })),
    crossReferences: persisted.crossReferences,
  };
  await repo.updatePackage(packageId, {
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
  return { persisted, structure };
}

export const rebuildIfrsNotePackageAction = createIfrsNotesAction<
  { packageId: string },
  { requiredNotes: number; coveragePct: number }
>({ module: "ifrs_notes.update" }, IFRS_NOTES_PERMISSIONS.UPDATE, async (input, context) => {
  const { repo, notePackage, dataset } = await loadContext(input.packageId, context);
  const run = ifrsNotesEngine.run({ package: notePackage, dataset });
  await persistEngineRun(repo, notePackage.id, run);
  await repo.insertHistory(
    buildIfrsNoteHistoryRecord({
      packageId: notePackage.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      engagementId: notePackage.engagementId,
      action: "rebuilt",
      actorUserId: context.userId,
      entityType: "package",
      entityId: notePackage.id,
      summary: "Rebuilt IFRS notes from normalized dataset",
    }),
  );
  return {
    requiredNotes: run.validation.requiredCount,
    coveragePct: run.validation.coveragePct,
  };
});

export const validateIfrsNotePackageAction = createIfrsNotesAction<
  { packageId: string },
  { ok: boolean; errorCount: number; warningCount: number }
>({ module: "ifrs_notes.validate" }, IFRS_NOTES_PERMISSIONS.VALIDATE, async (input, context) => {
  const { repo, notePackage, dataset } = await loadContext(input.packageId, context);
  const next = nextIfrsNoteWorkflowStatus(notePackage.packageStatus, "validate");
  if (!next) throw new ValidationError("Package cannot be validated from current status");
  const run = ifrsNotesEngine.run({ package: notePackage, dataset });
  await persistEngineRun(repo, notePackage.id, run);
  await repo.updatePackage(notePackage.id, {
    package_status: next,
    validated_at: new Date().toISOString(),
    validated_by: context.userId,
  });
  await repo.insertHistory(
    buildIfrsNoteHistoryRecord({
      packageId: notePackage.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      engagementId: notePackage.engagementId,
      action: "validated",
      actorUserId: context.userId,
      entityType: "package",
      entityId: notePackage.id,
      summary: run.validation.ok ? "IFRS notes validated" : "IFRS notes validated with errors",
      detailsJson: { ok: run.validation.ok },
    }),
  );
  return {
    ok: run.validation.ok,
    errorCount: run.validation.errors.length,
    warningCount: run.validation.warnings.length,
  };
});

export const submitIfrsNoteReviewAction = createIfrsNotesAction<
  { packageId: string },
  { packageId: string }
>({ module: "ifrs_notes.review" }, IFRS_NOTES_PERMISSIONS.REVIEW, async (input, context) => {
  const { repo, notePackage } = await loadContext(input.packageId, context);
  const next = nextIfrsNoteWorkflowStatus(notePackage.packageStatus, "submit_review");
  if (!next) throw new ValidationError("Package must be validated before review");
  await repo.updatePackage(notePackage.id, { package_status: next });
  await repo.insertHistory(
    buildIfrsNoteHistoryRecord({
      packageId: notePackage.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      engagementId: notePackage.engagementId,
      action: "submitted_review",
      actorUserId: context.userId,
      entityType: "package",
      entityId: notePackage.id,
      summary: "Submitted IFRS notes for reviewer",
    }),
  );
  return { packageId: notePackage.id };
});

export const advanceIfrsNoteManagerReviewAction = createIfrsNotesAction<
  { packageId: string },
  { packageId: string }
>({ module: "ifrs_notes.review" }, IFRS_NOTES_PERMISSIONS.REVIEW, async (input, context) => {
  const { repo, notePackage } = await loadContext(input.packageId, context);
  const next = nextIfrsNoteWorkflowStatus(notePackage.packageStatus, "manager_review");
  if (!next) throw new ValidationError("Package must be in reviewer stage");
  await repo.updatePackage(notePackage.id, { package_status: next });
  await repo.insertHistory(
    buildIfrsNoteHistoryRecord({
      packageId: notePackage.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      engagementId: notePackage.engagementId,
      action: "manager_approved",
      actorUserId: context.userId,
      entityType: "package",
      entityId: notePackage.id,
      summary: "Advanced IFRS notes to manager review",
    }),
  );
  return { packageId: notePackage.id };
});

export const advanceIfrsNotePartnerReviewAction = createIfrsNotesAction<
  { packageId: string },
  { packageId: string }
>({ module: "ifrs_notes.review" }, IFRS_NOTES_PERMISSIONS.REVIEW, async (input, context) => {
  const { repo, notePackage } = await loadContext(input.packageId, context);
  const next = nextIfrsNoteWorkflowStatus(notePackage.packageStatus, "partner_review");
  if (!next) throw new ValidationError("Package must be in manager review");
  await repo.updatePackage(notePackage.id, { package_status: next });
  await repo.insertHistory(
    buildIfrsNoteHistoryRecord({
      packageId: notePackage.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      engagementId: notePackage.engagementId,
      action: "partner_approved",
      actorUserId: context.userId,
      entityType: "package",
      entityId: notePackage.id,
      summary: "Advanced IFRS notes to partner review",
    }),
  );
  return { packageId: notePackage.id };
});

export const approveIfrsNotePackageAction = createIfrsNotesAction<
  { packageId: string },
  { packageId: string }
>({ module: "ifrs_notes.approve" }, IFRS_NOTES_PERMISSIONS.APPROVE, async (input, context) => {
  const { repo, notePackage } = await loadContext(input.packageId, context);
  const next = nextIfrsNoteWorkflowStatus(notePackage.packageStatus, "approve");
  if (!next) {
    throw new ValidationError("Package must be in partner review (or validated) before approval");
  }
  await repo.updatePackage(notePackage.id, {
    package_status: next,
    approved_at: new Date().toISOString(),
    approved_by: context.userId,
  });
  await repo.insertHistory(
    buildIfrsNoteHistoryRecord({
      packageId: notePackage.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      engagementId: notePackage.engagementId,
      action: "approved",
      actorUserId: context.userId,
      entityType: "package",
      entityId: notePackage.id,
      summary: "IFRS notes approved",
    }),
  );
  return { packageId: notePackage.id };
});

export const publishIfrsNotePackageAction = createIfrsNotesAction<
  { packageId: string; changeSummary?: string },
  { versionNumber: number }
>({ module: "ifrs_notes.publish" }, IFRS_NOTES_PERMISSIONS.PUBLISH, async (input, context) => {
  const { repo, notePackage, dataset } = await loadContext(input.packageId, context);
  const next = nextIfrsNoteWorkflowStatus(notePackage.packageStatus, "publish");
  if (!next) throw new ValidationError("Package must be approved before publish");
  const sections = await repo.listSections(notePackage.id);
  const items = await repo.listItems(notePackage.id);
  const crossReferences = await repo.listCrossReferences(notePackage.id);
  const run = ifrsNotesEngine.run({ package: notePackage, dataset });
  const versions = await repo.listVersions(notePackage.id);
  const versionNumber = (versions[0]?.versionNumber ?? 0) + 1;
  let draft = createIfrsNoteVersionDraft({
    package: notePackage,
    versionNumber,
    snapshot: {
      package: notePackage,
      structure: {
        sections: sections.map((section) => ({
          ...section,
          items: items.filter((item) => item.sectionId === section.id),
        })),
        crossReferences,
      },
      validation: run.validation,
    },
    changeSummary: input.changeSummary ?? "Published IFRS notes version",
    createdBy: context.userId,
  });
  draft = publishIfrsNoteVersion({ ...draft, id: "pending" }, context.userId);
  await repo.insertVersion(draft);
  await repo.updatePackage(notePackage.id, {
    package_status: next,
    published_at: new Date().toISOString(),
    published_by: context.userId,
    package_version: versionNumber,
    version_count: notePackage.versionCount + 1,
    validation_json: run.validation,
    summary_json: run.metrics,
  });
  await repo.insertHistory(
    buildIfrsNoteHistoryRecord({
      packageId: notePackage.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      engagementId: notePackage.engagementId,
      action: "published",
      actorUserId: context.userId,
      entityType: "package",
      entityId: notePackage.id,
      summary: `Published IFRS notes version ${versionNumber}`,
    }),
  );
  return { versionNumber };
});

export const archiveIfrsNotePackageAction = createIfrsNotesAction<
  { packageId: string },
  { packageId: string }
>({ module: "ifrs_notes.archive" }, IFRS_NOTES_PERMISSIONS.ARCHIVE, async (input, context) => {
  const { repo, notePackage } = await loadContext(input.packageId, context);
  await repo.updatePackage(notePackage.id, {
    package_status: "archived",
    archived_at: new Date().toISOString(),
    archived_by: context.userId,
  });
  await repo.insertHistory(
    buildIfrsNoteHistoryRecord({
      packageId: notePackage.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      engagementId: notePackage.engagementId,
      action: "archived",
      actorUserId: context.userId,
      entityType: "package",
      entityId: notePackage.id,
      summary: "IFRS notes package archived",
    }),
  );
  return { packageId: notePackage.id };
});

export const rollbackIfrsNoteVersionAction = createIfrsNotesAction<
  { packageId: string; versionNumber: number },
  { versionNumber: number }
>({ module: "ifrs_notes.update" }, IFRS_NOTES_PERMISSIONS.UPDATE, async (input, context) => {
  const { repo, notePackage } = await loadContext(input.packageId, context);
  const versions = await repo.listVersions(notePackage.id);
  const target = versions.find((version) => version.versionNumber === input.versionNumber);
  if (!target) throw new ValidationError("Version not found");
  const nextVersionNumber = (versions[0]?.versionNumber ?? 0) + 1;
  const rolled = rollbackIfrsNoteVersion({
    package: notePackage,
    fromVersion: target,
    nextVersionNumber,
    actorUserId: context.userId,
  });
  await repo.insertVersion(rolled);
  const snapshot = target.snapshotJson as {
    structure?: unknown;
    validation?: unknown;
  };
  await repo.updatePackage(notePackage.id, {
    package_status: "draft",
    package_version: nextVersionNumber,
    version_count: notePackage.versionCount + 1,
    structure_json: snapshot.structure ?? notePackage.structureJson,
    validation_json: snapshot.validation ?? notePackage.validationJson,
  });
  await repo.insertHistory(
    buildIfrsNoteHistoryRecord({
      packageId: notePackage.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      engagementId: notePackage.engagementId,
      action: "rolled_back",
      actorUserId: context.userId,
      entityType: "package",
      entityId: notePackage.id,
      summary: `Rolled back to version ${input.versionNumber}`,
    }),
  );
  return { versionNumber: nextVersionNumber };
});
