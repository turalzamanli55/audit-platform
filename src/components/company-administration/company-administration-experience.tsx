"use client";

import { useDeferredValue, useMemo, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type {
  CompanyAdministrationData,
  CompanyAdminUserRow,
} from "@/lib/company-administration/load-company-administration";
import {
  companyDisableUserAction,
  companyReactivateUserAction,
  companyDeleteUserAction,
  companyResetPasswordAction,
  companyChangeRoleAction,
  companyAssignWorkspaceMembershipAction,
  companyRemoveWorkspaceMembershipAction,
  companyTransferWorkspaceMembershipAction,
  companyRevokeInvitationAction,
} from "@/lib/actions/company-administration/company-administration-actions";
import {
  activityDayGroup,
  avatarInitials,
  buildSecurityIssues,
  computeCompanyHealthScore,
  countTodayActivity,
  friendlyErrorMessage,
  highlightMatch,
  recentJoiners,
  relativeTime,
  seatUsagePercent,
} from "@/lib/company-administration/presentation";
import { UserProvisionWizard } from "./user-provision-wizard";
import type { CompanyAdministrationLabels } from "./labels";

type Section =
  | "overview"
  | "team"
  | "roles"
  | "seats"
  | "workspaces"
  | "activity"
  | "logins"
  | "security"
  | "settings";

type Props = {
  data: CompanyAdministrationData;
  labels: CompanyAdministrationLabels;
};

function friendlyAction(action: string): string {
  return action
    .replace(/^auth\./, "")
    .replace(/^membership\./, "")
    .replace(/\./g, " ")
    .replace(/_/g, " ");
}

function Highlighted({ text, query }: { text: string; query: string }) {
  const parts = highlightMatch(text, query);
  return (
    <>
      {parts.map((part, index) =>
        part.match ? (
          <mark key={index} className="rounded bg-amber-200/80 px-0.5 text-foreground dark:bg-amber-500/30">
            {part.text}
          </mark>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </>
  );
}

function EmptyState({
  title,
  hint,
  actionLabel,
  onAction,
}: {
  title: string;
  hint: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center">
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-muted to-background shadow-inner"
        aria-hidden
      >
        <div className="h-8 w-8 rounded-full border-2 border-dashed border-muted-foreground/40" />
      </div>
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{hint}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 h-11 min-w-[10rem] rounded-2xl bg-foreground px-4 text-sm font-medium text-background transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

function Banner({
  tone,
  title,
  onDismiss,
  dismissLabel,
}: {
  tone: "success" | "error" | "warning";
  title: string;
  onDismiss?: () => void;
  dismissLabel: string;
}) {
  const toneClass =
    tone === "success"
      ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100"
      : tone === "warning"
        ? "border-amber-500/25 bg-amber-500/10 text-amber-950 dark:text-amber-100"
        : "border-destructive/30 bg-destructive/10 text-destructive";
  return (
    <div
      role="status"
      aria-live="polite"
      className={`mb-4 flex items-start justify-between gap-3 rounded-2xl border px-4 py-3 text-sm ${toneClass}`}
    >
      <p className="font-medium">{title}</p>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-lg px-2 py-1 text-xs opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={dismissLabel}
        >
          {dismissLabel}
        </button>
      ) : null}
    </div>
  );
}

export function CompanyAdministrationExperience({ data, labels }: Props) {
  const router = useRouter();
  const [section, setSection] = useState<Section>("overview");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [wizardMode, setWizardMode] = useState<"create" | "invite" | null>(null);
  const [selectedUser, setSelectedUser] = useState<CompanyAdminUserRow | null>(null);
  const [globalQuery, setGlobalQuery] = useState("");
  const [seatSort, setSeatSort] = useState<"name" | "login" | "created">("name");
  const deferredQuery = useDeferredValue(globalQuery.trim().toLowerCase());

  const health = useMemo(() => computeCompanyHealthScore(data), [data]);
  const security = useMemo(() => buildSecurityIssues(data), [data]);
  const usagePct = seatUsagePercent(data.seats.seatsUsed, data.seats.seatLimit);
  const todayActivity = countTodayActivity(data);
  const joiners = recentJoiners(data);
  const disabledCount = data.users.filter((u) => u.suspended || u.status === "inactive").length;

  const sections: Array<{ id: Section; label: string }> = [
    { id: "overview", label: labels.sections.overview },
    { id: "team", label: labels.sections.team },
    { id: "roles", label: labels.sections.roles },
    { id: "seats", label: labels.sections.seats },
    { id: "workspaces", label: labels.sections.workspaces },
    { id: "activity", label: labels.sections.activity },
    { id: "logins", label: labels.sections.logins },
    { id: "security", label: labels.sections.security },
    { id: "settings", label: labels.sections.settings },
  ];

  const filteredUsers = useMemo(() => {
    if (!deferredQuery) return data.users;
    return data.users.filter(
      (u) =>
        u.email.toLowerCase().includes(deferredQuery) ||
        u.fullName.toLowerCase().includes(deferredQuery) ||
        u.roleName.toLowerCase().includes(deferredQuery) ||
        (u.workspaceName ?? "").toLowerCase().includes(deferredQuery),
    );
  }, [data.users, deferredQuery]);

  const filteredRoles = useMemo(() => {
    if (!deferredQuery) return data.roles;
    return data.roles.filter(
      (r) =>
        r.label.toLowerCase().includes(deferredQuery) ||
        r.description.toLowerCase().includes(deferredQuery),
    );
  }, [data.roles, deferredQuery]);

  const filteredWorkspaces = useMemo(() => {
    if (!deferredQuery) return data.workspaces;
    return data.workspaces.filter((w) => w.name.toLowerCase().includes(deferredQuery));
  }, [data.workspaces, deferredQuery]);

  const filteredActivity = useMemo(() => {
    if (!deferredQuery) return data.activity;
    return data.activity.filter(
      (row) =>
        row.actorEmail.toLowerCase().includes(deferredQuery) ||
        row.action.toLowerCase().includes(deferredQuery) ||
        row.resourceType.toLowerCase().includes(deferredQuery),
    );
  }, [data.activity, deferredQuery]);

  const filteredInvites = useMemo(() => {
    if (!deferredQuery) return data.invitations;
    return data.invitations.filter((i) => i.email.toLowerCase().includes(deferredQuery));
  }, [data.invitations, deferredQuery]);

  const sortedSeats = useMemo(() => {
    const list = [...filteredUsers];
    list.sort((a, b) => {
      if (seatSort === "login") {
        return +(b.lastLoginAt ?? 0) - +(a.lastLoginAt ?? 0);
      }
      if (seatSort === "created") {
        return +new Date(b.createdAt) - +new Date(a.createdAt);
      }
      return (a.fullName || a.email).localeCompare(b.fullName || b.email);
    });
    return list;
  }, [filteredUsers, seatSort]);

  const groupedActivity = useMemo(() => {
    const groups: Record<"today" | "yesterday" | "week" | "earlier", typeof filteredActivity> = {
      today: [],
      yesterday: [],
      week: [],
      earlier: [],
    };
    for (const row of filteredActivity) {
      groups[activityDayGroup(row.createdAt)].push(row);
    }
    return groups;
  }, [filteredActivity]);

  function run(
    action: () => Promise<{ success: boolean; error?: { message: string } }>,
    successMessage: string,
  ) {
    setError(null);
    setNotice(null);
    startTransition(async () => {
      const result = await action();
      if (!result.success) {
        setError(friendlyErrorMessage(result.error?.message ?? labels.messages.forbidden));
        return;
      }
      setNotice(successMessage);
      setSelectedUser(null);
      router.refresh();
    });
  }

  function exportActivity() {
    const rows = [
      ["When", "User", "Action", "Type"],
      ...filteredActivity.map((row) => [row.createdAt, row.actorEmail, row.action, row.resourceType]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "company-activity.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const healthLabel =
    health.level === "healthy"
      ? labels.health.healthy
      : health.level === "attention"
        ? labels.health.attention
        : labels.health.critical;

  const noSeats = Boolean(data.seats.subscriptionId && data.seats.seatsAvailable <= 0);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6 sm:px-6 sm:pb-10 sm:pt-8">
      <header className="mb-6 space-y-5 border-b border-border/70 pb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {labels.navAdministration}
            </p>
            <h1 className="truncate text-3xl font-semibold tracking-tight sm:text-4xl">
              {data.organizationName}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{labels.subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2" aria-live="polite">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                health.level === "healthy"
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : health.level === "attention"
                    ? "bg-amber-500/10 text-amber-800 dark:text-amber-200"
                    : "bg-red-500/10 text-red-700 dark:text-red-300"
              }`}
              aria-label={`${labels.a11y.healthScore}: ${health.score}% ${healthLabel}`}
            >
              <span className="tabular-nums">{health.score}%</span>
              <span aria-hidden>·</span>
              <span>{healthLabel}</span>
            </span>
          </div>
        </div>

        <div className="relative">
          <label className="sr-only" htmlFor="company-admin-search">
            {labels.search.placeholder}
          </label>
          <input
            id="company-admin-search"
            value={globalQuery}
            onChange={(e) => setGlobalQuery(e.target.value)}
            placeholder={labels.search.placeholder}
            className="h-12 w-full rounded-2xl border border-border bg-card/80 px-4 text-sm shadow-sm transition placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {deferredQuery ? (
            <p className="mt-2 text-xs text-muted-foreground" role="status">
              {labels.search.results}: {filteredUsers.length + filteredRoles.length + filteredWorkspaces.length + filteredActivity.length + filteredInvites.length}
            </p>
          ) : null}
        </div>
      </header>

      {error ? (
        <Banner tone="error" title={error} onDismiss={() => setError(null)} dismissLabel={labels.messages.dismiss} />
      ) : null}
      {notice ? (
        <Banner tone="success" title={notice} onDismiss={() => setNotice(null)} dismissLabel={labels.messages.dismiss} />
      ) : null}
      {!data.canAdminister ? (
        <Banner tone="warning" title={labels.messages.readOnly} dismissLabel={labels.messages.dismiss} />
      ) : null}
      {noSeats ? (
        <Banner tone="warning" title={labels.messages.noSeats} dismissLabel={labels.messages.dismiss} />
      ) : null}

      <nav
        aria-label={labels.a11y.mainNav}
        className="-mx-4 mb-6 flex gap-1 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        {sections.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSection(item.id)}
            aria-current={section === item.id ? "page" : undefined}
            className={`h-10 shrink-0 rounded-full px-3.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              section === item.id
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {section === "overview" ? (
        <OverviewDashboard
          data={data}
          labels={labels}
          health={health}
          healthLabel={healthLabel}
          security={security}
          usagePct={usagePct}
          todayActivity={todayActivity}
          joiners={joiners}
          disabledCount={disabledCount}
          onOpenSection={setSection}
        />
      ) : null}

      {section === "team" ? (
        <TeamSection
          data={data}
          labels={labels}
          users={filteredUsers}
          invites={filteredInvites}
          query={globalQuery}
          pending={pending}
          selectedUser={selectedUser}
          onSelect={setSelectedUser}
          onOpenWizard={setWizardMode}
          onRun={run}
        />
      ) : null}

      {section === "roles" ? <RolesSection labels={labels} roles={filteredRoles} query={globalQuery} /> : null}

      {section === "seats" ? (
        <SeatsSection
          data={data}
          labels={labels}
          seats={sortedSeats}
          usagePct={usagePct}
          query={globalQuery}
          sort={seatSort}
          onSort={setSeatSort}
        />
      ) : null}

      {section === "workspaces" ? (
        <WorkspacesSection
          data={data}
          labels={labels}
          workspaces={filteredWorkspaces}
          pending={pending}
          onRun={run}
          onOpenWizard={() => setWizardMode("create")}
        />
      ) : null}

      {section === "activity" ? (
        <ActivitySection
          labels={labels}
          groups={groupedActivity}
          onExport={exportActivity}
          onOpenWizard={() => setWizardMode("create")}
        />
      ) : null}

      {section === "logins" ? <LoginsSection data={data} labels={labels} /> : null}
      {section === "security" ? <SecuritySection data={data} labels={labels} security={security} /> : null}
      {section === "settings" ? <SettingsSection data={data} labels={labels} /> : null}

      {data.canAdminister ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 px-4 py-3 backdrop-blur sm:hidden">
          <div className="mx-auto flex max-w-6xl gap-2">
            <button
              type="button"
              disabled={pending || noSeats}
              onClick={() => setWizardMode("invite")}
              className="h-11 flex-1 rounded-2xl border border-border text-sm font-medium disabled:opacity-40"
            >
              {labels.team.inviteUser}
            </button>
            <button
              type="button"
              disabled={pending || noSeats}
              onClick={() => setWizardMode("create")}
              className="h-11 flex-1 rounded-2xl bg-foreground text-sm font-medium text-background disabled:opacity-40"
            >
              {labels.team.addUser}
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-6 hidden gap-2 sm:flex">
        {data.canAdminister ? (
          <>
            <button
              type="button"
              disabled={pending || noSeats}
              onClick={() => setWizardMode("invite")}
              className="h-11 rounded-2xl border border-border px-4 text-sm font-medium transition hover:bg-muted disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {labels.team.inviteUser}
            </button>
            <button
              type="button"
              disabled={pending || noSeats}
              onClick={() => setWizardMode("create")}
              className="h-11 rounded-2xl bg-foreground px-4 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {labels.team.addUser}
            </button>
          </>
        ) : null}
      </div>

      <UserProvisionWizard
        data={data}
        labels={labels}
        mode={wizardMode ?? "create"}
        open={wizardMode != null}
        onClose={() => setWizardMode(null)}
        onDone={(kind) => {
          setWizardMode(null);
          setNotice(
            kind === "invite" ? labels.messages.invitationSent : labels.messages.userCreated,
          );
          router.refresh();
        }}
        onError={(message) => setError(friendlyErrorMessage(message))}
      />
    </div>
  );
}

function OverviewDashboard({
  data,
  labels,
  health,
  healthLabel,
  security,
  usagePct,
  todayActivity,
  joiners,
  disabledCount,
  onOpenSection,
}: {
  data: CompanyAdministrationData;
  labels: CompanyAdministrationLabels;
  health: ReturnType<typeof computeCompanyHealthScore>;
  healthLabel: string;
  security: ReturnType<typeof buildSecurityIssues>;
  usagePct: number;
  todayActivity: number;
  joiners: CompanyAdminUserRow[];
  disabledCount: number;
  onOpenSection: (section: Section) => void;
}) {
  const admin =
    data.companyAdministrators[0]?.fullName ||
    data.companyAdministrators[0]?.email ||
    labels.overview.none;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <PremiumCard title={labels.overview.cardCompany}>
          <dl className="space-y-2.5 text-sm">
            <Row label={labels.overview.companyName} value={data.organizationName} />
            <Row label={labels.overview.companyStatus} value={data.organizationStatus} />
            <Row label={labels.overview.plan} value={data.license?.planName ?? labels.overview.noPlan} />
            <Row label={labels.overview.license} value={data.license?.status ?? "—"} />
            <Row
              label={labels.overview.expiration}
              value={data.license?.endsAt ? relativeTime(data.license.endsAt) : "—"}
            />
            <Row label={labels.overview.administrator} value={admin} />
          </dl>
        </PremiumCard>

        <PremiumCard title={labels.overview.cardSeats}>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <Metric value={data.seats.seatLimit} label={labels.overview.purchasedSeats} />
              <Metric value={data.seats.seatsUsed} label={labels.overview.usedSeats} />
              <Metric value={data.seats.seatsAvailable} label={labels.overview.availableSeats} />
            </div>
            <div>
              <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                <span>{labels.overview.usagePercent}</span>
                <span className="tabular-nums font-medium text-foreground">{usagePct}%</span>
              </div>
              <div
                className="h-2.5 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-valuenow={usagePct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={labels.a11y.seatProgress}
              >
                <div
                  className={`h-full rounded-full transition-all ${
                    usagePct >= 90 ? "bg-amber-500" : usagePct >= 75 ? "bg-foreground/80" : "bg-foreground"
                  }`}
                  style={{ width: `${usagePct}%` }}
                />
              </div>
              {usagePct >= 85 ? (
                <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">{labels.overview.seatsWarning}</p>
              ) : null}
            </div>
            <button type="button" className="text-xs font-medium text-muted-foreground hover:text-foreground" onClick={() => onOpenSection("seats")}>
              {labels.overview.viewAll}
            </button>
          </div>
        </PremiumCard>

        <PremiumCard title={labels.overview.cardUsers}>
          <div className="grid grid-cols-2 gap-3">
            <Metric value={data.activeUserCount} label={labels.overview.activeUsers} />
            <Metric value={disabledCount} label={labels.overview.disabledUsers} />
            <Metric value={data.invitations.length} label={labels.overview.pendingInvitations} />
            <Metric value={joiners.length} label={labels.overview.recentJoiners} />
          </div>
          {joiners.length > 0 ? (
            <ul className="mt-3 space-y-1.5 border-t border-border/60 pt-3">
              {joiners.slice(0, 3).map((user) => (
                <li key={user.userId} className="truncate text-xs text-muted-foreground">
                  {user.fullName || user.email} · {relativeTime(user.createdAt)}
                </li>
              ))}
            </ul>
          ) : null}
        </PremiumCard>

        <PremiumCard title={labels.overview.cardAudit}>
          <div className="grid grid-cols-2 gap-3">
            <Metric value={todayActivity} label={labels.overview.todaysActivity} />
            <Metric value={data.activeEngagementCount} label={labels.overview.openEngagements} />
            <Metric value={data.activity.filter((a) => a.action.includes("approved") || a.action.includes("completed")).length} label={labels.overview.completedReviews} />
            <Metric value={data.activity.length} label={labels.overview.recentChanges} />
          </div>
        </PremiumCard>

        <PremiumCard title={labels.overview.cardSecurity}>
          <div className="mb-3">
            <p className="text-xs text-muted-foreground">{labels.overview.securityStatus}</p>
            <p className="mt-1 text-lg font-semibold">{security.label}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Metric value={Math.max(0, 100 - security.issues.length * 12)} label={labels.overview.securityScore} />
            <Metric value={data.failedLoginCount} label={labels.overview.failedLogins} />
            <Metric value={data.passwordResetCount} label={labels.overview.passwordResets} />
            <Metric value={data.securityEvents.length} label={labels.overview.alerts} />
          </div>
        </PremiumCard>

        <PremiumCard title={labels.overview.cardHealth}>
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">{labels.health.score}</p>
              <p className="mt-1 text-4xl font-semibold tracking-tight tabular-nums">{health.score}%</p>
              <p className="mt-1 text-sm font-medium">{healthLabel}</p>
            </div>
            <HealthRing score={health.score} level={health.level} />
          </div>
          <div className="mt-4 border-t border-border/60 pt-3">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {labels.health.deductions}
            </p>
            {health.deductions.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">{labels.health.noDeductions}</p>
            ) : (
              <ul className="mt-2 space-y-1.5">
                {health.deductions.map((item) => (
                  <li key={item.reason} className="flex items-start justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">{item.reason}</span>
                    <span className="shrink-0 tabular-nums text-foreground">−{item.points}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}

function PremiumCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-border/80 bg-card/70 p-5 shadow-sm backdrop-blur-sm transition hover:border-border">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="max-w-[60%] text-right font-medium">{value}</dd>
    </div>
  );
}

function Metric({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="rounded-2xl bg-muted/40 px-3 py-2.5">
      <p className="text-xl font-semibold tabular-nums tracking-tight">{value}</p>
      <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{label}</p>
    </div>
  );
}

function HealthRing({ score, level }: { score: number; level: string }) {
  const color =
    level === "healthy" ? "stroke-emerald-500" : level === "attention" ? "stroke-amber-500" : "stroke-red-500";
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (score / 100) * circumference;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden className="shrink-0">
      <circle cx="36" cy="36" r="28" className="stroke-muted" strokeWidth="6" fill="none" />
      <circle
        cx="36"
        cy="36"
        r="28"
        className={color}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 36 36)"
      />
    </svg>
  );
}

function TeamSection({
  data,
  labels,
  users,
  invites,
  query,
  pending,
  selectedUser,
  onSelect,
  onOpenWizard,
  onRun,
}: {
  data: CompanyAdministrationData;
  labels: CompanyAdministrationLabels;
  users: CompanyAdminUserRow[];
  invites: CompanyAdministrationData["invitations"];
  query: string;
  pending: boolean;
  selectedUser: CompanyAdminUserRow | null;
  onSelect: (user: CompanyAdminUserRow | null) => void;
  onOpenWizard: (mode: "create" | "invite") => void;
  onRun: (
    action: () => Promise<{ success: boolean; error?: { message: string } }>,
    successMessage: string,
  ) => void;
}) {
  const [roleSlug, setRoleSlug] = useState(data.roles[3]?.slug ?? "member");
  const [workspaceId, setWorkspaceId] = useState(data.workspaces[0]?.id ?? "");

  if (users.length === 0 && invites.length === 0) {
    return (
      <EmptyState
        title={labels.team.empty}
        hint={labels.team.emptyHint}
        actionLabel={data.canAdminister ? labels.team.emptyCta : undefined}
        onAction={data.canAdminister ? () => onOpenWizard("create") : undefined}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{labels.team.heading}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {data.activeUserCount} {labels.team.active.toLowerCase()}
          </p>
        </div>
      </div>

      {invites.length > 0 ? (
        <div className="rounded-3xl border border-border p-4">
          <h3 className="text-sm font-medium">{labels.team.pendingInvites}</h3>
          <ul className="mt-3 space-y-2">
            {invites.map((invite) => (
              <li key={invite.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <div>
                  <p className="font-medium">
                    <Highlighted text={invite.email} query={query} />
                  </p>
                  <p className="text-xs text-muted-foreground">{invite.roleSlug}</p>
                </div>
                {data.canAdminister ? (
                  <ActionChip
                    label={labels.team.revokeInvite}
                    disabled={pending}
                    onClick={() =>
                      onRun(
                        async () => companyRevokeInvitationAction({ invitationId: invite.id }),
                        labels.messages.success,
                      )
                    }
                  />
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid gap-3">
        {users.map((user) => {
          const enabledModules = user.modules.filter((m) => m.state !== "disabled");
          const inactive = user.suspended || user.status === "inactive";
          return (
            <article
              key={user.membershipId}
              className={`rounded-3xl border p-4 transition sm:p-5 ${
                inactive ? "border-amber-500/30 bg-amber-500/[0.04]" : "border-border bg-card/50"
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-foreground text-sm font-semibold text-background"
                  aria-label={`${labels.a11y.userAvatar}: ${user.fullName || user.email}`}
                >
                  {avatarInitials(user.fullName, user.email)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold">
                        <Highlighted text={user.fullName || user.email} query={query} />
                      </h3>
                      <p className="truncate text-sm text-muted-foreground">
                        <Highlighted text={user.email} query={query} />
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                        inactive
                          ? "bg-amber-500/15 text-amber-800 dark:text-amber-200"
                          : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                      }`}
                    >
                      {user.suspended
                        ? labels.team.disabled
                        : user.status === "inactive"
                          ? labels.team.inactive
                          : labels.team.active}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-muted px-2.5 py-1 font-medium text-foreground">
                      {user.roleName}
                    </span>
                    <span className="rounded-full bg-muted px-2.5 py-1">
                      {user.workspaceName || labels.overview.none}
                    </span>
                    <span className="rounded-full bg-muted px-2.5 py-1">
                      {labels.team.lastLogin}:{" "}
                      {user.lastLoginAt ? relativeTime(user.lastLoginAt) : labels.team.neverLoggedIn}
                    </span>
                    <span className="rounded-full bg-muted px-2.5 py-1">
                      {labels.team.memberSince}: {relativeTime(user.createdAt)}
                    </span>
                  </div>

                  <div className="mt-3">
                    <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                      {labels.team.modulesEnabled}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {user.modules.map((module) => (
                        <span
                          key={module.key}
                          title={module.reason}
                          className={`rounded-full px-2.5 py-1 text-[11px] ${
                            module.state === "disabled"
                              ? "bg-muted text-muted-foreground line-through decoration-muted-foreground/50"
                              : "bg-foreground/5 text-foreground"
                          }`}
                        >
                          {module.label}
                        </span>
                      ))}
                    </div>
                    {enabledModules[0] ? (
                      <p className="mt-2 text-xs text-muted-foreground">{enabledModules[0].reason}</p>
                    ) : null}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <ActionChip
                      label={labels.team.viewPermissions}
                      onClick={() => onSelect(selectedUser?.userId === user.userId ? null : user)}
                    />
                    {data.canAdminister ? (
                      <>
                        <ActionChip
                          label={labels.team.resetPassword}
                          disabled={pending}
                          onClick={() =>
                            onRun(
                              async () =>
                                companyResetPasswordAction({ email: user.email, userId: user.userId }),
                              labels.messages.passwordReset,
                            )
                          }
                        />
                        {inactive ? (
                          <ActionChip
                            label={labels.team.enable}
                            disabled={pending}
                            onClick={() =>
                              onRun(
                                async () =>
                                  companyReactivateUserAction({
                                    membershipId: user.membershipId,
                                    userId: user.userId,
                                  }),
                                labels.messages.userEnabled,
                              )
                            }
                          />
                        ) : (
                          <ActionChip
                            label={labels.team.disable}
                            disabled={pending}
                            onClick={() =>
                              onRun(
                                async () =>
                                  companyDisableUserAction({
                                    membershipId: user.membershipId,
                                    userId: user.userId,
                                  }),
                                labels.messages.userDisabled,
                              )
                            }
                          />
                        )}
                        <ActionChip
                          label={labels.team.delete}
                          disabled={pending}
                          onClick={() => {
                            if (!window.confirm(labels.team.confirmDelete)) return;
                            onRun(
                              async () =>
                                companyDeleteUserAction({
                                  membershipId: user.membershipId,
                                  userId: user.userId,
                                }),
                              labels.messages.userRemoved,
                            );
                          }}
                        />
                      </>
                    ) : null}
                  </div>

                  {selectedUser?.userId === user.userId ? (
                    <div className="mt-4 space-y-4 border-t border-border pt-4">
                      <div>
                        <h4 className="text-sm font-medium">{labels.permissions.heading}</h4>
                        <p className="mt-1 text-xs text-muted-foreground">{labels.permissions.readOnly}</p>
                        <ul className="mt-3 space-y-2">
                          {user.modules.map((module) => (
                            <li
                              key={module.key}
                              className="flex items-start justify-between gap-3 rounded-2xl bg-muted/40 px-3 py-2.5"
                            >
                              <div>
                                <p className="text-sm font-medium">{module.label}</p>
                                <p className="mt-0.5 text-xs text-muted-foreground">{module.reason}</p>
                              </div>
                              <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                {module.state === "inherited"
                                  ? labels.wizard.moduleInherited
                                  : module.state === "enabled"
                                    ? labels.wizard.moduleEnabled
                                    : labels.wizard.moduleDisabled}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <ul className="mt-3 grid gap-1 sm:grid-cols-2">
                          {user.permissionCodes.map((code) => (
                            <li key={code} className="rounded-lg bg-muted/50 px-2 py-1 text-xs">
                              <span className="font-medium">{code}</span>
                              <span className="ml-2 text-muted-foreground">
                                {labels.permissions.source}: {user.roleName}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {data.canAdminister ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-2xl border border-border p-3">
                            <p className="mb-2 text-xs font-medium">{labels.team.changeRole}</p>
                            <select
                              value={roleSlug}
                              onChange={(e) => setRoleSlug(e.target.value)}
                              className="h-10 w-full rounded-xl border border-border bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              {data.roles.map((role) => (
                                <option key={role.slug} value={role.slug}>
                                  {role.label}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              disabled={pending}
                              className="mt-2 h-10 w-full rounded-xl bg-foreground text-sm text-background disabled:opacity-40"
                              onClick={() =>
                                onRun(
                                  async () =>
                                    companyChangeRoleAction({
                                      membershipId: user.membershipId,
                                      userId: user.userId,
                                      roleSlug,
                                    }),
                                  labels.messages.roleUpdated,
                                )
                              }
                            >
                              {labels.team.changeRole}
                            </button>
                          </div>
                          <div className="rounded-2xl border border-border p-3">
                            <p className="mb-2 text-xs font-medium">{labels.workspaces.assign}</p>
                            <select
                              value={workspaceId}
                              onChange={(e) => setWorkspaceId(e.target.value)}
                              className="h-10 w-full rounded-xl border border-border bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              {data.workspaces.map((ws) => (
                                <option key={ws.id} value={ws.id}>
                                  {ws.name}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              disabled={pending || !workspaceId}
                              className="mt-2 h-10 w-full rounded-xl border border-border text-sm disabled:opacity-40"
                              onClick={() =>
                                onRun(
                                  async () =>
                                    companyAssignWorkspaceMembershipAction({
                                      userId: user.userId,
                                      workspaceId,
                                      roleSlug,
                                    }),
                                  labels.messages.workspaceAssigned,
                                )
                              }
                            >
                              {labels.workspaces.assign}
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function ActionChip({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-9 min-h-9 items-center rounded-xl border border-border px-3 text-xs font-medium transition hover:bg-muted disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {label}
    </button>
  );
}

function RolesSection({
  labels,
  roles,
  query,
}: {
  labels: CompanyAdministrationLabels;
  roles: CompanyAdministrationData["roles"];
  query: string;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{labels.roles.heading}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{labels.roles.description}</p>
      </div>
      {roles.length === 0 ? (
        <EmptyState title={labels.search.noResults} hint={labels.roles.empty} />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {roles.map((role) => (
              <article key={role.slug} className="rounded-3xl border border-border bg-card/50 p-5">
                <h3 className="text-base font-semibold">
                  <Highlighted text={role.label} query={query} />
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{role.description}</p>
                <p className="mt-3 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  {role.workspaceScope === "company"
                    ? labels.roles.scopeCompany
                    : role.workspaceScope === "workspace"
                      ? labels.roles.scopeWorkspace
                      : labels.roles.scopeEither}
                </p>
                <p className="mt-4 text-xs font-medium text-muted-foreground">
                  {labels.roles.permissions} · {role.permissions.length}
                </p>
                <ul className="mt-2 max-h-36 space-y-1 overflow-y-auto text-xs">
                  {role.permissions.map((permission) => (
                    <li key={permission.code} className="rounded-lg bg-muted/40 px-2 py-1">
                      {permission.name}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
        </div>
      )}
    </div>
  );
}

function SeatsSection({
  data,
  labels,
  seats,
  usagePct,
  query,
  sort,
  onSort,
}: {
  data: CompanyAdministrationData;
  labels: CompanyAdministrationLabels;
  seats: CompanyAdminUserRow[];
  usagePct: number;
  query: string;
  sort: "name" | "login" | "created";
  onSort: (value: "name" | "login" | "created") => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight">{labels.seats.heading}</h2>
      {!data.seats.subscriptionId ? (
        <EmptyState title={labels.seats.none} hint={labels.seats.empty} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Metric value={data.seats.seatLimit} label={labels.seats.purchased} />
            <Metric value={data.seats.seatsUsed} label={labels.seats.used} />
            <Metric value={data.seats.seatsAvailable} label={labels.seats.available} />
            <Metric value={`${usagePct}%`} label={labels.seats.usage} />
          </div>
          <div
            className="h-3 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={usagePct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={labels.a11y.seatProgress}
          >
            <div
              className={`h-full rounded-full ${usagePct >= 90 ? "bg-amber-500" : "bg-foreground"}`}
              style={{ width: `${usagePct}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["name", labels.seats.sortName],
                ["login", labels.seats.sortLogin],
                ["created", labels.seats.sortCreated],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => onSort(value)}
                className={`h-9 rounded-full px-3 text-xs font-medium ${
                  sort === value ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {seats.length === 0 ? (
            <EmptyState title={labels.search.noResults} hint={labels.seats.empty} />
          ) : (
            <ul className="divide-y divide-border overflow-hidden rounded-3xl border border-border">
              {seats.map((user) => {
                const inactive = user.suspended || user.status === "inactive" || !user.lastLoginAt;
                return (
                  <li
                    key={user.membershipId}
                    className={`grid gap-1 px-4 py-3 sm:grid-cols-6 sm:items-center ${
                      inactive ? "bg-amber-500/[0.05]" : ""
                    }`}
                  >
                    <div className="sm:col-span-2">
                      <p className="font-medium">
                        <Highlighted text={user.fullName || user.email} query={query} />
                      </p>
                      {inactive ? (
                        <p className="text-[11px] text-amber-700 dark:text-amber-300">
                          {labels.seats.inactiveHighlight}
                        </p>
                      ) : null}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.roleName}</p>
                    <p className="text-sm text-muted-foreground">{user.workspaceName || "—"}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.lastLoginAt ? relativeTime(user.lastLoginAt) : labels.seats.never}
                    </p>
                    <p className="text-xs text-muted-foreground">{relativeTime(user.createdAt)}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

function WorkspacesSection({
  data,
  labels,
  workspaces,
  pending,
  onRun,
  onOpenWizard,
}: {
  data: CompanyAdministrationData;
  labels: CompanyAdministrationLabels;
  workspaces: CompanyAdministrationData["workspaces"];
  pending: boolean;
  onRun: (
    action: () => Promise<{ success: boolean; error?: { message: string } }>,
    successMessage: string,
  ) => void;
  onOpenWizard: () => void;
}) {
  if (workspaces.length === 0) {
    return (
      <EmptyState
        title={labels.workspaces.empty}
        hint={labels.workspaces.emptyHint}
        actionLabel={data.canAdminister ? labels.team.emptyCta : undefined}
        onAction={data.canAdminister ? onOpenWizard : undefined}
      />
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight">{labels.workspaces.heading}</h2>
      <div className="grid gap-3">
        {workspaces.map((workspace) => {
          const members = data.users.filter((u) => u.workspaces.some((w) => w.id === workspace.id));
          return (
            <article key={workspace.id} className="rounded-3xl border border-border p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{workspace.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {labels.workspaces.members}: {workspace.memberCount}
                  </p>
                </div>
              </div>
              <ul className="mt-3 space-y-2">
                {members.map((user) => {
                  const membership = user.workspaces.find((w) => w.id === workspace.id);
                  if (!membership) return null;
                  return (
                    <li
                      key={`${user.userId}-${workspace.id}`}
                      className="flex flex-col gap-2 rounded-2xl bg-muted/30 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium">{user.fullName || user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {labels.workspaces.role}: {membership.roleSlug}
                        </p>
                      </div>
                      {data.canAdminister ? (
                        <div className="flex flex-wrap gap-1.5">
                          <ActionChip
                            label={labels.workspaces.remove}
                            disabled={pending}
                            onClick={() =>
                              onRun(
                                async () =>
                                  companyRemoveWorkspaceMembershipAction({
                                    membershipId: membership.membershipId,
                                    userId: user.userId,
                                  }),
                                labels.messages.success,
                              )
                            }
                          />
                          {data.workspaces.filter((w) => w.id !== workspace.id).length > 0 ? (
                            <ActionChip
                              label={labels.workspaces.transfer}
                              disabled={pending}
                              onClick={() => {
                                const target = data.workspaces.find((w) => w.id !== workspace.id);
                                if (!target) return;
                                onRun(
                                  async () =>
                                    companyTransferWorkspaceMembershipAction({
                                      membershipId: membership.membershipId,
                                      userId: user.userId,
                                      toWorkspaceId: target.id,
                                      roleSlug: membership.roleSlug,
                                    }),
                                  labels.messages.workspaceAssigned,
                                );
                              }}
                            />
                          ) : null}
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function ActivitySection({
  labels,
  groups,
  onExport,
  onOpenWizard,
}: {
  labels: CompanyAdministrationLabels;
  groups: Record<"today" | "yesterday" | "week" | "earlier", CompanyAdministrationData["activity"]>;
  onExport: () => void;
  onOpenWizard: () => void;
}) {
  const total = groups.today.length + groups.yesterday.length + groups.week.length + groups.earlier.length;
  if (total === 0) {
    return (
      <EmptyState
        title={labels.activity.empty}
        hint={labels.activity.emptyHint}
        actionLabel={labels.team.emptyCta}
        onAction={onOpenWizard}
      />
    );
  }

  const blocks: Array<[keyof typeof groups, string]> = [
    ["today", labels.activity.today],
    ["yesterday", labels.activity.yesterday],
    ["week", labels.activity.lastWeek],
    ["earlier", labels.activity.earlier],
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-tight">{labels.activity.heading}</h2>
        <button
          type="button"
          onClick={onExport}
          className="h-10 rounded-2xl border border-border px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {labels.activity.export}
        </button>
      </div>
      {blocks.map(([key, title]) =>
        groups[key].length === 0 ? null : (
          <section key={key}>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {title}
            </h3>
            <ol className="relative space-y-0 border-l border-border pl-4">
              {groups[key].map((row) => (
                <li key={row.id} className="relative pb-4">
                  <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-foreground" />
                  <p className="text-sm font-medium">{friendlyAction(row.action)}</p>
                  <p className="text-xs text-muted-foreground">
                    {row.actorEmail} · {relativeTime(row.createdAt)}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        ),
      )}
    </div>
  );
}

function LoginsSection({
  data,
  labels,
}: {
  data: CompanyAdministrationData;
  labels: CompanyAdministrationLabels;
}) {
  if (data.loginHistory.length === 0) {
    return <EmptyState title={labels.logins.empty} hint={labels.logins.emptyHint} />;
  }
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight">{labels.logins.heading}</h2>
      <ul className="divide-y divide-border overflow-hidden rounded-3xl border border-border">
        {data.loginHistory.map((row) => (
          <li key={row.id} className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-6 sm:items-center">
            <p className="font-medium sm:col-span-2">{row.actorEmail}</p>
            <p className="text-xs text-muted-foreground sm:text-sm">{friendlyAction(row.action)}</p>
            <p className="text-xs text-muted-foreground">{row.ipAddress}</p>
            <p className="text-xs text-muted-foreground">
              {row.browser} / {row.device}
            </p>
            <p className="text-xs text-muted-foreground">{relativeTime(row.createdAt)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SecuritySection({
  data,
  labels,
  security,
}: {
  data: CompanyAdministrationData;
  labels: CompanyAdministrationLabels;
  security: ReturnType<typeof buildSecurityIssues>;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{labels.security.heading}</h2>
        <p
          className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            security.level === "ok"
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : security.level === "minor"
                ? "bg-amber-500/10 text-amber-800 dark:text-amber-200"
                : "bg-red-500/10 text-red-700 dark:text-red-300"
          }`}
        >
          {security.level === "ok"
            ? labels.security.noAlerts
            : security.level === "minor"
              ? labels.security.minorIssues
              : labels.security.criticalIssues}
        </p>
      </div>

      {security.issues.length === 0 ? (
        <EmptyState title={labels.security.noAlerts} hint={labels.security.empty} />
      ) : (
        <ul className="space-y-2">
          {security.issues.map((issue) => (
            <li key={issue.title} className="rounded-3xl border border-border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{issue.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {labels.security.why}: {issue.detail}
                  </p>
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {issue.severity}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Metric value={data.passwordResetCount} label={labels.security.passwordResets} />
        <Metric value={data.disabledUserCount} label={labels.security.disabledUsers} />
        <Metric value={data.failedLoginCount} label={labels.security.failedLogins} />
      </div>
    </div>
  );
}

function SettingsSection({
  data,
  labels,
}: {
  data: CompanyAdministrationData;
  labels: CompanyAdministrationLabels;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight">{labels.settings.heading}</h2>
      <div className="grid gap-3 lg:grid-cols-2">
        <PremiumCard title={labels.settings.general}>
          <dl className="space-y-2 text-sm">
            <Row label={labels.overview.companyName} value={data.organizationName} />
            <Row label={labels.settings.companyStatus} value={data.organizationStatus} />
          </dl>
        </PremiumCard>
        <PremiumCard title={labels.settings.administrator}>
          <ul className="space-y-1 text-sm">
            {data.companyAdministrators.length === 0 ? (
              <li className="text-muted-foreground">{labels.overview.none}</li>
            ) : (
              data.companyAdministrators.map((admin) => (
                <li key={admin.userId}>{admin.fullName || admin.email}</li>
              ))
            )}
          </ul>
        </PremiumCard>
        <PremiumCard title={labels.settings.licenseSummary}>
          <dl className="space-y-2 text-sm">
            <Row label={labels.overview.plan} value={data.license?.planName ?? labels.overview.noPlan} />
            <Row
              label={labels.overview.expiration}
              value={data.license?.endsAt ? relativeTime(data.license.endsAt) : "—"}
            />
          </dl>
        </PremiumCard>
        <PremiumCard title={labels.settings.seatSummary}>
          <dl className="space-y-2 text-sm">
            <Row label={labels.seats.purchased} value={String(data.seats.seatLimit)} />
            <Row label={labels.seats.used} value={String(data.seats.seatsUsed)} />
            <Row label={labels.seats.available} value={String(data.seats.seatsAvailable)} />
          </dl>
        </PremiumCard>
      </div>
      <section className="rounded-3xl border border-destructive/20 bg-destructive/5 p-5">
        <h3 className="text-sm font-semibold text-destructive">{labels.settings.dangerZone}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{labels.settings.dangerHint}</p>
      </section>
    </div>
  );
}
