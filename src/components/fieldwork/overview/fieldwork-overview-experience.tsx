"use client";

import type { FieldworkCommandCenterData } from "@/types/fieldwork-command-center";
import type { Dictionary } from "@/i18n/get-dictionary";
import { FieldworkCommandCenter } from "../command-center/fieldwork-command-center";
import { FieldworkCreateExperience } from "@/components/fieldwork/create/fieldwork-create-experience";
import { useFieldworkWorkspace } from "@/lib/fieldwork/use-fieldwork-workspace";

type FieldworkOverviewExperienceProps = {
  locale: string;
  slug: string;
  canCreate: boolean;
  planningApproved: boolean;
  hasFieldwork: boolean;
  commandCenter: FieldworkCommandCenterData | null;
  labels: Dictionary["fieldwork"]["workspace"];
  fieldworkLabels: Dictionary["fieldwork"];
};

export function FieldworkOverviewExperience({
  locale,
  slug,
  canCreate,
  planningApproved,
  hasFieldwork,
  commandCenter,
  labels,
  fieldworkLabels,
}: FieldworkOverviewExperienceProps) {
  const { fieldwork } = useFieldworkWorkspace();

  if (!hasFieldwork || !commandCenter || !fieldwork) {
    return (
      <FieldworkCreateExperience
        canCreate={canCreate}
        planningApproved={planningApproved}
        labels={fieldworkLabels.empty}
        gateLabels={labels}
      />
    );
  }

  return (
    <FieldworkCommandCenter
      locale={locale}
      slug={slug}
      commandCenter={commandCenter}
      labels={labels}
      fieldworkLabels={fieldworkLabels}
    />
  );
}
