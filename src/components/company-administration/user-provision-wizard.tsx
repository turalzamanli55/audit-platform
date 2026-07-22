"use client";

import { useMemo, useState, useTransition } from "react";
import type { CompanyAdministrationData } from "@/lib/company-administration/load-company-administration";
import { resolveModuleAccess } from "@/lib/company-administration/modules";
import {
  companyCreateUserAction,
  companyInviteUserAction,
} from "@/lib/actions/company-administration/company-administration-actions";
import type { CompanyAdministrationLabels } from "./labels";

type Props = {
  data: CompanyAdministrationData;
  labels: CompanyAdministrationLabels;
  mode: "create" | "invite";
  open: boolean;
  onClose: () => void;
  onDone: () => void;
  onError: (message: string) => void;
};

const STEPS = ["info", "role", "workspace", "modules"] as const;

export function UserProvisionWizard({
  data,
  labels,
  mode,
  open,
  onClose,
  onDone,
  onError,
}: Props) {
  const [step, setStep] = useState(0);
  const [pending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [roleSlug, setRoleSlug] = useState(data.roles[3]?.slug ?? "member");
  const [workspaceId, setWorkspaceId] = useState("");

  const modulePreview = useMemo(() => {
    const role = data.roles.find((r) => r.slug === roleSlug);
    const codes = role?.permissions.map((p) => p.code) ?? [];
    return resolveModuleAccess(data.license?.moduleEntitlements ?? {}, codes);
  }, [data.license?.moduleEntitlements, data.roles, roleSlug]);

  if (!open) return null;

  function reset() {
    setStep(0);
    setEmail("");
    setFullName("");
    setPassword("");
    setRoleSlug(data.roles[3]?.slug ?? "member");
    setWorkspaceId("");
  }

  function close() {
    reset();
    onClose();
  }

  function submit() {
    startTransition(async () => {
      const result =
        mode === "invite"
          ? await companyInviteUserAction({ email, roleSlug })
          : await companyCreateUserAction({
              email,
              password,
              fullName: fullName || undefined,
              roleSlug,
              workspaceId: workspaceId || null,
            });

      if (!result.success) {
        onError(result.error.message);
        return;
      }

      if (mode === "invite" && workspaceId) {
        // Workspace assignment after invite acceptance is done from Team → Assign workspace.
      }

      if (mode === "create" && workspaceId) {
        // create action already assigns workspace when provided
      }

      reset();
      onDone();
    });
  }

  const stepLabel =
    step === 0
      ? labels.wizard.stepInfo
      : step === 1
        ? labels.wizard.stepRole
        : step === 2
          ? labels.wizard.stepWorkspace
          : labels.wizard.stepModules;

  return (
    <div className="fixed inset-0 z-[1600] flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label={labels.wizard.cancel}
        onClick={close}
      />
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-border bg-card shadow-2xl sm:rounded-2xl">
        <div className="border-b border-border px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {mode === "invite" ? labels.wizard.inviteTitle : labels.wizard.title}
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight">{stepLabel}</h2>
          <div className="mt-4 flex gap-1.5">
            {STEPS.map((key, index) => (
              <div
                key={key}
                className={`h-1 flex-1 rounded-full ${index <= step ? "bg-foreground" : "bg-muted"}`}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {step === 0 ? (
            <div className="grid gap-3">
              <label className="grid gap-1.5 text-sm">
                <span className="text-muted-foreground">{labels.wizard.email}</span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-xl border border-border bg-background px-3"
                />
              </label>
              {mode === "create" ? (
                <>
                  <label className="grid gap-1.5 text-sm">
                    <span className="text-muted-foreground">{labels.wizard.fullName}</span>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-11 rounded-xl border border-border bg-background px-3"
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm">
                    <span className="text-muted-foreground">{labels.wizard.password}</span>
                    <input
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 rounded-xl border border-border bg-background px-3"
                    />
                  </label>
                </>
              ) : null}
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-3">
              <p className="text-sm text-muted-foreground">{labels.wizard.roleHint}</p>
              <div className="grid gap-2">
                {data.roles.map((role) => (
                  <button
                    key={role.slug}
                    type="button"
                    onClick={() => setRoleSlug(role.slug)}
                    className={`rounded-xl border px-4 py-3 text-left transition ${
                      roleSlug === role.slug
                        ? "border-foreground bg-foreground/5"
                        : "border-border hover:bg-muted/40"
                    }`}
                  >
                    <p className="text-sm font-medium">{role.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{role.description}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-3">
              <p className="text-sm text-muted-foreground">{labels.wizard.workspaceHint}</p>
              <label className="grid gap-1.5 text-sm">
                <span className="text-muted-foreground">{labels.wizard.workspaceOptional}</span>
                <select
                  value={workspaceId}
                  onChange={(e) => setWorkspaceId(e.target.value)}
                  className="h-11 rounded-xl border border-border bg-background px-3"
                >
                  <option value="">{labels.wizard.workspaceOptional}</option>
                  {data.workspaces.map((ws) => (
                    <option key={ws.id} value={ws.id}>
                      {ws.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="grid gap-3">
              <p className="text-sm text-muted-foreground">{labels.wizard.modulesHint}</p>
              <ul className="grid gap-2">
                {modulePreview.map((module) => (
                  <li
                    key={module.key}
                    className="flex items-start justify-between gap-3 rounded-xl border border-border px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{module.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{module.reason}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      {module.state === "inherited"
                        ? labels.wizard.moduleInherited
                        : module.state === "enabled"
                          ? labels.wizard.moduleEnabled
                          : labels.wizard.moduleDisabled}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={close}
            className="h-10 rounded-xl px-3 text-sm text-muted-foreground hover:text-foreground"
          >
            {labels.wizard.cancel}
          </button>
          <div className="flex gap-2">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="h-10 rounded-xl border border-border px-4 text-sm"
              >
                {labels.wizard.back}
              </button>
            ) : null}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                disabled={step === 0 && (!email || (mode === "create" && !password))}
                onClick={() => setStep((s) => s + 1)}
                className="h-10 rounded-xl bg-foreground px-4 text-sm text-background disabled:opacity-40"
              >
                {labels.wizard.next}
              </button>
            ) : (
              <button
                type="button"
                disabled={pending}
                onClick={submit}
                className="h-10 rounded-xl bg-foreground px-4 text-sm text-background disabled:opacity-40"
              >
                {mode === "invite" ? labels.wizard.submitInvite : labels.wizard.submitCreate}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
