/**
 * EPAC Phase 5 — Frontend Audit.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  listImmediateChildren,
  toRepoPath,
  walkFiles,
} from "@/lib/platform-audit/utils";
import type { AuditFinding, PhaseHealth } from "@/lib/platform-audit/types";

export function auditFrontend(cwd = process.cwd()): PhaseHealth {
  const started = Date.now();
  const findings: AuditFinding[] = [];

  const appRoot = join(cwd, "src", "app");
  const componentsRoot = join(cwd, "src", "components");
  const pages = walkFiles(appRoot, [".tsx"]).filter(
    (file) => file.endsWith("page.tsx") || file.endsWith("layout.tsx"),
  );
  const pageRoutes = walkFiles(appRoot, [".tsx"]).filter((file) => file.endsWith("page.tsx"));
  const components = walkFiles(componentsRoot, [".tsx", ".ts"]);
  const componentGroups = listImmediateChildren(componentsRoot);

  if (!existsSync(appRoot)) {
    findings.push({
      phase: "frontend",
      code: "missing_app_router",
      severity: "blocker",
      message: "src/app missing",
      rootCause: "Next.js App Router layer absent",
    });
  }
  if (pageRoutes.length === 0) {
    findings.push({
      phase: "frontend",
      code: "no_routes",
      severity: "blocker",
      message: "No page.tsx routes discovered",
      rootCause: "Frontend route surface empty",
    });
  }
  if (components.length === 0) {
    findings.push({
      phase: "frontend",
      code: "no_components",
      severity: "error",
      message: "No components under src/components",
      rootCause: "UI component layer empty",
    });
  }

  const loadingStates = walkFiles(appRoot, [".tsx"]).filter((file) =>
    file.endsWith("loading.tsx"),
  );
  const errorStates = walkFiles(appRoot, [".tsx"]).filter((file) => file.endsWith("error.tsx"));

  if (loadingStates.length === 0) {
    findings.push({
      phase: "frontend",
      code: "no_loading_states",
      severity: "warning",
      message: "No loading.tsx files discovered",
      rootCause: "Loading-state coverage missing at route level",
    });
  }
  if (errorStates.length === 0) {
    findings.push({
      phase: "frontend",
      code: "no_error_states",
      severity: "warning",
      message: "No error.tsx files discovered",
      rootCause: "Error-state coverage missing at route level",
    });
  }

  const scorePct = Number(
    (
      (pageRoutes.length > 0 ? 40 : 0) +
      (components.length > 0 ? 30 : 0) +
      (loadingStates.length > 0 ? 15 : 0) +
      (errorStates.length > 0 ? 15 : 0)
    ).toFixed(2),
  );

  return {
    phase: "frontend",
    label: "Frontend Audit",
    ok: findings.every((finding) => finding.severity !== "blocker"),
    scorePct,
    findings,
    metrics: {
      routes: pageRoutes.length,
      layoutsAndPages: pages.length,
      components: components.length,
      componentGroups: componentGroups.length,
      loadingStates: loadingStates.length,
      errorStates: errorStates.length,
    },
    durationMs: Date.now() - started,
  };
}

export function listFrontendEvidence(cwd = process.cwd()) {
  return {
    routes: walkFiles(join(cwd, "src", "app"), [".tsx"])
      .filter((file) => file.endsWith("page.tsx"))
      .map((file) => toRepoPath(cwd, file)),
    components: walkFiles(join(cwd, "src", "components"), [".tsx", ".ts"]).map((file) =>
      toRepoPath(cwd, file),
    ),
    workspaces: walkFiles(join(cwd, "src"), [".tsx"]).filter((file) =>
      /workspace/i.test(file),
    ).map((file) => toRepoPath(cwd, file)),
  };
}
