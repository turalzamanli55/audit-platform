"use client";

import type { ReactNode } from "react";
import { AiEverywhereHost } from "@/components/ai-inline";
import type { AiEverywhereLabels } from "@/components/ai-inline";

/** Client bridge so protected layout can inject AI Everywhere into the app shell. */
export function AiEverywhereLayoutBridge({
  children,
  labels,
}: {
  children: ReactNode;
  labels?: AiEverywhereLabels;
}) {
  return <AiEverywhereHost labels={labels}>{children}</AiEverywhereHost>;
}
