"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { TENANT_TYPE_OPTIONS } from "@/config/platform-options";
import { usePlatformLabels } from "@/i18n/use-platform-labels";
import type { SubscriptionRow, OrganizationOption, PlanRow } from "@/lib/platform-console/data";
import {
  createSubscriptionAction,
  updateSubscriptionAction,
  pauseSubscriptionAction,
  resumeSubscriptionAction,
  expireSubscriptionAction,
  cancelSubscriptionAction,
} from "@/lib/platform-console/actions/subscriptions";
import {
  LICENSE_DURATION_OPTIONS,
  computeEndsAtFromDuration,
} from "@/lib/platform-console/tenant-lifecycle";
import { useActionRunner } from "./use-action-runner";

const STATUS_VARIANT: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  active: "success",
  trial: "success",
  suspended: "warning",
  expired: "destructive",
  cancelled: "destructive",
};

export function SubscriptionManager({
  subscriptions,
  organizations,
  plans,
}: {
  subscriptions: SubscriptionRow[];
  organizations: OrganizationOption[];
  plans: PlanRow[];
}) {
  const t = usePlatformLabels();
  const { run, pendingId } = useActionRunner();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<SubscriptionRow | null>(null);
  const orgName = (id: string) => organizations.find((o) => o.id === id)?.name ?? id;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setCreateOpen(true)} disabled={organizations.length === 0}>
          {t.subscriptionManager.create}
        </Button>
      </div>

      {subscriptions.length === 0 ? (
        <EmptyState title={t.subscriptionManager.emptyTitle} description={t.subscriptionManager.emptyDescription} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5">{t.subscriptionManager.colTenant}</th>
                <th className="px-4 py-2.5">{t.subscriptionManager.colPlan}</th>
                <th className="px-4 py-2.5">{t.subscriptionManager.colSeats}</th>
                <th className="px-4 py-2.5">{t.common.status}</th>
                <th className="px-4 py-2.5 text-right">{t.common.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {subscriptions.map((sub) => {
                const busy = pendingId?.startsWith(sub.id) ?? false;
                const active = sub.subscriptionStatus === "active" || sub.subscriptionStatus === "trial";
                return (
                  <tr key={sub.id}>
                    <td className="px-4 py-2.5 font-medium">{orgName(sub.organizationId)}</td>
                    <td className="px-4 py-2.5">{sub.planCode}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {sub.seatsUsed}/{sub.seatLimit}
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge variant={STATUS_VARIANT[sub.subscriptionStatus] ?? "secondary"}>
                        {sub.subscriptionStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex flex-wrap justify-end gap-1.5">
                        <Button size="sm" variant="ghost" disabled={busy} onClick={() => setEditing(sub)}>
                          {t.subscriptionManager.changePlan}
                        </Button>
                        {active ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            loading={pendingId === `${sub.id}:pause`}
                            disabled={busy}
                            onClick={() =>
                              run(`${sub.id}:pause`, () => pauseSubscriptionAction({ id: sub.id }), {
                                success: t.subscriptionManager.toastPaused,
                              })
                            }
                          >
                            {t.common.pause}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            loading={pendingId === `${sub.id}:resume`}
                            disabled={busy}
                            onClick={() =>
                              run(`${sub.id}:resume`, () => resumeSubscriptionAction({ id: sub.id }), {
                                success: t.subscriptionManager.toastResumed,
                              })
                            }
                          >
                            {t.common.resume}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          loading={pendingId === `${sub.id}:expire`}
                          disabled={busy}
                          onClick={() =>
                            run(`${sub.id}:expire`, () => expireSubscriptionAction({ id: sub.id }), {
                              success: t.subscriptionManager.toastExpired,
                            })
                          }
                        >
                          {t.common.expire}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          loading={pendingId === `${sub.id}:cancel`}
                          disabled={busy}
                          onClick={() => {
                            if (!window.confirm(t.subscriptionManager.cancelConfirm)) return;
                            void run(`${sub.id}:cancel`, () => cancelSubscriptionAction({ id: sub.id }), {
                              success: t.subscriptionManager.toastCancelled,
                            });
                          }}
                        >
                          {t.common.cancel}
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

      <CreateSubscriptionModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        organizations={organizations}
        plans={plans}
        pending={pendingId === "create-sub"}
        onSubmit={(values) =>
          run("create-sub", () => createSubscriptionAction(values), {
            success: t.subscriptionManager.toastCreated,
            onSuccess: () => setCreateOpen(false),
          })
        }
      />

      {editing ? (
        <ChangePlanModal
          subscription={editing}
          plans={plans}
          onClose={() => setEditing(null)}
          pending={pendingId === "edit-sub"}
          onSubmit={(values) =>
            run("edit-sub", () => updateSubscriptionAction({ id: editing.id, ...values }), {
              success: t.subscriptionManager.toastUpdated,
              onSuccess: () => setEditing(null),
            })
          }
        />
      ) : null}
    </div>
  );
}

function CreateSubscriptionModal({
  open,
  onClose,
  organizations,
  plans,
  onSubmit,
  pending,
}: {
  open: boolean;
  onClose: () => void;
  organizations: OrganizationOption[];
  plans: PlanRow[];
  onSubmit: (values: {
    organizationId: string;
    planCode: string;
    tenantType: string;
    seatLimit: number;
    endsAt: string | null;
  }) => void;
  pending: boolean;
}) {
  const t = usePlatformLabels();
  const [organizationId, setOrganizationId] = useState(organizations[0]?.id ?? "");
  const [planCode, setPlanCode] = useState(plans[0]?.planCode ?? "business");
  const [tenantType, setTenantType] = useState("business");
  const [seatLimit, setSeatLimit] = useState(25);
  const [duration, setDuration] = useState("365");
  const [customEndsAt, setCustomEndsAt] = useState("");

  return (
    <Modal
      open={open}
      onOpenChange={(next) => (next ? null : onClose())}
      title={t.subscriptionManager.createTitle}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button
            size="sm"
            loading={pending}
            onClick={() => {
              const endsAt = computeEndsAtFromDuration(
                duration,
                duration === "custom" ? customEndsAt : null,
              );
              if (!endsAt) return;
              onSubmit({
                organizationId,
                planCode,
                tenantType,
                seatLimit,
                endsAt,
              });
            }}
          >
            {t.common.create}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="sub-org">{t.subscriptionManager.colTenant}</Label>
          <Select id="sub-org" value={organizationId} onChange={(e) => setOrganizationId(e.target.value)}>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="sub-plan">{t.common.plan}</Label>
          <Select id="sub-plan" value={planCode} onChange={(e) => setPlanCode(e.target.value)}>
            {plans.map((plan) => (
              <option key={plan.planCode} value={plan.planCode}>
                {plan.planName}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="sub-type">{t.subscriptionManager.tenantTypeLabel}</Label>
          <Select id="sub-type" value={tenantType} onChange={(e) => setTenantType(e.target.value)}>
            {TENANT_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {t.options.tenantType[option.value]}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="sub-seats">{t.subscriptionManager.seatLimitLabel}</Label>
          <Input
            id="sub-seats"
            type="number"
            min={0}
            value={seatLimit}
            onChange={(e) => setSeatLimit(Number(e.target.value))}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="sub-duration">{t.ux.wizardDuration}</Label>
          <Select id="sub-duration" value={duration} onChange={(e) => setDuration(e.target.value)}>
            {LICENSE_DURATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {t.ux.duration[option.labelKey]}
              </option>
            ))}
          </Select>
        </div>
        {duration === "custom" ? (
          <div className="space-y-1">
            <Label htmlFor="sub-ends">{t.ux.wizardCustomExpiration}</Label>
            <Input id="sub-ends" type="date" value={customEndsAt} onChange={(e) => setCustomEndsAt(e.target.value)} />
          </div>
        ) : null}
        <p className="text-xs text-muted-foreground">{t.ux.wizardDurationHint}</p>
      </div>
    </Modal>
  );
}

function ChangePlanModal({
  subscription,
  plans,
  onClose,
  onSubmit,
  pending,
}: {
  subscription: SubscriptionRow;
  plans: PlanRow[];
  onClose: () => void;
  onSubmit: (values: {
    planCode?: string;
    seatLimit?: number;
    endsAt?: string | null;
    status?: string;
  }) => void;
  pending: boolean;
}) {
  const t = usePlatformLabels();
  const [planCode, setPlanCode] = useState(subscription.planCode);
  const [seatLimit, setSeatLimit] = useState(subscription.seatLimit);
  const [duration, setDuration] = useState("365");
  const [customEndsAt, setCustomEndsAt] = useState(
    subscription.endsAt ? subscription.endsAt.slice(0, 10) : "",
  );

  return (
    <Modal
      open
      onOpenChange={(next) => (next ? null : onClose())}
      title={t.subscriptionManager.changeTitle}
      description={t.subscriptionManager.changeDescription}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button
            size="sm"
            loading={pending}
            onClick={() => {
              const endsAt = computeEndsAtFromDuration(
                duration,
                duration === "custom" ? customEndsAt : null,
              );
              if (!endsAt) return;
              onSubmit({
                planCode,
                seatLimit,
                endsAt,
                status: "active",
              });
            }}
          >
            {t.subscriptionManager.renewLicense}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="edit-sub-plan">{t.common.plan}</Label>
          <Select id="edit-sub-plan" value={planCode} onChange={(e) => setPlanCode(e.target.value)}>
            {plans.map((plan) => (
              <option key={plan.planCode} value={plan.planCode}>
                {plan.planName}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="edit-sub-seats">{t.subscriptionManager.seatLimitLabel}</Label>
          <Input
            id="edit-sub-seats"
            type="number"
            min={0}
            value={seatLimit}
            onChange={(e) => setSeatLimit(Number(e.target.value))}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="edit-sub-duration">{t.ux.wizardDuration}</Label>
          <Select id="edit-sub-duration" value={duration} onChange={(e) => setDuration(e.target.value)}>
            {LICENSE_DURATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {t.ux.duration[option.labelKey]}
              </option>
            ))}
          </Select>
        </div>
        {duration === "custom" ? (
          <div className="space-y-1">
            <Label htmlFor="edit-sub-ends">{t.ux.wizardCustomExpiration}</Label>
            <Input
              id="edit-sub-ends"
              type="date"
              value={customEndsAt}
              onChange={(e) => setCustomEndsAt(e.target.value)}
            />
          </div>
        ) : null}
        <p className="text-xs text-muted-foreground">{t.ux.wizardDurationHint}</p>
      </div>
    </Modal>
  );
}
