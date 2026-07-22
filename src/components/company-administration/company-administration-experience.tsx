"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { CompanyAdministrationData, CompanyAdminUserRow } from "@/lib/company-administration/load-company-administration";
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

function formatDate(value: string | null): string {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function formatShortDate(value: string | null): string {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return value;
  }
}

function friendlyAction(action: string): string {
  return action
    .replace(/^auth\./, "")
    .replace(/^membership\./, "")
    .replace(/\./g, " ")
    .replace(/_/g, " ");
}

export function CompanyAdministrationExperience({ data, labels }: Props) {
  const router = useRouter();
  const [section, setSection] = useState<Section>("overview");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [wizardMode, setWizardMode] = useState<"create" | "invite" | null>(null);
  const [selectedUser, setSelectedUser] = useState<CompanyAdminUserRow | null>(null);
  const [teamQuery, setTeamQuery] = useState("");
  const [activityQuery, setActivityQuery] = useState("");
  const [activityFilter, setActivityFilter] = useState<"all" | "user" | "action">("all");

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
    const q = teamQuery.trim().toLowerCase();
    if (!q) return data.users;
    return data.users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        u.fullName.toLowerCase().includes(q) ||
        u.roleName.toLowerCase().includes(q),
    );
  }, [data.users, teamQuery]);

  const filteredActivity = useMemo(() => {
    const q = activityQuery.trim().toLowerCase();
    return data.activity.filter((row) => {
      if (!q) return true;
      if (activityFilter === "user") return row.actorEmail.toLowerCase().includes(q);
      if (activityFilter === "action") return row.action.toLowerCase().includes(q);
      return (
        row.actorEmail.toLowerCase().includes(q) ||
        row.action.toLowerCase().includes(q) ||
        row.resourceType.toLowerCase().includes(q)
      );
    });
  }, [activityFilter, activityQuery, data.activity]);

  function run(action: () => Promise<{ success: boolean; error?: { message: string } }>) {
    setError(null);
    setNotice(null);
    startTransition(async () => {
      const result = await action();
      if (!result.success) {
        setError(result.error?.message ?? labels.messages.forbidden);
        return;
      }
      setNotice(labels.messages.success);
      setSelectedUser(null);
      router.refresh();
    });
  }

  function exportActivity() {
    const rows = [
      ["When", "User", "Action", "Type"],
      ...filteredActivity.map((row) => [
        row.createdAt,
        row.actorEmail,
        row.action,
        row.resourceType,
      ]),
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
    data.health === "healthy"
      ? labels.health.healthy
      : data.health === "attention"
        ? labels.health.attention
        : labels.health.critical;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6 flex flex-col gap-4 border-b border-border pb-6 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {labels.navAdministration}
          </p>
          <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">
            {data.organizationName}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">{labels.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
              data.health === "healthy"
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : data.health === "attention"
                  ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                  : "bg-red-500/10 text-red-700 dark:text-red-300"
            }`}
          >
            {labels.health.label}: {healthLabel}
          </span>
          {data.canAdminister ? (
            <>
              <button
                type="button"
                disabled={pending || (data.seats.subscriptionId != null && data.seats.seatsAvailable <= 0)}
                onClick={() => setWizardMode("invite")}
                className="h-10 rounded-xl border border-border px-3 text-sm disabled:opacity-40"
              >
                {labels.team.inviteUser}
              </button>
              <button
                type="button"
                disabled={pending || (data.seats.subscriptionId != null && data.seats.seatsAvailable <= 0)}
                onClick={() => setWizardMode("create")}
                className="h-10 rounded-xl bg-foreground px-3 text-sm text-background disabled:opacity-40"
              >
                {labels.team.addUser}
              </button>
            </>
          ) : null}
        </div>
      </header>

      {error ? (
        <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}
      {notice ? (
        <div className="mb-4 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm">{notice}</div>
      ) : null}
      {!data.canAdminister ? (
        <div className="mb-4 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          {labels.messages.readOnly}
        </div>
      ) : null}
      {data.seats.subscriptionId && data.seats.seatsAvailable <= 0 ? (
        <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
          {labels.messages.noSeats}
        </div>
      ) : null}

      <nav
        aria-label={labels.navAdministration}
        className="-mx-4 mb-6 flex gap-1 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        {sections.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSection(item.id)}
            className={`h-10 shrink-0 rounded-full px-3 text-sm transition ${
              section === item.id
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {section === "overview" ? (
        <OverviewPanel
          data={data}
          labels={labels}
          onOpenSection={setSection}
        />
      ) : null}

      {section === "team" ? (
        <TeamPanel
          data={data}
          labels={labels}
          users={filteredUsers}
          query={teamQuery}
          onQuery={setTeamQuery}
          pending={pending}
          selectedUser={selectedUser}
          onSelect={setSelectedUser}
          onOpenWizard={setWizardMode}
          onRun={run}
        />
      ) : null}

      {section === "roles" ? <RolesPanel data={data} labels={labels} /> : null}
      {section === "seats" ? <SeatsPanel data={data} labels={labels} /> : null}
      {section === "workspaces" ? (
        <WorkspacesPanel data={data} labels={labels} pending={pending} onRun={run} />
      ) : null}
      {section === "activity" ? (
        <ActivityPanel
          labels={labels}
          rows={filteredActivity}
          query={activityQuery}
          filter={activityFilter}
          onQuery={setActivityQuery}
          onFilter={setActivityFilter}
          onExport={exportActivity}
        />
      ) : null}
      {section === "logins" ? <LoginsPanel data={data} labels={labels} /> : null}
      {section === "security" ? <SecurityPanel data={data} labels={labels} /> : null}
      {section === "settings" ? <SettingsPanel data={data} labels={labels} /> : null}

      <UserProvisionWizard
        data={data}
        labels={labels}
        mode={wizardMode ?? "create"}
        open={wizardMode != null}
        onClose={() => setWizardMode(null)}
        onDone={() => {
          setWizardMode(null);
          setNotice(labels.messages.success);
          router.refresh();
        }}
        onError={setError}
      />
    </div>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function OverviewPanel({
  data,
  labels,
  onOpenSection,
}: {
  data: CompanyAdministrationData;
  labels: CompanyAdministrationLabels;
  onOpenSection: (section: Section) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-gradient-to-br from-muted/50 via-background to-background p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{labels.overview.companyName}</p>
            <h2 className="mt-1 text-xl font-semibold">{data.organizationName}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {labels.overview.companyStatus}: {data.organizationStatus}
            </p>
          </div>
          <div className="text-sm">
            <p className="text-muted-foreground">{labels.overview.plan}</p>
            <p className="mt-1 font-medium">
              {data.license ? data.license.planName : labels.overview.noPlan}
            </p>
            <p className="mt-1 text-muted-foreground">
              {labels.overview.expiration}:{" "}
              {data.license?.endsAt ? formatShortDate(data.license.endsAt) : "—"}
            </p>
          </div>
        </div>
        <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
          {data.healthReasons.map((reason) => (
            <li key={reason}>• {reason}</li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label={labels.overview.purchasedSeats} value={data.seats.seatLimit} />
        <StatCard label={labels.overview.usedSeats} value={data.seats.seatsUsed} />
        <StatCard label={labels.overview.availableSeats} value={data.seats.seatsAvailable} />
        <StatCard label={labels.overview.activeUsers} value={data.activeUserCount} />
        <StatCard label={labels.overview.activeAudits} value={data.activeEngagementCount} />
        <StatCard label={labels.overview.workspaces} value={data.workspaceCount} />
        <StatCard
          label={labels.overview.administrators}
          value={data.companyAdministrators.length}
          hint={data.companyAdministrators.map((a) => a.email).join(", ") || labels.overview.none}
        />
        <StatCard
          label={labels.overview.securityStatus}
          value={data.securityEvents.filter((e) => e.severity === "critical").length === 0 ? "OK" : "!"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium">{labels.overview.recentActivity}</h3>
            <button type="button" className="text-xs text-muted-foreground" onClick={() => onOpenSection("activity")}>
              {labels.overview.viewAll}
            </button>
          </div>
          {data.activity.length === 0 ? (
            <p className="text-sm text-muted-foreground">{labels.overview.none}</p>
          ) : (
            <ul className="space-y-2">
              {data.activity.slice(0, 5).map((row) => (
                <li key={row.id} className="flex items-start justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{friendlyAction(row.action)}</p>
                    <p className="truncate text-xs text-muted-foreground">{row.actorEmail}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatShortDate(row.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-2xl border border-border p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium">{labels.overview.recentLogins}</h3>
            <button type="button" className="text-xs text-muted-foreground" onClick={() => onOpenSection("logins")}>
              {labels.overview.viewAll}
            </button>
          </div>
          {data.loginHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">{labels.overview.none}</p>
          ) : (
            <ul className="space-y-2">
              {data.loginHistory.slice(0, 5).map((row) => (
                <li key={row.id} className="flex items-start justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{row.actorEmail}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {row.browser} · {row.device}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatShortDate(row.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function TeamPanel({
  data,
  labels,
  users,
  query,
  onQuery,
  pending,
  selectedUser,
  onSelect,
  onOpenWizard,
  onRun,
}: {
  data: CompanyAdministrationData;
  labels: CompanyAdministrationLabels;
  users: CompanyAdminUserRow[];
  query: string;
  onQuery: (value: string) => void;
  pending: boolean;
  selectedUser: CompanyAdminUserRow | null;
  onSelect: (user: CompanyAdminUserRow | null) => void;
  onOpenWizard: (mode: "create" | "invite") => void;
  onRun: (action: () => Promise<{ success: boolean; error?: { message: string } }>) => void;
}) {
  const [roleSlug, setRoleSlug] = useState(data.roles[3]?.slug ?? "member");
  const [workspaceId, setWorkspaceId] = useState(data.workspaces[0]?.id ?? "");

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">{labels.team.heading}</h2>
          <p className="text-sm text-muted-foreground">
            {data.activeUserCount} / {data.seats.seatLimit || "—"}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={labels.team.search}
            className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm sm:w-64"
          />
          {data.canAdminister ? (
            <div className="flex gap-2">
              <button
                type="button"
                className="h-10 flex-1 rounded-xl border border-border px-3 text-sm sm:flex-none"
                onClick={() => onOpenWizard("invite")}
              >
                {labels.team.inviteUser}
              </button>
              <button
                type="button"
                className="h-10 flex-1 rounded-xl bg-foreground px-3 text-sm text-background sm:flex-none"
                onClick={() => onOpenWizard("create")}
              >
                {labels.team.addUser}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {data.invitations.length > 0 ? (
        <div className="rounded-2xl border border-border p-4">
          <h3 className="mb-3 text-sm font-medium">{labels.team.pendingInvites}</h3>
          <ul className="space-y-2">
            {data.invitations.map((invite) => (
              <li key={invite.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <div>
                  <p className="font-medium">{invite.email}</p>
                  <p className="text-xs text-muted-foreground">{invite.roleSlug}</p>
                </div>
                {data.canAdminister ? (
                  <button
                    type="button"
                    disabled={pending}
                    className="h-8 rounded-lg border border-border px-2 text-xs"
                    onClick={() =>
                      onRun(async () => companyRevokeInvitationAction({ invitationId: invite.id }))
                    }
                  >
                    {labels.team.revokeInvite}
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {users.length === 0 ? (
        <p className="text-sm text-muted-foreground">{labels.team.empty}</p>
      ) : (
        <div className="grid gap-3">
          {users.map((user) => (
            <article key={user.membershipId} className="rounded-2xl border border-border p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate font-medium">{user.fullName || user.email}</p>
                  <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-muted px-2 py-1">{user.roleName}</span>
                    <span className="rounded-full bg-muted px-2 py-1">
                      {user.suspended
                        ? labels.team.disabled
                        : user.status === "inactive"
                          ? labels.team.inactive
                          : labels.team.active}
                    </span>
                    {user.workspaceName ? (
                      <span className="rounded-full bg-muted px-2 py-1">{user.workspaceName}</span>
                    ) : null}
                  </div>
                </div>
                {data.canAdminister ? (
                  <div className="flex flex-wrap gap-1.5">
                    <ActionChip
                      label={labels.team.viewPermissions}
                      onClick={() => onSelect(selectedUser?.userId === user.userId ? null : user)}
                    />
                    <ActionChip
                      label={labels.team.resetPassword}
                      disabled={pending}
                      onClick={() =>
                        onRun(async () =>
                          companyResetPasswordAction({ email: user.email, userId: user.userId }),
                        )
                      }
                    />
                    {user.suspended || user.status === "inactive" ? (
                      <ActionChip
                        label={labels.team.enable}
                        disabled={pending}
                        onClick={() =>
                          onRun(async () =>
                            companyReactivateUserAction({
                              membershipId: user.membershipId,
                              userId: user.userId,
                            }),
                          )
                        }
                      />
                    ) : (
                      <ActionChip
                        label={labels.team.disable}
                        disabled={pending}
                        onClick={() =>
                          onRun(async () =>
                            companyDisableUserAction({
                              membershipId: user.membershipId,
                              userId: user.userId,
                            }),
                          )
                        }
                      />
                    )}
                    <ActionChip
                      label={labels.team.delete}
                      disabled={pending}
                      onClick={() => {
                        if (!window.confirm(labels.team.confirmDelete)) return;
                        onRun(async () =>
                          companyDeleteUserAction({
                            membershipId: user.membershipId,
                            userId: user.userId,
                          }),
                        );
                      }}
                    />
                  </div>
                ) : (
                  <ActionChip
                    label={labels.team.viewPermissions}
                    onClick={() => onSelect(selectedUser?.userId === user.userId ? null : user)}
                  />
                )}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {user.modules.map((module) => (
                  <div key={module.key} className="rounded-xl bg-muted/40 px-3 py-2">
                    <p className="text-xs font-medium">{module.label}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {module.state === "inherited"
                        ? labels.wizard.moduleInherited
                        : module.state === "enabled"
                          ? labels.wizard.moduleEnabled
                          : labels.wizard.moduleDisabled}
                    </p>
                  </div>
                ))}
              </div>

              {selectedUser?.userId === user.userId ? (
                <div className="mt-4 space-y-4 border-t border-border pt-4">
                  <div>
                    <h4 className="text-sm font-medium">{labels.permissions.heading}</h4>
                    <p className="mt-1 text-xs text-muted-foreground">{labels.permissions.readOnly}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {labels.permissions.inheritedRole}: {user.roleName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {labels.permissions.workspace}:{" "}
                      {user.workspaces.map((w) => w.name).join(", ") || "—"}
                    </p>
                    {user.permissionCodes.length === 0 ? (
                      <p className="mt-2 text-sm text-muted-foreground">{labels.permissions.empty}</p>
                    ) : (
                      <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                        {user.permissionCodes.map((code) => (
                          <li key={code} className="rounded-lg bg-muted/50 px-2 py-1 text-xs">
                            <span className="font-medium">{code}</span>
                            <span className="ml-2 text-muted-foreground">
                              {labels.permissions.source}: {user.roleName}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {data.canAdminister ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-border p-3">
                        <p className="mb-2 text-xs font-medium">{labels.team.changeRole}</p>
                        <select
                          value={roleSlug}
                          onChange={(e) => setRoleSlug(e.target.value)}
                          className="h-10 w-full rounded-lg border border-border bg-background px-2 text-sm"
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
                          className="mt-2 h-9 w-full rounded-lg bg-foreground text-sm text-background disabled:opacity-40"
                          onClick={() =>
                            onRun(async () =>
                              companyChangeRoleAction({
                                membershipId: user.membershipId,
                                userId: user.userId,
                                roleSlug,
                              }),
                            )
                          }
                        >
                          {labels.team.changeRole}
                        </button>
                      </div>
                      <div className="rounded-xl border border-border p-3">
                        <p className="mb-2 text-xs font-medium">{labels.workspaces.assign}</p>
                        <select
                          value={workspaceId}
                          onChange={(e) => setWorkspaceId(e.target.value)}
                          className="h-10 w-full rounded-lg border border-border bg-background px-2 text-sm"
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
                          className="mt-2 h-9 w-full rounded-lg border border-border text-sm disabled:opacity-40"
                          onClick={() =>
                            onRun(async () =>
                              companyAssignWorkspaceMembershipAction({
                                userId: user.userId,
                                workspaceId,
                                roleSlug,
                              }),
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
            </article>
          ))}
        </div>
      )}
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
      className="inline-flex h-8 items-center rounded-lg border border-border px-2.5 text-xs disabled:opacity-40"
    >
      {label}
    </button>
  );
}

function RolesPanel({
  data,
  labels,
}: {
  data: CompanyAdministrationData;
  labels: CompanyAdministrationLabels;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{labels.roles.heading}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{labels.roles.description}</p>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {data.roles.map((role) => (
          <article key={role.slug} className="rounded-2xl border border-border p-4">
            <h3 className="font-medium">{role.label}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{role.description}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.12em] text-muted-foreground">
              {role.workspaceScope === "company"
                ? labels.roles.scopeCompany
                : role.workspaceScope === "workspace"
                  ? labels.roles.scopeWorkspace
                  : labels.roles.scopeEither}
            </p>
            <h4 className="mt-4 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {labels.roles.permissions}
            </h4>
            {role.permissions.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">{labels.roles.empty}</p>
            ) : (
              <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto text-xs">
                {role.permissions.map((permission) => (
                  <li key={permission.code} className="rounded-lg bg-muted/40 px-2 py-1">
                    {permission.name}
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

function SeatsPanel({
  data,
  labels,
}: {
  data: CompanyAdministrationData;
  labels: CompanyAdministrationLabels;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{labels.seats.heading}</h2>
      {!data.seats.subscriptionId ? (
        <p className="text-sm text-muted-foreground">{labels.seats.none}</p>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <StatCard label={labels.seats.purchased} value={data.seats.seatLimit} />
          <StatCard label={labels.seats.used} value={data.seats.seatsUsed} />
          <StatCard label={labels.seats.available} value={data.seats.seatsAvailable} />
        </div>
      )}
      <div className="overflow-hidden rounded-2xl border border-border">
        <div className="hidden grid-cols-5 gap-2 border-b border-border bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground sm:grid">
          <span>{labels.seats.holder}</span>
          <span>{labels.seats.role}</span>
          <span>{labels.seats.created}</span>
          <span>{labels.seats.status}</span>
          <span>{labels.seats.lastLogin}</span>
        </div>
        <ul className="divide-y divide-border">
          {data.seatHolders.map((user) => (
            <li key={user.membershipId} className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-5 sm:gap-2 sm:items-center">
              <div>
                <p className="font-medium">{user.fullName || user.email}</p>
                <p className="text-xs text-muted-foreground sm:hidden">{user.roleName}</p>
              </div>
              <p className="hidden sm:block">{user.roleName}</p>
              <p className="text-xs text-muted-foreground sm:text-sm">{formatShortDate(user.createdAt)}</p>
              <p className="text-xs sm:text-sm">
                {user.suspended ? labels.team.disabled : labels.team.active}
              </p>
              <p className="text-xs text-muted-foreground sm:text-sm">
                {user.lastLoginAt ? formatDate(user.lastLoginAt) : labels.seats.never}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function WorkspacesPanel({
  data,
  labels,
  pending,
  onRun,
}: {
  data: CompanyAdministrationData;
  labels: CompanyAdministrationLabels;
  pending: boolean;
  onRun: (action: () => Promise<{ success: boolean; error?: { message: string } }>) => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{labels.workspaces.heading}</h2>
      {data.workspaces.length === 0 ? (
        <p className="text-sm text-muted-foreground">{labels.workspaces.empty}</p>
      ) : (
        <div className="grid gap-3">
          {data.workspaces.map((workspace) => {
            const members = data.users.filter((u) =>
              u.workspaces.some((w) => w.id === workspace.id),
            );
            return (
              <article key={workspace.id} className="rounded-2xl border border-border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-medium">{workspace.name}</h3>
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
                        className="flex flex-col gap-2 rounded-xl bg-muted/30 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
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
                                onRun(async () =>
                                  companyRemoveWorkspaceMembershipAction({
                                    membershipId: membership.membershipId,
                                    userId: user.userId,
                                  }),
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
                                  onRun(async () =>
                                    companyTransferWorkspaceMembershipAction({
                                      membershipId: membership.membershipId,
                                      userId: user.userId,
                                      toWorkspaceId: target.id,
                                      roleSlug: membership.roleSlug,
                                    }),
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
      )}
    </div>
  );
}

function ActivityPanel({
  labels,
  rows,
  query,
  filter,
  onQuery,
  onFilter,
  onExport,
}: {
  labels: CompanyAdministrationLabels;
  rows: CompanyAdministrationData["activity"];
  query: string;
  filter: "all" | "user" | "action";
  onQuery: (value: string) => void;
  onFilter: (value: "all" | "user" | "action") => void;
  onExport: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">{labels.activity.heading}</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={labels.activity.search}
            className="h-10 rounded-xl border border-border bg-background px-3 text-sm"
          />
          <select
            value={filter}
            onChange={(e) => onFilter(e.target.value as "all" | "user" | "action")}
            className="h-10 rounded-xl border border-border bg-background px-3 text-sm"
          >
            <option value="all">{labels.activity.filterAll}</option>
            <option value="user">{labels.activity.filterUser}</option>
            <option value="action">{labels.activity.filterAction}</option>
          </select>
          <button
            type="button"
            onClick={onExport}
            className="h-10 rounded-xl border border-border px-3 text-sm"
          >
            {labels.activity.export}
          </button>
        </div>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">{labels.activity.empty}</p>
      ) : (
        <ol className="relative space-y-0 border-l border-border pl-4">
          {rows.map((row) => (
            <li key={row.id} className="relative pb-4">
              <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-foreground" />
              <p className="text-sm font-medium">{friendlyAction(row.action)}</p>
              <p className="text-xs text-muted-foreground">
                {row.actorEmail} · {formatDate(row.createdAt)}
              </p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function LoginsPanel({
  data,
  labels,
}: {
  data: CompanyAdministrationData;
  labels: CompanyAdministrationLabels;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{labels.logins.heading}</h2>
      {data.loginHistory.length === 0 ? (
        <p className="text-sm text-muted-foreground">{labels.logins.empty}</p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
          {data.loginHistory.map((row) => (
            <li key={row.id} className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-6 sm:items-center">
              <p className="font-medium sm:col-span-2">{row.actorEmail}</p>
              <p className="text-xs text-muted-foreground sm:text-sm">{friendlyAction(row.action)}</p>
              <p className="text-xs text-muted-foreground">{row.ipAddress}</p>
              <p className="text-xs text-muted-foreground">
                {row.browser} / {row.device}
              </p>
              <p className="text-xs text-muted-foreground">{formatShortDate(row.createdAt)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SecurityPanel({
  data,
  labels,
}: {
  data: CompanyAdministrationData;
  labels: CompanyAdministrationLabels;
}) {
  const forceLogout = data.securityEvents.filter((e) =>
    e.eventCode.toLowerCase().includes("logout") || e.eventCode.toLowerCase().includes("session"),
  );
  const suspicious = data.securityEvents.filter(
    (e) => e.severity === "warning" || e.severity === "critical",
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{labels.security.heading}</h2>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard label={labels.security.passwordResets} value={data.passwordResetCount} />
        <StatCard label={labels.security.disabledUsers} value={data.disabledUserCount} />
        <StatCard label={labels.security.failedLogins} value={data.failedLoginCount} />
        <StatCard label={labels.security.forceLogout} value={forceLogout.length} />
        <StatCard label={labels.security.alerts} value={data.securityEvents.length} />
        <StatCard label={labels.security.suspicious} value={suspicious.length} />
      </div>
      {data.securityEvents.length === 0 ? (
        <p className="text-sm text-muted-foreground">{labels.security.empty}</p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
          {data.securityEvents.map((event) => (
            <li key={event.id} className="flex flex-col gap-1 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{friendlyAction(event.eventCode)}</p>
                <p className="text-xs text-muted-foreground">{event.actorEmail}</p>
              </div>
              <div className="text-xs text-muted-foreground">
                {event.severity} · {formatDate(event.createdAt)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SettingsPanel({
  data,
  labels,
}: {
  data: CompanyAdministrationData;
  labels: CompanyAdministrationLabels;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{labels.settings.heading}</h2>
      <div className="grid gap-3 lg:grid-cols-2">
        <section className="rounded-2xl border border-border p-4">
          <h3 className="text-sm font-medium">{labels.settings.general}</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{labels.overview.companyName}</dt>
              <dd>{data.organizationName}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{labels.settings.companyStatus}</dt>
              <dd>{data.organizationStatus}</dd>
            </div>
          </dl>
        </section>
        <section className="rounded-2xl border border-border p-4">
          <h3 className="text-sm font-medium">{labels.settings.administrator}</h3>
          <ul className="mt-3 space-y-1 text-sm">
            {data.companyAdministrators.length === 0 ? (
              <li className="text-muted-foreground">{labels.overview.none}</li>
            ) : (
              data.companyAdministrators.map((admin) => (
                <li key={admin.userId}>{admin.fullName || admin.email}</li>
              ))
            )}
          </ul>
        </section>
        <section className="rounded-2xl border border-border p-4">
          <h3 className="text-sm font-medium">{labels.settings.licenseSummary}</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{labels.overview.plan}</dt>
              <dd>{data.license?.planName ?? labels.overview.noPlan}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{labels.overview.expiration}</dt>
              <dd>{data.license?.endsAt ? formatShortDate(data.license.endsAt) : "—"}</dd>
            </div>
          </dl>
        </section>
        <section className="rounded-2xl border border-border p-4">
          <h3 className="text-sm font-medium">{labels.settings.seatSummary}</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{labels.seats.purchased}</dt>
              <dd>{data.seats.seatLimit}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{labels.seats.used}</dt>
              <dd>{data.seats.seatsUsed}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{labels.seats.available}</dt>
              <dd>{data.seats.seatsAvailable}</dd>
            </div>
          </dl>
        </section>
      </div>
      <section className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
        <h3 className="text-sm font-medium text-destructive">{labels.settings.dangerZone}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{labels.settings.dangerHint}</p>
      </section>
    </div>
  );
}
