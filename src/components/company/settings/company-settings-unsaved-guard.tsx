"use client";

import { useEffect } from "react";
import { useCompanySettings } from "@/lib/company/use-company-settings";

export function CompanySettingsUnsavedGuard() {
  const { hasUnsavedChanges } = useCompanySettings();

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
