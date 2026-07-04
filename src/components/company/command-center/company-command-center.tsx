"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui";
import {
  CommandCard,
  CommandEmpty,
  CommandKpiRow,
  CommandListRow,
} from "@/components/dashboard/command-center/command-center-primitives";
import { ENGAGEMENTS_NEW_PATH } from "@/config/dashboard-navigation";
import { updateCompanyAction } from "@/lib/actions/company/update-company";
import type { CompanyWorkspaceView } from "@/lib/company/company-workspace-view";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { CompanyWorkspaceCommandCenterData } from "@/types/company-workspace-command-center";
import { cn } from "@/lib/ui/cn";
import {
  IconArrowRight,
  IconBriefcase,
  IconCalendar,
  IconFileText,
  IconTrendingUp,
  IconUsers,
  IconZap,
} from "@/components/ui/icons";

type CompanyCommandCenterProps = {
  company: CompanyWorkspaceView;
  locale: string;
  commandCenter: CompanyWorkspaceCommandCenterData;
  canAdminister: boolean;
  labels: Dictionary["companies"]["workspace"];
  companiesLabels: Dictionary["companies"];
  overviewLabels: Dictionary["companies"]["overview"];
};

export function CompanyCommandCenter({
  company: initialCompany,
  locale,
  commandCenter,
  canAdminister,
  labels,
  companiesLabels,
  overviewLabels,
}: CompanyCommandCenterProps) {
  const cc = labels.commandCenter;
  const router = useRouter();
  const [company, setCompany] = useState(initialCompany);
  const [description, setDescription] = useState(initialCompany.description ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const canEdit = canAdminister && !company.isArchived;
  const isDirty = description !== (company.description ?? "");
  const slug = company.slug;
  const engagementBase = commandCenter.primaryEngagementSlug
    ? `/${locale}/app/engagements/${commandCenter.primaryEngagementSlug}`
    : null;

  const quickActions = [
    {
      id: "engagements",
      label: cc.actionViewEngagements,
      href: `/${locale}/app/engagements`,
      icon: IconBriefcase,
      enabled: true,
    },
    {
      id: "create",
      label: cc.actionCreateEngagement,
      href: `/${locale}${ENGAGEMENTS_NEW_PATH}`,
      icon: IconZap,
      enabled: true,
    },
    {
      id: "planning",
      label: cc.actionOpenPlanning,
      href: engagementBase ? `${engagementBase}/planning` : `/${locale}/app/engagements`,
      icon: IconFileText,
      enabled: Boolean(engagementBase),
    },
    {
      id: "risk",
      label: cc.actionOpenRisk,
      href: engagementBase ? `${engagementBase}/risk-assessment` : `/${locale}/app/engagements`,
      icon: IconTrendingUp,
      enabled: Boolean(engagementBase),
    },
    {
      id: "fieldwork",
      label: cc.actionOpenFieldwork,
      href: engagementBase ? `${engagementBase}/fieldwork` : `/${locale}/app/engagements`,
      icon: IconCalendar,
      enabled: Boolean(engagementBase),
    },
    {
      id: "materiality",
      label: cc.actionOpenMateriality,
      href: engagementBase ? `${engagementBase}/materiality` : `/${locale}/app/engagements`,
      icon: IconFileText,
      enabled: Boolean(engagementBase),
    },
  ].filter((action) => action.enabled || action.id === "engagements" || action.id === "create");

  const saveDescription = () => {
    startTransition(async () => {
      setError(null);
      const result = await updateCompanyAction({
        companyId: company.id,
        version: company.version,
        description: description.trim() || null,
      });

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      setCompany((current) => ({
        ...current,
        description: description.trim() || null,
        version: result.data.version,
        updatedAt: new Date().toISOString(),
      }));
      setIsEditing(false);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-border/40 bg-gradient-to-br from-card via-card to-muted/15 p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {cc.heroTitle}
            </p>
            <p className="text-sm text-muted-foreground">{cc.heroSubtitle}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="secondary" className="rounded-full">
                {commandCenter.compliance.framework}
              </Badge>
              <Badge variant="secondary" className="rounded-full">
                {commandCenter.financial.functionalCurrency}
              </Badge>
              <Badge
                variant={commandCenter.compliance.statusVariant === "success" ? "secondary" : "warning"}
                className="rounded-full"
              >
                {commandCenter.compliance.statusLabel}
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:max-w-xl">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.id}
                  href={action.href}
                  className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-card/80 px-3 py-2.5 text-xs font-medium transition-colors hover:bg-card sm:text-sm"
                >
                  <Icon width={14} height={14} className="shrink-0 text-primary" />
                  <span className="truncate">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <CommandKpiRow title={cc.healthTitle} items={commandCenter.health} />
      <CommandKpiRow title={cc.executiveTitle} items={commandCenter.executive} />

      <CommandCard title={cc.moduleProgressTitle} description={cc.moduleProgressDescription}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {commandCenter.moduleProgress.map((module) => (
            <Link
              key={module.id}
              href={module.href ?? `/${locale}/app/engagements`}
              className="rounded-xl border border-border/50 bg-muted/10 p-4 transition-all hover:border-border-strong hover:bg-card/80"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">{module.label}</p>
                <Badge variant={module.statusVariant}>{module.statusLabel}</Badge>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-foreground/75"
                  style={{ width: `${module.progressPct}%` }}
                  role="progressbar"
                  aria-valuenow={module.progressPct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {module.progressPct}% · {cc.pendingReview} {module.pendingReview}
              </p>
            </Link>
          ))}
        </div>
      </CommandCard>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] xl:gap-6">
        <div className="space-y-5">
          <CommandCard title={cc.activeEngagementsTitle} description={cc.activeEngagementsDescription}>
            {commandCenter.activeEngagements.length === 0 ? (
              <CommandEmpty title={cc.emptyEngagements} description={cc.emptyEngagementsDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.activeEngagements.map((eng) => (
                  <li key={eng.id}>
                    <CommandListRow
                      href={eng.href}
                      title={eng.name}
                      subtitle={eng.lifecycleStatus.replace(/_/g, " ")}
                      badge={
                        eng.isOverdue ? (
                          <Badge variant="destructive" className="text-[10px]">
                            {cc.overdue}
                          </Badge>
                        ) : undefined
                      }
                    />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>

          <CommandCard title={cc.recentActivityTitle} description={cc.recentActivityDescription}>
            {commandCenter.recentActivity.length === 0 ? (
              <CommandEmpty title={cc.emptyActivity} description={cc.emptyActivityDescription} />
            ) : (
              <ol className="divide-y divide-border/40">
                {commandCenter.recentActivity.map((item) => (
                  <li key={item.id} className="flex items-start justify-between gap-3 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <time className="shrink-0 text-xs text-muted-foreground">{item.time}</time>
                  </li>
                ))}
              </ol>
            )}
          </CommandCard>

          <CommandCard title={cc.recentDocumentsTitle} description={cc.recentDocumentsDescription}>
            {commandCenter.recentDocuments.length === 0 ? (
              <CommandEmpty title={cc.emptyDocuments} description={cc.emptyDocumentsDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.recentDocuments.map((doc) => (
                  <li key={doc.id}>
                    <CommandListRow
                      href={doc.href}
                      title={doc.name}
                      subtitle={`${doc.engagementName} · ${doc.documentType}`}
                      meta={doc.time}
                    />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>

          <CommandCard title={labels.sections.overview.highlightsTitle}>
            {error ? (
              <div className="mb-4">
                <Alert variant="error">{error}</Alert>
              </div>
            ) : null}
            {isEditing && canEdit ? (
              <div className="space-y-4">
                <label htmlFor="company-description" className="text-sm font-medium text-foreground">
                  {companiesLabels.create.description}
                </label>
                <Input
                  id="company-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                  <Button type="button" onClick={saveDescription} disabled={isPending || !isDirty}>
                    {overviewLabels.saveDescription}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setDescription(company.description ?? "");
                      setIsEditing(false);
                      setError(null);
                    }}
                    disabled={isPending}
                  >
                    {overviewLabels.cancelEdit}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {company.description?.trim() || labels.sections.overview.noDescription}
                </p>
                {canEdit ? (
                  <Button type="button" variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                    {overviewLabels.editDescription}
                  </Button>
                ) : null}
              </div>
            )}
          </CommandCard>
        </div>

        <div className="space-y-5">
          <CommandCard title={cc.financialTitle} description={cc.financialDescription}>
            <dl className="grid gap-4 sm:grid-cols-2">
              {[
                [cc.framework, commandCenter.financial.framework],
                [cc.currency, commandCenter.financial.functionalCurrency],
                [cc.fiscalYear, commandCenter.financial.fiscalYearEnd],
                [cc.entityType, commandCenter.financial.entityType],
                [cc.industry, commandCenter.financial.industry],
              ].map(([label, value]) => (
                <div key={label} className="space-y-1">
                  <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="text-sm font-medium text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
            <Link
              href={`/${locale}/app/companies/${slug}/financial`}
              className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              {cc.viewFinancial}
              <IconArrowRight width={12} height={12} />
            </Link>
          </CommandCard>

          <CommandCard title={cc.complianceTitle} description={cc.complianceDescription}>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">{cc.complianceStatus}</span>
                <Badge variant={commandCenter.compliance.statusVariant}>
                  {commandCenter.compliance.statusLabel}
                </Badge>
              </div>
              <CommandListRow title={cc.jurisdiction} subtitle={commandCenter.compliance.jurisdiction} />
              <CommandListRow
                title={cc.activeEngagementsLabel}
                subtitle={String(commandCenter.compliance.activeEngagements)}
              />
            </div>
            <Link
              href={`/${locale}/app/companies/${slug}/compliance`}
              className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              {cc.viewCompliance}
              <IconArrowRight width={12} height={12} />
            </Link>
          </CommandCard>

          <CommandCard title={cc.deadlinesTitle} description={cc.deadlinesDescription}>
            {commandCenter.upcomingDeadlines.length === 0 ? (
              <CommandEmpty title={cc.emptyDeadlines} description={cc.emptyDeadlinesDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.upcomingDeadlines.map((eng) => (
                  <li key={eng.id}>
                    <CommandListRow
                      href={eng.href}
                      title={eng.name}
                      meta={
                        eng.periodEnd
                          ? new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", year: "numeric" }).format(
                              new Date(eng.periodEnd),
                            )
                          : undefined
                      }
                    />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>

          <CommandCard title={cc.teamTitle} description={cc.teamDescription}>
            {commandCenter.teamMembers.length === 0 ? (
              <CommandEmpty title={cc.emptyTeam} description={cc.emptyTeamDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.teamMembers.map((member) => (
                  <li key={member.id}>
                    <CommandListRow
                      title={member.displayName}
                      subtitle={member.role}
                      meta={cc.engagementCount.replace("{count}", String(member.engagementCount))}
                      badge={
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                          <IconUsers width={14} height={14} />
                        </span>
                      }
                    />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>

          <CommandCard title={cc.recentCommentsTitle} description={cc.recentCommentsDescription}>
            {commandCenter.recentComments.length === 0 ? (
              <CommandEmpty title={cc.emptyComments} description={cc.emptyCommentsDescription} />
            ) : (
              <ul className="divide-y divide-border/40">
                {commandCenter.recentComments.map((comment) => (
                  <li key={comment.id}>
                    <CommandListRow
                      href={comment.href}
                      title={comment.body}
                      subtitle={`${comment.engagementName} · ${comment.module}`}
                      meta={comment.time}
                    />
                  </li>
                ))}
              </ul>
            )}
          </CommandCard>

          <CommandCard title={cc.pendingReviewsTitle}>
            <div
              className={cn(
                "rounded-xl border px-4 py-5 text-center",
                commandCenter.pendingReviews > 0
                  ? "border-warning/40 bg-warning/5"
                  : "border-border/50 bg-muted/10",
              )}
            >
              <p className="text-3xl font-semibold tabular-nums text-foreground">
                {commandCenter.pendingReviews}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{cc.pendingReviewsHint}</p>
            </div>
          </CommandCard>
        </div>
      </div>
    </div>
  );
}
