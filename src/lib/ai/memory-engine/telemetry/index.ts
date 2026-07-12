import type { EmeMemoryTelemetrySnapshot } from "@/lib/ai/memory-engine/types";
import type { EmeMemoryStorage } from "@/lib/ai/memory-engine/storage";

/**
 * Memory telemetry — created, used, ignored, hit rate, compression.
 */
export class EmeMemoryTelemetry {
  private memoriesCreated = 0;
  private memoriesUsed = 0;
  private memoriesIgnored = 0;
  private totalConfidence = 0;
  private confidenceSamples = 0;
  private compressedCount = 0;
  private candidatesPending = 0;
  private candidatesAccepted = 0;
  private candidatesRejected = 0;

  observeCreated(confidence: number): void {
    this.memoriesCreated += 1;
    this.totalConfidence += confidence;
    this.confidenceSamples += 1;
  }

  observeUsed(): void {
    this.memoriesUsed += 1;
  }

  observeIgnored(): void {
    this.memoriesIgnored += 1;
  }

  observeCompression(count: number): void {
    this.compressedCount += count;
  }

  observeCandidate(kind: "pending" | "accepted" | "rejected"): void {
    if (kind === "pending") this.candidatesPending += 1;
    if (kind === "accepted") {
      this.candidatesAccepted += 1;
      this.candidatesPending = Math.max(0, this.candidatesPending - 1);
    }
    if (kind === "rejected") {
      this.candidatesRejected += 1;
      this.candidatesPending = Math.max(0, this.candidatesPending - 1);
    }
  }

  snapshot(storage: EmeMemoryStorage): EmeMemoryTelemetrySnapshot {
    const totalRequests = this.memoriesUsed + this.memoriesIgnored;
    return {
      memoriesCreated: this.memoriesCreated,
      memoriesUsed: this.memoriesUsed,
      memoriesIgnored: this.memoriesIgnored,
      memoryHitRate: totalRequests === 0 ? 0 : Number((this.memoriesUsed / totalRequests).toFixed(4)),
      averageConfidence:
        this.confidenceSamples === 0
          ? 0
          : Number((this.totalConfidence / this.confidenceSamples).toFixed(4)),
      compressionRate:
        this.memoriesCreated === 0
          ? 0
          : Number((this.compressedCount / this.memoriesCreated).toFixed(4)),
      candidatesPending: storage.listCandidates(true).length,
      candidatesAccepted: this.candidatesAccepted,
      candidatesRejected: this.candidatesRejected,
      byLevel: storage.countByLevel(),
    };
  }

  reset(): void {
    this.memoriesCreated = 0;
    this.memoriesUsed = 0;
    this.memoriesIgnored = 0;
    this.totalConfidence = 0;
    this.confidenceSamples = 0;
    this.compressedCount = 0;
    this.candidatesPending = 0;
    this.candidatesAccepted = 0;
    this.candidatesRejected = 0;
  }
}
