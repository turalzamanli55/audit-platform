import type { AiModuleId } from "@/lib/ai/constants";

export type AiModuleKnowledge = {
  id: AiModuleId;
  name: string;
  purpose: string;
  inputs: string[];
  outputs: string[];
  dependencies: AiModuleId[];
  workflow: string[];
  permissions: string[];
  navigation: {
    basePath: string;
    sections: string[];
  };
  relatedModules: AiModuleId[];
};

export type AiKnowledgeSnapshot = {
  modules: AiModuleKnowledge[];
  version: string;
  registeredAt: string;
};
