import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

/**
 * Service-role Supabase client used for platform-global provisioning.
 * Type-only import of the client keeps this module runtime-free so it can be
 * executed from plain Node/tsx scripts as well as from the Next.js runtime.
 */
export type BootstrapClient = SupabaseClient<Database>;

export type BootstrapStepStatus = "created" | "verified" | "skipped" | "failed";

export type BootstrapStep = {
  key: string;
  label: string;
  status: BootstrapStepStatus;
  detail: string;
};

export type BootstrapResult = {
  ok: boolean;
  ranAt: string;
  environment: string;
  bootstrapCompleted: boolean;
  ownerUserId: string | null;
  ownerEmail: string | null;
  steps: BootstrapStep[];
};

export type ValidationCheck = {
  key: string;
  label: string;
  passed: boolean;
  detail: string;
};

export type ValidationReport = {
  ok: boolean;
  checkedAt: string;
  systemReady: boolean;
  checks: ValidationCheck[];
};

export type BootstrapRunOptions = {
  /** Explicit password for the Platform Owner (never hardcode; read from env). */
  ownerPassword?: string;
  /** Runtime environment label — production disables bootstrap. */
  environment?: string;
  /** Force re-running seed steps even if bootstrap already completed. */
  force?: boolean;
};
