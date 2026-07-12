"use client";

import type { ReactNode } from "react";
import { ContextMenuProvider } from "@/components/ui/context-menu";
import {
  AiEverywhereProvider,
} from "@/components/ai-inline/provider/ai-everywhere-provider";
import { AiEverywhereDrawer } from "@/components/ai-inline/drawers/ai-everywhere-drawer";
import type { AiEverywhereLabels } from "@/components/ai-inline/shared/labels";
import { AI_EVERYWHERE_LABELS_EN } from "@/components/ai-inline/shared/labels";

/**
 * Root host for AI Everywhere — wrap protected app surfaces once.
 * Reuses Orchestrator / Skills / Knowledge Graph / Tool Runtime / LLM Platform via foundation.
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
      </AiEverywhereProvider>
    </ContextMenuProvider>
  );
}
