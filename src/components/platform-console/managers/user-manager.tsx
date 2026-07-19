"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ASSIGNABLE_ROLE_OPTIONS } from "@/config/platform-options";
import { usePlatformLabels } from "@/i18n/use-platform-labels";
import { fillPlatform } from "@/i18n/platform-labels";
import type { PlatformUserRow, InvitationRow, OrganizationOption } from "@/lib/platform-console/data";
import {
  createUserAction,
  suspendUserAction,
  activateUserAction,
  deleteUserAction,
  resetPasswordAction,
  sendInvitationAction,
  resendInvitationAction,
  revokeInvitationAction,
  forceLogoutAction,
  assignCompanyAdminAction,
  transferUserAction,
} from "@/lib/platform-console/actions/users";
import { useActionRunner } from "./use-action-runner";

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export function UserManager({
  users,
  invitations,
  organizations,
  detailBasePath,
}: {
  users: PlatformUserRow[];
  invitations: InvitationRow[];
  organizations: OrganizationOption[];
  detailBasePath?: string;
}) {
  const t = usePlatformLabels();
  const { run, pendingId } = useActionRunner();
  const [createOpen, setCreateOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [membershipUser, setMembershipUser] = useState<PlatformUserRow | null>(null);

  return (
    <Tabs defaultValue="users">
      <TabsList>
        <TabsTrigger value="users">{fillPlatform(t.userManager.tabUsers, { count: users.length })}</TabsTrigger>
        <TabsTrigger value="invitations">{fillPlatform(t.userManager.tabInvitations, { count: invitations.length })}</TabsTrigger>
      </TabsList>

      <TabsContent value="users">
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              {t.userManager.createUser}
            </Button>
          </div>
          {users.length === 0 ? (
            <EmptyState title={t.userManager.usersEmptyTitle} description={t.userManager.usersEmptyDescription} />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5">{t.userManager.colEmail}</th>
                    <th className="px-4 py-2.5">{t.userManager.colName}</th>
                    <th className="px-4 py-2.5">{t.userManager.colLastSignIn}</th>
                    <th className="px-4 py-2.5">{t.common.status}</th>
                    <th className="px-4 py-2.5 text-right">{t.common.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {users.map((user) => {
                    const busy = pendingId?.startsWith(user.id) ?? false;
                    return (
                      <tr key={user.id}>
                        <td className="px-4 py-2.5 font-medium">
                          {detailBasePath ? (
                            <Link href={`${detailBasePath}/users/${user.id}`} className="text-foreground hover:underline">
                              {user.email}
                            </Link>
                          ) : (
                            user.email
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">{user.fullName ?? "—"}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{formatDate(user.lastSignInAt)}</td>
                        <td className="px-4 py-2.5">
                          {user.isPlatformOwner ? (
                            <Badge variant="info">{t.common.platformOwner}</Badge>
                          ) : user.suspended ? (
                            <Badge variant="warning">{t.common.suspended}</Badge>
                          ) : (
                            <Badge variant="success">{t.common.active}</Badge>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex flex-wrap justify-end gap-1.5">
                            {user.isPlatformOwner ? (
                              <span className="text-xs text-muted-foreground">{t.common.protected}</span>
                            ) : (
                              <>
                                {user.suspended ? (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    loading={pendingId === `${user.id}:activate`}
                                    disabled={busy}
                                    onClick={() =>
                                      run(`${user.id}:activate`, () => activateUserAction({ userId: user.id }), {
                                        success: t.userManager.toastActivated,
                                      })
                                    }
                                  >
                                    {t.common.activate}
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    loading={pendingId === `${user.id}:suspend`}
                                    disabled={busy}
                                    onClick={() =>
                                      run(`${user.id}:suspend`, () => suspendUserAction({ userId: user.id }), {
                                        success: t.userManager.toastSuspended,
                                      })
                                    }
                                  >
                                    {t.common.suspend}
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  loading={pendingId === `${user.id}:reset`}
                                  disabled={busy}
                                  onClick={() =>
                                    run(`${user.id}:reset`, () => resetPasswordAction({ email: user.email }), {
                                      success: t.userManager.toastResetSent,
                                    })
                                  }
                                >
                                  {t.common.resetPassword}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  loading={pendingId === `${user.id}:logout`}
                                  disabled={busy}
                                  onClick={() =>
                                    run(`${user.id}:logout`, () => forceLogoutAction({ userId: user.id }), {
                                      success: t.userManager.toastSessionsRevoked,
                                    })
                                  }
                                >
                                  {t.common.forceLogout}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  disabled={busy || organizations.length === 0}
                                  onClick={() => setMembershipUser(user)}
                                >
                                  {t.userManager.membership}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  loading={pendingId === `${user.id}:delete`}
                                  disabled={busy}
                                  onClick={() => {
                                    if (!window.confirm(fillPlatform(t.userManager.deleteConfirm, { email: user.email }))) return;
                                    void run(`${user.id}:delete`, () => deleteUserAction({ userId: user.id }), {
                                      success: t.userManager.toastDeleted,
                                    });
                                  }}
                                >
                                  {t.common.delete}
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="invitations">
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setInviteOpen(true)} disabled={organizations.length === 0}>
              {t.userManager.sendInvitation}
            </Button>
          </div>
          {invitations.length === 0 ? (
            <EmptyState title={t.userManager.invitationsEmptyTitle} description={t.userManager.invitationsEmptyDescription} />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5">{t.userManager.colEmail}</th>
                    <th className="px-4 py-2.5">{t.userManager.colRole}</th>
                    <th className="px-4 py-2.5">{t.common.status}</th>
                    <th className="px-4 py-2.5">{t.common.expires}</th>
                    <th className="px-4 py-2.5 text-right">{t.common.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {invitations.map((invite) => {
                    const busy = pendingId?.startsWith(invite.id) ?? false;
                    const revoked = invite.invitationStatus === "revoked";
                    return (
                      <tr key={invite.id}>
                        <td className="px-4 py-2.5 font-medium">{invite.email}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{invite.roleSlug}</td>
                        <td className="px-4 py-2.5">
                          <Badge variant={revoked ? "destructive" : invite.invitationStatus === "pending" ? "warning" : "success"}>
                            {invite.invitationStatus}
                          </Badge>
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">{formatDate(invite.expiresAt)}</td>
                        <td className="px-4 py-2.5">
                          <div className="flex flex-wrap justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="ghost"
                              loading={pendingId === `${invite.id}:resend`}
                              disabled={busy || revoked}
                              onClick={() =>
                                run(`${invite.id}:resend`, () => resendInvitationAction({ id: invite.id }), {
                                  success: t.userManager.toastInviteResent,
                                })
                              }
                            >
                              {t.common.resend}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              loading={pendingId === `${invite.id}:revoke`}
                              disabled={busy || revoked}
                              onClick={() =>
                                run(`${invite.id}:revoke`, () => revokeInvitationAction({ id: invite.id }), {
                                  success: t.userManager.toastInviteRevoked,
                                })
                              }
                            >
                              {t.common.revoke}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </TabsContent>

      <CreateUserModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        organizations={organizations}
        pending={pendingId === "create-user"}
        onSubmit={(values) =>
          run("create-user", () => createUserAction(values), {
            success: t.userManager.toastCreated,
            onSuccess: () => setCreateOpen(false),
          })
        }
      />

      <InviteModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        organizations={organizations}
        pending={pendingId === "invite"}
        onSubmit={(values) =>
          run("invite", () => sendInvitationAction(values), {
            success: t.userManager.toastInviteSent,
            onSuccess: () => setInviteOpen(false),
          })
        }
      />

      <MembershipModal
        user={membershipUser}
        onClose={() => setMembershipUser(null)}
        organizations={organizations}
        pending={pendingId === "assign-admin" || pendingId === "transfer-user"}
        onAssignAdmin={(organizationId) =>
          membershipUser &&
          run("assign-admin", () => assignCompanyAdminAction({ userId: membershipUser.id, organizationId }), {
            success: t.userManager.toastAdminAssigned,
            onSuccess: () => setMembershipUser(null),
          })
        }
        onTransfer={(toOrganizationId, roleSlug) =>
          membershipUser &&
          run(
            "transfer-user",
            () => transferUserAction({ userId: membershipUser.id, toOrganizationId, roleSlug }),
            { success: t.userManager.toastTransferred, onSuccess: () => setMembershipUser(null) },
          )
        }
      />
    </Tabs>
  );
}

function MembershipModal({
  user,
  onClose,
  organizations,
  onAssignAdmin,
  onTransfer,
  pending,
}: {
  user: PlatformUserRow | null;
  onClose: () => void;
  organizations: OrganizationOption[];
  onAssignAdmin: (organizationId: string) => void;
  onTransfer: (toOrganizationId: string, roleSlug: string) => void;
  pending: boolean;
}) {
  const t = usePlatformLabels();
  const [organizationId, setOrganizationId] = useState(organizations[0]?.id ?? "");
  const [roleSlug, setRoleSlug] = useState("member");

  return (
    <Modal
      open={user !== null}
      onOpenChange={(next) => (next ? null : onClose())}
      title={t.userManager.membershipTitle}
      description={user ? fillPlatform(t.userManager.membershipDescription, { email: user.email }) : ""}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button variant="outline" size="sm" loading={pending} disabled={!organizationId} onClick={() => onAssignAdmin(organizationId)}>
            {t.userManager.assignAsAdmin}
          </Button>
          <Button size="sm" loading={pending} disabled={!organizationId} onClick={() => onTransfer(organizationId, roleSlug)}>
            {t.userManager.transferHere}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="member-org">{t.common.company}</Label>
          <Select id="member-org" value={organizationId} onChange={(e) => setOrganizationId(e.target.value)}>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="member-role">{t.userManager.roleOnTransfer}</Label>
          <Select id="member-role" value={roleSlug} onChange={(e) => setRoleSlug(e.target.value)}>
            {ASSIGNABLE_ROLE_OPTIONS.map((role) => (
              <option key={role.value} value={role.value}>
                {t.options.roles[role.value] ?? role.label}
              </option>
            ))}
          </Select>
        </div>
        <p className="text-xs text-muted-foreground">
          {t.userManager.membershipHint}
        </p>
      </div>
    </Modal>
  );
}

function CreateUserModal({
  open,
  onClose,
  organizations,
  onSubmit,
  pending,
}: {
  open: boolean;
  onClose: () => void;
  organizations: OrganizationOption[];
  onSubmit: (values: {
    email: string;
    password: string;
    fullName?: string;
    organizationId?: string;
    roleSlug?: string;
  }) => void;
  pending: boolean;
}) {
  const t = usePlatformLabels();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [roleSlug, setRoleSlug] = useState("member");

  return (
    <Modal
      open={open}
      onOpenChange={(next) => (next ? null : onClose())}
      title={t.userManager.createUserTitle}
      description={t.userManager.createUserDescription}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button
            size="sm"
            loading={pending}
            onClick={() =>
              onSubmit({
                email,
                password,
                fullName: fullName || undefined,
                organizationId: organizationId || undefined,
                roleSlug: organizationId ? roleSlug : undefined,
              })
            }
          >
            {t.common.create}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="user-email">{t.common.email}</Label>
          <Input id="user-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="user-password">{t.userManager.tempPassword}</Label>
          <Input id="user-password" type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="user-name">{t.userManager.fullNameOptional}</Label>
          <Input id="user-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="user-org">{t.userManager.assignOrgOptional}</Label>
          <Select id="user-org" value={organizationId} onChange={(e) => setOrganizationId(e.target.value)}>
            <option value="">{t.userManager.noAssignment}</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </Select>
        </div>
        {organizationId ? (
          <div className="space-y-1">
            <Label htmlFor="user-role">{t.common.role}</Label>
            <Select id="user-role" value={roleSlug} onChange={(e) => setRoleSlug(e.target.value)}>
              {ASSIGNABLE_ROLE_OPTIONS.map((role) => (
                <option key={role.value} value={role.value}>
                  {t.options.roles[role.value] ?? role.label}
                </option>
              ))}
            </Select>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}

function InviteModal({
  open,
  onClose,
  organizations,
  onSubmit,
  pending,
}: {
  open: boolean;
  onClose: () => void;
  organizations: OrganizationOption[];
  onSubmit: (values: {
    email: string;
    organizationId: string;
    roleSlug: string;
    expiresInDays: number;
  }) => void;
  pending: boolean;
}) {
  const t = usePlatformLabels();
  const [email, setEmail] = useState("");
  const [organizationId, setOrganizationId] = useState(organizations[0]?.id ?? "");
  const [roleSlug, setRoleSlug] = useState("member");
  const [expiresInDays, setExpiresInDays] = useState(14);

  return (
    <Modal
      open={open}
      onOpenChange={(next) => (next ? null : onClose())}
      title={t.userManager.inviteTitle}
      description={t.userManager.inviteDescription}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button
            size="sm"
            loading={pending}
            onClick={() => onSubmit({ email, organizationId, roleSlug, expiresInDays })}
          >
            {t.common.send}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="invite-email">{t.common.email}</Label>
          <Input id="invite-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="invite-org">{t.common.organization}</Label>
          <Select id="invite-org" value={organizationId} onChange={(e) => setOrganizationId(e.target.value)}>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="invite-role">{t.common.role}</Label>
          <Select id="invite-role" value={roleSlug} onChange={(e) => setRoleSlug(e.target.value)}>
            {ASSIGNABLE_ROLE_OPTIONS.map((role) => (
              <option key={role.value} value={role.value}>
                {t.options.roles[role.value] ?? role.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="invite-days">{t.userManager.expiresInDays}</Label>
          <Input
            id="invite-days"
            type="number"
            min={1}
            max={90}
            value={expiresInDays}
            onChange={(e) => setExpiresInDays(Number(e.target.value))}
          />
        </div>
      </div>
    </Modal>
  );
}
