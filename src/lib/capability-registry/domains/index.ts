export type DomainDefinition = {
  id: string;
  name: string;
  description: string;
  moduleIds: string[];
};

export type DomainReadiness = {
  id: string;
  name: string;
  description: string;
  moduleIds: string[];
  completionPct: number;
  status: import("@/lib/capability-registry/capabilities").CapabilityStatus;
  moduleCount: number;
  featureCount: number;
  capabilityCount: number;
  completedCapabilities: number;
  missingCapabilities: number;
};
