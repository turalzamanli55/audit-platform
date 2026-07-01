import { Badge } from "@/components/ui/badge";
import { IconBuilding, IconBriefcase } from "@/components/ui/icons";
import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";
import { cn } from "@/lib/ui/cn";

type WorkspaceContextHeaderProps = {
  labels: DashboardWorkspaceLabels["context"];
  organizationName: string;
  workspaceName: string;
  companyName: string | null;
  formattedDate: string;
};

export function WorkspaceContextHeader({
  labels,
  organizationName,
  workspaceName,
  companyName,
  formattedDate,
}: WorkspaceContextHeaderProps) {
  const chips = [
    { icon: <IconBuilding width={14} height={14} />, label: labels.organization, value: organizationName },
    { icon: <IconBriefcase width={14} height={14} />, label: labels.workspace, value: workspaceName },
    {
      icon: <IconBriefcase width={14} height={14} />,
      label: labels.company,
      value: companyName ?? labels.none,
    },
  ];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <div
            key={chip.label}
            className="inline-flex min-h-10 items-center gap-2 rounded-2xl border border-border/50 bg-card/70 px-3.5 py-2 text-sm shadow-xs"
          >
            <span className="text-muted-foreground">{chip.icon}</span>
            <span className="text-muted-foreground">{chip.label}</span>
            <span className="font-medium text-foreground">{chip.value}</span>
          </div>
        ))}
      </div>
      <Badge variant="secondary" className="self-start sm:self-auto">
        {formattedDate}
      </Badge>
    </div>
  );
}

type WorkspaceWelcomeProps = {
  greeting: string;
  summary: string;
  motivation: string;
};

export function WorkspaceWelcome({ greeting, summary, motivation }: WorkspaceWelcomeProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-border/40 bg-gradient-to-br from-card via-card to-muted/20 p-8 sm:p-10 lg:p-12",
        "shadow-sm ds-animate-fade-in motion-reduce:animate-none",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/5 blur-3xl"
      />
      <div className="relative max-w-3xl space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {summary}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
          {greeting}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {motivation}
        </p>
      </div>
    </div>
  );
}
