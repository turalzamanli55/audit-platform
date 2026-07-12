import type { AiHostExecutionPlan } from "@/lib/ai/host/types";

/**
 * Job envelope — queue item for async-style host execution tracking.
 */
export type AiHostJob = {
  id: string;
  planId: string;
  status: AiHostExecutionPlan["queueState"];
  attempts: number;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
};

export class AiHostJobStore {
  private readonly jobs = new Map<string, AiHostJob>();

  createFromPlan(plan: AiHostExecutionPlan): AiHostJob {
    const job: AiHostJob = {
      id: `job_${plan.id}`,
      planId: plan.id,
      status: plan.queueState,
      attempts: 0,
      lastError: null,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    };
    this.jobs.set(job.id, job);
    return job;
  }

  sync(plan: AiHostExecutionPlan, error?: string | null): AiHostJob {
    const existing = this.jobs.get(`job_${plan.id}`);
    const job: AiHostJob = {
      id: `job_${plan.id}`,
      planId: plan.id,
      status: plan.queueState,
      attempts: (existing?.attempts ?? 0) + (plan.queueState === "executing" ? 1 : 0),
      lastError: error ?? existing?.lastError ?? null,
      createdAt: existing?.createdAt ?? plan.createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.jobs.set(job.id, job);
    return job;
  }

  getByPlanId(planId: string): AiHostJob | undefined {
    return this.jobs.get(`job_${planId}`);
  }

  list(limit = 50): AiHostJob[] {
    return [...this.jobs.values()]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, limit);
  }
}
