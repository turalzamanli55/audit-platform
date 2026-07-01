"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { IconMoon, IconSun } from "@/components/ui/icons";
import { OrganizationSwitcher } from "@/components/dashboard/organization-switcher";
import { WorkspaceSwitcher } from "@/components/dashboard/workspace-switcher";
import { siteConfig } from "@/config/site";
import { useTheme } from "@/providers";

type DashboardHeaderLabels = {
  organization: string;
  workspace: string;
  themeLight: string;
  themeDark: string;
  theme: string;
};

function resolveLocale(pathname: string): string {
  return pathname.split("/").filter(Boolean)[0] ?? siteConfig.defaultLocale;
}

export function DashboardBrand() {
  const pathname = usePathname();
  const locale = resolveLocale(pathname);

  return (
    <Link
      href={`/${locale}/app/dashboard`}
      className="flex min-w-0 items-center gap-2.5 rounded-xl px-1 py-1 transition-opacity hover:opacity-80"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
        {siteConfig.name.slice(0, 1)}
      </span>
      <span className="truncate text-base font-semibold tracking-tight text-sidebar-foreground lg:text-foreground">
        {siteConfig.name}
      </span>
    </Link>
  );
}

export function DashboardHeaderActions({ labels }: { labels: DashboardHeaderLabels }) {
  const { resolvedTheme, setMode } = useTheme();

  return (
    <div className="flex items-center gap-1">
      <OrganizationSwitcher label={labels.organization} />
      <WorkspaceSwitcher label={labels.workspace} />
      <DropdownMenu
        trigger={
          <Button variant="ghost" size="icon" aria-label={labels.theme}>
            {resolvedTheme === "dark" ? <IconSun /> : <IconMoon />}
          </Button>
        }
      >
        <DropdownMenuLabel>{labels.theme}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => setMode("light")}>{labels.themeLight}</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setMode("dark")}>{labels.themeDark}</DropdownMenuItem>
      </DropdownMenu>
    </div>
  );
}
