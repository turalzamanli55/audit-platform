import type { ReactNode } from "react";
import { CompanyErrorState } from "@/components/company";

type CompanySettingsErrorProps = {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
};

export function CompanySettingsError({
  title = "Unable to load settings",
  description = "Something went wrong while loading company settings.",
  action,
}: CompanySettingsErrorProps) {
  return <CompanyErrorState title={title} description={description} action={action} />;
}
