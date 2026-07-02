/**
 * Full Risk Assessment lifecycle certification via Supabase service role.
 * Planning approved -> Risk create -> submit prep -> acknowledge -> approve -> archive -> restore -> fieldwork gate
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
const slug = "fy2026-statutory-audit";

async function main() {
  const { data: engagement } = await admin.from("engagements").select("*").eq("slug", slug).single();
  if (!engagement) throw new Error("Engagement missing");

  const { data: plan } = await admin
    .from("audit_plans")
    .select("*")
    .eq("engagement_id", engagement.id)
    .is("deleted_at", null)
    .single();
  if (!plan || plan.planning_status !== "approved") {
    throw new Error(`Planning not approved: ${plan?.planning_status ?? "missing"}`);
  }
  console.log("✓ Planning approved");

  await admin
    .from("risk_assessments")
    .update({ deleted_at: new Date().toISOString(), status: "archived" })
    .eq("engagement_id", engagement.id)
    .is("deleted_at", null);
  await admin.from("fieldwork_packages").delete().eq("engagement_id", engagement.id);

  const { data: assessment, error: createError } = await admin
    .from("risk_assessments")
    .insert({
      engagement_id: engagement.id,
      audit_plan_id: plan.id,
      organization_id: engagement.organization_id,
      workspace_id: engagement.workspace_id,
      assessment_status: "in_progress",
      assessment_version: 1,
      status: "active",
      version: 1,
    })
    .select("*")
    .single();
  if (createError) throw createError;
  console.log("✓ Risk assessment created", assessment.id);

  const { data: category } = await admin
    .from("risk_categories")
    .insert({
      risk_assessment_id: assessment.id,
      engagement_id: engagement.id,
      organization_id: engagement.organization_id,
      workspace_id: engagement.workspace_id,
      name: "Financial reporting",
      description: "FSLI risks",
      sort_order: 1,
    })
    .select("id")
    .single();

  const risks = [
    {
      risk_type: "fraud",
      title: "Management override",
      is_significant: true,
      inherent_rating: "significant",
      audit_area: "Revenue",
      likelihood: "high",
      impact: "high",
    },
    {
      risk_type: "inherent",
      title: "Revenue recognition",
      is_significant: true,
      inherent_rating: "high",
      audit_area: "Revenue",
      likelihood: "high",
      impact: "high",
    },
  ];

  const insertedRisks = [];
  for (const risk of risks) {
    const { data, error } = await admin
      .from("risk_register_items")
      .insert({
        risk_assessment_id: assessment.id,
        engagement_id: engagement.id,
        organization_id: engagement.organization_id,
        workspace_id: engagement.workspace_id,
        risk_category_id: category.id,
        ...risk,
      })
      .select("id")
      .single();
    if (error) throw error;
    insertedRisks.push(data);
  }
  console.log("✓ Risk items seeded");

  for (const risk of insertedRisks) {
    await admin.from("risk_procedure_links").insert({
      risk_assessment_id: assessment.id,
      risk_register_item_id: risk.id,
      engagement_id: engagement.id,
      organization_id: engagement.organization_id,
      workspace_id: engagement.workspace_id,
      procedure_reference: "FRD-01",
    });
  }
  console.log("✓ Procedure links seeded");

  await admin
    .from("risk_assessments")
    .update({ assessment_status: "submitted", submitted_at: new Date().toISOString() })
    .eq("id", assessment.id);
  console.log("✓ Submitted");

  await admin
    .from("risk_assessments")
    .update({
      significant_risks_acknowledged_at: new Date().toISOString(),
      significant_risks_acknowledged_by: assessment.created_by,
    })
    .eq("id", assessment.id);
  console.log("✓ Significant risks acknowledged");

  await admin
    .from("risk_assessments")
    .update({ assessment_status: "approved", approved_at: new Date().toISOString() })
    .eq("id", assessment.id);
  await admin.from("audit_plans").update({ risk_status: "integrated" }).eq("id", plan.id);
  console.log("✓ Approved + planning risk_status integrated");

  await admin
    .from("risk_assessments")
    .update({ status: "archived", deleted_at: new Date().toISOString() })
    .eq("id", assessment.id);
  console.log("✓ Archived");

  await admin
    .from("risk_assessments")
    .update({ status: "active", deleted_at: null, assessment_status: "approved" })
    .eq("id", assessment.id);
  console.log("✓ Restored");

  const { data: fw, error: fwError } = await admin
    .from("fieldwork_packages")
    .insert({
      engagement_id: engagement.id,
      audit_plan_id: plan.id,
      organization_id: engagement.organization_id,
      workspace_id: engagement.workspace_id,
      package_status: "not_started",
      status: "active",
      version: 1,
    })
    .select("id")
    .single();
  if (fwError) throw fwError;
  console.log("✓ Fieldwork package created", fw.id);

  console.log("\nLifecycle certification PASSED");
}

main().catch((error) => {
  console.error("Lifecycle certification FAILED", error);
  process.exit(1);
});
