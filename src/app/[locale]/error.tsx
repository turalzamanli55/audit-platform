"use client";

import { ErrorShell } from "@/components/layout";
import { useCommonLabels } from "@/i18n/use-common-labels";

type LocaleErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function LocaleError({ error, reset }: LocaleErrorProps) {
  const { error: errorTitle, tryAgain } = useCommonLabels();

  return (
    <ErrorShell title={errorTitle} description={error.message}>
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        {tryAgain}
      </button>
    </ErrorShell>
  );
}
