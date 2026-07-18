"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ASSIGNABLE_ROLE_OPTIONS } from "@/config/platform-options";
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
}: {
  users: PlatformUserRow[];
  invitations: InvitationRow[];
  organizations: OrganizationOption[];
}) {
  const { run, pendingId } = useActionRunner();
  const [createOpen, setCreateOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <Tabs defaultValue="users">
      <TabsList>
        <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
        <TabsTrigger value="invitations">Invitations ({invitations.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="users">
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              Create user
            </Button>
          </div>
          {users.length === 0 ? (
            <EmptyState title="No users" description="Create a user or send an invitation." />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5">Email</th>
                    <th className="px-4 py-2.5">Name</th>
                    <th className="px-4 py-2.5">Last sign-in</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {users.map((user) => {
                    const busy = pendingId?.startsWith(user.id) ?? false;
                    return (
                      <tr key={user.id}>
                        <td className="px-4 py-2.5 font-medium">{user.email}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{user.fullName ?? "—"}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{formatDate(user.lastSignInAt)}</td>
                        <td className="px-4 py-2.5">
                          {user.isPlatformOwner ? (
                            <Badge variant="info">Platform Owner</Badge>
                          ) : user.suspended ? (
                            <Badge variant="warning">Suspended</Badge>
                          ) : (
                            <Badge variant="success">Active</Badge>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex flex-wrap justify-end gap-1.5">
                            {user.isPlatformOwner ? (
                              <span className="text-xs text-muted-foreground">Protected</span>
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
                                        success: "User activated",
                                      })
                                    }
                                  >
                                    Activate
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    loading={pendingId === `${user.id}:suspend`}
                                    disabled={busy}
                                    onClick={() =>
                                      run(`${user.id}:suspend`, () => suspendUserAction({ userId: user.id }), {
                                        success: "User suspended",
                                      })
                                    }
                                  >
                                    Suspend
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  loading={pendingId === `${user.id}:reset`}
                                  disabled={busy}
                                  onClick={() =>
                                    run(`${user.id}:reset`, () => resetPasswordAction({ email: user.email }), {
                                      success: "Password reset email sent",
                                    })
                                  }
                                >
                                  Reset password
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  loading={pendingId === `${user.id}:delete`}
                                  disabled={busy}
                                  onClick={() => {
                                    if (!window.confirm(`Delete ${user.email}? This cannot be undone.`)) return;
                                    void run(`${user.id}:delete`, () => deleteUserAction({ userId: user.id }), {
                                      success: "User deleted",
                                    });
                                  }}
                                >
                                  Delete
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
              Send invitation
            </Button>
          </div>
          {invitations.length === 0 ? (
            <EmptyState title="No invitations" description="Invite a tenant user to get started." />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5">Email</th>
                    <th className="px-4 py-2.5">Role</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5">Expires</th>
                    <th className="px-4 py-2.5 text-right">Actions</th>
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
                                  success: "Invitation resent",
                                })
                              }
                            >
                              Resend
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              loading={pendingId === `${invite.id}:revoke`}
                              disabled={busy || revoked}
                              onClick={() =>
                                run(`${invite.id}:revoke`, () => revokeInvitationAction({ id: invite.id }), {
                                  success: "Invitation revoked",
                                })
                              }
                            >
                              Revoke
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
            success: "User created",
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
            success: "Invitation sent",
            onSuccess: () => setInviteOpen(false),
          })
        }
      />
    </Tabs>
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [roleSlug, setRoleSlug] = useState("member");

  return (
    <Modal
      open={open}
      onOpenChange={(next) => (next ? null : onClose())}
      title="Create user"
      description="Creates an authenticated user and optionally assigns a tenant, organization, and role."
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
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
            Create
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="user-email">Email</Label>
          <Input id="user-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="user-password">Temporary password</Label>
          <Input id="user-password" type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="user-name">Full name (optional)</Label>
          <Input id="user-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="user-org">Assign organization (optional)</Label>
          <Select id="user-org" value={organizationId} onChange={(e) => setOrganizationId(e.target.value)}>
            <option value="">No assignment</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </Select>
        </div>
        {organizationId ? (
          <div className="space-y-1">
            <Label htmlFor="user-role">Role</Label>
            <Select id="user-role" value={roleSlug} onChange={(e) => setRoleSlug(e.target.value)}>
              {ASSIGNABLE_ROLE_OPTIONS.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
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
  const [email, setEmail] = useState("");
  const [organizationId, setOrganizationId] = useState(organizations[0]?.id ?? "");
  const [roleSlug, setRoleSlug] = useState("member");
  const [expiresInDays, setExpiresInDays] = useState(14);

  return (
    <Modal
      open={open}
      onOpenChange={(next) => (next ? null : onClose())}
      title="Send invitation"
      description="Invite a tenant user by email."
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            loading={pending}
            onClick={() => onSubmit({ email, organizationId, roleSlug, expiresInDays })}
          >
            Send
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="invite-email">Email</Label>
          <Input id="invite-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="invite-org">Organization</Label>
          <Select id="invite-org" value={organizationId} onChange={(e) => setOrganizationId(e.target.value)}>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="invite-role">Role</Label>
          <Select id="invite-role" value={roleSlug} onChange={(e) => setRoleSlug(e.target.value)}>
            {ASSIGNABLE_ROLE_OPTIONS.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="invite-days">Expires in (days)</Label>
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
