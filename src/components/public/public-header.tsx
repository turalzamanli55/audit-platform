"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { IconChevronDown, IconMenu, IconMoon, IconSun, IconX } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import type { MarketingNavLabels } from "@/i18n/marketing-types";
import { locales } from "@/i18n";
import { useLanguage } from "@/providers";
import { useTheme } from "@/providers";
import { cn } from "@/lib/ui/cn";
import { PublicLinkButton } from "./ui/public-link-button";
import { PublicLocaleThemeControls } from "./public-locale-theme-controls";

type PublicHeaderProps = {
  locale: string;
  labels: MarketingNavLabels;
};

const navItems = [
  { key: "overview", href: "#overview" },
  { key: "features", href: "#features" },
  { key: "enterprise", href: "#enterprise" },
  { key: "ai", href: "#ai" },
  { key: "security", href: "#security" },
] as const;

export function PublicHeader({ locale, labels }: PublicHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { setLocale } = useLanguage();
  const { resolvedTheme, setMode } = useTheme();

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 8);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLabel = (key: (typeof navItems)[number]["key"]) => labels[key];

  return (
    <header
      className={cn(
        "sticky top-0 z-[1200] transition-all duration-300 motion-reduce:transition-none ds-safe-top",
        scrolled
          ? "border-b border-border/60 bg-background/75 shadow-xs backdrop-blur-xl supports-[backdrop-filter]:bg-background/65"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="ds-container flex h-[var(--ds-header-height)] items-center justify-between gap-4">
        <Link
          href={`/${locale}`}
          className="flex min-w-0 items-center gap-2.5 rounded-xl px-1 py-1 transition-opacity hover:opacity-80"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
            {siteConfig.name.slice(0, 1)}
          </span>
          <span className="truncate text-base font-semibold tracking-tight">{siteConfig.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label={labels.primaryNav}>
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              {navLabel(item.key)}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <DropdownMenu
            trigger={
              <Button variant="ghost" size="sm" className="gap-1.5 font-normal text-muted-foreground">
                {locales.find((l) => l.code === locale)?.label ?? locale}
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

          <PublicLinkButton href={`/${locale}/login`} variant="ghost" size="md">
            {labels.signIn}
          </PublicLinkButton>
          <PublicLinkButton href={`/${locale}/register`} size="md">
            {labels.register}
          </PublicLinkButton>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? labels.closeMenu : labels.openMenu}
        >
          {mobileOpen ? <IconX /> : <IconMenu />}
        </Button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-border/60 bg-background/95 px-4 py-5 backdrop-blur-xl md:hidden">
          <nav className="space-y-1" aria-label={labels.primaryNav}>
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                {navLabel(item.key)}
              </a>
            ))}
          </nav>
          <div className="mt-5 space-y-4 border-t border-border/60 pt-5">
            <PublicLocaleThemeControls
              labels={{
                language: labels.language,
                theme: labels.theme,
                themeLight: labels.themeLight,
                themeDark: labels.themeDark,
              }}
              layout="stacked"
            />
            <div className="grid gap-2">
            <PublicLinkButton href={`/${locale}/login`} variant="outline" className="w-full">
              {labels.signIn}
            </PublicLinkButton>
            <PublicLinkButton href={`/${locale}/register`} className="w-full">
              {labels.register}
            </PublicLinkButton>
            <PublicLinkButton href="mailto:hello@audit.platform" variant="ghost" className="w-full">
              {labels.requestDemo}
            </PublicLinkButton>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
