"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { LicenseRow, SubscriptionRow, OrganizationOption } from "@/lib/platform-console/data";
import { assignLicenseAction, revokeLicenseAction } from "@/lib/platform-console/actions/licenses";
import { useActionRunner } from "./use-action-runner";

function formatDate(value: string | null): string {
  return value ? new Date(value).toLocaleDateString() : "Perpetual";
}

export function LicenseManager({
  licenses,
  subscriptions,
  organizations,
}: {
  licenses: LicenseRow[];
  subscriptions: SubscriptionRow[];
  organizations: OrganizationOption[];
}) {
  const { run, pendingId } = useActionRunner();
  const [assignOpen, setAssignOpen] = useState(false);
  const orgName = (id: string) => organizations.find((o) => o.id === id)?.name ?? id;
  const active = subscriptions.filter((s) => s.subscriptionStatus !== "cancelled");

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setAssignOpen(true)} disabled={organizations.length === 0 || licenses.length === 0}>
          Assign license
        </Button>
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold">Assigned licenses (seat usage &amp; expiration)</h3>
        {active.length === 0 ? (
          <EmptyState title="No assigned licenses" description="Assign a license template to a tenant." />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border/60">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5">Tenant</th>
                  <th className="px-4 py-2.5">Plan</th>
                  <th className="px-4 py-2.5">Seats</th>
                  <th className="px-4 py-2.5">Expires</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {active.map((sub) => (
                  <tr key={sub.id}>
                    <td className="px-4 py-2.5 font-medium">{orgName(sub.organizationId)}</td>
                    <td className="px-4 py-2.5">{sub.planCode}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {sub.seatsUsed}/{sub.seatLimit} ({Math.max(sub.seatLimit - sub.seatsUsed, 0)} free)
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">{formatDate(sub.endsAt)}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant={sub.subscriptionStatus === "active" || sub.subscriptionStatus === "trial" ? "success" : "warning"}>
                        {sub.subscriptionStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <Button
                        size="sm"
                        variant="destructive"
                        loading={pendingId === `${sub.id}:revoke`}
                        onClick={() => {
                          if (!window.confirm("Revoke this license?")) return;
                          void run(`${sub.id}:revoke`, () => revokeLicenseAction({ subscriptionId: sub.id }), {
                            success: "License revoked",
                          });
                        }}
                      >
                        Revoke
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <AssignLicenseModal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        organizations={organizations}
        licenses={licenses}
        pending={pendingId === "assign"}
        onSubmit={(values) =>
          run("assign", () => assignLicenseAction(values), {
            success: "License assigned",
            onSuccess: () => setAssignOpen(false),
          })
        }
      />
    </div>
  );
}

function AssignLicenseModal({
  open,
  onClose,
  organizations,
  licenses,
  onSubmit,
  pending,
}: {
  open: boolean;
  onClose: () => void;
  organizations: OrganizationOption[];
  licenses: LicenseRow[];
  onSubmit: (values: { organizationId: string; licenseCode: string }) => void;
  pending: boolean;
}) {
  const [organizationId, setOrganizationId] = useState(organizations[0]?.id ?? "");
  const [licenseCode, setLicenseCode] = useState(licenses[0]?.licenseCode ?? "");

  return (
    <Modal
      open={open}
      onOpenChange={(next) => (next ? null : onClose())}
      title="Assign license"
      description="Instantiates a subscription from the license template with computed expiration."
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" loading={pending} onClick={() => onSubmit({ organizationId, licenseCode })}>
            Assign
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="lic-org">Tenant</Label>
          <Select id="lic-org" value={organizationId} onChange={(e) => setOrganizationId(e.target.value)}>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="lic-code">License template</Label>
          <Select id="lic-code" value={licenseCode} onChange={(e) => setLicenseCode(e.target.value)}>
            {licenses.map((license) => (
              <option key={license.licenseCode} value={license.licenseCode}>
                {license.licenseName}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </Modal>
  );
}
