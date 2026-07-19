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
import { usePlatformLabels } from "@/i18n/use-platform-labels";
import { fillPlatform } from "@/i18n/platform-labels";
import { useActionRunner } from "./use-action-runner";

export function LicenseManager({
  licenses,
  subscriptions,
  organizations,
}: {
  licenses: LicenseRow[];
  subscriptions: SubscriptionRow[];
  organizations: OrganizationOption[];
}) {
  const t = usePlatformLabels();
  const { run, pendingId } = useActionRunner();
  const [assignOpen, setAssignOpen] = useState(false);
  const orgName = (id: string) => organizations.find((o) => o.id === id)?.name ?? id;
  const active = subscriptions.filter((s) => s.subscriptionStatus !== "cancelled");
  const formatDate = (value: string | null): string =>
    value ? new Date(value).toLocaleDateString() : t.common.perpetual;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setAssignOpen(true)} disabled={organizations.length === 0 || licenses.length === 0}>
          {t.licenseManager.assign}
        </Button>
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold">{t.licenseManager.sectionTitle}</h3>
        {active.length === 0 ? (
          <EmptyState title={t.licenseManager.emptyTitle} description={t.licenseManager.emptyDescription} />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border/60">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5">{t.licenseManager.colTenant}</th>
                  <th className="px-4 py-2.5">{t.licenseManager.colPlan}</th>
                  <th className="px-4 py-2.5">{t.licenseManager.colSeats}</th>
                  <th className="px-4 py-2.5">{t.licenseManager.colExpires}</th>
                  <th className="px-4 py-2.5">{t.common.status}</th>
                  <th className="px-4 py-2.5 text-right">{t.common.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {active.map((sub) => (
                  <tr key={sub.id}>
                    <td className="px-4 py-2.5 font-medium">{orgName(sub.organizationId)}</td>
                    <td className="px-4 py-2.5">{sub.planCode}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {fillPlatform(t.licenseManager.seatsFree, {
                        used: sub.seatsUsed,
                        limit: sub.seatLimit,
                        free: Math.max(sub.seatLimit - sub.seatsUsed, 0),
                      })}
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
                          if (!window.confirm(t.licenseManager.revokeConfirm)) return;
                          void run(`${sub.id}:revoke`, () => revokeLicenseAction({ subscriptionId: sub.id }), {
                            success: t.licenseManager.toastRevoked,
                          });
                        }}
                      >
                        {t.common.revoke}
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
            success: t.licenseManager.toastAssigned,
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
  const t = usePlatformLabels();
  const [organizationId, setOrganizationId] = useState(organizations[0]?.id ?? "");
  const [licenseCode, setLicenseCode] = useState(licenses[0]?.licenseCode ?? "");

  return (
    <Modal
      open={open}
      onOpenChange={(next) => (next ? null : onClose())}
      title={t.licenseManager.assignTitle}
      description={t.licenseManager.assignDescription}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button size="sm" loading={pending} onClick={() => onSubmit({ organizationId, licenseCode })}>
            {t.common.assign}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="lic-org">{t.licenseManager.colTenant}</Label>
          <Select id="lic-org" value={organizationId} onChange={(e) => setOrganizationId(e.target.value)}>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="lic-code">{t.licenseManager.templateLabel}</Label>
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
