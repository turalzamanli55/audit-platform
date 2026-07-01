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
  /** Icon-only trigger for tight spaces (e.g. legacy compact slots). */
  compact?: boolean;
  /** Single instance: icon on mobile, label + chevron on desktop (lg+). */
  responsive?: boolean;
  className?: string;
};

export function LocaleSwitcher({
  label,
  compact = false,
  responsive = false,
  className,
}: LocaleSwitcherProps) {
  const { locale, setLocale } = useLanguage();
  const current = locales.find((item) => item.code === locale);

  const trigger =
    responsive ? (
      <Button
        variant="ghost"
        className="h-9 w-9 shrink-0 gap-1.5 p-0 font-normal text-muted-foreground sm:h-10 sm:w-10 lg:h-10 lg:w-auto lg:px-2.5"
        aria-label={label}
      >
        <IconGlobe width={16} height={16} className="shrink-0" />
        <span className="hidden max-w-[6rem] truncate lg:inline">{current?.label ?? locale}</span>
        <IconChevronDown className="hidden shrink-0 lg:block" />
      </Button>
    ) : compact ? (
      <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" aria-label={label}>
        <IconGlobe />
      </Button>
    ) : (
      <Button variant="ghost" size="sm" className="h-10 gap-1.5 px-2.5 font-normal text-muted-foreground">
        <IconGlobe width={16} height={16} />
        <span className="hidden max-w-[6rem] truncate sm:inline">{current?.label ?? locale}</span>
        <IconChevronDown />
      </Button>
    );

  return (
    <DropdownMenu className={className} trigger={trigger}>
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
