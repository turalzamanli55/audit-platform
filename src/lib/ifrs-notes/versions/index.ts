import type {
  IfrsNotePackage,
  IfrsNoteVersion,
  IfrsNoteStructure,
  IfrsNoteValidationReport,
} from "@/types/ifrs-notes";

export type IfrsNoteVersionSnapshot = {
  package: IfrsNotePackage;
  structure: IfrsNoteStructure;
  validation: IfrsNoteValidationReport;
};

export function createIfrsNoteVersionDraft(input: {
  package: IfrsNotePackage;
  versionNumber: number;
  snapshot: IfrsNoteVersionSnapshot;
  changeSummary?: string | null;
  createdBy?: string | null;
}): Omit<IfrsNoteVersion, "id"> {
  return {
    packageId: input.package.id,
    organizationId: input.package.organizationId,
    workspaceId: input.package.workspaceId,
    engagementId: input.package.engagementId,
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

export function publishIfrsNoteVersion(
  version: IfrsNoteVersion,
  actorUserId: string,
): IfrsNoteVersion {
  return {
    ...version,
    versionStatus: "published",
    publishedAt: new Date().toISOString(),
    publishedBy: actorUserId,
  };
}

export function rollbackIfrsNoteVersion(input: {
  package: IfrsNotePackage;
  fromVersion: IfrsNoteVersion;
  nextVersionNumber: number;
  actorUserId: string;
}): Omit<IfrsNoteVersion, "id"> {
  return {
    packageId: input.package.id,
    organizationId: input.package.organizationId,
    workspaceId: input.package.workspaceId,
    engagementId: input.package.engagementId,
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
