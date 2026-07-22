"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { TENANT_TYPE_OPTIONS } from "@/config/platform-options";
import { usePlatformLabels } from "@/i18n/use-platform-labels";
import { fillPlatform } from "@/i18n/platform-labels";
import type { PlanRow } from "@/lib/platform-console/data";
import { createTenantAction } from "@/lib/platform-console/actions/organizations";
import { createSubscriptionAction } from "@/lib/platform-console/actions/subscriptions";
import { createUserAction } from "@/lib/platform-console/actions/users";
import { useActionRunner } from "./use-action-runner";
import { cn } from "@/lib/ui/cn";

type Step = 1 | 2 | 3 | 4;

/**
 * Guided company provisioning UI. Reuses existing createTenant / createSubscription /
 * createUser actions in sequence — no new business logic.
 */
export function CreateCompanyWizard({
  open,
  onClose,
  plans,
}: {
  open: boolean;
  onClose: () => void;
  plans: PlanRow[];
}) {
  const t = usePlatformLabels();
  const { run, pendingId } = useActionRunner();
  const [step, setStep] = useState<Step>(1);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [tenantType, setTenantType] = useState("business");
  const [legalName, setLegalName] = useState("");
  const [planCode, setPlanCode] = useState(plans.find((p) => p.isDefault)?.planCode ?? plans[0]?.planCode ?? "");
  const [seatLimit, setSeatLimit] = useState(plans.find((p) => p.isDefault)?.seatLimit ?? plans[0]?.seatLimit ?? 5);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminName, setAdminName] = useState("");

  const selectedPlan = useMemo(() => plans.find((p) => p.planCode === planCode), [plans, planCode]);

  function reset() {
    setStep(1);
    setName("");
    setSlug("");
    setTenantType("business");
    setLegalName("");
    setPlanCode(plans.find((p) => p.isDefault)?.planCode ?? plans[0]?.planCode ?? "");
    setSeatLimit(plans.find((p) => p.isDefault)?.seatLimit ?? plans[0]?.seatLimit ?? 5);
    setAdminEmail("");
    setAdminPassword("");
    setAdminName("");
  }

  function handleClose() {
    reset();
    onClose();
  }

  function onPlanChange(code: string) {
    setPlanCode(code);
    const plan = plans.find((p) => p.planCode === code);
    if (plan) {
      setSeatLimit(plan.seatLimit);
      setTenantType(plan.tenantType || tenantType);
    }
  }

  async function finish(withAdmin: boolean) {
    await run(
      "wizard",
      async () => {
        const tenant = await createTenantAction({
          name,
          slug,
          tenantType,
          legalName: legalName || undefined,
        });
        if (!tenant.success) return tenant;

        const orgId = tenant.data.id;
        const sub = await createSubscriptionAction({
          organizationId: orgId,
          planCode,
          tenantType,
          seatLimit,
        });
        if (!sub.success) return sub;

        if (withAdmin && adminEmail && adminPassword) {
          const user = await createUserAction({
            email: adminEmail,
            password: adminPassword,
            fullName: adminName || undefined,
            organizationId: orgId,
            roleSlug: "organization_admin",
          });
          if (!user.success) return user;
        }

        return { success: true as const, data: { id: orgId } };
      },
      {
        success: fillSuccess(t, name),
        onSuccess: () => handleClose(),
      },
    );
  }

  const steps: { id: Step; label: string }[] = [
    { id: 1, label: t.ux.wizardCompany },
    { id: 2, label: t.ux.wizardPlan },
    { id: 3, label: t.ux.wizardSeats },
    { id: 4, label: t.ux.wizardAdmin },
  ];

  const pending = pendingId === "wizard";

  return (
    <Modal
      open={open}
      onOpenChange={(next) => (next ? null : handleClose())}
      title={t.ux.wizardTitle}
      size="md"
      footer={
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            className="min-h-11"
            disabled={step === 1 || pending}
            onClick={() => setStep((s) => (s > 1 ? ((s - 1) as Step) : s))}
          >
            {t.ux.wizardBack}
          </Button>
          <div className="flex flex-wrap gap-2">
            {step < 4 ? (
              <Button
                size="sm"
                className="min-h-11"
                disabled={!canContinue(step, { name, slug, planCode, seatLimit })}
                onClick={() => setStep((s) => (s < 4 ? ((s + 1) as Step) : s))}
              >
                {t.ux.wizardNext}
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="min-h-11"
                  loading={pending}
                  onClick={() => void finish(false)}
                >
                  {t.ux.wizardSkipAdmin}
                </Button>
                <Button
                  size="sm"
                  className="min-h-11"
                  loading={pending}
                  disabled={!adminEmail || !adminPassword}
                  onClick={() => void finish(true)}
                >
                  {t.ux.wizardFinish}
                </Button>
              </>
            )}
          </div>
        </div>
      }
    >
      <ol className="mb-5 flex gap-1 overflow-x-auto pb-1">
        {steps.map((item) => (
          <li
            key={item.id}
            className={cn(
              "min-w-0 flex-1 rounded-lg px-2 py-2 text-center text-xs font-medium",
              item.id === step
                ? "bg-primary text-primary-foreground"
                : item.id < step
                  ? "bg-muted text-foreground"
                  : "bg-muted/40 text-muted-foreground",
            )}
          >
            <span className="block truncate">{item.label}</span>
          </li>
        ))}
      </ol>

      {step === 1 ? (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="wiz-name">{t.entityManager.nameLabel}</Label>
            <Input
              id="wiz-name"
              className="min-h-11"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slug || slug === slugify(name)) setSlug(slugify(e.target.value));
              }}
              placeholder={t.entityManager.namePlaceholder}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="wiz-slug">{t.entityManager.slugLabel}</Label>
            <Input
              id="wiz-slug"
              className="min-h-11"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder={t.entityManager.slugPlaceholder}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="wiz-type">{t.entityManager.tenantTypeLabel}</Label>
            <Select id="wiz-type" className="min-h-11" value={tenantType} onChange={(e) => setTenantType(e.target.value)}>
              {TENANT_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {t.options.tenantType[option.value]}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="wiz-legal">{t.entityManager.legalNameLabel}</Label>
            <Input id="wiz-legal" className="min-h-11" value={legalName} onChange={(e) => setLegalName(e.target.value)} />
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="wiz-plan">{t.common.plan}</Label>
            <Select id="wiz-plan" className="min-h-11" value={planCode} onChange={(e) => onPlanChange(e.target.value)}>
              {plans.map((plan) => (
                <option key={plan.planCode} value={plan.planCode}>
                  {plan.planName} ({plan.planCode})
                </option>
              ))}
            </Select>
          </div>
          {selectedPlan ? (
            <p className="text-sm text-muted-foreground">
              {selectedPlan.tenantType} · {selectedPlan.seatLimit} {t.common.seats.toLowerCase()}
            </p>
          ) : null}
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="wiz-seats">{t.common.seatLimit}</Label>
            <Input
              id="wiz-seats"
              type="number"
              min={0}
              className="min-h-11"
              value={seatLimit}
              onChange={(e) => setSeatLimit(Number(e.target.value))}
            />
          </div>
        </div>
      ) : null}

      {step === 4 ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{t.ux.wizardAdminHint}</p>
          <div className="space-y-1">
            <Label htmlFor="wiz-admin-email">{t.ux.wizardAdminEmail}</Label>
            <Input
              id="wiz-admin-email"
              type="email"
              className="min-h-11"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="wiz-admin-pass">{t.ux.wizardAdminPassword}</Label>
            <Input
              id="wiz-admin-pass"
              type="text"
              className="min-h-11"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="wiz-admin-name">{t.ux.wizardAdminName}</Label>
            <Input
              id="wiz-admin-name"
              className="min-h-11"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
            />
          </div>
        </div>
      ) : null}
    </Modal>
  );
}

function canContinue(
  step: Step,
  values: { name: string; slug: string; planCode: string; seatLimit: number },
): boolean {
  if (step === 1) return values.name.trim().length >= 2 && values.slug.trim().length >= 2;
  if (step === 2) return Boolean(values.planCode);
  if (step === 3) return Number.isInteger(values.seatLimit) && values.seatLimit >= 0;
  return true;
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function fillSuccess(
  t: ReturnType<typeof usePlatformLabels>,
  name: string,
): string {
  return fillPlatform(t.entityManager.toastCreated, { label: name || t.common.company });
}
