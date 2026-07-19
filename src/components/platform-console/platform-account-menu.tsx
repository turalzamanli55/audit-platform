"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Modal } from "@/components/ui/modal";
import {
  IconCheck,
  IconChevronDown,
  IconGlobe,
  IconInfo,
  IconSun,
  IconUser,
} from "@/components/ui/icons";
import { signOutAction } from "@/lib/actions/auth/sign-out";
import { PLATFORM_LOGIN_PATH } from "@/config/auth";
import { useTheme } from "@/providers";
import type { ThemeMode } from "@/types/theme";
import { cn } from "@/lib/ui/cn";
import {
  CONSOLE_LOCALES,
  getConsoleStrings,
  persistConsoleLocale,
  type ConsoleLocale,
} from "@/lib/platform-console/i18n";

type PlatformAccountMenuProps = {
  /** URL locale segment, used only to build the post-sign-out redirect. */
  locale: string;
  /** Current console interface language. */
  consoleLocale: ConsoleLocale;
  displayName: string;
  email: string;
  environment: string;
  /** Opens the shared About Platform dialog (owned by the header). */
  onAbout: () => void;
};

const APPEARANCE_MODES: ThemeMode[] = ["system", "light", "dark"];

export function PlatformAccountMenu({
  locale,
  consoleLocale,
  displayName,
  email,
  environment,
  onAbout,
}: PlatformAccountMenuProps) {
  const router = useRouter();
  const { mode, setMode } = useTheme();
  const t = getConsoleStrings(consoleLocale);
  const [isPending, startTransition] = useTransition();
  const [profileOpen, setProfileOpen] = useState(false);

  function handleSignOut() {
    startTransition(async () => {
      await signOutAction({});
      router.push(`/${locale}${PLATFORM_LOGIN_PATH}`);
      router.refresh();
    });
  }

  function handleLocaleSelect(next: ConsoleLocale) {
    if (next === consoleLocale) return;
    persistConsoleLocale(next);
    router.refresh();
  }

  return (
    <>
      <DropdownMenu
        align="end"
        trigger={
          <Button
            variant="ghost"
            className="group h-10 gap-2 rounded-lg px-1.5 font-normal text-muted-foreground data-[state=open]:text-foreground sm:px-2"
            aria-label={t.account.menu}
          >
            <Avatar name={displayName} size="sm" />
            <span className="hidden max-w-[10rem] truncate text-sm font-medium text-foreground sm:inline">
              {displayName}
            </span>
            <IconChevronDown
              width={16}
              height={16}
              className="hidden shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180 sm:block"
            />
          </Button>
        }
      >
        <DropdownMenuLabel>
          <div className="flex items-center gap-2.5 py-0.5">
            <Avatar name={displayName} size="sm" />
            <div className="min-w-0 space-y-0.5">
              <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
              <p className="truncate text-xs font-normal text-muted-foreground">{email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => setProfileOpen(true)}>
          <IconUser width={16} height={16} className="shrink-0" />
          <span className="flex-1">{t.account.profile}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>
          <span className="inline-flex items-center gap-1.5">
            <IconGlobe width={14} height={14} />
            {t.account.language}
          </span>
        </DropdownMenuLabel>
        {CONSOLE_LOCALES.map((item) => (
          <DropdownMenuItem
            key={item.code}
            selected={item.code === consoleLocale}
            onSelect={() => handleLocaleSelect(item.code)}
          >
            <span className="flex-1">{item.label}</span>
            {item.code === consoleLocale ? (
              <IconCheck width={16} height={16} className="text-primary" />
            ) : null}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuLabel>
          <span className="inline-flex items-center gap-1.5">
            <IconSun width={14} height={14} />
            {t.account.appearance}
          </span>
        </DropdownMenuLabel>
        {APPEARANCE_MODES.map((value) => (
          <DropdownMenuItem key={value} selected={value === mode} onSelect={() => setMode(value)}>
            <span className="flex-1">{t.appearance[value]}</span>
            {value === mode ? <IconCheck width={16} height={16} className="text-primary" /> : null}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onAbout}>
          <IconInfo width={16} height={16} className="shrink-0" />
          <span className="flex-1">{t.account.about}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem destructive disabled={isPending} onSelect={handleSignOut}>
          {isPending ? t.account.signingOut : t.account.signOut}
        </DropdownMenuItem>
      </DropdownMenu>

      <Modal open={profileOpen} onOpenChange={setProfileOpen} title={t.profile.title} size="sm">
        <div className="flex items-center gap-3">
          <Avatar name={displayName} size="lg" />
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-foreground">{displayName}</p>
            <p className="truncate text-sm text-muted-foreground">{email}</p>
          </div>
        </div>
        <dl className="mt-5 space-y-3 text-sm">
          <PlatformDetailRow label={t.profile.email} value={email} />
          <PlatformDetailRow label={t.profile.role} value={t.profile.owner} />
          <PlatformDetailRow label={t.profile.environment} value={environment} />
        </dl>
      </Modal>
    </>
  );
}

export function PlatformDetailRow({
  label,
  value,
  mono = false,
  muted = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "min-w-0 truncate text-right font-medium text-foreground",
          mono && "font-mono text-xs",
          muted && "font-normal text-muted-foreground",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
