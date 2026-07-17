import { ExportToPublicationFormatsWorkspaceProvider } from "@/components/export-to-publication-formats/export-to-publication-formats-workspace-provider";

export default function ExportToPublicationFormatsPage() {
  return (
    <ExportToPublicationFormatsWorkspaceProvider title="Export to publication formats">
      <p className="text-muted-foreground">
        Publication export workflow shell — packages are prepared from approved financial
        statements without generating PDFs in this sprint.
      </p>
    </ExportToPublicationFormatsWorkspaceProvider>
  );
}
