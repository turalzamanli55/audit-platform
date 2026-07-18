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
  const { run, pendingId } = useActionRunner();

  return (
    <Tabs defaultValue="overview">
      <TabsList className="flex flex-wrap">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="users">Users ({company.members.length})</TabsTrigger>
        <TabsTrigger value="organizations">Organizations ({company.clients.length})</TabsTrigger>
        <TabsTrigger value="workspaces">Workspaces ({company.workspaces.length})</TabsTrigger>
        <TabsTrigger value="engagements">Engagements ({company.engagements.length})</TabsTrigger>
        <TabsTrigger value="licenses">License</TabsTrigger>
        <TabsTrigger value="seats">Seats</TabsTrigger>
        <TabsTrigger value="modules">Modules ({company.modules.length})</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        <TabsTrigger value="logins">Login History</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <OverviewTab company={company} />
      </TabsContent>

      <TabsContent value="users">
        <UsersTab company={company} organizations={organizations} basePath={basePath} run={run} pendingId={pendingId} />
      </TabsContent>

      <TabsContent value="organizations">
        <DataTable
          columns={["Organization", "Workspace", "Status"]}
          empty="No client organizations yet."
          rows={company.clients.map((c) => [
            <span key="n" className="font-medium text-foreground">{c.name}</span>,
            c.workspaceName ?? "—",
            <Badge key="s" variant="secondary">{c.status}</Badge>,
          ])}
        />
      </TabsContent>

      <TabsContent value="workspaces">
        <DataTable
          columns={["Workspace", "Members", "Status", "Created"]}
          empty="No workspaces yet."
          rows={company.workspaces.map((w) => [
            <span key="n" className="font-medium text-foreground">{w.name}</span>,
            w.members.toLocaleString(),
            <Badge key="s" variant="secondary">{w.status}</Badge>,
            fmt(w.createdAt),
          ])}
        />
      </TabsContent>

      <TabsContent value="engagements">
        <DataTable
          columns={["Audit / Engagement", "Client", "Type", "Status", "Updated"]}
          empty="No engagements yet."
          rows={company.engagements.map((e) => [
            <span key="n" className="font-medium text-foreground">{e.name}</span>,
            e.clientName,
            <span key="t" className="capitalize">{e.type.replace(/_/g, " ")}</span>,
            <Badge key="s" variant="secondary">{e.status}</Badge>,
            fmt(e.updatedAt),
          ])}
        />
      </TabsContent>

      <TabsContent value="licenses">
        <LicenseTab company={company} />
      </TabsContent>

      <TabsContent value="seats">
        <SeatsTab company={company} />
      </TabsContent>

      <TabsContent value="modules">
        <DataTable
          columns={["Module", "State", "Scope", "Updated"]}
          empty="No module overrides — modules follow plan entitlements."
          rows={company.modules.map((m) => [
            <span key="n" className="font-medium capitalize text-foreground">{m.code.replace(/_/g, " ")}</span>,
            <Badge key="s" variant={m.state === "enabled" ? "success" : "secondary"}>{m.state}</Badge>,
            <span key="sc" className="capitalize">{m.scope}</span>,
            fmt(m.updatedAt),
          ])}
        />
      </TabsContent>

      <TabsContent value="activity">
        <div className="mb-4 flex justify-end">
          <Button
            size="sm"
            variant="outline"
            disabled={company.activity.length === 0}
            onClick={() =>
              downloadCsv(
                timestampedName(`activity-${company.slug}`, "csv"),
                ["Timestamp", "Event", "Severity", "Actor"],
                company.activity.map((e) => [e.timestamp, e.title, e.severity, e.detail]),
              )
            }
          >
            Export CSV
          </Button>
        </div>
        <Timeline events={company.activity} empty="No activity recorded for this company." />
      </TabsContent>

      <TabsContent value="audit">
        <DataTable
          columns={["Timestamp", "Action", "Resource", "Actor"]}
          empty="No audit events recorded."
          rows={company.auditLogs.map((a) => [
            fmt(a.createdAt),
            <span key="a" className="font-medium text-foreground">{a.action}</span>,
            a.resource,
            a.actorEmail,
          ])}
        />
      </TabsContent>

      <TabsContent value="logins">
        <DataTable
          columns={["Date", "User", "IP", "Device", "Browser", "Result"]}
          empty="No login events recorded."
          rows={company.loginHistory.map((l) => [
            fmt(l.createdAt),
            l.email,
            l.ip,
            l.device,
            l.browser,
            <Badge key="r" variant={l.result === "Success" ? "success" : "secondary"}>{l.result}</Badge>,
          ])}
        />
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
  return (
    <div className="space-y-8">
      <PlatformSection title="Company">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Status" value={company.status} tone={company.status === "active" ? "ok" : "warn"} />
          <StatCard label="Type" value={company.tenantType} />
          <StatCard label="Active Users" value={company.activeUsers.toLocaleString()} />
          <StatCard label="Workspaces" value={company.workspaces.length.toLocaleString()} />
          <StatCard label="Engagements" value={company.engagements.length.toLocaleString()} />
          <StatCard label="Modules On" value={company.modules.filter((m) => m.state === "enabled").length.toLocaleString()} />
          <StatCard
            label="Security"
            value={company.security.riskEvents > 0 ? `${company.security.riskEvents} risk` : "Clear"}
            tone={company.security.riskEvents > 0 ? "warn" : "ok"}
          />
          <StatCard label="Last Activity" value={company.lastActivityAt ? new Date(company.lastActivityAt).toLocaleDateString() : "—"} />
        </div>
      </PlatformSection>

      <PlatformSection title="License & Seats">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Plan" value={company.license.planCode ?? "None"} />
          <StatCard label="Seats Purchased" value={company.license.seatLimit.toLocaleString()} />
          <StatCard label="Seats Used" value={company.license.seatsUsed.toLocaleString()} />
          <StatCard
            label="Seats Available"
            value={company.license.seatsAvailable.toLocaleString()}
            tone={company.license.seatsAvailable === 0 ? "warn" : "ok"}
          />
          <StatCard label="License Status" value={company.license.status ?? "—"} />
          <StatCard label="Expiration" value={company.license.endsAt ? new Date(company.license.endsAt).toLocaleDateString() : "Perpetual"} />
        </div>
      </PlatformSection>

      <PlatformSection title="Details">
        <div className="grid gap-x-8 gap-y-3 rounded-xl border border-border/60 p-4 text-sm md:grid-cols-2">
          <Field label="Legal name" value={company.legalName ?? "—"} />
          <Field label="Slug" value={company.slug} />
          <Field label="Created" value={fmt(company.createdAt)} />
          <Field label="Created by" value={company.createdByEmail ?? "—"} />
          <Field label="Platform managed" value={company.platformManaged ? "Yes" : "No"} />
          <Field label="Description" value={company.description ?? "—"} />
        </div>
      </PlatformSection>

      <PlatformSection title="Recent Timeline">
        <Timeline events={company.timeline.slice(0, 25)} empty="No recorded activity yet." />
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
  const [createOpen, setCreateOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [transferUser, setTransferUser] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-end gap-2">
        <Button size="sm" variant="outline" onClick={() => setInviteOpen(true)}>Invite user</Button>
        <Button size="sm" onClick={() => setCreateOpen(true)}>Create user</Button>
      </div>

      {company.members.length === 0 ? (
        <EmptyState title="No users" description="Invite or create the first user for this company." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5">User</th>
                <th className="px-4 py-2.5">Role</th>
                <th className="px-4 py-2.5">Scope</th>
                <th className="px-4 py-2.5">Workspace</th>
                <th className="px-4 py-2.5">Last login</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {company.members.map((m) => {
                const busy = pendingId?.startsWith(m.userId) ?? false;
                return (
                  <tr key={m.membershipId}>
                    <td className="px-4 py-2.5">
                      <Link href={`${basePath}/users/${m.userId}`} className="font-medium text-foreground hover:underline">
                        {m.email}
                      </Link>
                      {m.fullName ? <div className="text-xs text-muted-foreground">{m.fullName}</div> : null}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">{m.roleName}</td>
                    <td className="px-4 py-2.5 capitalize text-muted-foreground">{m.scope}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{m.workspaceName ?? "—"}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{fmt(m.lastSignInAt)}</td>
                    <td className="px-4 py-2.5">
                      {m.isPlatformOwner ? (
                        <Badge variant="info">Platform Owner</Badge>
                      ) : m.suspended ? (
                        <Badge variant="warning">Suspended</Badge>
                      ) : (
                        <Badge variant="success">Active</Badge>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {m.isPlatformOwner ? (
                        <span className="text-xs text-muted-foreground">Protected</span>
                      ) : (
                        <div className="flex flex-wrap justify-end gap-1.5">
                          {m.suspended ? (
                            <Button size="sm" variant="ghost" loading={pendingId === `${m.userId}:enable`} disabled={busy}
                              onClick={() => run(`${m.userId}:enable`, () => activateUserAction({ userId: m.userId }), { success: "User enabled" })}>
                              Enable
                            </Button>
                          ) : (
                            <Button size="sm" variant="ghost" loading={pendingId === `${m.userId}:disable`} disabled={busy}
                              onClick={() => run(`${m.userId}:disable`, () => suspendUserAction({ userId: m.userId }), { success: "User disabled" })}>
                              Disable
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" loading={pendingId === `${m.userId}:reset`} disabled={busy}
                            onClick={() => run(`${m.userId}:reset`, () => resetPasswordAction({ email: m.email }), { success: "Reset email sent" })}>
                            Reset
                          </Button>
                          <Button size="sm" variant="ghost" loading={pendingId === `${m.userId}:logout`} disabled={busy}
                            onClick={() => run(`${m.userId}:logout`, () => forceLogoutAction({ userId: m.userId }), { success: "Sessions revoked" })}>
                            Force logout
                          </Button>
                          <Button size="sm" variant="ghost" loading={pendingId === `${m.userId}:admin`} disabled={busy}
                            onClick={() => run(`${m.userId}:admin`, () => assignCompanyAdminAction({ userId: m.userId, organizationId: company.id }), { success: "Admin assigned" })}>
                            Make admin
                          </Button>
                          <Button size="sm" variant="ghost" disabled={busy} onClick={() => setTransferUser(m.userId)}>
                            Transfer
                          </Button>
                          <Button size="sm" variant="destructive" loading={pendingId === `${m.userId}:delete`} disabled={busy}
                            onClick={() => {
                              if (!window.confirm(`Delete ${m.email}?`)) return;
                              void run(`${m.userId}:delete`, () => deleteUserAction({ userId: m.userId }), { success: "User deleted" });
                            }}>
                            Delete
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
      )}

      <CreateUserModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        companyId={company.id}
        pending={pendingId === "create-user"}
        onSubmit={(values) => run("create-user", () => createUserAction(values), { success: "User created", onSuccess: () => setCreateOpen(false) })}
      />
      <InviteUserModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        companyId={company.id}
        pending={pendingId === "invite-user"}
        onSubmit={(values) => run("invite-user", () => sendInvitationAction(values), { success: "Invitation sent", onSuccess: () => setInviteOpen(false) })}
      />
      <TransferModal
        open={transferUser !== null}
        onClose={() => setTransferUser(null)}
        organizations={organizations.filter((o) => o.id !== company.id)}
        pending={pendingId === "transfer"}
        onSubmit={(toOrganizationId, roleSlug) =>
          transferUser &&
          run("transfer", () => transferUserAction({ userId: transferUser, toOrganizationId, roleSlug }), {
            success: "User transferred",
            onSuccess: () => setTransferUser(null),
          })
        }
      />
    </div>
  );
}

function LicenseTab({ company }: { company: CompanyDetail }) {
  const licenseEvents = company.timeline.filter(
    (e) => e.title.startsWith("subscription.") || e.title.startsWith("license") || e.category === "subscription",
  );
  return (
    <div className="space-y-8">
      <div className="grid gap-x-8 gap-y-3 rounded-xl border border-border/60 p-4 text-sm md:grid-cols-2">
        <Field label="Plan" value={company.license.planCode ?? "None"} />
        <Field label="Status" value={company.license.status ?? "—"} />
        <Field label="Seats" value={`${company.license.seatsUsed} / ${company.license.seatLimit}`} />
        <Field label="Expiration" value={company.license.endsAt ? new Date(company.license.endsAt).toLocaleDateString() : "Perpetual"} />
        <Field label="Enabled modules" value={company.modules.filter((m) => m.state === "enabled").map((m) => m.code).join(", ") || "Plan defaults"} />
      </div>
      <PlatformSection title="License Timeline">
        <Timeline events={licenseEvents} empty="No license changes recorded yet." />
      </PlatformSection>
    </div>
  );
}

function SeatsTab({ company }: { company: CompanyDetail }) {
  const seatEvents = company.timeline.filter((e) => e.title.includes("seat") || e.title.startsWith("subscription.") || e.title.startsWith("user."));
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Purchased" value={company.license.seatLimit.toLocaleString()} />
        <StatCard label="Used" value={company.license.seatsUsed.toLocaleString()} />
        <StatCard label="Available" value={company.license.seatsAvailable.toLocaleString()} tone={company.license.seatsAvailable === 0 ? "warn" : "ok"} />
      </div>
      <PlatformSection title="Seat Timeline (membership & license changes)">
        <Timeline events={seatEvents} empty="No seat activity recorded yet." />
      </PlatformSection>
    </div>
  );
}

function SecurityTab({ company }: { company: CompanyDetail }) {
  const s = company.security;
  const securityEvents = company.activity.filter((e) => e.severity !== "info");
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Suspensions" value={s.suspensions.toLocaleString()} tone={s.suspensions > 0 ? "warn" : "neutral"} />
        <StatCard label="Reactivations" value={s.reactivations.toLocaleString()} />
        <StatCard label="Password Resets" value={s.passwordResets.toLocaleString()} />
        <StatCard label="Force Logouts" value={s.forceLogouts.toLocaleString()} />
        <StatCard label="Security Events" value={s.securityEvents.toLocaleString()} />
        <StatCard label="Risk Events" value={s.riskEvents.toLocaleString()} tone={s.riskEvents > 0 ? "warn" : "ok"} />
      </div>
      <PlatformSection title="Risk & Security Events">
        <Timeline events={securityEvents} empty="No elevated security events." />
      </PlatformSection>
    </div>
  );
}

function SettingsTab({ company, run, pendingId }: { company: CompanyDetail; run: Runner; pendingId: string | null }) {
  const busy = pendingId !== null;
  function exportCompany() {
    downloadJson(timestampedName(`company-${company.slug}`, "json"), company);
  }
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/60 p-4">
        <h3 className="mb-1 text-sm font-semibold">Company status</h3>
        <p className="mb-4 text-sm text-muted-foreground">Current status: <span className="font-medium text-foreground">{company.status}</span></p>
        <div className="flex flex-wrap gap-2">
          {company.status !== "suspended" ? (
            <Button size="sm" variant="outline" loading={pendingId === "suspend"} disabled={busy}
              onClick={() => run("suspend", () => suspendTenantAction({ id: company.id }), { success: "Company suspended" })}>Suspend</Button>
          ) : (
            <Button size="sm" variant="outline" loading={pendingId === "activate"} disabled={busy}
              onClick={() => run("activate", () => activateTenantAction({ id: company.id }), { success: "Company reactivated" })}>Reactivate</Button>
          )}
          {company.status !== "archived" ? (
            <Button size="sm" variant="outline" loading={pendingId === "archive"} disabled={busy}
              onClick={() => run("archive", () => archiveTenantAction({ id: company.id }), { success: "Company archived" })}>Archive</Button>
          ) : (
            <Button size="sm" variant="outline" loading={pendingId === "restore"} disabled={busy}
              onClick={() => run("restore", () => restoreTenantAction({ id: company.id }), { success: "Company restored" })}>Restore</Button>
          )}
          <Button size="sm" variant="destructive" loading={pendingId === "delete"} disabled={busy}
            onClick={() => {
              if (!window.confirm(`Delete ${company.name}? This soft-deletes the company.`)) return;
              void run("delete", () => deleteTenantAction({ id: company.id }), { success: "Company deleted" });
            }}>Delete</Button>
        </div>
      </div>

      <div className="rounded-xl border border-border/60 p-4">
        <h3 className="mb-1 text-sm font-semibold">Export</h3>
        <p className="mb-4 text-sm text-muted-foreground">Download the full company administration bundle.</p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={exportCompany}>Export JSON</Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              downloadCsv(
                timestampedName(`company-users-${company.slug}`, "csv"),
                ["Email", "Role", "Scope", "Workspace", "Status"],
                company.members.map((m) => [m.email, m.roleName, m.scope, m.workspaceName ?? "", m.suspended ? "Suspended" : "Active"]),
              )
            }
          >
            Export users CSV
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [roleSlug, setRoleSlug] = useState("member");
  return (
    <Modal open={open} onOpenChange={(n) => (n ? null : onClose())} title="Create user"
      description="Creates a user inside this company. Seat limits are enforced."
      footer={<>
        <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" loading={pending} onClick={() => onSubmit({ email, password, fullName: fullName || undefined, organizationId: companyId, roleSlug })}>Create</Button>
      </>}>
      <div className="space-y-3">
        <div className="space-y-1"><Label htmlFor="cu-email">Email</Label><Input id="cu-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="space-y-1"><Label htmlFor="cu-pass">Temporary password</Label><Input id="cu-pass" type="text" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <div className="space-y-1"><Label htmlFor="cu-name">Full name (optional)</Label><Input id="cu-name" value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
        <div className="space-y-1"><Label htmlFor="cu-role">Role</Label>
          <Select id="cu-role" value={roleSlug} onChange={(e) => setRoleSlug(e.target.value)}>
            {ASSIGNABLE_ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
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
  const [email, setEmail] = useState("");
  const [roleSlug, setRoleSlug] = useState("member");
  const [expiresInDays, setExpiresInDays] = useState(14);
  return (
    <Modal open={open} onOpenChange={(n) => (n ? null : onClose())} title="Invite user" description="Invite a user by email to this company."
      footer={<>
        <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" loading={pending} onClick={() => onSubmit({ email, organizationId: companyId, roleSlug, expiresInDays })}>Send</Button>
      </>}>
      <div className="space-y-3">
        <div className="space-y-1"><Label htmlFor="iu-email">Email</Label><Input id="iu-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="space-y-1"><Label htmlFor="iu-role">Role</Label>
          <Select id="iu-role" value={roleSlug} onChange={(e) => setRoleSlug(e.target.value)}>
            {ASSIGNABLE_ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </Select>
        </div>
        <div className="space-y-1"><Label htmlFor="iu-days">Expires in (days)</Label><Input id="iu-days" type="number" min={1} max={90} value={expiresInDays} onChange={(e) => setExpiresInDays(Number(e.target.value))} /></div>
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
  const [organizationId, setOrganizationId] = useState(organizations[0]?.id ?? "");
  const [roleSlug, setRoleSlug] = useState("member");
  return (
    <Modal open={open} onOpenChange={(n) => (n ? null : onClose())} title="Transfer user"
      description="Move this user's company membership to another company."
      footer={<>
        <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" loading={pending} disabled={!organizationId} onClick={() => onSubmit(organizationId, roleSlug)}>Transfer</Button>
      </>}>
      <div className="space-y-3">
        <div className="space-y-1"><Label htmlFor="tr-org">Destination company</Label>
          <Select id="tr-org" value={organizationId} onChange={(e) => setOrganizationId(e.target.value)}>
            {organizations.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </Select>
        </div>
        <div className="space-y-1"><Label htmlFor="tr-role">Role</Label>
          <Select id="tr-role" value={roleSlug} onChange={(e) => setRoleSlug(e.target.value)}>
            {ASSIGNABLE_ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </Select>
        </div>
      </div>
    </Modal>
  );
}
