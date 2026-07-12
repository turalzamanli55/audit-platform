"use client";

import type { AiModuleKnowledge } from "@/lib/ai/types/knowledge";
import type { AiWorkspaceLabels } from "@/components/ai/types";
import { AiEmptyState } from "@/components/ai/empty/empty-states";
import { AiPanelLoading } from "@/components/ai/loading/skeletons";
import { AiContextRow, AiPanelSection } from "@/components/ai/shared/panel-section";

export function AiKnowledgePanel({
  labels,
  knowledge,
  loading,
}: {
  labels: AiWorkspaceLabels;
  knowledge: AiModuleKnowledge | null;
  loading?: boolean;
}) {
  if (loading) return <AiPanelLoading label={labels.loading.knowledge} />;

  return (
    <AiPanelSection title={labels.knowledge.title}>
      {!knowledge ? (
        <AiEmptyState title={labels.knowledge.empty} className="py-6" />
      ) : (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">{knowledge.name}</p>
          <dl className="space-y-2">
            <AiContextRow label={labels.knowledge.purpose} value={knowledge.purpose} />
            <AiContextRow label={labels.knowledge.inputs} value={knowledge.inputs.join(", ") || "—"} />
            <AiContextRow label={labels.knowledge.outputs} value={knowledge.outputs.join(", ") || "—"} />
            <AiContextRow
              label={labels.knowledge.dependencies}
              value={knowledge.dependencies.join(", ") || "—"}
            />
            <AiContextRow label={labels.knowledge.workflow} value={knowledge.workflow.join(" → ") || "—"} />
            <AiContextRow
              label={labels.knowledge.related}
              value={knowledge.relatedModules.join(", ") || "—"}
            />
          </dl>
        </div>
      )}
    </AiPanelSection>
  );
}
