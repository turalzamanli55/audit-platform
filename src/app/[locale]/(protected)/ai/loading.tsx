import { AiWorkspaceLoading } from "@/components/ai/loading/skeletons";
import { AI_WORKSPACE_LABELS_EN } from "@/components/ai/labels";

export default function AiWorkspaceRouteLoading() {
  return <AiWorkspaceLoading label={AI_WORKSPACE_LABELS_EN.loading.workspace} />;
}
