"use client";

import type { ReactNode } from "react";
import { CompanyIdentityProvider } from "@/lib/company/use-company-identity";
import type { CompanyWorkspaceView } from "@/lib/company/company-workspace-view";
import type { CompanyIdentityParentOption } from "@/lib/company/use-company-identity";
import { CompanyIdentityChrome } from "./company-identity-chrome";
import type { Dictionary } from "@/i18n/get-dictionary";

type CompanyIdentityExperienceProps = {
  company: CompanyWorkspaceView;
  locale: string;
  canAdminister: boolean;
  canConfigure: boolean;
  parentOptions: CompanyIdentityParentOption[];
  labels: Dictionary["companies"]["identity"];
  children: ReactNode;
};

export function CompanyIdentityExperience({
  company,
  locale,
  canAdminister,
  canConfigure,
  parentOptions,
  labels,
  children,
}: CompanyIdentityExperienceProps) {
  return (
    <CompanyIdentityProvider
      initialCompany={company}
      canAdminister={canAdminister}
      canConfigure={canConfigure}
      parentOptions={parentOptions}
      locale={locale}
    >
      <CompanyIdentityChrome labels={labels}>{children}</CompanyIdentityChrome>
    </CompanyIdentityProvider>
  );
}
