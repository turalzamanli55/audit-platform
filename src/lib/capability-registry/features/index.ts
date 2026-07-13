export type FeatureDefinition = {
  id: string;
  moduleId: string;
  domainId: string;
  name: string;
  description: string;
  capabilityIds: string[];
};

export type FeatureReadiness = {
  id: string;
  moduleId: string;
  domainId: string;
  name: string;
  description: string;
  capabilityIds: string[];
  completionPct: number;
  status: import("@/lib/capability-registry/capabilities").CapabilityStatus;
  capabilityCount: number;
  completedCapabilities: number;
  missingEvidenceCount: number;
};
