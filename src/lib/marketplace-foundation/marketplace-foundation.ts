/**
 * Marketplace foundation architecture only — plugins, extensions, AI skills, connectors.
 */

export type MarketplaceExtensionKind = "plugin" | "extension" | "ai_skill" | "connector";

export type MarketplaceExtensionManifest = {
  extensionId: string;
  kind: MarketplaceExtensionKind;
  displayName: string;
  version: string;
};

export function assertMarketplaceExtensionManifest(input: MarketplaceExtensionManifest): void {
  if (!input.extensionId.trim() || !input.displayName.trim() || !input.version.trim()) {
    throw new Error("Marketplace extension manifest is incomplete");
  }
}

export class MarketplaceFoundationRegistry {
  private readonly manifests = new Map<string, MarketplaceExtensionManifest>();

  register(manifest: MarketplaceExtensionManifest): void {
    assertMarketplaceExtensionManifest(manifest);
    this.manifests.set(manifest.extensionId, manifest);
  }

  list(): MarketplaceExtensionManifest[] {
    return [...this.manifests.values()];
  }
}
