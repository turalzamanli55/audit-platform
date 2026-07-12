import type { ReactNode } from "react";
import type { AiWorkspaceMessageBlock } from "@/components/ai/types";
import { workspaceTokens } from "@/components/workspace/workspace-tokens";
import { cn } from "@/lib/ui/cn";

/** Lightweight markdown subset — no LLM, no external markdown SDK. */
export function renderAiMarkdown(content: string) {
  const lines = content.split("\n");
  const nodes: ReactNode[] = [];
  let listBuffer: string[] = [];
  let codeBuffer: string[] | null = null;
  let tableBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length === 0) return;
    nodes.push(
      <ul key={`ul-${nodes.length}`} className="my-2 list-disc space-y-1 pl-5 text-sm">
        {listBuffer.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>,
    );
    listBuffer = [];
  };

  const flushCode = () => {
    if (!codeBuffer) return;
    nodes.push(
      <pre
        key={`code-${nodes.length}`}
        className="my-2 overflow-x-auto rounded-xl border border-border/50 bg-muted/40 p-3 text-xs leading-relaxed"
      >
        <code>{codeBuffer.join("\n")}</code>
      </pre>,
    );
    codeBuffer = null;
  };

  const flushTable = () => {
    if (tableBuffer.length < 2) {
      tableBuffer.forEach((line) => nodes.push(<p key={`p-${nodes.length}`} className="text-sm">{line}</p>));
      tableBuffer = [];
      return;
    }
    const rows = tableBuffer
      .filter((line) => !/^\|?\s*-{3,}/.test(line.replace(/\|/g, "")))
      .map((line) =>
        line
          .trim()
          .replace(/^\|/, "")
          .replace(/\|$/, "")
          .split("|")
          .map((cell) => cell.trim()),
      );
    const [header, ...body] = rows;
    nodes.push(
      <div key={`table-${nodes.length}`} className="my-2 overflow-x-auto">
        <table className="w-full min-w-[16rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border/60">
              {header?.map((cell, index) => (
                <th key={index} className="px-2 py-1.5 font-semibold">
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-border/40">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-2 py-1.5 text-muted-foreground">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>,
    );
    tableBuffer = [];
  };

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      if (codeBuffer) flushCode();
      else {
        flushList();
        flushTable();
        codeBuffer = [];
      }
      continue;
    }
    if (codeBuffer) {
      codeBuffer.push(line);
      continue;
    }
    if (line.includes("|") && line.trim().startsWith("|")) {
      flushList();
      tableBuffer.push(line);
      continue;
    }
    if (tableBuffer.length) flushTable();

    if (/^\s*[-*]\s+/.test(line)) {
      listBuffer.push(line.replace(/^\s*[-*]\s+/, ""));
      continue;
    }
    flushList();

    if (line.startsWith("### ")) {
      nodes.push(
        <h4 key={`h-${nodes.length}`} className="mt-3 text-sm font-semibold text-foreground">
          {line.slice(4)}
        </h4>,
      );
    } else if (line.startsWith("## ")) {
      nodes.push(
        <h3 key={`h-${nodes.length}`} className="mt-3 text-base font-semibold text-foreground">
          {line.slice(3)}
        </h3>,
      );
    } else if (line.trim() === "") {
      nodes.push(<div key={`sp-${nodes.length}`} className="h-2" />);
    } else {
      nodes.push(
        <p key={`p-${nodes.length}`} className="text-sm leading-relaxed text-foreground">
          {line}
        </p>,
      );
    }
  }
  flushList();
  flushCode();
  flushTable();
  return nodes;
}

export function AiMessageBlockView({ block }: { block: AiWorkspaceMessageBlock }) {
  switch (block.type) {
    case "markdown":
      return <div className="space-y-1">{renderAiMarkdown(block.content)}</div>;
    case "status": {
      const toneClass =
        block.tone === "success"
          ? "border-emerald-500/30 bg-emerald-500/10"
          : block.tone === "warning"
            ? "border-amber-500/30 bg-amber-500/10"
            : block.tone === "error"
              ? "border-destructive/30 bg-destructive/10"
              : "border-primary/20 bg-primary/5";
      return (
        <div className={cn("my-2 rounded-xl border px-3 py-2.5", toneClass)}>
          <p className="text-sm font-medium text-foreground">{block.title}</p>
          {block.body ? <p className="mt-1 text-sm text-muted-foreground">{block.body}</p> : null}
        </div>
      );
    }
    case "timeline":
      return (
        <ol className="my-2 space-y-2 border-l border-border/60 pl-4">
          {block.items.map((item) => (
            <li key={item.id} className="relative text-sm">
              <span className="absolute -left-[1.28rem] top-1.5 h-2 w-2 rounded-full bg-primary" aria-hidden />
              <p className="font-medium text-foreground">{item.label}</p>
              {item.detail ? <p className="text-muted-foreground">{item.detail}</p> : null}
            </li>
          ))}
        </ol>
      );
    case "workflow":
      return (
        <div className={cn(workspaceTokens.card, "my-2 p-3")}>
          <p className="text-sm font-semibold text-foreground">{block.title}</p>
          <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm text-muted-foreground">
            {block.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      );
    case "action":
      return (
        <div className={cn(workspaceTokens.card, "my-2 space-y-2 p-3")}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-foreground">{block.label}</p>
              <p className="text-sm text-muted-foreground">{block.description}</p>
            </div>
            <span className="shrink-0 rounded-lg border border-border/50 px-2 py-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
              {block.available ? "Available" : "Locked"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{block.permissionSummary}</p>
          <p className="text-xs text-muted-foreground">{block.estimatedResult}</p>
        </div>
      );
    case "reference":
      return (
        <div className={cn(workspaceTokens.listRow, "my-2 pointer-events-none")}>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{block.title}</p>
            {block.meta ? <p className="truncate text-xs text-muted-foreground">{block.meta}</p> : null}
          </div>
        </div>
      );
    case "search":
      return (
        <div className="my-2 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Search · {block.query}
          </p>
          {block.results.map((result) => (
            <div key={result.id} className={cn(workspaceTokens.listRow, "pointer-events-none")}>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{result.title}</p>
                {result.subtitle ? (
                  <p className="truncate text-xs text-muted-foreground">{result.subtitle}</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      );
    case "knowledge":
      return (
        <div className={cn(workspaceTokens.card, "my-2 space-y-2 p-3")}>
          <p className="text-sm font-semibold text-foreground">{block.moduleName}</p>
          <p className="text-sm text-muted-foreground">{block.purpose}</p>
          {block.related.length > 0 ? (
            <p className="text-xs text-muted-foreground">Related: {block.related.join(", ")}</p>
          ) : null}
        </div>
      );
    default:
      return null;
  }
}
