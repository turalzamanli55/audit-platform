import {
  AuditOpinionFormationPanel,
  AuditOpinionFormationWorkspaceProvider,
} from "@/components/audit-engine";
import { deriveAuditOpinionType } from "@/lib/audit-engine/audit-opinion-formation";

export default function AuditOpinionFormationPage() {
  const facts = {
    misstatementsMaterial: false,
    misstatementsPervasive: false,
    scopeLimitation: false,
    goingConcernMaterialUncertainty: false,
  };
  const derivedOpinionType = deriveAuditOpinionType(facts);
  const opinionType = derivedOpinionType;

  return (
    <AuditOpinionFormationWorkspaceProvider
      title="Audit opinion formation"
      subtitle="Form the engagement opinion from ISA-aligned facts before report issuance."
    >
      <AuditOpinionFormationPanel
        opinionType={opinionType}
        derivedOpinionType={derivedOpinionType}
        consistent={opinionType === derivedOpinionType}
      />
    </AuditOpinionFormationWorkspaceProvider>
  );
}
