import type { ReactNode } from "react";
import { CompanyInfoCard, CompanyInfoList, CompanyInfoRow } from "@/components/company";

export type CompanyWorkspaceMetadataItem = {
  id: string;
  label: ReactNode;
  value: ReactNode;
};

type CompanyWorkspaceMetadataPanelProps = {
  title: string;
  description?: string;
  items: CompanyWorkspaceMetadataItem[];
  className?: string;
};

/**
 * Structured metadata panel for workspace identity and record details.
 */
export function CompanyWorkspaceMetadataPanel({
  title,
  description,
  items,
  className = "",
}: CompanyWorkspaceMetadataPanelProps) {
  return (
    <CompanyInfoCard title={title} description={description} className={className}>
      <CompanyInfoList>
        {items.map((item) => (
          <CompanyInfoRow key={item.id} label={item.label} value={item.value} />
        ))}
      </CompanyInfoList>
    </CompanyInfoCard>
  );
}
