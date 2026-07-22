"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard, DataTable, PlatformSection } from "@/components/platform-console/platform-primitives";
import { Timeline } from "@/components/platform-console/timeline";
import { useActionRunner } from "@/components/platform-console/managers/use-action-runner";
import { ASSIGNABLE_ROLE_OPTIONS } from "@/config/platform-options";
import { downloadCsv, downloadJson, timestampedName } from "@/lib/platform-console/export-utils";
import { usePlatformLabels } from "@/i18n/use-platform-labels";
import { fillPlatform } from "@/i18n/platform-labels";
import type { CompanyDetail } from "@/lib/platform-console/detail-data";
import {
  createUserAction,
  sendInvitationAction,
  suspendUserAction,
  activateUserAction,
  deleteUserAction,
  resetPasswordAction,
  forceLogoutAction,
  assignCompanyAdminAction,
  transferUserAction,
} from "@/lib/platform-console/actions/users";
import {
  suspendTenantAction,
  activateTenantAction,
  archiveTenantAction,
  restoreTenantAction,
  deleteTenantAction,
} from "@/lib/platform-console/actions/organizations";
import { updateSubscriptionAction } from "@/lib/platform-console/actions/subscriptions";
import {
  LICENSE_DURATION_OPTIONS,
  computeEndsAtFromDuration,
  resolveTenantDisplayStatus,
  daysUntil,
  expirationWarningKey,
} from "@/lib/platform-console/tenant-lifecycle";

function fmt(value: string | null): string {
  return value ? new Date(value).toLocaleString() : "—";
}

export function CompanyDetail({
  company,
  organizations,
  basePath,
}: {
  company: CompanyDetail;
  organizations: { id: string; name: string }[];
  basePath: string;
}) {
  const t = usePlatformLabels();
  const { run, pendingId } = useActionRunner();

  return (
    <Tabs defaultValue="overview">
      <TabsList className="flex w-full flex-nowrap gap-1 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
        <TabsTrigger value="overview" className="min-h-11 shrink-0">{t.companyDetail.tabs.overview}</TabsTrigger>
        <TabsTrigger value="users" className="min-h-11 shrink-0">
          {fillPlatform(t.companyDetail.tabs.users, { count: company.members.length })}
        </TabsTrigger>
        <TabsTrigger value="subscription" className="min-h-11 shrink-0">{t.companyDetail.tabs.subscription}</TabsTrigger>
        <TabsTrigger value="activity" className="min-h-11 shrink-0">{t.companyDetail.tabs.activity}</TabsTrigger>
        <TabsTrigger value="security" className="min-h-11 shrink-0">{t.companyDetail.tabs.security}</TabsTrigger>
        <TabsTrigger value="settings" className="min-h-11 shrink-0">{t.companyDetail.tabs.settings}</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <OverviewTab company={company} />
      </TabsContent>

      <TabsContent value="users">
        <UsersTab company={company} organizations={organizations} basePath={basePath} run={run} pendingId={pendingId} />
      </TabsContent>

      <TabsContent value="subscription">
        <SubscriptionTab company={company} />
      </TabsContent>

      <TabsContent value="activity">
        <ActivityTab company={company} />
      </TabsContent>

      <TabsContent value="security">
        <SecurityTab company={company} />
      </TabsContent>

      <TabsContent value="settings">
        <SettingsTab company={company} run={run} pendingId={pendingId} />
      </TabsContent>
    </Tabs>
  );
}

function OverviewTab({ company }: { company: CompanyDetail }) {
  const t = usePlatformLabels();
  const [showStructure, setShowStructure] = useState(false);
  const displayStatus = resolveTenantDisplayStatus({
    orgStatus: company.status,
    licenseStatus: company.license.status,
    endsAt: company.license.endsAt,
  });
  const remaining = daysUntil(company.license.endsAt);
  const warnKey = expirationWarningKey(remaining);
  const warnText =
    warnKey && t.entityManager.warnings[warnKey as keyof typeof t.entityManager.warnings]
      ? fillPlatform(t.entityManager.warnings[warnKey as keyof typeof t.entityManager.warnings], {
          days: Math.abs(remaining ?? 0),
        })
      : null;

  return (
    <div className="space-y-8">
      {warnText ? (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
          {warnText}
        </p>
      ) : null}
      <PlatformSection title={t.companyDetail.overview.company}>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard
            label={t.companyDetail.overview.status}
            value={t.entityManager.status[displayStatus] ?? displayStatus}
            tone={displayStatus === "active" ? "ok" : "warn"}
          />
          <StatCard label={t.companyDetail.overview.type} value={company.tenantType} />
          <StatCard
            label={t.companyDetail.overview.administrator}
            value={
              company.administrator
                ? company.administrator.fullName || company.administrator.email
                : t.common.none
            }
          />
          <StatCard label={t.companyDetail.overview.activeUsers} value={company.activeUsers.toLocaleString()} />
          <StatCard label={t.companyDetail.overview.workspaces} value={company.workspaces.length.toLocaleString()} />
          <StatCard label={t.companyDetail.overview.engagements} value={company.engagements.length.toLocaleString()} />
          <StatCard label={t.companyDetail.overview.modulesOn} value={company.modules.filter((m) => m.state === "enabled").length.toLocaleString()} />
          <StatCard
            label={t.companyDetail.overview.security}
            value={company.security.riskEvents > 0 ? fillPlatform(t.companyDetail.overview.riskSuffix, { count: company.security.riskEvents }) : t.companyDetail.overview.clear}
            tone={company.security.riskEvents > 0 ? "warn" : "ok"}
          />
        </div>
      </PlatformSection>

      <PlatformSection title={t.companyDetail.overview.licenseSeats}>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label={t.companyDetail.overview.plan} value={company.license.planCode ?? t.common.none} />
          <StatCard label={t.companyDetail.overview.seatsPurchased} value={company.license.seatLimit.toLocaleString()} />
          <StatCard label={t.companyDetail.overview.seatsUsed} value={company.license.seatsUsed.toLocaleString()} />
          <StatCard
            label={t.companyDetail.overview.seatsAvailable}
            value={company.license.seatsAvailable.toLocaleString()}
            tone={company.license.seatsAvailable === 0 ? "warn" : "ok"}
          />
          <StatCard label={t.companyDetail.overview.licenseStatus} value={company.license.status ?? "—"} />
          <StatCard label={t.companyDetail.overview.expiration} value={company.license.endsAt ? new Date(company.license.endsAt).toLocaleDateString() : t.common.perpetual} />
        </div>
      </PlatformSection>

      <PlatformSection title={t.companyDetail.overview.details}>
        <div className="grid gap-x-8 gap-y-3 rounded-xl border border-border/60 p-4 text-sm md:grid-cols-2">
          <Field label={t.companyDetail.overview.legalName} value={company.legalName ?? "—"} />
          <Field label={t.companyDetail.overview.slug} value={company.slug} />
          <Field label={t.companyDetail.overview.created} value={fmt(company.createdAt)} />
          <Field label={t.companyDetail.overview.createdBy} value={company.createdByEmail ?? "—"} />
          <Field label={t.companyDetail.overview.platformManaged} value={company.platformManaged ? t.common.yes : t.common.no} />
          <Field label={t.companyDetail.overview.description} value={company.description ?? "—"} />
        </div>
      </PlatformSection>

      <div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="mb-3 min-h-11"
          onClick={() => setShowStructure((v) => !v)}
        >
          {showStructure ? t.ux.hideAdvanced : t.ux.structure}
        </Button>
        {showStructure ? (
          <div className="space-y-6">
            <PlatformSection title={fillPlatform(t.companyDetail.tabs.organizations, { count: company.clients.length })}>
              <DataTable
                columns={[t.companyDetail.organizations.colOrganization, t.companyDetail.organizations.colWorkspace, t.companyDetail.organizations.colStatus]}
                empty={t.companyDetail.organizations.empty}
                rows={company.clients.map((c) => [
                  <span key="n" className="font-medium text-foreground">{c.name}</span>,
                  c.workspaceName ?? "—",
                  <Badge key="s" variant="secondary">{c.status}</Badge>,
                ])}
              />
            </PlatformSection>
            <PlatformSection title={fillPlatform(t.companyDetail.tabs.workspaces, { count: company.workspaces.length })}>
              <DataTable
                columns={[t.companyDetail.workspaces.colWorkspace, t.companyDetail.workspaces.colMembers, t.companyDetail.workspaces.colStatus, t.companyDetail.workspaces.colCreated]}
                empty={t.companyDetail.workspaces.empty}
                rows={company.workspaces.map((w) => [
                  <span key="n" className="font-medium text-foreground">{w.name}</span>,
                  w.members.toLocaleString(),
                  <Badge key="s" variant="secondary">{w.status}</Badge>,
                  fmt(w.createdAt),
                ])}
              />
            </PlatformSection>
            <PlatformSection title={fillPlatform(t.companyDetail.tabs.engagements, { count: company.engagements.length })}>
              <DataTable
                columns={[t.companyDetail.engagements.colEngagement, t.companyDetail.engagements.colClient, t.companyDetail.engagements.colType, t.companyDetail.engagements.colStatus, t.companyDetail.engagements.colUpdated]}
                empty={t.companyDetail.engagements.empty}
                rows={company.engagements.map((e) => [
                  <span key="n" className="font-medium text-foreground">{e.name}</span>,
                  e.clientName,
                  <span key="t" className="capitalize">{e.type.replace(/_/g, " ")}</span>,
                  <Badge key="s" variant="secondary">{e.status}</Badge>,
                  fmt(e.updatedAt),
                ])}
              />
            </PlatformSection>
          </div>
        ) : null}
      </div>

      <PlatformSection title={t.companyDetail.overview.recentTimeline}>
        <Timeline events={company.timeline.slice(0, 25)} empty={t.companyDetail.overview.timelineEmpty} emptyTitle={t.timeline.noEventsTitle} />
      </PlatformSection>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );
}

type Runner = ReturnType<typeof useActionRunner>["run"];

function UsersTab({
  company,
  organizations,
  basePath,
  run,
  pendingId,
}: {
  company: CompanyDetail;
  organizations: { id: string; name: string }[];
  basePath: string;
  run: Runner;
  pendingId: string | null;
}) {
  const t = usePlatformLabels();
  const [createOpen, setCreateOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [transferUser, setTransferUser] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-end gap-2">
        <Button size="sm" variant="outline" onClick={() => setInviteOpen(true)}>{t.companyDetail.users.invite}</Button>
        <Button size="sm" onClick={() => setCreateOpen(true)}>{t.companyDetail.users.createUser}</Button>
      </div>

      {company.members.length === 0 ? (
        <EmptyState title={t.companyDetail.users.emptyTitle} description={t.companyDetail.users.emptyDescription} />
      ) : (
        <>
          <div className="space-y-3 lg:hidden">
            {company.members.map((m) => {
              const busy = pendingId?.startsWith(m.userId) ?? false;
              const avatar = (m.fullName || m.email)
                .split(/\s+/)
                .slice(0, 2)
                .map((p) => p[0]?.toUpperCase() ?? "")
                .join("");
              return (
                <article key={m.membershipId} className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {avatar || "?"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <Link href={`${basePath}/users/${m.userId}`} className="font-medium hover:underline">
                        {m.fullName || m.email}
                      </Link>
                      {m.fullName ? <p className="truncate text-xs text-muted-foreground">{m.email}</p> : null}
                      <p className="mt-1 text-xs text-muted-foreground">
                        {m.roleName} · {m.workspaceName ?? "—"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t.companyDetail.users.colLastLogin}: {fmt(m.lastSignInAt)}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {m.modules.length === 0 ? (
                          <span className="text-xs text-muted-foreground">—</span>
                        ) : (
                          m.modules.map((mod) => (
                            <Badge key={mod} variant="secondary">
                              {mod}
                            </Badge>
                          ))
                        )}
                      </div>
                    </div>
                    {m.isPlatformOwner ? (
                      <Badge variant="info">{t.common.platformOwner}</Badge>
                    ) : m.suspended ? (
                      <Badge variant="warning">{t.common.suspended}</Badge>
                    ) : (
                      <Badge variant="success">{t.common.active}</Badge>
                    )}
                  </div>
                  {!m.isPlatformOwner ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {m.suspended ? (
                        <Button size="sm" variant="ghost" className="min-h-11" loading={pendingId === `${m.userId}:enable`} disabled={busy}
                          onClick={() => run(`${m.userId}:enable`, () => activateUserAction({ userId: m.userId }), { success: t.companyDetail.users.toastEnabled })}>
                          {t.common.enable}
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" className="min-h-11" loading={pendingId === `${m.userId}:disable`} disabled={busy}
                          onClick={() => run(`${m.userId}:disable`, () => suspendUserAction({ userId: m.userId }), { success: t.companyDetail.users.toastDisabled })}>
                          {t.common.disable}
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="min-h-11" loading={pendingId === `${m.userId}:reset`} disabled={busy}
                        onClick={() => run(`${m.userId}:reset`, () => resetPasswordAction({ email: m.email }), { success: t.companyDetail.users.toastResetSent })}>
                        {t.common.reset}
                      </Button>
                      <Button size="sm" variant="ghost" className="min-h-11" disabled={busy} onClick={() => setTransferUser(m.userId)}>
                        {t.common.transfer}
                      </Button>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>

          <div className="hidden overflow-x-auto rounded-xl border border-border/60 lg:block">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5">{t.companyDetail.users.colUser}</th>
                <th className="px-4 py-2.5">{t.companyDetail.users.colRole}</th>
                <th className="px-4 py-2.5">{t.companyDetail.users.colWorkspace}</th>
                <th className="px-4 py-2.5">{t.nav.modules}</th>
                <th className="px-4 py-2.5">{t.companyDetail.users.colCreated}</th>
                <th className="px-4 py-2.5">{t.companyDetail.users.colLastLogin}</th>
                <th className="px-4 py-2.5">{t.companyDetail.users.colStatus}</th>
                <th className="px-4 py-2.5 text-right">{t.companyDetail.users.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {company.members.map((m) => {
                const busy = pendingId?.startsWith(m.userId) ?? false;
                const avatar = (m.fullName || m.email)
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((p) => p[0]?.toUpperCase() ?? "")
                  .join("");
                return (
                  <tr key={m.membershipId}>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {avatar || "?"}
                        </span>
                        <div className="min-w-0">
                          <Link href={`${basePath}/users/${m.userId}`} className="font-medium text-foreground hover:underline">
                            {m.fullName || m.email}
                          </Link>
                          {m.fullName ? <div className="truncate text-xs text-muted-foreground">{m.email}</div> : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">{m.roleName}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{m.workspaceName ?? "—"}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex max-w-[14rem] flex-wrap gap-1">
                        {m.modules.length === 0 ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          m.modules.map((mod) => (
                            <Badge key={mod} variant="secondary">
                              {mod}
                            </Badge>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">{fmt(m.createdAt)}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{fmt(m.lastSignInAt)}</td>
                    <td className="px-4 py-2.5">
                      {m.isPlatformOwner ? (
                        <Badge variant="info">{t.common.platformOwner}</Badge>
                      ) : m.suspended ? (
                        <Badge variant="warning">{t.common.suspended}</Badge>
                      ) : (
                        <Badge variant="success">{t.common.active}</Badge>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {m.isPlatformOwner ? (
                        <span className="text-xs text-muted-foreground">{t.common.protected}</span>
                      ) : (
                        <div className="flex flex-wrap justify-end gap-1.5">
                          {m.suspended ? (
                            <Button size="sm" variant="ghost" loading={pendingId === `${m.userId}:enable`} disabled={busy}
                              onClick={() => run(`${m.userId}:enable`, () => activateUserAction({ userId: m.userId }), { success: t.companyDetail.users.toastEnabled })}>
                              {t.common.enable}
                            </Button>
                          ) : (
                            <Button size="sm" variant="ghost" loading={pendingId === `${m.userId}:disable`} disabled={busy}
                              onClick={() => run(`${m.userId}:disable`, () => suspendUserAction({ userId: m.userId }), { success: t.companyDetail.users.toastDisabled })}>
                              {t.common.disable}
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" loading={pendingId === `${m.userId}:reset`} disabled={busy}
                            onClick={() => run(`${m.userId}:reset`, () => resetPasswordAction({ email: m.email }), { success: t.companyDetail.users.toastResetSent })}>
                            {t.common.reset}
                          </Button>
                          <Button size="sm" variant="ghost" loading={pendingId === `${m.userId}:logout`} disabled={busy}
                            onClick={() => run(`${m.userId}:logout`, () => forceLogoutAction({ userId: m.userId }), { success: t.companyDetail.users.toastSessionsRevoked })}>
                            {t.common.forceLogout}
                          </Button>
                          <Button size="sm" variant="ghost" loading={pendingId === `${m.userId}:admin`} disabled={busy}
                            onClick={() => run(`${m.userId}:admin`, () => assignCompanyAdminAction({ userId: m.userId, organizationId: company.id }), { success: t.companyDetail.users.toastAdminAssigned })}>
                            {t.companyDetail.users.makeAdmin}
                          </Button>
                          <Button size="sm" variant="ghost" disabled={busy} onClick={() => setTransferUser(m.userId)}>
                            {t.common.transfer}
                          </Button>
                          <Button size="sm" variant="destructive" loading={pendingId === `${m.userId}:delete`} disabled={busy}
                            onClick={() => {
                              if (!window.confirm(fillPlatform(t.companyDetail.users.deleteConfirm, { email: m.email }))) return;
                              void run(`${m.userId}:delete`, () => deleteUserAction({ userId: m.userId }), { success: t.companyDetail.users.toastDeleted });
                            }}>
                            {t.common.delete}
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </>
      )}

      <CreateUserModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        companyId={company.id}
        pending={pendingId === "create-user"}
        onSubmit={(values) => run("create-user", () => createUserAction(values), { success: t.companyDetail.users.toastCreated, onSuccess: () => setCreateOpen(false) })}
      />
      <InviteUserModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        companyId={company.id}
        pending={pendingId === "invite-user"}
        onSubmit={(values) => run("invite-user", () => sendInvitationAction(values), { success: t.companyDetail.users.toastInviteSent, onSuccess: () => setInviteOpen(false) })}
      />
      <TransferModal
        open={transferUser !== null}
        onClose={() => setTransferUser(null)}
        organizations={organizations.filter((o) => o.id !== company.id)}
        pending={pendingId === "transfer"}
        onSubmit={(toOrganizationId, roleSlug) =>
          transferUser &&
          run("transfer", () => transferUserAction({ userId: transferUser, toOrganizationId, roleSlug }), {
            success: t.companyDetail.users.toastTransferred,
            onSuccess: () => setTransferUser(null),
          })
        }
      />
    </div>
  );
}

function SubscriptionTab({ company }: { company: CompanyDetail }) {
  const t = usePlatformLabels();
  return (
    <div className="space-y-8">
      <LicenseTab company={company} />
      <SeatsTab company={company} />
      <PlatformSection title={fillPlatform(t.companyDetail.tabs.modules, { count: company.modules.length })}>
        <DataTable
          columns={[t.companyDetail.modules.colModule, t.companyDetail.modules.colState, t.companyDetail.modules.colScope, t.companyDetail.modules.colUpdated]}
          empty={t.companyDetail.modules.empty}
          rows={company.modules.map((m) => [
            <span key="n" className="font-medium capitalize text-foreground">{m.code.replace(/_/g, " ")}</span>,
            <Badge key="s" variant={m.state === "enabled" ? "success" : "secondary"}>{m.state}</Badge>,
            <span key="sc" className="capitalize">{m.scope}</span>,
            fmt(m.updatedAt),
          ])}
        />
      </PlatformSection>
    </div>
  );
}

function ActivityTab({ company }: { company: CompanyDetail }) {
  const t = usePlatformLabels();
  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button
          size="sm"
          variant="outline"
          className="min-h-11"
          disabled={company.activity.length === 0}
          onClick={() =>
            downloadCsv(
              timestampedName(`activity-${company.slug}`, "csv"),
              [t.common.timestamp, t.common.event, t.common.severity, t.common.actor],
              company.activity.map((e) => [e.timestamp, e.title, e.severity, e.detail]),
            )
          }
        >
          {t.common.exportCsv}
        </Button>
      </div>
      <Timeline events={company.activity} empty={t.companyDetail.activity.timelineEmpty} emptyTitle={t.timeline.noEventsTitle} />
      <PlatformSection title={t.companyDetail.tabs.auditLogs}>
        <DataTable
          columns={[t.companyDetail.auditLogs.colTimestamp, t.companyDetail.auditLogs.colAction, t.companyDetail.auditLogs.colResource, t.companyDetail.auditLogs.colActor]}
          empty={t.companyDetail.auditLogs.empty}
          rows={company.auditLogs.map((a) => [
            fmt(a.createdAt),
            <span key="a" className="font-medium text-foreground">{a.action}</span>,
            a.resource,
            a.actorEmail,
          ])}
        />
      </PlatformSection>
      <PlatformSection title={t.companyDetail.tabs.loginHistory}>
        <DataTable
          columns={[t.companyDetail.loginHistory.colDate, t.companyDetail.loginHistory.colUser, t.companyDetail.loginHistory.colIp, t.companyDetail.loginHistory.colDevice, t.companyDetail.loginHistory.colBrowser, t.companyDetail.loginHistory.colResult]}
          empty={t.companyDetail.loginHistory.empty}
          rows={company.loginHistory.map((l) => [
            fmt(l.createdAt),
            l.email,
            l.ip,
            l.device,
            l.browser,
            <Badge key="r" variant={l.result === "Success" ? "success" : "secondary"}>{l.result}</Badge>,
          ])}
        />
      </PlatformSection>
    </div>
  );
}

function LicenseTab({ company }: { company: CompanyDetail }) {
  const t = usePlatformLabels();
  const { run, pendingId } = useActionRunner();
  const [duration, setDuration] = useState("365");
  const [customEndsAt, setCustomEndsAt] = useState("");
  const licenseEvents = company.timeline.filter(
    (e) => e.title.startsWith("subscription.") || e.title.startsWith("license") || e.category === "subscription",
  );
  const canRenew = Boolean(company.license.subscriptionId);

  return (
    <div className="space-y-8">
      <div className="grid gap-x-8 gap-y-3 rounded-xl border border-border/60 p-4 text-sm md:grid-cols-2">
        <Field label={t.common.plan} value={company.license.planCode ?? t.common.none} />
        <Field label={t.common.status} value={company.license.status ?? "—"} />
        <Field label={t.common.seats} value={`${company.license.seatsUsed} / ${company.license.seatLimit}`} />
        <Field label={t.common.expiration} value={company.license.endsAt ? new Date(company.license.endsAt).toLocaleDateString() : t.common.perpetual} />
        <Field label={t.companyDetail.license.enabledModules} value={company.modules.filter((m) => m.state === "enabled").map((m) => m.code).join(", ") || t.companyDetail.license.planDefaults} />
      </div>

      {canRenew ? (
        <PlatformSection title={t.ux.wizardDuration}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="renew-duration">{t.ux.wizardDuration}</Label>
              <Select id="renew-duration" value={duration} onChange={(e) => setDuration(e.target.value)}>
                {LICENSE_DURATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t.ux.duration[option.labelKey]}
                  </option>
                ))}
              </Select>
            </div>
            {duration === "custom" ? (
              <div className="space-y-1">
                <Label htmlFor="renew-custom">{t.ux.wizardCustomExpiration}</Label>
                <Input
                  id="renew-custom"
                  type="date"
                  value={customEndsAt}
                  onChange={(e) => setCustomEndsAt(e.target.value)}
                />
              </div>
            ) : null}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{t.ux.wizardDurationHint}</p>
          <Button
            className="mt-4 min-h-11"
            size="sm"
            loading={pendingId === "renew-license"}
            onClick={() => {
              const endsAt = computeEndsAtFromDuration(
                duration,
                duration === "custom" ? customEndsAt : null,
              );
              if (!endsAt || !company.license.subscriptionId) return;
              void run(
                "renew-license",
                () =>
                  updateSubscriptionAction({
                    id: company.license.subscriptionId!,
                    endsAt,
                    status: "active",
                  }),
                { success: t.subscriptionManager.toastUpdated },
              );
            }}
          >
            {t.subscriptionManager.renewLicense}
          </Button>
        </PlatformSection>
      ) : null}

      <PlatformSection title={t.companyDetail.license.timelineTitle}>
        <Timeline events={licenseEvents} empty={t.companyDetail.license.timelineEmpty} emptyTitle={t.timeline.noEventsTitle} />
      </PlatformSection>
    </div>
  );
}

function SeatsTab({ company }: { company: CompanyDetail }) {
  const t = usePlatformLabels();
  const seatEvents = company.timeline.filter((e) => e.title.includes("seat") || e.title.startsWith("subscription.") || e.title.startsWith("user."));
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-3">
        <StatCard label={t.companyDetail.seats.purchased} value={company.license.seatLimit.toLocaleString()} />
        <StatCard label={t.companyDetail.seats.used} value={company.license.seatsUsed.toLocaleString()} />
        <StatCard label={t.companyDetail.seats.available} value={company.license.seatsAvailable.toLocaleString()} tone={company.license.seatsAvailable === 0 ? "warn" : "ok"} />
      </div>
      <PlatformSection title={t.companyDetail.seats.timelineTitle}>
        <Timeline events={seatEvents} empty={t.companyDetail.seats.timelineEmpty} emptyTitle={t.timeline.noEventsTitle} />
      </PlatformSection>
    </div>
  );
}

function SecurityTab({ company }: { company: CompanyDetail }) {
  const t = usePlatformLabels();
  const s = company.security;
  const securityEvents = company.activity.filter((e) => e.severity !== "info");
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <StatCard label={t.companyDetail.security.suspensions} value={s.suspensions.toLocaleString()} tone={s.suspensions > 0 ? "warn" : "neutral"} />
        <StatCard label={t.companyDetail.security.reactivations} value={s.reactivations.toLocaleString()} />
        <StatCard label={t.companyDetail.security.passwordResets} value={s.passwordResets.toLocaleString()} />
        <StatCard label={t.companyDetail.security.forceLogouts} value={s.forceLogouts.toLocaleString()} />
        <StatCard label={t.companyDetail.security.securityEvents} value={s.securityEvents.toLocaleString()} />
        <StatCard label={t.companyDetail.security.riskEvents} value={s.riskEvents.toLocaleString()} tone={s.riskEvents > 0 ? "warn" : "ok"} />
      </div>
      <PlatformSection title={t.companyDetail.security.timelineTitle}>
        <Timeline events={securityEvents} empty={t.companyDetail.security.timelineEmpty} emptyTitle={t.timeline.noEventsTitle} />
      </PlatformSection>
    </div>
  );
}

function SettingsTab({ company, run, pendingId }: { company: CompanyDetail; run: Runner; pendingId: string | null }) {
  const t = usePlatformLabels();
  const busy = pendingId !== null;
  function exportCompany() {
    downloadJson(timestampedName(`company-${company.slug}`, "json"), company);
  }
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/60 p-4">
        <h3 className="mb-1 text-sm font-semibold">{t.companyDetail.settings.statusHeading}</h3>
        <p className="mb-4 text-sm text-muted-foreground">{t.companyDetail.settings.currentStatus} <span className="font-medium text-foreground">{company.status}</span></p>
        <div className="flex flex-wrap gap-2">
          {company.status !== "suspended" ? (
            <Button size="sm" variant="outline" loading={pendingId === "suspend"} disabled={busy}
              onClick={() => run("suspend", () => suspendTenantAction({ id: company.id }), { success: t.companyDetail.settings.toastSuspended })}>{t.common.suspend}</Button>
          ) : (
            <Button size="sm" variant="outline" loading={pendingId === "activate"} disabled={busy}
              onClick={() => run("activate", () => activateTenantAction({ id: company.id }), { success: t.companyDetail.settings.toastReactivated })}>{t.companyDetail.settings.reactivate}</Button>
          )}
          {company.status !== "archived" ? (
            <Button size="sm" variant="outline" loading={pendingId === "archive"} disabled={busy}
              onClick={() => run("archive", () => archiveTenantAction({ id: company.id }), { success: t.companyDetail.settings.toastArchived })}>{t.common.archive}</Button>
          ) : (
            <Button size="sm" variant="outline" loading={pendingId === "restore"} disabled={busy}
              onClick={() => run("restore", () => restoreTenantAction({ id: company.id }), { success: t.companyDetail.settings.toastRestored })}>{t.common.restore}</Button>
          )}
          <Button size="sm" variant="destructive" loading={pendingId === "delete"} disabled={busy}
            onClick={() => {
              if (!window.confirm(fillPlatform(t.companyDetail.settings.deleteConfirm, { name: company.name }))) return;
              void run("delete", () => deleteTenantAction({ id: company.id }), { success: t.companyDetail.settings.toastDeleted });
            }}>{t.common.delete}</Button>
        </div>
      </div>

      <div className="rounded-xl border border-border/60 p-4">
        <h3 className="mb-1 text-sm font-semibold">{t.companyDetail.settings.exportHeading}</h3>
        <p className="mb-4 text-sm text-muted-foreground">{t.companyDetail.settings.exportText}</p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={exportCompany}>{t.common.exportJson}</Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              downloadCsv(
                timestampedName(`company-users-${company.slug}`, "csv"),
                [t.common.email, t.common.role, t.common.scope, t.common.workspace, t.common.status],
                company.members.map((m) => [m.email, m.roleName, m.scope, m.workspaceName ?? "", m.suspended ? t.common.suspended : t.common.active]),
              )
            }
          >
            {t.companyDetail.settings.exportUsersCsv}
          </Button>
        </div>
      </div>
    </div>
  );
}

// --- Modals -----------------------------------------------------------------

function CreateUserModal({
  open, onClose, companyId, onSubmit, pending,
}: {
  open: boolean; onClose: () => void; companyId: string;
  onSubmit: (v: { email: string; password: string; fullName?: string; organizationId: string; roleSlug: string }) => void;
  pending: boolean;
}) {
  const t = usePlatformLabels();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [roleSlug, setRoleSlug] = useState("member");
  return (
    <Modal open={open} onOpenChange={(n) => (n ? null : onClose())} title={t.companyDetail.createUserModal.title}
      description={t.companyDetail.createUserModal.description}
      footer={<>
        <Button variant="outline" size="sm" onClick={onClose}>{t.common.cancel}</Button>
        <Button size="sm" loading={pending} onClick={() => onSubmit({ email, password, fullName: fullName || undefined, organizationId: companyId, roleSlug })}>{t.common.create}</Button>
      </>}>
      <div className="space-y-3">
        <div className="space-y-1"><Label htmlFor="cu-email">{t.companyDetail.createUserModal.email}</Label><Input id="cu-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="space-y-1"><Label htmlFor="cu-pass">{t.companyDetail.createUserModal.tempPassword}</Label><Input id="cu-pass" type="text" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <div className="space-y-1"><Label htmlFor="cu-name">{t.companyDetail.createUserModal.fullName}</Label><Input id="cu-name" value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
        <div className="space-y-1"><Label htmlFor="cu-role">{t.companyDetail.createUserModal.role}</Label>
          <Select id="cu-role" value={roleSlug} onChange={(e) => setRoleSlug(e.target.value)}>
            {ASSIGNABLE_ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{t.options.roles[r.value] ?? r.label}</option>)}
          </Select>
        </div>
      </div>
    </Modal>
  );
}

function InviteUserModal({
  open, onClose, companyId, onSubmit, pending,
}: {
  open: boolean; onClose: () => void; companyId: string;
  onSubmit: (v: { email: string; organizationId: string; roleSlug: string; expiresInDays: number }) => void;
  pending: boolean;
}) {
  const t = usePlatformLabels();
  const [email, setEmail] = useState("");
  const [roleSlug, setRoleSlug] = useState("member");
  const [expiresInDays, setExpiresInDays] = useState(14);
  return (
    <Modal open={open} onOpenChange={(n) => (n ? null : onClose())} title={t.companyDetail.inviteModal.title} description={t.companyDetail.inviteModal.description}
      footer={<>
        <Button variant="outline" size="sm" onClick={onClose}>{t.common.cancel}</Button>
        <Button size="sm" loading={pending} onClick={() => onSubmit({ email, organizationId: companyId, roleSlug, expiresInDays })}>{t.common.send}</Button>
      </>}>
      <div className="space-y-3">
        <div className="space-y-1"><Label htmlFor="iu-email">{t.companyDetail.inviteModal.email}</Label><Input id="iu-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="space-y-1"><Label htmlFor="iu-role">{t.companyDetail.inviteModal.role}</Label>
          <Select id="iu-role" value={roleSlug} onChange={(e) => setRoleSlug(e.target.value)}>
            {ASSIGNABLE_ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{t.options.roles[r.value] ?? r.label}</option>)}
          </Select>
        </div>
        <div className="space-y-1"><Label htmlFor="iu-days">{t.companyDetail.inviteModal.expiresDays}</Label><Input id="iu-days" type="number" min={1} max={90} value={expiresInDays} onChange={(e) => setExpiresInDays(Number(e.target.value))} /></div>
      </div>
    </Modal>
  );
}

function TransferModal({
  open, onClose, organizations, onSubmit, pending,
}: {
  open: boolean; onClose: () => void; organizations: { id: string; name: string }[];
  onSubmit: (toOrganizationId: string, roleSlug: string) => void; pending: boolean;
}) {
  const t = usePlatformLabels();
  const [organizationId, setOrganizationId] = useState(organizations[0]?.id ?? "");
  const [roleSlug, setRoleSlug] = useState("member");
  return (
    <Modal open={open} onOpenChange={(n) => (n ? null : onClose())} title={t.companyDetail.transferModal.title}
      description={t.companyDetail.transferModal.description}
      footer={<>
        <Button variant="outline" size="sm" onClick={onClose}>{t.common.cancel}</Button>
        <Button size="sm" loading={pending} disabled={!organizationId} onClick={() => onSubmit(organizationId, roleSlug)}>{t.common.transfer}</Button>
      </>}>
      <div className="space-y-3">
        <div className="space-y-1"><Label htmlFor="tr-org">{t.companyDetail.transferModal.destination}</Label>
          <Select id="tr-org" value={organizationId} onChange={(e) => setOrganizationId(e.target.value)}>
            {organizations.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </Select>
        </div>
        <div className="space-y-1"><Label htmlFor="tr-role">{t.companyDetail.transferModal.role}</Label>
          <Select id="tr-role" value={roleSlug} onChange={(e) => setRoleSlug(e.target.value)}>
            {ASSIGNABLE_ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{t.options.roles[r.value] ?? r.label}</option>)}
          </Select>
        </div>
      </div>
    </Modal>
  );
}
