import type {
  FsMappingLine,
  FsMappingRule,
  FsMappingSet,
  FsMappingVersion,
  FsMappingVersionStatus,
  FsNormalizedDataset,
} from "@/types/fs-mapping";

export type FsMappingVersionSnapshot = {
  set: FsMappingSet;
  rules: FsMappingRule[];
  lines: FsMappingLine[];
  dataset: FsNormalizedDataset | null;
};

/**
 * Version Engine — draft / published / archived / rollback metadata.
 */
export function createVersionDraft(input: {
  mappingSet: FsMappingSet;
  versionNumber: number;
  snapshot: FsMappingVersionSnapshot;
  changeSummary?: string | null;
  createdBy?: string | null;
}): Omit<FsMappingVersion, "id"> {
  return {
    mappingSetId: input.mappingSet.id,
    organizationId: input.mappingSet.organizationId,
    workspaceId: input.mappingSet.workspaceId,
    engagementId: input.mappingSet.engagementId,
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

export function publishVersion(
  version: FsMappingVersion,
  actorUserId: string,
): FsMappingVersion {
  return {
    ...version,
    versionStatus: "published",
    publishedAt: new Date().toISOString(),
    publishedBy: actorUserId,
  };
}

export function archiveVersion(
  version: FsMappingVersion,
  actorUserId: string,
): FsMappingVersion {
  return {
    ...version,
    versionStatus: "archived",
    archivedAt: new Date().toISOString(),
    archivedBy: actorUserId,
  };
}

export function rollbackVersion(input: {
  mappingSet: FsMappingSet;
  fromVersion: FsMappingVersion;
  nextVersionNumber: number;
  actorUserId: string;
}): Omit<FsMappingVersion, "id"> {
  return {
    mappingSetId: input.mappingSet.id,
    organizationId: input.mappingSet.organizationId,
    workspaceId: input.mappingSet.workspaceId,
    engagementId: input.mappingSet.engagementId,
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

export function canTransitionVersion(
  from: FsMappingVersionStatus,
  to: FsMappingVersionStatus,
): boolean {
  const allowed: Record<FsMappingVersionStatus, FsMappingVersionStatus[]> = {
    draft: ["published", "archived"],
    published: ["archived"],
    archived: [],
  };
  return allowed[from].includes(to);
}
