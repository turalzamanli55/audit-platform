"use client";

import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard, DataTable, PlatformSection, FoundationNotice } from "@/components/platform-console/platform-primitives";
import { Timeline } from "@/components/platform-console/timeline";
import { useActionRunner } from "@/components/platform-console/managers/use-action-runner";
import { downloadCsv, downloadJson, timestampedName } from "@/lib/platform-console/export-utils";
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
  const { run, pendingId } = useActionRunner();
  const primary = user.memberships[0] ?? null;

  return (
    <Tabs defaultValue="profile">
      <TabsList className="flex flex-wrap">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="organizations">Organizations ({user.memberships.length})</TabsTrigger>
        <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
        <TabsTrigger value="permissions">Permissions ({user.permissions.length})</TabsTrigger>
        <TabsTrigger value="role">Role</TabsTrigger>
        <TabsTrigger value="sessions">Sessions ({user.sessions.length})</TabsTrigger>
        <TabsTrigger value="logins">Login History</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="audit">Audit History</TabsTrigger>
        <TabsTrigger value="modules">Modules ({user.modules.length})</TabsTrigger>
        <TabsTrigger value="license">License</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
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
                <Badge variant="info">Platform Owner</Badge>
              ) : user.status === "Suspended" ? (
                <Badge variant="warning">Suspended</Badge>
              ) : (
                <Badge variant="success">Active</Badge>
              )}
            </div>
          </div>

          <div className="grid gap-x-8 gap-y-3 rounded-xl border border-border/60 p-4 text-sm md:grid-cols-2">
            <Field label="Status" value={user.status} />
            <Field label="Primary role" value={primary?.roleName ?? "—"} />
            <Field
              label="Company"
              value={primary?.organizationName ?? "—"}
              href={primary ? `${basePath}/companies/${primary.organizationId}` : undefined}
            />
            <Field label="Created" value={fmt(user.createdAt)} />
            <Field label="Last login" value={fmt(user.lastSignInAt)} />
          </div>

          {!user.isPlatformOwner ? (
            <div className="flex flex-wrap gap-2">
              {user.status === "Suspended" ? (
                <Button size="sm" variant="outline" loading={pendingId === "enable"}
                  onClick={() => run("enable", () => activateUserAction({ userId: user.id }), { success: "User enabled" })}>Enable</Button>
              ) : (
                <Button size="sm" variant="outline" loading={pendingId === "disable"}
                  onClick={() => run("disable", () => suspendUserAction({ userId: user.id }), { success: "User disabled" })}>Disable</Button>
              )}
              <Button size="sm" variant="outline" loading={pendingId === "reset"}
                onClick={() => run("reset", () => resetPasswordAction({ email: user.email }), { success: "Reset email sent" })}>Reset password</Button>
              <Button size="sm" variant="outline" loading={pendingId === "logout"}
                onClick={() => run("logout", () => forceLogoutAction({ userId: user.id }), { success: "Sessions revoked" })}>Force logout</Button>
              <Button size="sm" variant="outline" onClick={() => downloadJson(timestampedName(`user-${user.email}`, "json"), user)}>Export JSON</Button>
            </div>
          ) : null}
        </div>
      </TabsContent>

      <TabsContent value="organizations">
        <DataTable
          columns={["Company", "Role", "Scope", "Workspace"]}
          empty="No memberships."
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
          columns={["Workspace", "Company", "Role"]}
          empty="No workspace memberships."
          rows={user.memberships.filter((m) => m.workspaceName).map((m) => [
            <span key="w" className="font-medium text-foreground">{m.workspaceName}</span>,
            m.organizationName,
            m.roleName,
          ])}
        />
      </TabsContent>

      <TabsContent value="permissions">
        <DataTable
          columns={["Permission", "Name", "Source (role)"]}
          empty="No permissions inherited."
          rows={user.permissions.map((p) => [
            <span key="c" className="font-mono text-xs text-foreground">{p.code}</span>,
            p.name,
            <span key="s" className="text-muted-foreground">{p.source}</span>,
          ])}
        />
      </TabsContent>

      <TabsContent value="role">
        <DataTable
          columns={["Role", "Scope", "Company"]}
          empty="No roles assigned."
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
          columns={["Date", "IP", "Device", "Browser", "Result"]}
          empty="No login events recorded."
          rows={user.loginHistory.map((l) => [
            fmt(l.createdAt), l.ip, l.device, l.browser,
            <Badge key="r" variant={l.result === "Success" ? "success" : "secondary"}>{l.result}</Badge>,
          ])}
        />
      </TabsContent>

      <TabsContent value="activity">
        <div className="mb-4 flex justify-end">
          <Button size="sm" variant="outline" disabled={user.activity.length === 0}
            onClick={() => downloadCsv(timestampedName(`user-activity-${user.email}`, "csv"), ["Timestamp", "Event", "Severity"], user.activity.map((e) => [e.timestamp, e.title, e.severity]))}>
            Export CSV
          </Button>
        </div>
        <Timeline events={user.activity} empty="No activity recorded for this user." />
      </TabsContent>

      <TabsContent value="audit">
        <DataTable
          columns={["Timestamp", "Action", "Resource"]}
          empty="No audit history."
          rows={user.auditHistory.map((a) => [fmt(a.createdAt), <span key="a" className="font-medium text-foreground">{a.action}</span>, a.resource])}
        />
      </TabsContent>

      <TabsContent value="modules">
        <DataTable
          columns={["Module", "State", "Scope"]}
          empty="No module entitlements."
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
            <Field label="Company" value={user.license.organizationName ?? "—"} />
            <Field label="Plan" value={user.license.planCode ?? "—"} />
            <Field label="Seat" value={`${user.license.seatsUsed} / ${user.license.seatLimit}`} />
            <Field label="Status" value={user.license.status ?? "—"} />
            <Field label="Expiration" value={user.license.endsAt ? new Date(user.license.endsAt).toLocaleDateString() : "Perpetual"} />
          </div>
        ) : (
          <FoundationNotice>This user&rsquo;s company has no active license.</FoundationNotice>
        )}
      </TabsContent>

      <TabsContent value="security">
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatCard label="Failed Logins" value={user.security.failedLogins.toLocaleString()} />
            <StatCard label="Suspensions" value={user.security.suspensions.toLocaleString()} tone={user.security.suspensions > 0 ? "warn" : "neutral"} />
            <StatCard label="Password Changes" value={user.security.passwordChanges.toLocaleString()} />
            <StatCard label="Force Logouts" value={user.security.forceLogouts.toLocaleString()} />
          </div>
          <PlatformSection title="Security Timeline">
            <Timeline events={user.activity.filter((e) => e.severity !== "info")} empty="No elevated security events." />
          </PlatformSection>
        </div>
      </TabsContent>
    </Tabs>
  );
}

type Runner = ReturnType<typeof useActionRunner>["run"];

function SessionsTab({ user, run, pendingId }: { user: UserDetail; run: Runner; pendingId: string | null }) {
  return (
    <div className="space-y-4">
      {!user.sessionsAvailable ? (
        <FoundationNotice>
          Live session tracking requires the platform session-management migration to be applied. Force logout still
          revokes all sessions once deployed.
        </FoundationNotice>
      ) : null}
      <div className="flex justify-end">
        <Button size="sm" variant="outline" loading={pendingId === "logout-all"} disabled={user.isPlatformOwner}
          onClick={() => run("logout-all", () => forceLogoutAction({ userId: user.id }), { success: "All sessions revoked" })}>
          Force logout (all sessions)
        </Button>
      </div>
      {user.sessions.length === 0 ? (
        <DataTable columns={["Session", "Started", "Last seen", "Expires", "Age"]} rows={[]} empty="No active sessions." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5">Session</th>
                <th className="px-4 py-2.5">Started</th>
                <th className="px-4 py-2.5">Last seen</th>
                <th className="px-4 py-2.5">Expires</th>
                <th className="px-4 py-2.5">Age</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {user.sessions.map((s) => (
                <tr key={s.sessionId}>
                  <td className="px-4 py-2.5 font-mono text-xs">{s.sessionId.slice(0, 8)}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{fmt(s.createdAt)}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{fmt(s.updatedAt)}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{fmt(s.notAfter)}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{s.ageMinutes !== null ? `${s.ageMinutes} min` : "—"}</td>
                  <td className="px-4 py-2.5 text-right">
                    <Button size="sm" variant="ghost" loading={pendingId === `${s.sessionId}:revoke`}
                      onClick={() => run(`${s.sessionId}:revoke`, () => revokeSessionAction({ sessionId: s.sessionId, userId: user.id }), { success: "Session revoked" })}>
                      Revoke
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
