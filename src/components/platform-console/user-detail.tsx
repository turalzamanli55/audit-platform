"use client";

import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard, DataTable, PlatformSection, FoundationNotice } from "@/components/platform-console/platform-primitives";
import { Timeline } from "@/components/platform-console/timeline";
import { useActionRunner } from "@/components/platform-console/managers/use-action-runner";
import { downloadCsv, downloadJson, timestampedName } from "@/lib/platform-console/export-utils";
import { usePlatformLabels } from "@/i18n/use-platform-labels";
import { fillPlatform } from "@/i18n/platform-labels";
import type { UserDetail } from "@/lib/platform-console/detail-data";
import {
  suspendUserAction,
  activateUserAction,
  resetPasswordAction,
  forceLogoutAction,
  revokeSessionAction,
} from "@/lib/platform-console/actions/users";

function fmt(value: string | null): string {
  return value ? new Date(value).toLocaleString() : "—";
}

function initials(email: string, fullName: string | null): string {
  if (fullName) {
    return fullName
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("");
  }
  return email.slice(0, 2).toUpperCase();
}

export function UserDetailView({ user, basePath }: { user: UserDetail; basePath: string }) {
  const t = usePlatformLabels();
  const { run, pendingId } = useActionRunner();
  const primary = user.memberships[0] ?? null;

  return (
    <Tabs defaultValue="profile">
      <TabsList className="flex flex-wrap">
        <TabsTrigger value="profile">{t.userDetail.tabs.profile}</TabsTrigger>
        <TabsTrigger value="organizations">{fillPlatform(t.userDetail.tabs.organizations, { count: user.memberships.length })}</TabsTrigger>
        <TabsTrigger value="workspaces">{t.userDetail.tabs.workspaces}</TabsTrigger>
        <TabsTrigger value="permissions">{fillPlatform(t.userDetail.tabs.permissions, { count: user.permissions.length })}</TabsTrigger>
        <TabsTrigger value="role">{t.userDetail.tabs.role}</TabsTrigger>
        <TabsTrigger value="sessions">{fillPlatform(t.userDetail.tabs.sessions, { count: user.sessions.length })}</TabsTrigger>
        <TabsTrigger value="logins">{t.userDetail.tabs.loginHistory}</TabsTrigger>
        <TabsTrigger value="activity">{t.userDetail.tabs.activity}</TabsTrigger>
        <TabsTrigger value="audit">{t.userDetail.tabs.auditHistory}</TabsTrigger>
        <TabsTrigger value="modules">{fillPlatform(t.userDetail.tabs.modules, { count: user.modules.length })}</TabsTrigger>
        <TabsTrigger value="license">{t.userDetail.tabs.license}</TabsTrigger>
        <TabsTrigger value="security">{t.userDetail.tabs.security}</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <div className="space-y-8">
          <div className="flex items-center gap-4 rounded-xl border border-border/60 p-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
              {initials(user.email, user.fullName)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold">{user.fullName ?? user.email}</p>
              <p className="truncate text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="ml-auto">
              {user.isPlatformOwner ? (
                <Badge variant="info">{t.common.platformOwner}</Badge>
              ) : user.status === "Suspended" ? (
                <Badge variant="warning">{t.common.suspended}</Badge>
              ) : (
                <Badge variant="success">{t.common.active}</Badge>
              )}
            </div>
          </div>

          <div className="grid gap-x-8 gap-y-3 rounded-xl border border-border/60 p-4 text-sm md:grid-cols-2">
            <Field label={t.userDetail.profile.status} value={user.status} />
            <Field label={t.userDetail.profile.primaryRole} value={primary?.roleName ?? "—"} />
            <Field
              label={t.userDetail.profile.company}
              value={primary?.organizationName ?? "—"}
              href={primary ? `${basePath}/companies/${primary.organizationId}` : undefined}
            />
            <Field label={t.userDetail.profile.created} value={fmt(user.createdAt)} />
            <Field label={t.userDetail.profile.lastLogin} value={fmt(user.lastSignInAt)} />
          </div>

          {!user.isPlatformOwner ? (
            <div className="flex flex-wrap gap-2">
              {user.status === "Suspended" ? (
                <Button size="sm" variant="outline" loading={pendingId === "enable"}
                  onClick={() => run("enable", () => activateUserAction({ userId: user.id }), { success: t.userDetail.profile.toastEnabled })}>{t.common.enable}</Button>
              ) : (
                <Button size="sm" variant="outline" loading={pendingId === "disable"}
                  onClick={() => run("disable", () => suspendUserAction({ userId: user.id }), { success: t.userDetail.profile.toastDisabled })}>{t.common.disable}</Button>
              )}
              <Button size="sm" variant="outline" loading={pendingId === "reset"}
                onClick={() => run("reset", () => resetPasswordAction({ email: user.email }), { success: t.userDetail.profile.toastResetSent })}>{t.userDetail.profile.resetPassword}</Button>
              <Button size="sm" variant="outline" loading={pendingId === "logout"}
                onClick={() => run("logout", () => forceLogoutAction({ userId: user.id }), { success: t.userDetail.profile.toastSessionsRevoked })}>{t.common.forceLogout}</Button>
              <Button size="sm" variant="outline" onClick={() => downloadJson(timestampedName(`user-${user.email}`, "json"), user)}>{t.userDetail.profile.exportJson}</Button>
            </div>
          ) : null}
        </div>
      </TabsContent>

      <TabsContent value="organizations">
        <DataTable
          columns={[t.userDetail.organizations.colCompany, t.userDetail.organizations.colRole, t.userDetail.organizations.colScope, t.userDetail.organizations.colWorkspace]}
          empty={t.userDetail.organizations.empty}
          rows={user.memberships.map((m) => [
            <Link key="o" href={`${basePath}/companies/${m.organizationId}`} className="font-medium text-foreground hover:underline">{m.organizationName}</Link>,
            m.roleName,
            <span key="s" className="capitalize">{m.scope}</span>,
            m.workspaceName ?? "—",
          ])}
        />
      </TabsContent>

      <TabsContent value="workspaces">
        <DataTable
          columns={[t.userDetail.workspaces.colWorkspace, t.userDetail.workspaces.colCompany, t.userDetail.workspaces.colRole]}
          empty={t.userDetail.workspaces.empty}
          rows={user.memberships.filter((m) => m.workspaceName).map((m) => [
            <span key="w" className="font-medium text-foreground">{m.workspaceName}</span>,
            m.organizationName,
            m.roleName,
          ])}
        />
      </TabsContent>

      <TabsContent value="permissions">
        <DataTable
          columns={[t.userDetail.permissions.colPermission, t.userDetail.permissions.colName, t.userDetail.permissions.colSource]}
          empty={t.userDetail.permissions.empty}
          rows={user.permissions.map((p) => [
            <span key="c" className="font-mono text-xs text-foreground">{p.code}</span>,
            p.name,
            <span key="s" className="text-muted-foreground">{p.source}</span>,
          ])}
        />
      </TabsContent>

      <TabsContent value="role">
        <DataTable
          columns={[t.userDetail.role.colRole, t.userDetail.role.colScope, t.userDetail.role.colCompany]}
          empty={t.userDetail.role.empty}
          rows={user.memberships.map((m) => [
            <span key="r" className="font-medium text-foreground">{m.roleName}</span>,
            <span key="s" className="capitalize">{m.scope}</span>,
            m.organizationName,
          ])}
        />
      </TabsContent>

      <TabsContent value="sessions">
        <SessionsTab user={user} run={run} pendingId={pendingId} />
      </TabsContent>

      <TabsContent value="logins">
        <DataTable
          columns={[t.userDetail.loginHistory.colDate, t.userDetail.loginHistory.colIp, t.userDetail.loginHistory.colDevice, t.userDetail.loginHistory.colBrowser, t.userDetail.loginHistory.colResult]}
          empty={t.userDetail.loginHistory.empty}
          rows={user.loginHistory.map((l) => [
            fmt(l.createdAt), l.ip, l.device, l.browser,
            <Badge key="r" variant={l.result === "Success" ? "success" : "secondary"}>{l.result}</Badge>,
          ])}
        />
      </TabsContent>

      <TabsContent value="activity">
        <div className="mb-4 flex justify-end">
          <Button size="sm" variant="outline" disabled={user.activity.length === 0}
            onClick={() => downloadCsv(timestampedName(`user-activity-${user.email}`, "csv"), [t.common.timestamp, t.common.event, t.common.severity], user.activity.map((e) => [e.timestamp, e.title, e.severity]))}>
            {t.common.exportCsv}
          </Button>
        </div>
        <Timeline events={user.activity} empty={t.userDetail.activity.timelineEmpty} emptyTitle={t.timeline.noEventsTitle} />
      </TabsContent>

      <TabsContent value="audit">
        <DataTable
          columns={[t.userDetail.auditHistory.colTimestamp, t.userDetail.auditHistory.colAction, t.userDetail.auditHistory.colResource]}
          empty={t.userDetail.auditHistory.empty}
          rows={user.auditHistory.map((a) => [fmt(a.createdAt), <span key="a" className="font-medium text-foreground">{a.action}</span>, a.resource])}
        />
      </TabsContent>

      <TabsContent value="modules">
        <DataTable
          columns={[t.userDetail.modules.colModule, t.userDetail.modules.colState, t.userDetail.modules.colScope]}
          empty={t.userDetail.modules.empty}
          rows={user.modules.map((m, i) => [
            <span key={`n${i}`} className="font-medium capitalize text-foreground">{m.code.replace(/_/g, " ")}</span>,
            <Badge key={`s${i}`} variant={m.state === "enabled" ? "success" : "secondary"}>{m.state}</Badge>,
            <span key={`sc${i}`} className="capitalize">{m.scope}</span>,
          ])}
        />
      </TabsContent>

      <TabsContent value="license">
        {user.license ? (
          <div className="grid gap-x-8 gap-y-3 rounded-xl border border-border/60 p-4 text-sm md:grid-cols-2">
            <Field label={t.userDetail.license.company} value={user.license.organizationName ?? "—"} />
            <Field label={t.userDetail.license.plan} value={user.license.planCode ?? "—"} />
            <Field label={t.userDetail.license.seat} value={`${user.license.seatsUsed} / ${user.license.seatLimit}`} />
            <Field label={t.userDetail.license.status} value={user.license.status ?? "—"} />
            <Field label={t.userDetail.license.expiration} value={user.license.endsAt ? new Date(user.license.endsAt).toLocaleDateString() : t.common.perpetual} />
          </div>
        ) : (
          <FoundationNotice>{t.userDetail.license.noLicense}</FoundationNotice>
        )}
      </TabsContent>

      <TabsContent value="security">
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatCard label={t.userDetail.security.failedLogins} value={user.security.failedLogins.toLocaleString()} />
            <StatCard label={t.userDetail.security.suspensions} value={user.security.suspensions.toLocaleString()} tone={user.security.suspensions > 0 ? "warn" : "neutral"} />
            <StatCard label={t.userDetail.security.passwordChanges} value={user.security.passwordChanges.toLocaleString()} />
            <StatCard label={t.userDetail.security.forceLogouts} value={user.security.forceLogouts.toLocaleString()} />
          </div>
          <PlatformSection title={t.userDetail.security.timelineTitle}>
            <Timeline events={user.activity.filter((e) => e.severity !== "info")} empty={t.userDetail.security.timelineEmpty} emptyTitle={t.timeline.noEventsTitle} />
          </PlatformSection>
        </div>
      </TabsContent>
    </Tabs>
  );
}

type Runner = ReturnType<typeof useActionRunner>["run"];

function SessionsTab({ user, run, pendingId }: { user: UserDetail; run: Runner; pendingId: string | null }) {
  const t = usePlatformLabels();
  return (
    <div className="space-y-4">
      {!user.sessionsAvailable ? (
        <FoundationNotice>
          {t.userDetail.sessions.notice}
        </FoundationNotice>
      ) : null}
      <div className="flex justify-end">
        <Button size="sm" variant="outline" loading={pendingId === "logout-all"} disabled={user.isPlatformOwner}
          onClick={() => run("logout-all", () => forceLogoutAction({ userId: user.id }), { success: t.userDetail.sessions.toastAllRevoked })}>
          {t.userDetail.sessions.forceLogoutAll}
        </Button>
      </div>
      {user.sessions.length === 0 ? (
        <DataTable columns={[t.userDetail.sessions.colSession, t.userDetail.sessions.colStarted, t.userDetail.sessions.colLastSeen, t.userDetail.sessions.colExpires, t.userDetail.sessions.colAge]} rows={[]} empty={t.userDetail.sessions.empty} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5">{t.userDetail.sessions.colSession}</th>
                <th className="px-4 py-2.5">{t.userDetail.sessions.colStarted}</th>
                <th className="px-4 py-2.5">{t.userDetail.sessions.colLastSeen}</th>
                <th className="px-4 py-2.5">{t.userDetail.sessions.colExpires}</th>
                <th className="px-4 py-2.5">{t.userDetail.sessions.colAge}</th>
                <th className="px-4 py-2.5 text-right">{t.common.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {user.sessions.map((s) => (
                <tr key={s.sessionId}>
                  <td className="px-4 py-2.5 font-mono text-xs">{s.sessionId.slice(0, 8)}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{fmt(s.createdAt)}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{fmt(s.updatedAt)}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{fmt(s.notAfter)}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{s.ageMinutes !== null ? fillPlatform(t.userDetail.sessions.ageMinutes, { count: s.ageMinutes }) : "—"}</td>
                  <td className="px-4 py-2.5 text-right">
                    <Button size="sm" variant="ghost" loading={pendingId === `${s.sessionId}:revoke`}
                      onClick={() => run(`${s.sessionId}:revoke`, () => revokeSessionAction({ sessionId: s.sessionId, userId: user.id }), { success: t.userDetail.sessions.toastRevoked })}>
                      {t.common.revoke}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      {href ? (
        <Link href={href} className="text-right font-medium text-foreground hover:underline">{value}</Link>
      ) : (
        <span className="text-right font-medium text-foreground">{value}</span>
      )}
    </div>
  );
}
