"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RiskAssessmentWorkspaceError } from "@/components/risk-assessment";

const retryLabels: Record<string, string> = {
  en: "Retry",
  az: "Yenidən cəhd et",
  ru: "Повторить",
  tr: "Yeniden dene",
};

export default function RiskAssessmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const locale = typeof params.locale === "string" ? params.locale : "en";

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <RiskAssessmentWorkspaceError
      action={
        <Button type="button" variant="secondary" onClick={reset}>
          {retryLabels[locale] ?? retryLabels.en}
        </Button>
      }
    />
  );
}
