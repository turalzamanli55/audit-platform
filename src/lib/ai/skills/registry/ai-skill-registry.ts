import type { AiSkillDefinition, AiSkillHandler, AiSkillRegistration } from "@/lib/ai/skills/contracts/types";
import type { AiModuleId } from "@/lib/ai/constants";

/**
 * Enterprise Skill Registry — definitions + handlers.
 * No LLM calls. No business mutations.
 */
export class AiSkillRegistry {
  private readonly skills = new Map<string, AiSkillRegistration>();

  register(registration: AiSkillRegistration): void {
    if (this.skills.has(registration.definition.id)) {
      throw new Error(`Duplicate AI skill id: ${registration.definition.id}`);
    }
    this.skills.set(registration.definition.id, registration);
  }

  registerAll(registrations: readonly AiSkillRegistration[]): void {
    for (const registration of registrations) {
      this.register(registration);
    }
  }

  remove(skillId: string): boolean {
    return this.skills.delete(skillId);
  }

  get(skillId: string): AiSkillRegistration | null {
    return this.skills.get(skillId) ?? null;
  }

  getDefinition(skillId: string): AiSkillDefinition | null {
    return this.skills.get(skillId)?.definition ?? null;
  }

  getHandler(skillId: string): AiSkillHandler | null {
    return this.skills.get(skillId)?.handler ?? null;
  }

  list(filter?: {
    moduleId?: AiModuleId;
    category?: AiSkillDefinition["category"];
    visibility?: AiSkillDefinition["visibility"];
  }): AiSkillDefinition[] {
    return [...this.skills.values()]
      .map((entry) => entry.definition)
      .filter((definition) => {
        if (filter?.moduleId && definition.moduleId !== filter.moduleId) return false;
        if (filter?.category && definition.category !== filter.category) return false;
        if (filter?.visibility && definition.visibility !== filter.visibility) return false;
        return true;
      })
      .sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id));
  }

  listIds(): string[] {
    return [...this.skills.keys()];
  }

  count(): number {
    return this.skills.size;
  }
}
