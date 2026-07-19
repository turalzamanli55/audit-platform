"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import {
  PlatformAccountMenu,
  PlatformDetailRow,
} from "@/components/platform-console/platform-account-menu";
import { usePlatformLabels } from "@/i18n/use-platform-labels";

/**
 * The single Platform Console header. No tenant/workspace/company switchers.
 * Platform Owner only. Language follows the current URL locale (switched via the
 * account menu using the shared application localization); appearance is a
 * user-interface preference. Neither affects business logic.
 */
export function PlatformHeader({
  ownerEmail,
  environment,
  version,
  buildDate,
  gitCommit,
  databaseVersion,
}: {
  ownerEmail: string;
  environment: string;
  version: string;
  buildDate?: string;
  gitCommit?: string;
  databaseVersion?: string;
}) {
  const t = usePlatformLabels();
  const [aboutOpen, setAboutOpen] = useState(false);
  const displayName = deriveDisplayName(ownerEmail);

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl lg:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
          P
        </span>
        <span className="truncate text-sm font-semibold tracking-tight text-foreground">
          {t.header.console}
        </span>
        <span className="hidden shrink-0 rounded-full border border-border/60 px-2 py-0.5 text-xs font-medium text-muted-foreground sm:inline">
          {environment}
        </span>
        <button
          type="button"
          onClick={() => setAboutOpen(true)}
          aria-label={t.about.title}
          className="hidden shrink-0 rounded-full border border-border/60 px-2 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:inline"
        >
          v{version}
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <PlatformAccountMenu
          displayName={displayName}
          email={ownerEmail}
          environment={environment}
          onAbout={() => setAboutOpen(true)}
        />
      </div>

      <Modal open={aboutOpen} onOpenChange={setAboutOpen} title={t.about.title} size="sm">
        <dl className="space-y-3 text-sm">
          <PlatformDetailRow label={t.about.version} value={`v${version}`} />
          <PlatformDetailRow label={t.about.environment} value={environment} />
          <PlatformDetailRow
            label={t.about.buildDate}
            value={formatBuildDate(buildDate) ?? t.about.notAvailable}
            muted={!buildDate}
          />
          <PlatformDetailRow
            label={t.about.gitCommit}
            value={gitCommit ? gitCommit.slice(0, 12) : t.about.notAvailable}
            mono={Boolean(gitCommit)}
            muted={!gitCommit}
          />
          <PlatformDetailRow
            label={t.about.databaseVersion}
            value={databaseVersion || t.about.notAvailable}
            muted={!databaseVersion}
          />
        </dl>
      </Modal>
    </header>
  );
}

function deriveDisplayName(email: string): string {
  const local = email.split("@")[0] ?? email;
  const words = local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  return words.join(" ") || email;
}

function formatBuildDate(value?: string): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
}
