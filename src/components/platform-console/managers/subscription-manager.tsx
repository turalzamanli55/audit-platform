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
import type { SubscriptionRow, OrganizationOption, PlanRow } from "@/lib/platform-console/data";
import {
  createSubscriptionAction,
  updateSubscriptionAction,
  pauseSubscriptionAction,
  resumeSubscriptionAction,
  expireSubscriptionAction,
  cancelSubscriptionAction,
} from "@/lib/platform-console/actions/subscriptions";
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
  const { run, pendingId } = useActionRunner();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<SubscriptionRow | null>(null);
  const orgName = (id: string) => organizations.find((o) => o.id === id)?.name ?? id;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setCreateOpen(true)} disabled={organizations.length === 0}>
          Create subscription
        </Button>
      </div>

      {subscriptions.length === 0 ? (
        <EmptyState title="No subscriptions" description="Create a subscription for a tenant." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5">Tenant</th>
                <th className="px-4 py-2.5">Plan</th>
                <th className="px-4 py-2.5">Seats</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
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
                          Change plan
                        </Button>
                        {active ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            loading={pendingId === `${sub.id}:pause`}
                            disabled={busy}
                            onClick={() =>
                              run(`${sub.id}:pause`, () => pauseSubscriptionAction({ id: sub.id }), {
                                success: "Subscription paused",
                              })
                            }
                          >
                            Pause
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            loading={pendingId === `${sub.id}:resume`}
                            disabled={busy}
                            onClick={() =>
                              run(`${sub.id}:resume`, () => resumeSubscriptionAction({ id: sub.id }), {
                                success: "Subscription resumed",
                              })
                            }
                          >
                            Resume
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          loading={pendingId === `${sub.id}:expire`}
                          disabled={busy}
                          onClick={() =>
                            run(`${sub.id}:expire`, () => expireSubscriptionAction({ id: sub.id }), {
                              success: "Subscription expired",
                            })
                          }
                        >
                          Expire
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          loading={pendingId === `${sub.id}:cancel`}
                          disabled={busy}
                          onClick={() => {
                            if (!window.confirm("Cancel this subscription?")) return;
                            void run(`${sub.id}:cancel`, () => cancelSubscriptionAction({ id: sub.id }), {
                              success: "Subscription cancelled",
                            });
                          }}
                        >
                          Cancel
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
            success: "Subscription created",
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
              success: "Subscription updated",
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
  const [organizationId, setOrganizationId] = useState(organizations[0]?.id ?? "");
  const [planCode, setPlanCode] = useState(plans[0]?.planCode ?? "business");
  const [tenantType, setTenantType] = useState("business");
  const [seatLimit, setSeatLimit] = useState(25);
  const [endsAt, setEndsAt] = useState("");

  return (
    <Modal
      open={open}
      onOpenChange={(next) => (next ? null : onClose())}
      title="Create subscription"
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
                organizationId,
                planCode,
                tenantType,
                seatLimit,
                endsAt: endsAt ? new Date(endsAt).toISOString() : null,
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
          <Label htmlFor="sub-org">Tenant</Label>
          <Select id="sub-org" value={organizationId} onChange={(e) => setOrganizationId(e.target.value)}>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="sub-plan">Plan</Label>
          <Select id="sub-plan" value={planCode} onChange={(e) => setPlanCode(e.target.value)}>
            {plans.map((plan) => (
              <option key={plan.planCode} value={plan.planCode}>
                {plan.planName}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="sub-type">Tenant type</Label>
          <Select id="sub-type" value={tenantType} onChange={(e) => setTenantType(e.target.value)}>
            {TENANT_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="sub-seats">Seat limit</Label>
          <Input
            id="sub-seats"
            type="number"
            min={0}
            value={seatLimit}
            onChange={(e) => setSeatLimit(Number(e.target.value))}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="sub-ends">Expiration date (optional)</Label>
          <Input id="sub-ends" type="date" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
        </div>
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
  onSubmit: (values: { planCode?: string; seatLimit?: number }) => void;
  pending: boolean;
}) {
  const [planCode, setPlanCode] = useState(subscription.planCode);
  const [seatLimit, setSeatLimit] = useState(subscription.seatLimit);

  return (
    <Modal
      open
      onOpenChange={(next) => (next ? null : onClose())}
      title="Change plan / seats"
      description="Upgrade or downgrade by changing the plan or seat limit."
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" loading={pending} onClick={() => onSubmit({ planCode, seatLimit })}>
            Save
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="edit-sub-plan">Plan</Label>
          <Select id="edit-sub-plan" value={planCode} onChange={(e) => setPlanCode(e.target.value)}>
            {plans.map((plan) => (
              <option key={plan.planCode} value={plan.planCode}>
                {plan.planName}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="edit-sub-seats">Seat limit</Label>
          <Input
            id="edit-sub-seats"
            type="number"
            min={0}
            value={seatLimit}
            onChange={(e) => setSeatLimit(Number(e.target.value))}
          />
        </div>
      </div>
    </Modal>
  );
}
