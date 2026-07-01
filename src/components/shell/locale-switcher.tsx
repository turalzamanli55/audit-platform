"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { IconChevronDown, IconGlobe } from "@/components/ui/icons";
import { locales } from "@/i18n";
import { useLanguage } from "@/providers";
import { cn } from "@/lib/ui/cn";

type LocaleSwitcherProps = {
  label: string;
  compact?: boolean;
  className?: string;
};

export function LocaleSwitcher({ label, compact = false, className }: LocaleSwitcherProps) {
  const { locale, setLocale } = useLanguage();
  const current = locales.find((item) => item.code === locale);

  return (
    <DropdownMenu
      className={className}
      trigger={
        compact ? (
          <Button variant="ghost" size="icon" className="h-10 w-10" aria-label={label}>
            <IconGlobe />
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="h-10 gap-1.5 px-2.5 font-normal text-muted-foreground">
            <IconGlobe width={16} height={16} />
            <span className="hidden max-w-[6rem] truncate sm:inline">{current?.label ?? locale}</span>
            <IconChevronDown />
          </Button>
        )
      }
    >
      <DropdownMenuLabel>{label}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {locales.map((item) => (
        <DropdownMenuItem
          key={item.code}
          onSelect={() => setLocale(item.code)}
          className={cn(item.code === locale && "bg-accent/60 font-medium")}
        >
          {item.label}
        </DropdownMenuItem>
      ))}
    </DropdownMenu>
  );
}
