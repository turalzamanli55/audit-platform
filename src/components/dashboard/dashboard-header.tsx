"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { OrganizationSwitcher } from "@/components/dashboard/organization-switcher";
import { WorkspaceSwitcher } from "@/components/dashboard/workspace-switcher";
import { useTheme } from "@/providers";

type DashboardHeaderProps = {
  labels: {
    organization: string;
    workspace: string;
    themeLight: string;
    themeDark: string;
  };
};

function resolveLocale(pathname: string): string {
  return pathname.split("/").filter(Boolean)[0] ?? siteConfig.defaultLocale;
}

export function DashboardHeader({ labels }: DashboardHeaderProps) {
  const pathname = usePathname();
  const locale = resolveLocale(pathname);
  const { resolvedTheme, setMode } = useTheme();

  return (
    <>
      <Link href={`/${locale}/app/dashboard`} className="text-lg font-semibold tracking-tight">
        {siteConfig.name}
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <OrganizationSwitcher label={labels.organization} />
        <WorkspaceSwitcher label={labels.workspace} />
        <button
          type="button"
          className="rounded-lg border border-input px-3 py-1.5 text-sm"
          onClick={() => setMode(resolvedTheme === "dark" ? "light" : "dark")}
        >
          {resolvedTheme === "dark" ? labels.themeLight : labels.themeDark}
        </button>
      </div>
    </>
  );
}
