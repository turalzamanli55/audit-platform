import type { ResetProcedureStep } from "@/lib/database-governance/types";

/**
 * Enterprise Database Reset Procedure — authoritative ordered steps for remote rebuild.
 * Automated steps are executed by continuous validation; manual steps require operator confirmation.
 */
export const ENTERPRISE_DATABASE_RESET_PROCEDURE: ResetProcedureStep[] = [
  {
    id: "backup_verification",
    order: 1,
    title: "Backup Verification",
    description:
      "Confirm latest logical backup or Supabase point-in-time recovery window. Verify backup restore drill succeeded in staging within the last release cycle. No reset proceeds without verified recovery path.",
    automated: false,
  },
  {
    id: "remote_reset",
    order: 2,
    title: "Remote Reset",
    command: "supabase link --project-ref <ref> && supabase db reset --linked",
    description:
      "Drop and recreate the linked remote database. Active development only — production requires change window and stakeholder sign-off per PROJECT_BIBLE Part 16.",
    automated: false,
  },
  {
    id: "migration_replay",
    order: 3,
    title: "Migration Replay",
    command: "supabase db push",
    description:
      "Replay migrations #1 through #Last in strict chronological order. Governance engine dry-run must pass before push.",
    automated: true,
  },
  {
    id: "supabase_types_generation",
    order: 4,
    title: "Supabase Types Generation",
    command:
      "npx supabase gen types typescript --project-id <ref> > src/types/supabase.ts",
    description:
      "Regenerate TypeScript types from the rebuilt schema. Types must match migration output with zero drift.",
    automated: false,
  },
  {
    id: "seed_execution",
    order: 5,
    title: "Seed Execution",
    command: "supabase db seed",
    description:
      "Apply supabase/seed.sql for platform roles and permissions. Role-permission backfill migrations require seeded roles.",
    automated: false,
  },
  {
    id: "validation",
    order: 6,
    title: "Validation",
    command: "npx vitest run src/lib/database-governance/database-lifecycle.test.ts",
    description:
      "Run database lifecycle validation: governance, schema drift, definition of done, and acceptance criteria.",
    automated: true,
  },
  {
    id: "build",
    order: 7,
    title: "Build",
    command: "npm run build",
    description: "Verify application compiles against regenerated Supabase types.",
    automated: true,
  },
  {
    id: "tests",
    order: 8,
    title: "Tests",
    command: "npm run test",
    description: "Execute full Vitest suite including governance, SQL foundation, and module tests.",
    automated: true,
  },
  {
    id: "platform_readiness",
    order: 9,
    title: "Platform Readiness",
    description:
      "Synchronize platform readiness via EPBSE. Platform completion percentage is derived from capability registry — never invented.",
    automated: true,
  },
  {
    id: "capability_registry",
    order: 10,
    title: "Capability Registry",
    description:
      "Resync capability catalog from PROJECT_BIBLE. Validate module dependencies and readiness gates.",
    automated: true,
  },
  {
    id: "project_sync",
    order: 11,
    title: "Project Sync",
    description:
      "Run EPBSE synchronizeFromProjectBible to align domains, modules, features, and completion evidence.",
    automated: true,
  },
  {
    id: "migration_governance",
    order: 12,
    title: "Migration Governance",
    description:
      "Audit chronological order, dependency graph, compatibility, RLS, policies, permissions, extensions, enums, sequences, indexes, constraints, storage, generated columns, defaults, and foundation dependencies.",
    automated: true,
  },
  {
    id: "sql_foundation",
    order: 13,
    title: "SQL Foundation",
    description:
      "Verify Enterprise SQL Foundation migration is the root provider of all shared helpers. Coverage must be 100%. No feature migration may define shared SQL infrastructure.",
    automated: true,
  },
  {
    id: "health_verification",
    order: 14,
    title: "Health Verification",
    description:
      "Confirm Migration Health ≥ 95, Dependency Health = 100, zero schema drift errors, dry-run #1→#Last OK.",
    automated: true,
  },
];

export function formatResetProcedure(): string {
  const lines = ["Enterprise Database Reset Procedure", ""];
  for (const step of ENTERPRISE_DATABASE_RESET_PROCEDURE) {
    lines.push(`${step.order}. ${step.title}${step.automated ? " [automated]" : " [manual]"}`);
    lines.push(`   ${step.description}`);
    if (step.command) lines.push(`   Command: ${step.command}`);
    lines.push("");
  }
  return lines.join("\n");
}
