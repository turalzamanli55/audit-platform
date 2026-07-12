import type { KgRankedHit, KgRetrievalRequest } from "@/lib/ai/knowledge-graph/types";
import { hasPermissionCode } from "@/lib/auth/permissions";

/**
 * Ranking engine — module / workflow / context / permission / confidence / freshness.
 */
export class KgRanker {
  rank(hits: KgRankedHit[], request: KgRetrievalRequest): KgRankedHit[] {
    const now = Date.now();
    return hits
      .map((hit) => {
        let score = hit.score;
        const reasons = [...hit.reasons];

        if (request.context.moduleId && hit.node.moduleId === request.context.moduleId) {
          score += 25;
          reasons.push("module_relevance");
        }

        if (
          request.context.workflowId &&
          (hit.node.type === "workflow" ||
            String(hit.node.metadata.workflowId ?? "") === request.context.workflowId)
        ) {
          score += 18;
          reasons.push("workflow_relevance");
        }

        if (request.context.route.includes(hit.node.moduleId ?? "")) {
          score += 8;
          reasons.push("context_route");
        }

        if (hit.node.permissionCodes && hit.node.permissionCodes.length > 0) {
          const allowed = hasPermissionCode(
            request.context.permissionCodes,
            [...hit.node.permissionCodes],
          );
          if (!allowed) {
            score -= 1000;
            reasons.push("permission_denied");
          } else {
            score += 10;
            reasons.push("permission_relevance");
          }
        } else {
          score += 4;
          reasons.push("permission_open");
        }

        score += hit.node.confidence * 12;
        reasons.push("knowledge_confidence");

        const freshnessMs = Date.parse(hit.node.freshness);
        if (!Number.isNaN(freshnessMs)) {
          const ageDays = Math.max(0, (now - freshnessMs) / 86_400_000);
          const freshnessBoost = Math.max(0, 10 - ageDays / 30);
          score += freshnessBoost;
          reasons.push("freshness");
        } else {
          score += 5;
          reasons.push("freshness_unknown");
        }

        return { ...hit, score, reasons };
      })
      .filter((hit) => hit.score > -500)
      .sort((a, b) => b.score - a.score || b.node.confidence - a.node.confidence);
  }
}
