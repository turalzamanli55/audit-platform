"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { IconArrowRight, IconBell, IconBriefcase, IconZap } from "@/components/ui/icons";
import { COMPANIES_PATH, COMPANIES_NEW_PATH, ENGAGEMENTS_PATH, ENGAGEMENTS_NEW_PATH } from "@/config/dashboard-navigation";
import type { DashboardWorkspaceViewModel } from "@/lib/dashboard/load-dashboard-workspace";
import { buildWelcomeGreeting, buildWelcomeSummary } from "@/lib/dashboard/workspace-greeting";
import { useSettings } from "@/providers";
import { useShell } from "@/components/shell/shell-provider";
import { useTheme } from "@/providers";
import { WorkspaceStatusBadge, workspaceTokens } from "@/components/workspace";
import { cn } from "@/lib/ui/cn";
import { WorkspaceContextHeader } from "../workspace/workspace-welcome";
import { WorkspaceTasks } from "../workspace/workspace-tasks";
import { WorkspaceCalendarCard } from "../workspace/workspace-calendar-card";
import {
  CommandCard,
  CommandEmpty,
  CommandKpiRow,
  CommandListRow,
  CommandModuleBadge,
  CommandPriorityDot,
} from "./command-center-primitives";

type DashboardCommandCenterProps = {
  model: DashboardWorkspaceViewModel;
};

export function DashboardCommandCenter({ model }: DashboardCommandCenterProps) {
  const { labels, locale, commandCenter } = model;
  const cc = labels.commandCenter;
  const router = useRouter();
  const { setMode, resolvedTheme } = useTheme();
  const { toggleSidebar } = useShell();
  const { registerDashboardCommands } = useSettings();

  const greeting = buildWelcomeGreeting(labels.welcome.greeting, {
    timeOfDay: model.timeOfDay,
    name: model.userName,
  });

  const summary = buildWelcomeSummary(cc.heroSubtitle, {
    workspace: model.workspaceName,
    organization: model.organizationName,
  });

  const scrollToSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    registerDashboardCommands({
      customize: () => scrollToSection("command-center-hero"),
      reset: () => undefined,
      toggleSidebar: () => toggleSidebar(),
      toggleTheme: () => setMode(resolvedTheme === "dark" ? "light" : "dark"),
      searchCompanies: () => router.push(`/${locale}${COMPANIES_PATH}`),
      searchEngagements: () => router.push(`/${locale}${ENGAGEMENTS_PATH}`),
      openCalendar: () => scrollToSection("command-center-deadlines"),
      openAi: () => scrollToSection("command-center-my-work"),
    });

    return () => registerDashboardCommands(null);
  }, [
    locale,
    registerDashboardCommands,
    resolvedTheme,
    router,
    scrollToSection,
    setMode,
    toggleSidebar,
  ]);

  const heroStats = [
    commandCenter.attentionCount > 0
      ? cc.heroAttention.replace("{count}", String(commandCenter.attentionCount))
      : null,
    commandCenter.overdueCount > 0
      ? cc.heroOverdue.replace("{count}", String(commandCenter.overdueCount))
      : null,
    cc.heroActive.replace("{count}", String(commandCenter.activeEngagements.length)),
  ].filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-[90rem] space-y-6 pb-10 sm:space-y-7">
      <WorkspaceContextHeader
        labels={labels.context}
        organizationName={model.organizationName}
        workspaceName={model.workspaceName}
        companyName={model.companyName}
        formattedDate={model.formattedDate}
      />

      <section
        id="command-center-hero"
        className="relative overflow-hidden rounded-[1.75rem] border border-border/40 bg-gradient-to-br from-card via-card to-muted/15 p-6 sm:p-8"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl"
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {cc.heroTitle}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              {greeting}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">{summary}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {heroStats.length > 0 ? (
                heroStats.map((stat) => (
                  <WorkspaceStatusBadge key={stat} label={stat!} variant="secondary" />
                ))
              ) : (
                <WorkspaceStatusBadge label={cc.heroClear} variant="success" />
              )}
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
            <Link
              href={`/${locale}${COMPANIES_NEW_PATH}`}
              className={workspaceTokens.actionLink}
            >
              <IconBriefcase width={16} height={16} />
              {labels.quickActions.createCompany}
            </Link>
            <Link
              href={`/${locale}${ENGAGEMENTS_NEW_PATH}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
            >
              <IconZap width={16} height={16} />
              {labels.quickActions.createEngagement}
            </Link>
          </div>
        </div>
      </section>

      <div className="space-y-5">
        <CommandKpiRow title={cc.executiveTitle} items={commandCenter.executive} />
        <CommandKpiRow title={cc.reviewTitle} items={commandCenter.review} />
        <CommandKpiRow title={cc.operationalTitle} items={commandCenter.operational} />
      </div>

      <CommandCard title={cc.moduleHealthTitle} description={cc.moduleHealthDescription}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {commandCenter.moduleHealth.map((module) => (
            <Link
              key={module.id}
              href={module.href}
              className={workspaceTokens.moduleTile}
            >
              <p className="text-sm font-semibold text-foreground">{module.label}</p>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div>
                  <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {cc.pendingReview}
                  </dt>
                  <dd
                    className={cn(
                      "mt-0.5 text-lg font-semibold tabular-nums",
                      module.pendingReview > 0 ? "text-warning" : "text-foreground",
                    )}
                  >
                    {module.pendingReview}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {cc.inProgress}
                  </dt>
                  <dd className="mt-0.5 text-lg font-semibold tabular-nums text-foreground">
                    {module.inProgress}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {cc.approved}
                  </dt>
                  <dd className="mt-0.5 text-lg font-semibold tabular-nums text-success">
                    {module.approved}
                  </dd>
                </div>
              </dl>
            </Link>
          ))}
        </div>
      </CommandCard>

      {commandCenter.attention.length > 0 ? (
        <CommandCard title={cc.attentionTitle} description={cc.attentionDescription}>
          <ul className="divide-y divide-border/40">
            {commandCenter.attention.map((item) => (
              <li key={item.id}>
                <CommandListRow
                  href={item.href}
                  title={item.label}
                  badge={
                    <>
                      <CommandPriorityDot priority={item.priority} />
                      <CommandModuleBadge label={item.module} />
                    </>
                  }
                />
              </li>
            ))}
          </ul>
        </CommandCard>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] xl:gap-6">
        <div className="space-y-5">
          <CommandCard
            id="command-center-my-work"
            title={cc.myWorkTitle}
            description={cc.myWorkDescription}
            action={
              <Link
                href={`/${locale}${ENGAGEMENTS_PATH}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                {cc.viewAll}
                <IconArrowRight width={12} height={12} />
              </Link>
            }
          >
            {model.feed.tasks.length === 0 ? (
              <CommandEmpty title={cc.emptyTasks} description={cc.emptyTasksDescription} />
            ) : (
              <WorkspaceTasks labels={labels.tasks} items={model.feed.tasks} embedded />
            )}
          </CommandCard>

          <CommandCard title={cc.todayActivityTitle} description={cc.todayActivityDescription}>
            {commandCenter.todayActivity.length === 0 ? (
              <CommandEmpty title={cc.emptyToday} description={cc.emptyTodayDescription} />
            ) : (
              <ActivityList
                items={commandCenter.todayActivity}
                actorLabel={cc.actorBy}
              />
            )}
          </CommandCard>

          <CommandCard title={cc.auditTrailTitle} description={cc.auditTrailDescription}>
            {commandCenter.auditTrail.length === 0 ? (
              <CommandEmpty title={cc.emptyActivity} description={cc.emptyActivityDescription} />
            ) : (
              <ActivityList
                items={commandCenter.auditTrail.slice(0, 12)}
                actorLabel={cc.actorBy}
              />
            )}
          </CommandCard>
        </div>

        <div className="space-y-5">
          <div id="command-center-deadlines">
            <WorkspaceCalendarCard
              labels={labels.calendar}
              items={model.feed.calendarItems}
              embedded
            />
          </div>

          {commandCenter.overdueEngagements.length > 0 ? (
            <CommandCard title={cc.overdueTitle}>
              <ul className="divide-y divide-border/40">
                {commandCenter.overdueEngagements.map((eng) => (
                  <li key={eng.id}>
                    <CommandListRow
                      href={eng.href}
                      title={eng.name}
                      subtitle={eng.companyName}
                      badge={
                        <WorkspaceStatusBadge
                          label={cc.daysOverdue.replace(
                            "{count}",
                            String(eng.daysOverdue ?? 1),
                          )}
                          variant="destructive"
                        />
                      }
                    />
                  </li>
                ))}
              </ul>
            </CommandCard>
          ) : null}

          <CommandCard
            title={cc.pendingApprovalsTitle}
            description={cc.pendingApprovalsDescription}
          >
            {commandCenter.pendingApprovals.length === 0 ? (
              <CommandEmpty
                title={cc.emptyApprovals}
                description={cc.emptyApprovalsDescription}
              />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.pendingApprovals.map((item) => (
                  <li key={item.id}>
                    <CommandListRow
                      href={item.href}
                      title={item.label}
                      subtitle={item.status.replace(/_/g, " ")}
                      badge={<CommandModuleBadge label={item.module} />}
                    />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>

          <CommandCard
            title={cc.recentCommentsTitle}
            description={cc.recentCommentsDescription}
          >
            {commandCenter.recentComments.length === 0 ? (
              <CommandEmpty
                title={cc.emptyComments}
                description={cc.emptyCommentsDescription}
              />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.recentComments.map((comment) => (
                  <li key={comment.id}>
                    <CommandListRow
                      href={comment.href}
                      title={comment.body}
                      subtitle={comment.module}
                      meta={comment.time}
                    />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>

          <CommandCard title={cc.activeEngagementsTitle}>
            {commandCenter.activeEngagements.length === 0 ? (
              <CommandEmpty title={cc.emptyEngagements} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.activeEngagements.map((eng) => (
                  <li key={eng.id}>
                    <CommandListRow
                      href={eng.href}
                      title={eng.name}
                      subtitle={`${eng.companyName} · ${eng.lifecycleStatus.replace(/_/g, " ")}`}
                    />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>

          <CommandCard title={cc.recentCompaniesTitle}>
            {model.companies.length === 0 ? (
              <CommandEmpty title={cc.emptyCompanies} />
            ) : (
              <ul className="divide-y divide-border/40">
                {model.companies.slice(0, 6).map((company) => (
                  <li key={company.id}>
                    <CommandListRow
                      href={`/${locale}/app/companies/${company.slug}`}
                      title={company.name}
                    />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>

          <CommandCard title={cc.notificationsTitle}>
            <div className="flex flex-col items-center gap-2 py-4 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted/40 text-muted-foreground">
                <IconBell width={18} height={18} />
              </span>
              <p className="text-sm font-medium text-foreground">{cc.emptyNotifications}</p>
              <p className="text-xs text-muted-foreground">{cc.emptyNotificationsDescription}</p>
            </div>
          </CommandCard>
        </div>
      </div>
    </div>
  );
}

function ActivityList({
  items,
  actorLabel,
}: {
  items: DashboardWorkspaceViewModel["commandCenter"]["auditTrail"];
  actorLabel: string;
}) {
  return (
    <ol className="divide-y divide-border/40">
      {items.map((item) => (
        <li key={item.id} className="py-3 first:pt-0 last:pb-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {item.description}
                {item.actor
                  ? ` · ${actorLabel.replace("{name}", item.actor)}`
                  : null}
              </p>
            </div>
            <time className="shrink-0 text-xs text-muted-foreground">{item.time}</time>
          </div>
        </li>
      ))}
    </ol>
  );
}
