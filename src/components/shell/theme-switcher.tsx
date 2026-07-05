"use client";

import { Button } from "@/components/ui/button";
import { IconMoon, IconSun } from "@/components/ui/icons";
import { useTheme } from "@/providers";
import { cn } from "@/lib/ui/cn";

type ThemeSwitcherProps = {
  label: string;
  themeLight: string;
  themeDark: string;
  toggleTheme: string;
  className?: string;
};

export function ThemeSwitcher({ label, themeLight, themeDark, toggleTheme, className }: ThemeSwitcherProps) {
  const { resolvedTheme, setMode } = useTheme();
  const isDark = resolvedTheme === "dark";

  function handleToggle() {
    setMode(isDark ? "light" : "dark");
  }

  const modeLabel = isDark ? themeDark : themeLight;

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("relative h-9 w-9 shrink-0 overflow-hidden sm:h-10 sm:w-10", className)}
      aria-label={`${label}: ${modeLabel}. ${toggleTheme}.`}
      onClick={handleToggle}
    >
      <IconSun
        width={18}
        height={18}
        className={cn(
          "absolute transition-all duration-200 motion-reduce:transition-none",
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-75 rotate-90 opacity-0",
        )}
      />
      <IconMoon
        width={18}
        height={18}
        className={cn(
          "absolute transition-all duration-200 motion-reduce:transition-none",
          isDark ? "scale-75 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
        )}
      />
    </Button>
  );
}
