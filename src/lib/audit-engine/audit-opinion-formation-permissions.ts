/**
 * Permission helpers for audit opinion formation (PROJECT_BIBLE §13.2 Audit).
 */
import { AuthorizationError } from "@/lib/errors";
import {
  AUDIT_OPINION_FORMATION_PERMISSIONS,
  AUDIT_ENGINE_PERMISSIONS,
} from "@/constants/audit-engine";

export function authorizeAuditOpinionFormationPermission(
  permissionCodes: string[],
  required: string | string[],
): boolean {
  const needed = Array.isArray(required) ? required : [required];
  return needed.every((code) => permissionCodes.includes(code));
}

export function requireAuditOpinionFormationPermission(
  permissionCodes: string[],
  required: string | string[] = AUDIT_OPINION_FORMATION_PERMISSIONS.READ,
): void {
  if (!authorizeAuditOpinionFormationPermission(permissionCodes, required)) {
    throw new AuthorizationError("Audit opinion formation permission required");
  }
}

export {
  AUDIT_OPINION_FORMATION_PERMISSIONS,
  AUDIT_ENGINE_PERMISSIONS,
};
