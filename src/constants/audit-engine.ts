/**
 * Audit Engine permission catalog (PROJECT_BIBLE §13.2 Audit).
 * Codes are scoped to capability contracts under mod_audit-engine.
 */
export const AUDIT_ENGINE_PERMISSIONS = {
  PLANNING_READ: "audit_engine.planning.read",
  PLANNING_EXECUTE: "audit_engine.planning.execute",
  PROGRAM_EXECUTE: "audit_engine.program.execute",
  EVIDENCE_MANAGE: "audit_engine.evidence.manage",
  REVIEW_WORKFLOW: "audit_engine.review.workflow",
  QUALITY_REVIEW: "audit_engine.quality.review",
  OPINION_FORMATION: "audit_engine.opinion.formation",
  OPINION_APPROVE: "audit_engine.opinion.approve",
  ISA_METHODOLOGY: "audit_engine.isa.methodology",
  ANALYTICAL_PROCEDURES: "audit_engine.analytical.procedures",
  SAMPLING: "audit_engine.sampling",
  FINDING_TRACK: "audit_engine.finding.track",
  COMMITTEE_DASHBOARD: "audit_engine.committee.dashboard",
  REPORT_GENERATE: "audit_engine.report.generate",
  AUDIT_LOG_READ: "audit_engine.audit_log.read",
  AUDIT_LOG_EXPORT: "audit_engine.audit_log.export",
} as const;

export const AUDIT_OPINION_FORMATION_PERMISSIONS = {
  READ: AUDIT_ENGINE_PERMISSIONS.OPINION_FORMATION,
  APPROVE: AUDIT_ENGINE_PERMISSIONS.OPINION_APPROVE,
} as const;

export const AUDIT_ENGINE_RESOURCE_TYPE = "audit_engine";

export const AUDIT_OPINION_TYPES = [
  "unqualified",
  "qualified",
  "adverse",
  "disclaimer",
] as const;

export type AuditOpinionType = (typeof AUDIT_OPINION_TYPES)[number];

export const ISA_PHASES = [
  "acceptance",
  "planning",
  "risk_assessment",
  "response",
  "conclusion",
  "reporting",
] as const;

export type IsaPhase = (typeof ISA_PHASES)[number];
