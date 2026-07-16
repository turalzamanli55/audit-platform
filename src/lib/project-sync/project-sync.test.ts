import { describe, expect, it } from "vitest";
import {
  projectSyncEngine,
  synchronizeFromProjectBible,
  calculateEvidenceCompletion,
  emptyProjectSyncEvidence,
  PROJECT_SYNC_EVIDENCE_DIMENSIONS,
} from "@/lib/project-sync";

describe("EPBSE Project Bible Synchronization", () => {
  it("calculates completion only from evidence flags", () => {
    expect(calculateEvidenceCompletion(emptyProjectSyncEvidence())).toBe(0);
    const all = emptyProjectSyncEvidence(
      Object.fromEntries(PROJECT_SYNC_EVIDENCE_DIMENSIONS.map((d) => [d, true])) as never,
    );
    expect(calculateEvidenceCompletion(all)).toBe(100);
  });

  it("synchronizes domains/modules/capabilities from PROJECT_BIBLE", () => {
    const result = synchronizeFromProjectBible({ persist: false });
    expect(result.snapshot.domains.length).toBeGreaterThan(5);
    expect(result.snapshot.modules.length).toBeGreaterThan(10);
    expect(result.snapshot.capabilities.length).toBeGreaterThan(20);
    expect(result.report.validation.ok).toBe(true);
    expect(result.snapshot.platformCompletionPct).toBeGreaterThanOrEqual(0);
    expect(result.snapshot.platformCompletionPct).toBeLessThanOrEqual(100);
  });

  it("produces incremental diff against previous snapshot when persisted", () => {
    const first = synchronizeFromProjectBible({ persist: true });
    const second = synchronizeFromProjectBible({ persist: true });
    expect(second.report.incremental).toBe(true);
    expect(second.report.previousSnapshotId).toBe(first.snapshot.id);
  }, 60_000);

  it("exposes governance dashboard from engine", () => {
    const dashboard = projectSyncEngine.getDashboard();
    expect(dashboard.authority).toBe("PROJECT_BIBLE");
    expect(dashboard.source).toBe("project-sync");
    expect(dashboard.counts.capabilities).toBeGreaterThan(0);
  });
});
