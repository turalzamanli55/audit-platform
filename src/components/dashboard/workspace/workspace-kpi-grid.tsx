import Link from "next/link";
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
  locale: string;
  labels: DashboardWorkspaceLabels["kpi"];
  values: {
    companies: string;
    engagements: string;
    openTasks: string;
    reports: string;
    aiSuggestions: string;
  };
  live: {
    companies: boolean;
    engagements: boolean;
    openTasks: boolean;
    reports: boolean;
    aiSuggestions: boolean;
  };
};

const kpiConfig = [
  { key: "companies" as const, icon: IconBriefcase, href: (locale: string) => `/${locale}/app/companies` },
  { key: "engagements" as const, icon: IconTrendingUp, href: (locale: string) => `/${locale}/app/engagements` },
  { key: "openTasks" as const, icon: IconZap, href: null },
  { key: "reports" as const, icon: IconFileText, href: null },
  { key: "aiSuggestions" as const, icon: IconSparkles, href: null },
] as const;

export function WorkspaceKpiGrid({ locale, labels, values, live }: WorkspaceKpiGridProps) {
  const hints: Record<(typeof kpiConfig)[number]["key"], string> = {
    companies: labels.hintCompanies ?? labels.liveHint,
    engagements: labels.hintEngagements ?? labels.liveHint,
    openTasks: labels.hintOpenTasks ?? labels.liveHint,
    reports: labels.comingSoon ?? labels.placeholder,
    aiSuggestions: labels.comingSoon ?? labels.placeholder,
  };

  const items = kpiConfig.map((config) => ({
    ...config,
    label: labels[config.key],
    value: values[config.key],
    isLive: live[config.key],
    hint: hints[config.key],
    emphasize: config.key === "openTasks" && live.openTasks && values.openTasks !== "0" && values.openTasks !== "—",
  }));

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-5">
      {items.map((item) => {
        const Icon = item.icon;
        const panel = (
          <WorkspacePanel
            className={`p-4 sm:p-5 ${item.emphasize ? "border-warning/40 bg-warning/5" : ""}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {item.label}
                </p>
                <p className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {item.value}
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">{item.hint}</p>
              </div>
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  item.emphasize ? "bg-warning/15 text-warning" : "bg-primary/10 text-primary"
                }`}
              >
                <Icon width={16} height={16} />
              </span>
            </div>
          </WorkspacePanel>
        );

        if (item.href && item.isLive) {
          return (
            <Link key={item.key} href={item.href(locale)} className="block transition-opacity hover:opacity-90">
              {panel}
            </Link>
          );
        }

        return <div key={item.key}>{panel}</div>;
      })}
    </div>
  );
}
