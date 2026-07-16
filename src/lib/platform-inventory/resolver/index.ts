/**
 * EPIRE resolver — load EPBSE / EPAC / ECIE / EIIE without duplicating their logic.
 */
import { projectSyncEngine } from "@/lib/project-sync/engine";
import type { SynchronizationResult } from "@/lib/project-sync/sync";
import { loadLatestSnapshot } from "@/lib/project-sync/snapshots";
import {
  loadLatestAuditReport,
  runPlatformAudit,
} from "@/lib/platform-audit/engine";
import type { PlatformAuditReport } from "@/lib/platform-audit/types";
import {
  loadLatestIntelligenceReport,
  runCapabilityIntelligence,
} from "@/lib/capability-intelligence/engine";
import type { CapabilityIntelligenceReport } from "@/lib/capability-intelligence/types";
import {
  loadLatestImplementationReport,
  runImplementationIntelligence,
} from "@/lib/implementation-intelligence/engine";
import type { ImplementationIntelligenceReport } from "@/lib/implementation-intelligence/types";
import type { InputSources } from "@/lib/platform-inventory/types";

export type EpireInputs = {
  epbse: SynchronizationResult;
  epac: PlatformAuditReport;
  ecie: CapabilityIntelligenceReport;
  eiie: ImplementationIntelligenceReport;
  sources: InputSources;
};

export type ResolveInputsOptions = {
  cwd?: string;
  /** Prefer persisted snapshots; run engines only when missing. */
  preferSnapshot?: boolean;
  /** When true, force live runs of EPAC/ECIE/EIIE. */
  forceLive?: boolean;
  persistUpstream?: boolean;
};

export function resolveEpireInputs(options: ResolveInputsOptions = {}): EpireInputs {
  const cwd = options.cwd ?? process.cwd();
  const preferSnapshot = options.preferSnapshot !== false && !options.forceLive;
  const persist = options.persistUpstream ?? false;
  const sources: InputSources = {
    epbse: "missing",
    epac: "missing",
    ecie: "missing",
    eiie: "missing",
  };

  // EPBSE — always synchronize (authoritative entity inventory from PROJECT_BIBLE)
  const existingSync = loadLatestSnapshot(cwd);
  const epbse = projectSyncEngine.synchronize({ cwd, persist: false });
  sources.epbse = existingSync ? "snapshot" : "live";

  let epac: PlatformAuditReport | null = preferSnapshot ? loadLatestAuditReport(cwd) : null;
  if (epac) {
    sources.epac = "snapshot";
  } else {
    epac = runPlatformAudit({ cwd, persist });
    sources.epac = "live";
  }

  let ecie: CapabilityIntelligenceReport | null = preferSnapshot
    ? loadLatestIntelligenceReport(cwd)
    : null;
  if (ecie) {
    sources.ecie = "snapshot";
  } else {
    ecie = runCapabilityIntelligence({ cwd, persist });
    sources.ecie = "live";
  }

  let eiie: ImplementationIntelligenceReport | null = preferSnapshot
    ? loadLatestImplementationReport(cwd)
    : null;
  if (eiie) {
    sources.eiie = "snapshot";
  } else {
    eiie = runImplementationIntelligence({ cwd, persist });
    sources.eiie = "live";
  }

  return { epbse, epac, ecie, eiie, sources };
}
