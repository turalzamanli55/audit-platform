"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { resolveActiveCompany } from "@/lib/company/resolve-active-company";
import type { CompanySwitcherItem } from "@/components/shell/company-switcher";

export function useActiveCompany(
  companies: CompanySwitcherItem[],
  preferredSlug?: string | null,
) {
  const pathname = usePathname();

  return useMemo(
    () => resolveActiveCompany(companies, pathname, preferredSlug),
    [companies, pathname, preferredSlug],
  );
}
