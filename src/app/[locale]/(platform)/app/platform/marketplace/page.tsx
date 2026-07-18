import { FoundationNotice, PlatformPageHeader, PlatformSection } from "@/components/platform-console/platform-primitives";

export default function PlatformMarketplacePage() {
  const surfaces = ["Plugins", "Extensions", "AI Skills", "Connectors"];

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="Marketplace"
        description="Extensibility surface for plugins, extensions, AI skills, and connectors."
      />
      <FoundationNotice>
        Marketplace is a foundation in this sprint — the extension architecture is prepared, no
        listings are published yet.
      </FoundationNotice>
      <PlatformSection title="Planned Surfaces">
        <ul className="grid gap-2 sm:grid-cols-2">
          {surfaces.map((surface) => (
            <li key={surface} className="rounded-lg border px-3 py-2 text-sm text-muted-foreground">
              {surface}
            </li>
          ))}
        </ul>
      </PlatformSection>
    </div>
  );
}
