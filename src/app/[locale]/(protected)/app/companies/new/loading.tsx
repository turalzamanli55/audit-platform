import { CompanyLoadingSkeleton, CompanyPageShell } from "@/components/company";

export default function CompanyCreateLoading() {
  return (
    <CompanyPageShell>
      <CompanyLoadingSkeleton variant="detail" />
    </CompanyPageShell>
  );
}
