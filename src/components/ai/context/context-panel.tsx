"use client";

import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type { AiWorkspaceLabels } from "@/components/ai/types";
import { AiContextRow, AiPanelSection } from "@/components/ai/shared/panel-section";
import { AiPanelLoading } from "@/components/ai/loading/skeletons";
import { AiErrorState } from "@/components/ai/error/error-states";

export function AiContextPanel({
  labels,
  context,
  loading,
  error,
  companyName,
  engagementName,
  organizationName,
  workspaceName,
  userLabel,
}: {
  labels: AiWorkspaceLabels;
  context: AiRuntimeContext | null;
  loading?: boolean;
  error?: boolean;
  companyName: string;
  engagementName: string;
  organizationName: string;
  workspaceName: string;
  userLabel: string;
}) {
  if (loading) return <AiPanelLoading label={labels.loading.context} />;
  if (error || !context) {
    return (
      <AiPanelSection title={labels.context.title}>
        <AiErrorState title={labels.error.context} />
      </AiPanelSection>
    );
  }

  const selection =
    context.selectedObjectType && context.selectedObjectId
      ? `${context.selectedObjectType}:${context.selectedObjectId}`
      : "—";
  const filters =
    Object.keys(context.filters).length > 0
      ? Object.entries(context.filters)
          .map(([key, value]) => `${key}=${String(value)}`)
          .join(", ")
      : "—";

  return (
    <AiPanelSection title={labels.context.title}>
      <dl className="space-y-2">
        <AiContextRow label={labels.context.route} value={context.route} />
        <AiContextRow label={labels.context.module} value={context.moduleId ?? "—"} />
        <AiContextRow label={labels.context.company} value={companyName || context.companySlug || "—"} />
        <AiContextRow
          label={labels.context.engagement}
          value={engagementName || context.engagementSlug || "—"}
        />
        <AiContextRow label={labels.context.user} value={userLabel || context.userId || "—"} />
        <AiContextRow label={labels.context.workspace} value={workspaceName || context.workspaceId || "—"} />
        <AiContextRow
          label={labels.context.organization}
          value={organizationName || context.organizationId || "—"}
        />
        <AiContextRow label={labels.context.locale} value={context.locale} />
        <AiContextRow label={labels.context.theme} value={context.theme} />
        <AiContextRow
          label={labels.context.workflow}
          value={context.workflowId ? `${context.workflowId}${context.workflowStatus ? ` · ${context.workflowStatus}` : ""}` : "—"}
        />
        <AiContextRow
          label={labels.context.permissions}
          value={context.permissionCodes.length ? `${context.permissionCodes.length} codes` : "—"}
        />
        <AiContextRow label={labels.context.filters} value={filters} />
        <AiContextRow label={labels.context.selection} value={selection} />
        <AiContextRow
          label={labels.context.unsaved}
          value={context.hasUnsavedChanges ? labels.context.yes : labels.context.no}
        />
      </dl>
    </AiPanelSection>
  );
}
