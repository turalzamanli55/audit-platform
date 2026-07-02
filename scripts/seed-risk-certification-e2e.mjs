/**
 * Seeds approved planning for fy2026-statutory-audit so Risk Assessment E2E can run.
 * Usage: node scripts/seed-risk-certification-e2e.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

function loadEnv() {
  const env = {};
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) env[match[1].trim()] = match[2].trim();
  }
  return env;
}

const env = loadEnv();
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const slug = "fy2026-statutory-audit";
  const { data: engagement, error: engagementError } = await admin
    .from("engagements")
    .select("id, workspace_id, organization_id, name")
    .eq("slug", slug)
    .single();

  if (engagementError || !engagement) {
    throw new Error(`Engagement not found: ${engagementError?.message ?? slug}`);
  }

  const { data: existingPlan } = await admin
    .from("audit_plans")
    .select("id, version, planning_status")
    .eq("engagement_id", engagement.id)
    .is("deleted_at", null)
    .maybeSingle();

  let plan = existingPlan;
  if (!plan) {
    const { data: created, error } = await admin
      .from("audit_plans")
      .insert({
        engagement_id: engagement.id,
        organization_id: engagement.organization_id,
        workspace_id: engagement.workspace_id,
        planning_status: "approved",
        plan_version: 1,
        audit_strategy: "Substantive approach with controls reliance where effective.",
        engagement_objectives: "Express an opinion on the financial statements.",
        scope_of_audit: "Statutory audit of FY2026 financial statements.",
        financial_reporting_framework: "IFRS",
        materiality_status: "placeholder",
        risk_status: "not_configured",
        checklist: [
          { id: "1", key: "objectives", completed: true },
          { id: "2", key: "scope", completed: true },
        ],
        approved_at: new Date().toISOString(),
        status: "active",
        version: 1,
      })
      .select("id, version, planning_status")
      .single();
    if (error) throw error;
    plan = created;
    console.log("Created approved audit plan", plan.id);
  } else if (plan.planning_status !== "approved") {
    const { data: updated, error } = await admin
      .from("audit_plans")
      .update({
        planning_status: "approved",
        audit_strategy: "Substantive approach with controls reliance where effective.",
        engagement_objectives: "Express an opinion on the financial statements.",
        scope_of_audit: "Statutory audit of FY2026 financial statements.",
        financial_reporting_framework: "IFRS",
        materiality_status: "placeholder",
        checklist: [
          { id: "1", key: "objectives", completed: true },
          { id: "2", key: "scope", completed: true },
        ],
        approved_at: new Date().toISOString(),
      })
      .eq("id", plan.id)
      .select("id, version, planning_status")
      .single();
    if (error) throw error;
    plan = updated;
    console.log("Updated audit plan to approved", plan.id);
  } else {
    console.log("Audit plan already approved", plan.id);
  }

  await admin
    .from("engagements")
    .update({ lifecycle_status: "planning" })
    .eq("id", engagement.id);

  console.log("Certification seed complete for", engagement.name);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
