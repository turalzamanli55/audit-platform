import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";

export function resolveTimeOfDay(
  hour: number,
  labels: Pick<
    DashboardWorkspaceLabels["welcome"],
    "timeMorning" | "timeAfternoon" | "timeEvening"
  >,
): string {
  if (hour < 12) return labels.timeMorning;
  if (hour < 18) return labels.timeAfternoon;
  return labels.timeEvening;
}

export function buildWelcomeGreeting(
  template: string,
  values: { timeOfDay: string; name: string },
): string {
  return template.replace("{timeOfDay}", values.timeOfDay).replace("{name}", values.name);
}

export function buildWelcomeSummary(
  template: string,
  values: { workspace: string; organization: string },
): string {
  return template.replace("{workspace}", values.workspace).replace("{organization}", values.organization);
}
