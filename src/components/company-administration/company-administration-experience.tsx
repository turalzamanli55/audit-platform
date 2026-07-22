"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { COMPANY_ADMIN_ASSIGNABLE_ROLES } from "@/constants/membership";
import type { CompanyAdministrationData } from "@/lib/company-administration/load-company-administration";
import {
  companyInviteUserAction,
  companyCreateUserAction,
  companyDisableUserAction,
  companyReactivateUserAction,
  companyDeleteUserAction,
  companyResetPasswordAction,
  companyChangeRoleAction,
  companyAssignWorkspaceMembershipAction,
  companyRevokeInvitationAction,
} from "@/lib/actions/company-administration/company-administration-actions";

export type CompanyAdministrationLabels = {
  title: string;
  subtitle: string;
  navAdministration: string;
  tabs: {
    users: string;
    invitations: string;
    roles: string;
    activity: string;
    logins: string;
    seats: string;
  };
  seats: {
    purchased: string;
    used: string;
    available: string;
    none: string;
  };
  users: {
    heading: string;
    email: string;
    name: string;
    role: string;
    workspace: string;
    status: string;
    actions: string;
    active: string;
    suspended: string;
    inactive: string;
    invite: string;
    create: string;
    disable: string;
    reactivate: string;
    delete: string;
    resetPassword: string;
    changeRole: string;
    assignWorkspace: string;
    empty: string;
    confirmDelete: string;
  };
  forms: {
    email: string;
    password: string;
    fullName: string;
    role: string;
    workspace: string;
    workspaceOptional: string;
    submitInvite: string;
    submitCreate: string;
    submitRole: string;
    submitWorkspace: string;
    cancel: string;
  };
  invitations: {
    heading: string;
    empty: string;
    revoke: string;
    expires: string;
  };
  roles: {
    heading: string;
    description: string;
    permissionsNote: string;
  };
  activity: {
    heading: string;
    empty: string;
    actor: string;
    action: string;
    when: string;
  };
  logins: {
    heading: string;
    empty: string;
    ip: string;
    agent: string;
  };
  messages: {
    success: string;
    forbidden: string;
    readOnly: string;
  };
};

type Props = {
  data: CompanyAdministrationData;
  labels: CompanyAdministrationLabels;
};

function formatDate(value: string): string {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

export function CompanyAdministrationExperience({ data, labels }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [roleTarget, setRoleTarget] = useState<string | null>(null);
  const [workspaceTarget, setWorkspaceTarget] = useState<string | null>(null);

  const roleOptions = useMemo(() => COMPANY_ADMIN_ASSIGNABLE_ROLES, []);

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
      setInviteOpen(false);
      setCreateOpen(false);
      setRoleTarget(null);
      setWorkspaceTarget(null);
      router.refresh();
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <header className="flex flex-col gap-2 border-b border-border pb-6">
        <p className="text-sm text-muted-foreground">{data.organizationName}</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{labels.title}</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">{labels.subtitle}</p>
        <div className="mt-2 flex flex-wrap gap-4 text-sm">
          <span>
            {labels.seats.purchased}: <strong>{data.seats.seatLimit}</strong>
          </span>
          <span>
            {labels.seats.used}: <strong>{data.seats.seatsUsed}</strong>
          </span>
          <span>
            {labels.seats.available}: <strong>{data.seats.seatsAvailable}</strong>
          </span>
        </div>
      </header>

      {error ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}
      {notice ? (
        <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-foreground">
          {notice}
        </div>
      ) : null}
      {!data.canAdminister ? (
        <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
          {labels.messages.readOnly}
        </div>
      ) : null}

      <Tabs defaultValue="users">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="users">{labels.tabs.users}</TabsTrigger>
          <TabsTrigger value="invitations">{labels.tabs.invitations}</TabsTrigger>
          <TabsTrigger value="roles">{labels.tabs.roles}</TabsTrigger>
          <TabsTrigger value="activity">{labels.tabs.activity}</TabsTrigger>
          <TabsTrigger value="logins">{labels.tabs.logins}</TabsTrigger>
          <TabsTrigger value="seats">{labels.tabs.seats}</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4 space-y-4">
          {data.canAdminister ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex h-9 items-center rounded-md bg-foreground px-3 text-sm text-background disabled:opacity-50"
                disabled={pending || data.seats.seatsAvailable <= 0}
                onClick={() => {
                  setInviteOpen(true);
                  setCreateOpen(false);
                }}
              >
                {labels.users.invite}
              </button>
              <button
                type="button"
                className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm disabled:opacity-50"
                disabled={pending || data.seats.seatsAvailable <= 0}
                onClick={() => {
                  setCreateOpen(true);
                  setInviteOpen(false);
                }}
              >
                {labels.users.create}
              </button>
            </div>
          ) : null}

          {inviteOpen ? (
            <InviteForm
              labels={labels}
              roleOptions={roleOptions}
              pending={pending}
              onCancel={() => setInviteOpen(false)}
              onSubmit={(values) =>
                run(async () => companyInviteUserAction(values))
              }
            />
          ) : null}

          {createOpen ? (
            <CreateForm
              labels={labels}
              workspaces={data.workspaces}
              roleOptions={roleOptions}
              pending={pending}
              onCancel={() => setCreateOpen(false)}
              onSubmit={(values) =>
                run(async () => companyCreateUserAction(values))
              }
            />
          ) : null}

          {data.users.length === 0 ? (
            <p className="text-sm text-muted-foreground">{labels.users.empty}</p>
          ) : (
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-muted/40 text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">{labels.users.email}</th>
                    <th className="px-3 py-2 font-medium">{labels.users.name}</th>
                    <th className="px-3 py-2 font-medium">{labels.users.role}</th>
                    <th className="px-3 py-2 font-medium">{labels.users.workspace}</th>
                    <th className="px-3 py-2 font-medium">{labels.users.status}</th>
                    {data.canAdminister ? (
                      <th className="px-3 py-2 font-medium">{labels.users.actions}</th>
                    ) : null}
                  </tr>
                </thead>
                <tbody>
                  {data.users.map((user) => (
                    <tr key={user.membershipId} className="border-t border-border">
                      <td className="px-3 py-2">{user.email || "—"}</td>
                      <td className="px-3 py-2">{user.fullName || "—"}</td>
                      <td className="px-3 py-2">{user.roleName}</td>
                      <td className="px-3 py-2">{user.workspaceName ?? "—"}</td>
                      <td className="px-3 py-2">
                        {user.suspended
                          ? labels.users.suspended
                          : user.status === "inactive"
                            ? labels.users.inactive
                            : labels.users.active}
                      </td>
                      {data.canAdminister ? (
                        <td className="px-3 py-2">
                          <div className="flex flex-wrap gap-1">
                            <ActionButton
                              disabled={pending}
                              label={labels.users.changeRole}
                              onClick={() => setRoleTarget(user.membershipId)}
                            />
                            <ActionButton
                              disabled={pending}
                              label={labels.users.assignWorkspace}
                              onClick={() => setWorkspaceTarget(user.userId)}
                            />
                            <ActionButton
                              disabled={pending}
                              label={labels.users.resetPassword}
                              onClick={() =>
                                run(async () =>
                                  companyResetPasswordAction({
                                    email: user.email,
                                    userId: user.userId,
                                  }),
                                )
                              }
                            />
                            {user.suspended || user.status === "inactive" ? (
                              <ActionButton
                                disabled={pending}
                                label={labels.users.reactivate}
                                onClick={() =>
                                  run(async () =>
                                    companyReactivateUserAction({
                                      membershipId: user.membershipId,
                                      userId: user.userId,
                                    }),
                                  )
                                }
                              />
                            ) : (
                              <ActionButton
                                disabled={pending}
                                label={labels.users.disable}
                                onClick={() =>
                                  run(async () =>
                                    companyDisableUserAction({
                                      membershipId: user.membershipId,
                                      userId: user.userId,
                                    }),
                                  )
                                }
                              />
                            )}
                            <ActionButton
                              disabled={pending}
                              label={labels.users.delete}
                              onClick={() => {
                                if (!window.confirm(labels.users.confirmDelete)) return;
                                run(async () =>
                                  companyDeleteUserAction({
                                    membershipId: user.membershipId,
                                    userId: user.userId,
                                  }),
                                );
                              }}
                            />
                          </div>
                          {roleTarget === user.membershipId ? (
                            <RoleForm
                              labels={labels}
                              roleOptions={roleOptions}
                              pending={pending}
                              onCancel={() => setRoleTarget(null)}
                              onSubmit={(roleSlug) =>
                                run(async () =>
                                  companyChangeRoleAction({
                                    membershipId: user.membershipId,
                                    userId: user.userId,
                                    roleSlug,
                                  }),
                                )
                              }
                            />
                          ) : null}
                          {workspaceTarget === user.userId ? (
                            <WorkspaceForm
                              labels={labels}
                              workspaces={data.workspaces}
                              roleOptions={roleOptions}
                              pending={pending}
                              onCancel={() => setWorkspaceTarget(null)}
                              onSubmit={(values) =>
                                run(async () =>
                                  companyAssignWorkspaceMembershipAction({
                                    userId: user.userId,
                                    workspaceId: values.workspaceId,
                                    roleSlug: values.roleSlug,
                                  }),
                                )
                              }
                            />
                          ) : null}
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="invitations" className="mt-4 space-y-3">
          <h2 className="text-base font-medium">{labels.invitations.heading}</h2>
          {data.invitations.length === 0 ? (
            <p className="text-sm text-muted-foreground">{labels.invitations.empty}</p>
          ) : (
            <ul className="divide-y divide-border rounded-md border border-border">
              {data.invitations.map((invite) => (
                <li
                  key={invite.id}
                  className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium">{invite.email}</p>
                    <p className="text-muted-foreground">
                      {invite.roleSlug} · {labels.invitations.expires}{" "}
                      {formatDate(invite.expiresAt)}
                    </p>
                  </div>
                  {data.canAdminister ? (
                    <ActionButton
                      disabled={pending}
                      label={labels.invitations.revoke}
                      onClick={() =>
                        run(async () =>
                          companyRevokeInvitationAction({ invitationId: invite.id }),
                        )
                      }
                    />
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="roles" className="mt-4 space-y-3">
          <h2 className="text-base font-medium">{labels.roles.heading}</h2>
          <p className="text-sm text-muted-foreground">{labels.roles.description}</p>
          <p className="text-sm text-muted-foreground">{labels.roles.permissionsNote}</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {roleOptions.map((role) => (
              <li key={role.value} className="rounded-md border border-border px-3 py-2 text-sm">
                <p className="font-medium">{role.label}</p>
                <p className="text-muted-foreground">{role.value}</p>
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="activity" className="mt-4 space-y-3">
          <h2 className="text-base font-medium">{labels.activity.heading}</h2>
          {data.activity.length === 0 ? (
            <p className="text-sm text-muted-foreground">{labels.activity.empty}</p>
          ) : (
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-muted/40 text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">{labels.activity.when}</th>
                    <th className="px-3 py-2 font-medium">{labels.activity.actor}</th>
                    <th className="px-3 py-2 font-medium">{labels.activity.action}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.activity.map((row) => (
                    <tr key={row.id} className="border-t border-border">
                      <td className="px-3 py-2 whitespace-nowrap">{formatDate(row.createdAt)}</td>
                      <td className="px-3 py-2">{row.actorEmail}</td>
                      <td className="px-3 py-2">{row.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="logins" className="mt-4 space-y-3">
          <h2 className="text-base font-medium">{labels.logins.heading}</h2>
          {data.loginHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">{labels.logins.empty}</p>
          ) : (
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-muted/40 text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">{labels.activity.when}</th>
                    <th className="px-3 py-2 font-medium">{labels.activity.actor}</th>
                    <th className="px-3 py-2 font-medium">{labels.logins.ip}</th>
                    <th className="px-3 py-2 font-medium">{labels.logins.agent}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.loginHistory.map((row) => (
                    <tr key={row.id} className="border-t border-border">
                      <td className="px-3 py-2 whitespace-nowrap">{formatDate(row.createdAt)}</td>
                      <td className="px-3 py-2">{row.actorEmail}</td>
                      <td className="px-3 py-2">{row.ipAddress}</td>
                      <td className="max-w-xs truncate px-3 py-2">{row.userAgent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="seats" className="mt-4 space-y-3">
          <h2 className="text-base font-medium">{labels.tabs.seats}</h2>
          {!data.seats.subscriptionId ? (
            <p className="text-sm text-muted-foreground">{labels.seats.none}</p>
          ) : (
            <dl className="grid max-w-md gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-md border border-border px-3 py-3">
                <dt className="text-muted-foreground">{labels.seats.purchased}</dt>
                <dd className="mt-1 text-2xl font-semibold">{data.seats.seatLimit}</dd>
              </div>
              <div className="rounded-md border border-border px-3 py-3">
                <dt className="text-muted-foreground">{labels.seats.used}</dt>
                <dd className="mt-1 text-2xl font-semibold">{data.seats.seatsUsed}</dd>
              </div>
              <div className="rounded-md border border-border px-3 py-3">
                <dt className="text-muted-foreground">{labels.seats.available}</dt>
                <dd className="mt-1 text-2xl font-semibold">{data.seats.seatsAvailable}</dd>
              </div>
            </dl>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ActionButton({
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
      className="inline-flex h-7 items-center rounded border border-border px-2 text-xs disabled:opacity-50"
    >
      {label}
    </button>
  );
}

function InviteForm({
  labels,
  roleOptions,
  pending,
  onCancel,
  onSubmit,
}: {
  labels: CompanyAdministrationLabels;
  roleOptions: typeof COMPANY_ADMIN_ASSIGNABLE_ROLES;
  pending: boolean;
  onCancel: () => void;
  onSubmit: (values: {
    email: string;
    roleSlug: string;
  }) => void;
}) {
  const [email, setEmail] = useState("");
  const [roleSlug, setRoleSlug] = useState<string>(roleOptions[3]?.value ?? "member");

  return (
    <form
      className="grid gap-3 rounded-md border border-border p-4 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          email,
          roleSlug,
        });
      }}
    >
      <label className="grid gap-1 text-sm">
        <span>{labels.forms.email}</span>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-9 rounded-md border border-border bg-background px-2"
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span>{labels.forms.role}</span>
        <select
          value={roleSlug}
          onChange={(e) => setRoleSlug(e.target.value)}
          className="h-9 rounded-md border border-border bg-background px-2"
        >
          {roleOptions.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
      </label>
      <div className="flex gap-2 sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-9 items-center rounded-md bg-foreground px-3 text-sm text-background disabled:opacity-50"
        >
          {labels.forms.submitInvite}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm"
        >
          {labels.forms.cancel}
        </button>
      </div>
    </form>
  );
}

function CreateForm({
  labels,
  workspaces,
  roleOptions,
  pending,
  onCancel,
  onSubmit,
}: {
  labels: CompanyAdministrationLabels;
  workspaces: CompanyAdministrationData["workspaces"];
  roleOptions: typeof COMPANY_ADMIN_ASSIGNABLE_ROLES;
  pending: boolean;
  onCancel: () => void;
  onSubmit: (values: {
    email: string;
    password: string;
    fullName?: string;
    roleSlug: string;
    workspaceId?: string | null;
  }) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [roleSlug, setRoleSlug] = useState<string>(roleOptions[3]?.value ?? "member");
  const [workspaceId, setWorkspaceId] = useState("");

  return (
    <form
      className="grid gap-3 rounded-md border border-border p-4 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          email,
          password,
          fullName: fullName || undefined,
          roleSlug,
          workspaceId: workspaceId || null,
        });
      }}
    >
      <label className="grid gap-1 text-sm">
        <span>{labels.forms.email}</span>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-9 rounded-md border border-border bg-background px-2"
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span>{labels.forms.fullName}</span>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="h-9 rounded-md border border-border bg-background px-2"
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span>{labels.forms.password}</span>
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-9 rounded-md border border-border bg-background px-2"
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span>{labels.forms.role}</span>
        <select
          value={roleSlug}
          onChange={(e) => setRoleSlug(e.target.value)}
          className="h-9 rounded-md border border-border bg-background px-2"
        >
          {roleOptions.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm sm:col-span-2">
        <span>{labels.forms.workspaceOptional}</span>
        <select
          value={workspaceId}
          onChange={(e) => setWorkspaceId(e.target.value)}
          className="h-9 rounded-md border border-border bg-background px-2"
        >
          <option value="">{labels.forms.workspaceOptional}</option>
          {workspaces.map((ws) => (
            <option key={ws.id} value={ws.id}>
              {ws.name}
            </option>
          ))}
        </select>
      </label>
      <div className="flex gap-2 sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-9 items-center rounded-md bg-foreground px-3 text-sm text-background disabled:opacity-50"
        >
          {labels.forms.submitCreate}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm"
        >
          {labels.forms.cancel}
        </button>
      </div>
    </form>
  );
}

function RoleForm({
  labels,
  roleOptions,
  pending,
  onCancel,
  onSubmit,
}: {
  labels: CompanyAdministrationLabels;
  roleOptions: typeof COMPANY_ADMIN_ASSIGNABLE_ROLES;
  pending: boolean;
  onCancel: () => void;
  onSubmit: (roleSlug: string) => void;
}) {
  const [roleSlug, setRoleSlug] = useState<string>(roleOptions[3]?.value ?? "member");
  return (
    <form
      className="mt-2 flex flex-wrap items-end gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(roleSlug);
      }}
    >
      <label className="grid gap-1 text-xs">
        <span>{labels.forms.role}</span>
        <select
          value={roleSlug}
          onChange={(e) => setRoleSlug(e.target.value)}
          className="h-8 rounded-md border border-border bg-background px-2"
        >
          {roleOptions.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-8 items-center rounded-md bg-foreground px-2 text-xs text-background disabled:opacity-50"
      >
        {labels.forms.submitRole}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex h-8 items-center rounded-md border border-border px-2 text-xs"
      >
        {labels.forms.cancel}
      </button>
    </form>
  );
}

function WorkspaceForm({
  labels,
  workspaces,
  roleOptions,
  pending,
  onCancel,
  onSubmit,
}: {
  labels: CompanyAdministrationLabels;
  workspaces: CompanyAdministrationData["workspaces"];
  roleOptions: typeof COMPANY_ADMIN_ASSIGNABLE_ROLES;
  pending: boolean;
  onCancel: () => void;
  onSubmit: (values: { workspaceId: string; roleSlug: string }) => void;
}) {
  const [workspaceId, setWorkspaceId] = useState(workspaces[0]?.id ?? "");
  const [roleSlug, setRoleSlug] = useState<string>(roleOptions[3]?.value ?? "member");
  return (
    <form
      className="mt-2 flex flex-wrap items-end gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (!workspaceId) return;
        onSubmit({ workspaceId, roleSlug });
      }}
    >
      <label className="grid gap-1 text-xs">
        <span>{labels.forms.workspace}</span>
        <select
          required
          value={workspaceId}
          onChange={(e) => setWorkspaceId(e.target.value)}
          className="h-8 rounded-md border border-border bg-background px-2"
        >
          {workspaces.map((ws) => (
            <option key={ws.id} value={ws.id}>
              {ws.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-xs">
        <span>{labels.forms.role}</span>
        <select
          value={roleSlug}
          onChange={(e) => setRoleSlug(e.target.value)}
          className="h-8 rounded-md border border-border bg-background px-2"
        >
          {roleOptions.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        disabled={pending || !workspaceId}
        className="inline-flex h-8 items-center rounded-md bg-foreground px-2 text-xs text-background disabled:opacity-50"
      >
        {labels.forms.submitWorkspace}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex h-8 items-center rounded-md border border-border px-2 text-xs"
      >
        {labels.forms.cancel}
      </button>
    </form>
  );
}
