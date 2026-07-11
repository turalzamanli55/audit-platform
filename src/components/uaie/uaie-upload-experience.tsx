"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import {
  WorkspaceMetricCard,
  WorkspaceNoticeBanner,
  WorkspacePanel,
  WorkspaceStatusBadge,
  WorkspaceTable,
} from "@/components/workspace";
import { uploadAndScanUaieAction } from "@/lib/actions/uaie";

type Labels = {
  title: string;
  description: string;
  dropHint: string;
  browseAction: string;
  uploading: string;
  recentTitle: string;
  emptyTitle: string;
  emptyDescription: string;
  noPermissionDescription: string;
  columns: {
    file: string;
    status: string;
    erp: string;
    confidence: string;
    rows: string;
    created: string;
  };
  errorGeneric: string;
};

export type UaieSessionListRow = {
  id: string;
  filename: string;
  importStatus: string;
  detectedErp: string;
  overallConfidence: number;
  createdAt: string;
  rowCount: number;
};

export function UaieUploadExperience(props: {
  locale: string;
  companySlug: string;
  companyId: string;
  canCreate: boolean;
  sessions: UaieSessionListRow[];
  labels: Labels;
  statusLabels: Record<string, string>;
  erpLabels: Record<string, string>;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const openSession = (sessionId: string) => {
    router.push(`/${props.locale}/app/companies/${props.companySlug}/import/${sessionId}`);
  };

  const processFile = (file: File) => {
    if (!props.canCreate) return;
    setError(null);
    startTransition(async () => {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = "";
      for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]!);
      const contentBase64 = btoa(binary);
      const result = await uploadAndScanUaieAction({
        companyId: props.companyId,
        filename: file.name,
        mimeType: file.type || null,
        contentBase64,
      });
      if (!result.success) {
        setError(result.error?.message ?? props.labels.errorGeneric);
        return;
      }
      openSession(result.data.sessionId);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <WorkspacePanel>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{props.labels.title}</h1>
          <p className="text-sm text-muted-foreground">{props.labels.description}</p>
        </div>
      </WorkspacePanel>

      {props.canCreate ? (
        <div
          className={`rounded-xl border border-dashed p-8 transition ${
            dragOver ? "border-foreground bg-muted/40" : "border-border"
          }`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragOver(false);
            const file = event.dataTransfer.files?.[0];
            if (file) processFile(file);
          }}
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-sm text-muted-foreground">{props.labels.dropHint}</p>
            <Button type="button" disabled={isPending} onClick={() => inputRef.current?.click()}>
              {isPending ? props.labels.uploading : props.labels.browseAction}
            </Button>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept=".xlsx,.xls,.csv,.tsv,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) processFile(file);
                event.target.value = "";
              }}
            />
          </div>
        </div>
      ) : (
        <WorkspaceNoticeBanner
          variant="warning"
          description={props.labels.noPermissionDescription}
          role="status"
        />
      )}

      {error ? <WorkspaceNoticeBanner variant="error" description={error} role="alert" /> : null}

      {props.sessions[0] ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <WorkspaceMetricCard
            label={props.labels.columns.confidence}
            value={`${props.sessions[0].overallConfidence}%`}
          />
          <WorkspaceMetricCard
            label={props.labels.columns.erp}
            value={props.erpLabels[props.sessions[0].detectedErp] ?? props.sessions[0].detectedErp}
          />
          <WorkspaceMetricCard
            label={props.labels.columns.rows}
            value={String(props.sessions[0].rowCount)}
          />
        </div>
      ) : null}

      <WorkspacePanel>
        <h2 className="mb-4 text-lg font-medium">{props.labels.recentTitle}</h2>
        <WorkspaceTable
          columns={[
            {
              id: "file",
              header: props.labels.columns.file,
              cell: (row) => (
                <button
                  type="button"
                  className="text-left font-medium underline-offset-2 hover:underline"
                  onClick={() => openSession(row.id)}
                >
                  {row.filename}
                </button>
              ),
            },
            {
              id: "status",
              header: props.labels.columns.status,
              cell: (row) => (
                <WorkspaceStatusBadge
                  label={props.statusLabels[row.importStatus] ?? row.importStatus}
                  variant="outline"
                />
              ),
            },
            {
              id: "erp",
              header: props.labels.columns.erp,
              cell: (row) => props.erpLabels[row.detectedErp] ?? row.detectedErp,
            },
            {
              id: "confidence",
              header: props.labels.columns.confidence,
              cell: (row) => `${row.overallConfidence}%`,
              sortable: true,
              sortValue: (row) => row.overallConfidence,
            },
            {
              id: "rows",
              header: props.labels.columns.rows,
              cell: (row) => String(row.rowCount),
            },
            {
              id: "created",
              header: props.labels.columns.created,
              cell: (row) => new Date(row.createdAt).toLocaleString(),
              sortable: true,
              sortValue: (row) => new Date(row.createdAt).getTime(),
            },
          ]}
          rows={props.sessions}
          keyFn={(row) => row.id}
          emptyTitle={props.labels.emptyTitle}
          emptyDescription={props.labels.emptyDescription}
        />
      </WorkspacePanel>
    </div>
  );
}
