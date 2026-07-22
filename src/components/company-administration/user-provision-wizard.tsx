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
  onDone: (kind: "create" | "invite") => void;
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

  const selectedRole = data.roles.find((r) => r.slug === roleSlug);
  const modulePreview = useMemo(() => {
    const codes = selectedRole?.permissions.map((p) => p.code) ?? [];
    return resolveModuleAccess(data.license?.moduleEntitlements ?? {}, codes);
  }, [data.license?.moduleEntitlements, selectedRole]);

  const includedModules = modulePreview.filter((m) => m.state !== "disabled");

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

      reset();
      onDone(mode);
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
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-wizard-title"
        className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-border bg-card shadow-2xl sm:rounded-3xl"
      >
        <div className="border-b border-border px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {mode === "invite" ? labels.wizard.inviteTitle : labels.wizard.title}
          </p>
          <h2 id="user-wizard-title" className="mt-1 text-lg font-semibold tracking-tight">
            {stepLabel}
          </h2>
          <div className="mt-4 flex gap-1.5" aria-hidden>
            {STEPS.map((key, index) => (
              <div
                key={key}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  index <= step ? "bg-foreground" : "bg-muted"
                }`}
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
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-2xl border border-border bg-background px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </label>
              {mode === "create" ? (
                <>
                  <label className="grid gap-1.5 text-sm">
                    <span className="text-muted-foreground">{labels.wizard.fullName}</span>
                    <input
                      type="text"
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-11 rounded-2xl border border-border bg-background px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm">
                    <span className="text-muted-foreground">{labels.wizard.password}</span>
                    <input
                      required
                      type="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 rounded-2xl border border-border bg-background px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </label>
                </>
              ) : null}
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-3">
              <p className="text-sm text-muted-foreground">{labels.wizard.roleHint}</p>
              <div className="grid gap-2" role="radiogroup" aria-label={labels.wizard.stepRole}>
                {data.roles.map((role) => {
                  const selected = roleSlug === role.slug;
                  return (
                    <button
                      key={role.slug}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setRoleSlug(role.slug)}
                      className={`rounded-2xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        selected
                          ? "border-foreground bg-foreground/5 shadow-sm"
                          : "border-border hover:bg-muted/40"
                      }`}
                    >
                      <p className="text-sm font-semibold">{role.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{role.description}</p>
                    </button>
                  );
                })}
              </div>
              {selectedRole ? (
                <div className="rounded-2xl border border-border bg-muted/30 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {labels.wizard.includesHeading}
                  </p>
                  <p className="mt-1 text-sm font-medium">{selectedRole.label}</p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {includedModules.length === 0 ? (
                      <li className="text-xs text-muted-foreground">{labels.wizard.moduleDisabled}</li>
                    ) : (
                      includedModules.map((module) => (
                        <li
                          key={module.key}
                          className="rounded-full bg-background px-2.5 py-1 text-[11px] font-medium"
                        >
                          {module.label}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              ) : null}
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
                  className="h-11 rounded-2xl border border-border bg-background px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
              <div className="rounded-2xl border border-border bg-muted/20 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {labels.wizard.effectiveAccess}
                </p>
                <p className="mt-1 text-sm font-medium">{selectedRole?.label}</p>
              </div>
              <ul className="grid gap-2">
                {modulePreview.map((module) => (
                  <li
                    key={module.key}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-border px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{module.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{module.reason}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
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
            className="h-11 rounded-2xl px-3 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {labels.wizard.cancel}
          </button>
          <div className="flex gap-2">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="h-11 rounded-2xl border border-border px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {labels.wizard.back}
              </button>
            ) : null}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                disabled={step === 0 && (!email || (mode === "create" && !password))}
                onClick={() => setStep((s) => s + 1)}
                className="h-11 rounded-2xl bg-foreground px-4 text-sm font-medium text-background disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {labels.wizard.next}
              </button>
            ) : (
              <button
                type="button"
                disabled={pending}
                onClick={submit}
                aria-busy={pending}
                className="h-11 rounded-2xl bg-foreground px-4 text-sm font-medium text-background disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {pending ? labels.a11y.loading : mode === "invite" ? labels.wizard.submitInvite : labels.wizard.submitCreate}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
