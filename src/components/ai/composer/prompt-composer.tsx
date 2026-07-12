"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { AiWorkspaceLabels } from "@/components/ai/types";
import { aiWorkspaceTokens } from "@/components/ai/shared/ai-tokens";
import { cn } from "@/lib/ui/cn";

export type AiPromptComposerProps = {
  labels: AiWorkspaceLabels;
  moduleLabel: string;
  workspaceLabel: string;
  contextReady: boolean;
  disabled?: boolean;
  onSubmit: (utterance: string) => void;
  focusSignal?: number;
};

export function AiPromptComposer({
  labels,
  moduleLabel,
  workspaceLabel,
  contextReady,
  disabled,
  onSubmit,
  focusSignal,
}: AiPromptComposerProps) {
  const [value, setValue] = useState("");
  const [enterToSend, setEnterToSend] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fieldId = useId();

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  }, [value]);

  useEffect(() => {
    if (focusSignal === undefined) return;
    textareaRef.current?.focus();
  }, [focusSignal]);

  const send = () => {
    const next = value.trim();
    if (!next || disabled) return;
    onSubmit(next);
    setValue("");
  };

  return (
    <div className={aiWorkspaceTokens.composerShell}>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className={aiWorkspaceTokens.chip}>
          <span className={aiWorkspaceTokens.chipMuted}>{labels.composer.module}</span>
          <span>{moduleLabel}</span>
        </span>
        <span className={aiWorkspaceTokens.chip}>
          <span className={aiWorkspaceTokens.chipMuted}>{labels.composer.workspace}</span>
          <span>{workspaceLabel}</span>
        </span>
        <span className={aiWorkspaceTokens.chip}>
          <span className={aiWorkspaceTokens.chipMuted}>{labels.composer.context}</span>
          <span>{contextReady ? "Ready" : "…"}</span>
        </span>
      </div>

      <label htmlFor={fieldId} className="sr-only">
        {labels.composer.placeholder}
      </label>
      <textarea
        id={fieldId}
        ref={textareaRef}
        value={value}
        disabled={disabled}
        rows={1}
        placeholder={labels.composer.placeholder}
        className={cn(aiWorkspaceTokens.composerField, disabled && "opacity-60")}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key !== "Enter") return;
          if (enterToSend && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            send();
            return;
          }
          if ((event.ctrlKey || event.metaKey) && !enterToSend) {
            event.preventDefault();
            send();
          }
        }}
      />

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>
            {value.length} {labels.composer.characters}
          </span>
          <button
            type="button"
            className="underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setEnterToSend((current) => !current)}
          >
            {enterToSend ? labels.composer.enterSends : labels.composer.ctrlEnterSends}
          </button>
        </div>
        <Button type="button" size="sm" disabled={disabled || !value.trim()} onClick={send}>
          {labels.composer.send}
        </Button>
      </div>
    </div>
  );
}
