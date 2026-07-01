import { WorkspacePanel } from "./workspace-section";
import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";
import {
  IconBriefcase,
  IconFileText,
  IconSparkles,
  IconTrendingUp,
  IconZap,
} from "@/components/ui/icons";

type WorkspaceKpiGridProps = {
  labels: DashboardWorkspaceLabels["kpi"];
  values: {
    companies: string;
    engagements: string;
    openTasks: string;
    reports: string;
    aiSuggestions: string;
  };
};

const kpiIcons = [
  IconBriefcase,
  IconTrendingUp,
  IconZap,
  IconFileText,
  IconSparkles,
] as const;

export function WorkspaceKpiGrid({ labels, values }: WorkspaceKpiGridProps) {
  const items = [
    { label: labels.companies, value: values.companies },
    { label: labels.engagements, value: values.engagements },
    { label: labels.openTasks, value: values.openTasks },
    { label: labels.reports, value: values.reports },
    { label: labels.aiSuggestions, value: values.aiSuggestions },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
      {items.map((item, index) => {
        const Icon = kpiIcons[index] ?? IconBriefcase;
        return (
          <WorkspacePanel key={item.label} className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-3xl font-semibold tracking-tight text-foreground">{item.value}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">{labels.placeholder}</p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon width={18} height={18} />
              </span>
            </div>
          </WorkspacePanel>
        );
      })}
    </div>
  );
}
