"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { resolveActiveEngagement } from "@/lib/engagement/resolve-active-engagement";
import type { EngagementSwitcherItem } from "@/components/shell/engagement-switcher";

export function useActiveEngagement(
  engagements: EngagementSwitcherItem[],
  preferredSlug?: string | null,
  companyId?: string | null,
) {
  const pathname = usePathname();

  return useMemo(
    () => resolveActiveEngagement(engagements, pathname, preferredSlug, companyId),
    [engagements, pathname, preferredSlug, companyId],
  );
}
