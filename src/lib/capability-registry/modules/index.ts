export type ModuleDefinition = {
  id: string;
  domainId: string;
  name: string;
  description: string;
  featureIds: string[];
  dependencies: string[];
};

export type ModuleReadiness = {
  id: string;
  domainId: string;
  name: string;
  description: string;
  featureIds: string[];
  dependencies: string[];
  completionPct: number;
  status: import("@/lib/capability-registry/capabilities").CapabilityStatus;
  featureCount: number;
  capabilityCount: number;
  completedCapabilities: number;
};
