"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { switchCompanyAction } from "@/lib/actions/tenant/switch-company";

type CompanyWorkspaceCookieSyncProps = {
  companySlug: string;
  preferredCompanySlug?: string | null;
};

/**
 * Persists the active company slug via a Server Action.
 * Cookie writes are not allowed during Server Component render in Next.js 15+.
 */
export function CompanyWorkspaceCookieSync({
  companySlug,
  preferredCompanySlug,
}: CompanyWorkspaceCookieSyncProps) {
  const router = useRouter();
  const syncedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!companySlug || companySlug === preferredCompanySlug) {
      syncedRef.current = companySlug;
      return;
    }

    if (syncedRef.current === companySlug) {
      return;
    }

    let cancelled = false;

    void (async () => {
      const result = await switchCompanyAction({ slug: companySlug });
      if (cancelled || !result.success) {
        return;
      }

      syncedRef.current = companySlug;
      router.refresh();
    })();

    return () => {
      cancelled = true;
    };
  }, [companySlug, preferredCompanySlug, router]);

  return null;
}
