"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { switchEngagementAction } from "@/lib/actions/tenant/switch-engagement";

type EngagementWorkspaceCookieSyncProps = {
  engagementSlug: string;
  preferredEngagementSlug?: string | null;
};

export function EngagementWorkspaceCookieSync({
  engagementSlug,
  preferredEngagementSlug,
}: EngagementWorkspaceCookieSyncProps) {
  const router = useRouter();
  const syncedRef = useRef<string | null>(null);
  const [retryTick, setRetryTick] = useState(0);

  useEffect(() => {
    if (!engagementSlug || engagementSlug === preferredEngagementSlug) {
      syncedRef.current = engagementSlug;
      return;
    }

    if (syncedRef.current === engagementSlug) {
      return;
    }

    let cancelled = false;

    void (async () => {
      const result = await switchEngagementAction({ slug: engagementSlug });
      if (cancelled) {
        return;
      }

      if (!result.success) {
        syncedRef.current = null;
        window.setTimeout(() => {
          if (!cancelled) {
            setRetryTick((current) => current + 1);
          }
        }, 2000);
        return;
      }

      syncedRef.current = engagementSlug;
      router.refresh();
    })();

    return () => {
      cancelled = true;
    };
  }, [engagementSlug, preferredEngagementSlug, router, retryTick]);

  return null;
}
