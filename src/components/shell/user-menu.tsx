"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
import { IconUser } from "@/components/ui/icons";
import { signOutAction } from "@/lib/actions/auth/sign-out";
import { DASHBOARD_PATH } from "@/config/auth";
import { useAuth } from "@/providers";
import { defaultLocale, isValidLocale } from "@/i18n";

type UserMenuLabels = {
  title: string;
  profile: string;
  signOut: string;
};

type UserMenuProps = {
  labels: UserMenuLabels;
  className?: string;
};

function resolveLocale(pathname: string): string {
  const segment = pathname.split("/").filter(Boolean)[0];
  return segment && isValidLocale(segment) ? segment : defaultLocale;
}

export function UserMenu({ labels, className }: UserMenuProps) {
  const { session } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = resolveLocale(pathname);

  if (session.status !== "authenticated" || !session.user) {
    return null;
  }

  async function handleSignOut() {
    await signOutAction({});
    router.push(`/${locale}`);
    router.refresh();
  }

  const displayName = session.user.displayName || session.user.email;

  return (
    <DropdownMenu
      className={className}
      align="end"
      trigger={
        <Button variant="ghost" className="h-10 gap-2 px-2" aria-label={labels.title}>
          <Avatar name={displayName} size="sm" />
          <span className="hidden max-w-[8rem] truncate text-sm font-medium md:inline">{displayName}</span>
        </Button>
      }
    >
      <DropdownMenuLabel>
        <div className="space-y-0.5 py-0.5">
          <p className="text-sm font-medium text-foreground">{displayName}</p>
          <p className="text-xs font-normal text-muted-foreground">{session.user.email}</p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={() => router.push(`/${locale}${DASHBOARD_PATH}`)}>
        <IconUser width={16} height={16} />
        {labels.profile}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem destructive onSelect={handleSignOut}>
        {labels.signOut}
      </DropdownMenuItem>
    </DropdownMenu>
  );
}
