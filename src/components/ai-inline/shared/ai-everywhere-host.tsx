"use client";

import type { ReactNode } from "react";
import { ContextMenuProvider } from "@/components/ui/context-menu";
import {
  AiEverywhereProvider,
  useAiEverywhere,
} from "@/components/ai-inline/provider/ai-everywhere-provider";
import { AiEverywhereDrawer } from "@/components/ai-inline/drawers/ai-everywhere-drawer";
import { AiHostExecutionDrawer } from "@/components/ai-inline/drawers/ai-host-execution-drawer";
import type { AiEverywhereLabels } from "@/components/ai-inline/shared/labels";
import { AI_EVERYWHERE_LABELS_EN } from "@/components/ai-inline/shared/labels";

function AiHostExecutionDrawerBridge() {
  const host = useAiEverywhere();
  return (
    <AiHostExecutionDrawer
      open={host.executionOpen}
      onOpenChange={host.setExecutionOpen}
      plan={host.executionPlan}
      context={host.context}
      onPlanUpdated={host.setExecutionPlan}
    />
  );
}

/**
 * Root host for AI Everywhere — wrap protected app surfaces once.
 * Reuses Orchestrator / Skills / Knowledge Graph / Tool Runtime / LLM Platform via foundation.
 * Mutation suggestions open Host Execution Drawer (HITL) — never execute directly.
 */
export function AiEverywhereHost({
  children,
  labels = AI_EVERYWHERE_LABELS_EN,
}: {
  children: ReactNode;
  labels?: AiEverywhereLabels;
}) {
  return (
    <ContextMenuProvider>
      <AiEverywhereProvider labels={labels}>
        {children}
        <AiEverywhereDrawer />
        <AiHostExecutionDrawerBridge />
      </AiEverywhereProvider>
    </ContextMenuProvider>
  );
}
