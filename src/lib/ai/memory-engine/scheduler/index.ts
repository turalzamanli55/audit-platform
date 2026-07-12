import type { EmeCleanupReport } from "@/lib/ai/memory-engine/cleanup";

export type EmeSchedulerTask = {
  id: string;
  intervalMs: number;
  lastRunAt: string | null;
  enabled: boolean;
};

/**
 * Memory scheduler — periodic cleanup and compression.
 */
export class EmeMemoryScheduler {
  private readonly tasks = new Map<string, EmeSchedulerTask>();
  private timers = new Map<string, ReturnType<typeof setInterval>>();

  register(task: Omit<EmeSchedulerTask, "lastRunAt">, handler: () => EmeCleanupReport | void): void {
    this.tasks.set(task.id, { ...task, lastRunAt: null });
    if (!task.enabled) return;
    const timer = setInterval(() => {
      handler();
      const existing = this.tasks.get(task.id);
      if (existing) {
        this.tasks.set(task.id, { ...existing, lastRunAt: new Date().toISOString() });
      }
    }, task.intervalMs);
    this.timers.set(task.id, timer);
  }

  stop(taskId?: string): void {
    if (taskId) {
      const timer = this.timers.get(taskId);
      if (timer) clearInterval(timer);
      this.timers.delete(taskId);
      return;
    }
    for (const timer of this.timers.values()) clearInterval(timer);
    this.timers.clear();
  }

  list(): EmeSchedulerTask[] {
    return [...this.tasks.values()];
  }
}
