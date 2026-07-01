"use client";

import { useEffect } from "react";
import { useCompanyIdentity } from "@/lib/company/use-company-identity";

export function CompanyIdentityUnsavedGuard() {
  const { hasUnsavedChanges } = useCompanyIdentity();

  useEffect(() => {
    if (!hasUnsavedChanges) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return null;
}
