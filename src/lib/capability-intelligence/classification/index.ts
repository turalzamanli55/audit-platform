/**
 * Automatic capability classification from bible intent signals.
 */
import type { CapabilityClass, ParsedCapability } from "@/lib/capability-intelligence/types";

function haystack(capability: ParsedCapability): string {
  return [
    capability.id,
    capability.name,
    capability.description,
    capability.moduleId,
    capability.domainId,
    capability.category,
  ]
    .join(" ")
    .toLowerCase();
}

export function classifyCapability(capability: ParsedCapability): CapabilityClass[] {
  const text = haystack(capability);
  const classes = new Set<CapabilityClass>();

  if (/future|roadmap|later|backlog|upcoming/.test(text)) classes.add("future");
  if (/experimental|prototype|spike|poc\b/.test(text)) classes.add("experimental");
  if (/planned|todo|not yet/.test(text)) classes.add("planned");
  if (/optional|nice.to.have|enhancement/.test(text)) classes.add("optional");
  if (/enterprise.?only|enterprise.?tier/.test(text)) classes.add("enterprise_only");
  if (/internal|platform.?core|registry|devops|governance|sync/.test(text)) classes.add("internal");
  if (/infrastruct|foundation|sql.?foundation|migration.?health/.test(text)) classes.add("infrastructure");
  if (/\bui\b|dashboard|workspace.?shell|component|sidebar|palette/.test(text)) classes.add("ui");
  if (/\bai\b|llm|prompt|orchestrat|knowledge.?graph|memory.?engine|planner/.test(text)) {
    classes.add("ai");
  }
  if (/security|auth|permission|rls|rbac|tenant.?isolation|encryption/.test(text)) {
    classes.add("security");
  }
  if (/compliance|ifrs|isa\b|audit.?standard|regulatory/.test(text)) classes.add("compliance");
  if (/database|migration|schema|repository|supabase|sql\b/.test(text)) classes.add("database");
  if (/workflow|pipeline|engine|approval|lifecycle/.test(text)) classes.add("workflow");

  // Default required unless clearly future/optional/experimental
  const nonRequired =
    classes.has("future") ||
    classes.has("optional") ||
    classes.has("experimental") ||
    classes.has("planned") ||
    classes.has("enterprise_only");

  if (!nonRequired) {
    classes.add("required");
  }

  // Security/database/infrastructure are required by default when not future
  if (
    (classes.has("security") || classes.has("database") || classes.has("infrastructure")) &&
    !classes.has("future") &&
    !classes.has("experimental")
  ) {
    classes.add("required");
    classes.delete("optional");
  }

  // Pure AI capabilities that are not foundation may be future/optional unless critical
  if (classes.has("ai") && capability.priority === "low" && !classes.has("required")) {
    classes.add("future");
  }

  if (classes.size === 0) classes.add("required");
  return [...classes];
}

export function primaryClass(classes: CapabilityClass[]): CapabilityClass {
  const order: CapabilityClass[] = [
    "required",
    "security",
    "database",
    "compliance",
    "infrastructure",
    "workflow",
    "ai",
    "ui",
    "internal",
    "enterprise_only",
    "optional",
    "planned",
    "experimental",
    "future",
  ];
  for (const candidate of order) {
    if (classes.includes(candidate)) return candidate;
  }
  return "required";
}
