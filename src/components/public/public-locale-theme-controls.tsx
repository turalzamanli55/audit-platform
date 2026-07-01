"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { IconChevronDown, IconGlobe, IconMoon, IconSun } from "@/components/ui/icons";
import { locales } from "@/i18n";
import { useLanguage, useTheme } from "@/providers";

type PublicLocaleThemeControlsLabels = {
  language: string;
  theme: string;
  themeLight: string;
  themeDark: string;
};

type PublicLocaleThemeControlsProps = {
  labels: PublicLocaleThemeControlsLabels;
  layout?: "inline" | "stacked";
};

export function PublicLocaleThemeControls({
  labels,
  layout = "inline",
}: PublicLocaleThemeControlsProps) {
  const { locale, setLocale } = useLanguage();
  const { resolvedTheme, setMode } = useTheme();
  const current = locales.find((item) => item.code === locale);

  if (layout === "stacked") {
    return (
      <div className="grid gap-2">
        <DropdownMenu
          trigger={
            <Button variant="outline" className="w-full justify-between font-normal">
              <span className="flex items-center gap-2">
                <IconGlobe width={16} height={16} />
                {current?.label ?? locale}
              </span>
              <IconChevronDown />
            </Button>
          }
        >
          <DropdownMenuLabel>{labels.language}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {locales.map((item) => (
            <DropdownMenuItem key={item.code} onSelect={() => setLocale(item.code)}>
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenu>

        <DropdownMenu
          trigger={
            <Button variant="outline" className="w-full justify-between font-normal">
              <span className="flex items-center gap-2">
                {resolvedTheme === "dark" ? <IconSun width={16} height={16} /> : <IconMoon width={16} height={16} />}
                {labels.theme}
              </span>
              <IconChevronDown />
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

  return (
    <div className="flex items-center gap-1">
      <DropdownMenu
        trigger={
          <Button variant="ghost" size="sm" className="gap-1.5 font-normal text-muted-foreground">
            {current?.label ?? locale}
            <IconChevronDown />
          </Button>
        }
      >
        <DropdownMenuLabel>{labels.language}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {locales.map((item) => (
          <DropdownMenuItem key={item.code} onSelect={() => setLocale(item.code)}>
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenu>

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
