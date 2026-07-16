/**
 * Enterprise DevOps & Release Platform (EDRP)
 *
 * Orchestrates existing platform governance systems into one releasable pipeline:
 * Database Governance · SQL Foundation · Schema Drift · EPBSE · Capability Registry · Platform Registry
 *
 * Does NOT recreate those systems — only integrates and gates releases on their outcomes.
 */

export * from "@/lib/devops/types";
export * from "@/lib/devops/validation";
export * from "@/lib/devops/pipeline";
export * from "@/lib/devops/migration";
export * from "@/lib/devops/schema";
export * from "@/lib/devops/build";
export * from "@/lib/devops/testing";
export * from "@/lib/devops/project-sync";
export * from "@/lib/devops/capability-sync";
export * from "@/lib/devops/platform-sync";
export * from "@/lib/devops/release";
export * from "@/lib/devops/versioning";
export * from "@/lib/devops/artifacts";
export * from "@/lib/devops/reports";
export * from "@/lib/devops/health";
export * from "@/lib/devops/monitoring";
export * from "@/lib/devops/deployment";
export * from "@/lib/devops/rollback";
export * from "@/lib/devops/checklists";
export * from "@/lib/devops/ci";
export * from "@/lib/devops/cd";
export * from "@/lib/devops/dashboard";
export * from "@/lib/devops/engine";
