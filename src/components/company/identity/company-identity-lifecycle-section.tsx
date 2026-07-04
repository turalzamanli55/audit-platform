"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui";
import { useCompanyIdentity } from "@/lib/company/use-company-identity";
import type { Dictionary } from "@/i18n/get-dictionary";
import { CompanySettingsGroup } from "@/components/company/settings";
import { WorkspaceFormPanel, WorkspaceSectionShell } from "@/components/workspace";
import { CompanyLifecycleConfirmationPanel } from "./company-lifecycle-confirmation-panel";

type CompanyIdentityLifecycleSectionProps = {
  labels: Dictionary["companies"]["identity"];
};

export function CompanyIdentityLifecycleSection({ labels }: CompanyIdentityLifecycleSectionProps) {
  const {
    company,
    canAdminister,
    lifecycleState,
    lifecycleError,
    archiveCompany,
    restoreCompany,
  } = useCompanyIdentity();
  const [mode, setMode] = useState<"idle" | "archive" | "restore">("idle");
  const section = labels.sections.lifecycle;
  const isPending = lifecycleState === "archiving" || lifecycleState === "restoring";

  if (!canAdminister) {
    return (
      <WorkspaceSectionShell
        title={section.title}
        description={section.readOnlyDescription}
        headingId="company-identity-lifecycle"
      >
        <WorkspaceFormPanel>
          <p className="text-sm leading-relaxed text-muted-foreground">{section.readOnlyNotice}</p>
        </WorkspaceFormPanel>
      </WorkspaceSectionShell>
    );
  }

  return (
    <WorkspaceSectionShell
      title={section.title}
      description={section.description}
      headingId="company-identity-lifecycle"
    >
      <div className="space-y-4">
        {lifecycleError ? <Alert variant="error">{lifecycleError}</Alert> : null}

        {mode === "idle" ? (
          <CompanySettingsGroup title={section.actionsTitle}>
            <div className="space-y-4 px-4 py-5 sm:px-5">
              {company.isArchived ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">{section.restorePrompt}</p>
                  <Button type="button" onClick={() => setMode("restore")}>
                    {section.restoreAction}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">{section.archivePrompt}</p>
                  <Button
                    type="button"
                    variant="secondary"
                    className="border-destructive/30 text-destructive hover:bg-destructive/10"
                    onClick={() => setMode("archive")}
                  >
                    {section.archiveAction}
                  </Button>
                </div>
              )}
            </div>
          </CompanySettingsGroup>
        ) : null}

        {mode === "archive" ? (
          <CompanyLifecycleConfirmationPanel
            title={section.archiveConfirmTitle}
            description={section.archiveConfirmDescription}
            reasonLabel={section.reasonLabel}
            reasonPlaceholder={section.archiveReasonPlaceholder}
            confirmLabel={section.archiveConfirmAction}
            cancelLabel={section.cancelAction}
            isPending={isPending}
            variant="destructive"
            onCancel={() => setMode("idle")}
            onConfirm={(reason) => {
              archiveCompany(reason);
              setMode("idle");
            }}
          />
        ) : null}

        {mode === "restore" ? (
          <CompanyLifecycleConfirmationPanel
            title={section.restoreConfirmTitle}
            description={section.restoreConfirmDescription}
            reasonLabel={section.reasonLabel}
            reasonPlaceholder={section.restoreReasonPlaceholder}
            confirmLabel={section.restoreConfirmAction}
            cancelLabel={section.cancelAction}
            isPending={isPending}
            onCancel={() => setMode("idle")}
            onConfirm={(reason) => {
              restoreCompany(reason);
              setMode("idle");
            }}
          />
        ) : null}
      </div>
    </WorkspaceSectionShell>
  );
}
