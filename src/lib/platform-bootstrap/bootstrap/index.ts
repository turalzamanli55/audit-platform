import type {
  BootstrapClient,
  BootstrapResult,
  BootstrapRunOptions,
  BootstrapStep,
} from "../types";
import { ensurePlatformOwner } from "../owner";
import { runPlatformSeed } from "../seed";

export type BootstrapStatusRow = {
  id: string;
  bootstrap_completed: boolean;
  owner_user_id: string | null;
  owner_email: string | null;
  environment: string;
  completed_at: string | null;
  last_run_at: string | null;
  details: unknown;
};

function resolveEnvironment(explicit?: string): string {
  if (explicit && explicit.trim().length > 0) return explicit.trim();
  return process.env.NODE_ENV ?? "development";
}

/** Reads the singleton bootstrap ledger row, or null if bootstrap never ran. */
export async function readBootstrapStatus(
  client: BootstrapClient,
): Promise<BootstrapStatusRow | null> {
  const { data, error } = await client
    .from("platform_bootstrap_status")
    .select("id, bootstrap_completed, owner_user_id, owner_email, environment, completed_at, last_run_at, details")
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data as BootstrapStatusRow;
}

async function persistBootstrapStatus(
  client: BootstrapClient,
  input: {
    completed: boolean;
    ownerUserId: string | null;
    ownerEmail: string | null;
    environment: string;
    steps: BootstrapStep[];
  },
): Promise<void> {
  const existing = await readBootstrapStatus(client);
  const now = new Date().toISOString();
  const details = {
    steps: input.steps.map((step) => ({ key: step.key, status: step.status, detail: step.detail })),
  };

  if (existing) {
    await client
      .from("platform_bootstrap_status")
      .update({
        bootstrap_completed: input.completed || existing.bootstrap_completed,
        owner_user_id: input.ownerUserId ?? existing.owner_user_id,
        owner_email: input.ownerEmail ?? existing.owner_email,
        environment: input.environment,
        completed_at: input.completed ? (existing.completed_at ?? now) : existing.completed_at,
        last_run_at: now,
        details,
      })
      .eq("id", existing.id);
    return;
  }

  await client.from("platform_bootstrap_status").insert({
    singleton: true,
    bootstrap_completed: input.completed,
    owner_user_id: input.ownerUserId,
    owner_email: input.ownerEmail,
    environment: input.environment,
    completed_at: input.completed ? now : null,
    last_run_at: now,
    details,
  });
}

/**
 * Runs the one-time platform bootstrap. Idempotent and safe to invoke on every
 * startup: once completed it never recreates the Platform Owner or re-seeds.
 * Bootstrap is DISABLED in production.
 */
export async function runPlatformBootstrap(
  client: BootstrapClient,
  options: BootstrapRunOptions = {},
): Promise<BootstrapResult> {
  const environment = resolveEnvironment(options.environment);
  const ranAt = new Date().toISOString();

  if (environment === "production") {
    return {
      ok: false,
      ranAt,
      environment,
      bootstrapCompleted: false,
      ownerUserId: null,
      ownerEmail: null,
      steps: [
        {
          key: "guard",
          label: "Environment Guard",
          status: "skipped",
          detail: "Production bootstrap is disabled. Provision the Platform Owner out-of-band.",
        },
      ],
    };
  }

  const existing = await readBootstrapStatus(client);
  if (existing?.bootstrap_completed && !options.force) {
    return {
      ok: true,
      ranAt,
      environment,
      bootstrapCompleted: true,
      ownerUserId: existing.owner_user_id,
      ownerEmail: existing.owner_email,
      steps: [
        {
          key: "status",
          label: "Bootstrap Status",
          status: "skipped",
          detail: "Bootstrap already completed — Platform Owner preserved.",
        },
      ],
    };
  }

  const owner = await ensurePlatformOwner(client, options.ownerPassword);
  const seedSteps = await runPlatformSeed(client);
  const steps = [owner.step, ...seedSteps];

  const ownerReady = owner.step.status === "created" || owner.step.status === "verified";
  const seedReady = seedSteps.every((step) => step.status !== "failed");
  const completed = ownerReady && seedReady;

  await persistBootstrapStatus(client, {
    completed,
    ownerUserId: owner.ownerUserId,
    ownerEmail: owner.ownerEmail,
    environment,
    steps,
  });

  return {
    ok: completed,
    ranAt,
    environment,
    bootstrapCompleted: completed,
    ownerUserId: owner.ownerUserId,
    ownerEmail: owner.ownerEmail,
    steps,
  };
}
