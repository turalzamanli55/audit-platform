"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { IconMoon, IconSun } from "@/components/ui/icons";
import { useTheme } from "@/providers";

type ThemeSwitcherProps = {
  label: string;
  themeLight: string;
  themeDark: string;
  className?: string;
};

export function ThemeSwitcher({ label, themeLight, themeDark, className }: ThemeSwitcherProps) {
  const { resolvedTheme, setMode } = useTheme();

  return (
    <DropdownMenu
      className={className}
      trigger={
        <Button variant="ghost" size="icon" className="h-10 w-10" aria-label={label}>
          {resolvedTheme === "dark" ? <IconSun /> : <IconMoon />}
        </Button>
      }
    >
      <DropdownMenuLabel>{label}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={() => setMode("light")}>{themeLight}</DropdownMenuItem>
      <DropdownMenuItem onSelect={() => setMode("dark")}>{themeDark}</DropdownMenuItem>
    </DropdownMenu>
  );
}
