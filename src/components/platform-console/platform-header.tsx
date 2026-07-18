"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { signOutAction } from "@/lib/actions/auth/sign-out";
import { Button } from "@/components/ui/button";
import { PLATFORM_LOGIN_PATH } from "@/config/auth";

/**
 * The single Platform Console header. No tenant/workspace/company switchers,
 * no environment switcher, no language selector — Platform Owner only, English.
 */
export function PlatformHeader({
  locale,
  ownerEmail,
  environment,
  version,
}: {
  locale: string;
  ownerEmail: string;
  environment: string;
  version: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(async () => {
      await signOutAction({});
      router.push(`/${locale}${PLATFORM_LOGIN_PATH}`);
      router.refresh();
    });
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl lg:px-6">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
          P
        </span>
        <span className="text-sm font-semibold tracking-tight">Platform Owner Console</span>
        <span className="rounded-full border border-border/60 px-2 py-0.5 text-xs text-muted-foreground">
          {environment}
        </span>
        <span className="hidden rounded-full border border-border/60 px-2 py-0.5 text-xs text-muted-foreground sm:inline">
          v{version}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-xs text-muted-foreground sm:inline">{ownerEmail}</span>
        <Button variant="outline" size="sm" onClick={handleSignOut} loading={isPending}>
          Sign out
        </Button>
      </div>
    </header>
  );
}
