import type {
  FsRenderPresentation,
  FsRenderVersion,
  FsRenderedStatementBundle,
  FsRenderValidationReport,
} from "@/types/fs-rendering";

export type FsRenderVersionSnapshot = {
  presentation: FsRenderPresentation;
  bundle: FsRenderedStatementBundle;
  validation: FsRenderValidationReport;
};

export function createRenderVersionDraft(input: {
  presentation: FsRenderPresentation;
  versionNumber: number;
  snapshot: FsRenderVersionSnapshot;
  changeSummary?: string | null;
  createdBy?: string | null;
}): Omit<FsRenderVersion, "id"> {
  return {
    presentationId: input.presentation.id,
    organizationId: input.presentation.organizationId,
    workspaceId: input.presentation.workspaceId,
    engagementId: input.presentation.engagementId,
    versionNumber: input.versionNumber,
    versionStatus: "draft",
    changeSummary: input.changeSummary ?? null,
    snapshotJson: input.snapshot as unknown as Record<string, unknown>,
    rolledBackFromVersion: null,
    publishedAt: null,
    publishedBy: null,
    archivedAt: null,
    archivedBy: null,
    createdAt: new Date().toISOString(),
    createdBy: input.createdBy ?? null,
  };
}

export function publishRenderVersion(
  version: FsRenderVersion,
  actorUserId: string,
): FsRenderVersion {
  return {
    ...version,
    versionStatus: "published",
    publishedAt: new Date().toISOString(),
    publishedBy: actorUserId,
  };
}

export function rollbackRenderVersion(input: {
  presentation: FsRenderPresentation;
  fromVersion: FsRenderVersion;
  nextVersionNumber: number;
  actorUserId: string;
}): Omit<FsRenderVersion, "id"> {
  return {
    presentationId: input.presentation.id,
    organizationId: input.presentation.organizationId,
    workspaceId: input.presentation.workspaceId,
    engagementId: input.presentation.engagementId,
    versionNumber: input.nextVersionNumber,
    versionStatus: "draft",
    changeSummary: `Rollback to version ${input.fromVersion.versionNumber}`,
    snapshotJson: input.fromVersion.snapshotJson,
    rolledBackFromVersion: input.fromVersion.versionNumber,
    publishedAt: null,
    publishedBy: null,
    archivedAt: null,
    archivedBy: null,
    createdAt: new Date().toISOString(),
    createdBy: input.actorUserId,
  };
}
