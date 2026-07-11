import fs from "fs";

const supabasePath = "src/types/supabase.ts";
let content = fs.readFileSync(supabasePath, "utf8");

if (!content.includes("reporting_packages:")) {
  const tables = `
      reporting_packages: {
        Row: {
          approved_at: string | null;
          approved_by: string | null;
          audit_plan_id: string;
          completion_package_id: string | null;
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          deleted_by: string | null;
          engagement_id: string;
          id: string;
          organization_id: string;
          pending_sections_count: number;
          package_status: Database["public"]["Enums"]["reporting_package_status"];
          package_version: number;
          pending_count: number;
          progress_pct: number;
          resolved_count: number;
          return_notes: string | null;
          returned_at: string | null;
          returned_by: string | null;
          returned_count: number;
          status: Database["public"]["Enums"]["record_status"];
          submitted_at: string | null;
          submitted_by: string | null;
          summary_notes: string | null;
          updated_at: string;
          updated_by: string | null;
          version: number;
          workspace_id: string;
        };
        Insert: {
          approved_at?: string | null;
          approved_by?: string | null;
          audit_plan_id: string;
          completion_package_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          engagement_id: string;
          id?: string;
          organization_id: string;
          pending_sections_count?: number;
          package_status?: Database["public"]["Enums"]["reporting_package_status"];
          package_version?: number;
          pending_count?: number;
          progress_pct?: number;
          resolved_count?: number;
          return_notes?: string | null;
          returned_at?: string | null;
          returned_by?: string | null;
          returned_count?: number;
          status?: Database["public"]["Enums"]["record_status"];
          submitted_at?: string | null;
          submitted_by?: string | null;
          summary_notes?: string | null;
          updated_at?: string;
          updated_by?: string | null;
          version?: number;
          workspace_id: string;
        };
        Update: {
          approved_at?: string | null;
          approved_by?: string | null;
          audit_plan_id?: string;
          completion_package_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          engagement_id?: string;
          id?: string;
          organization_id?: string;
          pending_sections_count?: number;
          package_status?: Database["public"]["Enums"]["reporting_package_status"];
          package_version?: number;
          pending_count?: number;
          progress_pct?: number;
          resolved_count?: number;
          return_notes?: string | null;
          returned_at?: string | null;
          returned_by?: string | null;
          returned_count?: number;
          status?: Database["public"]["Enums"]["record_status"];
          submitted_at?: string | null;
          submitted_by?: string | null;
          summary_notes?: string | null;
          updated_at?: string;
          updated_by?: string | null;
          version?: number;
          workspace_id?: string;
        };
        Relationships: [];
      };
      report_sections: {
        Row: {
          assigned_reviewer_id: string | null;
          reporting_package_id: string;
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          deleted_by: string | null;
          description: string | null;
          due_date: string | null;
          engagement_id: string;
          href: string | null;
          id: string;
          section_status: Database["public"]["Enums"]["report_section_status"];
          section_type: Database["public"]["Enums"]["report_section_type"];
          organization_id: string;
          priority: string | null;
          resolved_at: string | null;
          resolved_by: string | null;
          return_notes: string | null;
          severity: string | null;
          sort_order: number;
          status: Database["public"]["Enums"]["record_status"];
          title: string;
          updated_at: string;
          updated_by: string | null;
          version: number;
          workspace_id: string;
        };
        Insert: {
          assigned_reviewer_id?: string | null;
          reporting_package_id: string;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          description?: string | null;
          due_date?: string | null;
          engagement_id: string;
          href?: string | null;
          id?: string;
          section_status?: Database["public"]["Enums"]["report_section_status"];
          section_type: Database["public"]["Enums"]["report_section_type"];
          organization_id: string;
          priority?: string | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          return_notes?: string | null;
          severity?: string | null;
          sort_order?: number;
          status?: Database["public"]["Enums"]["record_status"];
          title: string;
          updated_at?: string;
          updated_by?: string | null;
          version?: number;
          workspace_id: string;
        };
        Update: {
          assigned_reviewer_id?: string | null;
          reporting_package_id?: string;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          description?: string | null;
          due_date?: string | null;
          engagement_id?: string;
          href?: string | null;
          id?: string;
          section_status?: Database["public"]["Enums"]["report_section_status"];
          section_type?: Database["public"]["Enums"]["report_section_type"];
          organization_id?: string;
          priority?: string | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          return_notes?: string | null;
          severity?: string | null;
          sort_order?: number;
          status?: Database["public"]["Enums"]["record_status"];
          title?: string;
          updated_at?: string;
          updated_by?: string | null;
          version?: number;
          workspace_id?: string;
        };
        Relationships: [];
      };
      report_versions: {
        Row: {
          change_summary: string | null;
          reporting_package_id: string;
          created_at: string;
          created_by: string | null;
          engagement_id: string;
          id: string;
          organization_id: string;
          snapshot: Json;
          version_number: number;
          workspace_id: string;
        };
        Insert: {
          change_summary?: string | null;
          reporting_package_id: string;
          created_at?: string;
          created_by?: string | null;
          engagement_id: string;
          id?: string;
          organization_id: string;
          snapshot?: Json;
          version_number: number;
          workspace_id: string;
        };
        Update: {
          change_summary?: string | null;
          reporting_package_id?: string;
          created_at?: string;
          created_by?: string | null;
          engagement_id?: string;
          id?: string;
          organization_id?: string;
          snapshot?: Json;
          version_number?: number;
          workspace_id?: string;
        };
        Relationships: [];
      };
      report_comments: {
        Row: {
          attachment_metadata: Json;
          body: string;
          comment_type: Database["public"]["Enums"]["report_comment_type"];
          report_section_id: string | null;
          reporting_package_id: string;
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          deleted_by: string | null;
          engagement_id: string;
          id: string;
          mentions: Json;
          organization_id: string;
          parent_comment_id: string | null;
          resolved_at: string | null;
          resolved_by: string | null;
          status: Database["public"]["Enums"]["record_status"];
          updated_at: string;
          updated_by: string | null;
          version: number;
          workspace_id: string;
        };
        Insert: {
          attachment_metadata?: Json;
          body: string;
          comment_type?: Database["public"]["Enums"]["report_comment_type"];
          report_section_id?: string | null;
          reporting_package_id: string;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          engagement_id: string;
          id?: string;
          mentions?: Json;
          organization_id: string;
          parent_comment_id?: string | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          status?: Database["public"]["Enums"]["record_status"];
          updated_at?: string;
          updated_by?: string | null;
          version?: number;
          workspace_id: string;
        };
        Update: {
          attachment_metadata?: Json;
          body?: string;
          comment_type?: Database["public"]["Enums"]["report_comment_type"];
          report_section_id?: string | null;
          reporting_package_id?: string;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          engagement_id?: string;
          id?: string;
          mentions?: Json;
          organization_id?: string;
          parent_comment_id?: string | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          status?: Database["public"]["Enums"]["record_status"];
          updated_at?: string;
          updated_by?: string | null;
          version?: number;
          workspace_id?: string;
        };
        Relationships: [];
      };
      report_activity: {
        Row: {
          action: string;
          reporting_package_id: string;
          created_at: string;
          created_by: string | null;
          engagement_id: string;
          id: string;
          metadata: Json;
          organization_id: string;
          summary: string | null;
          workspace_id: string;
        };
        Insert: {
          action: string;
          reporting_package_id: string;
          created_at?: string;
          created_by?: string | null;
          engagement_id: string;
          id?: string;
          metadata?: Json;
          organization_id: string;
          summary?: string | null;
          workspace_id: string;
        };
        Update: {
          action?: string;
          reporting_package_id?: string;
          created_at?: string;
          created_by?: string | null;
          engagement_id?: string;
          id?: string;
          metadata?: Json;
          organization_id?: string;
          summary?: string | null;
          workspace_id?: string;
        };
        Relationships: [];
      };`;

  content = content.replace("      companies: {", `${tables}\n      companies: {`);
}

if (!content.includes("reporting_package_status:")) {
  content = content.replace(
    "      role_scope: \"platform\" | \"organization\" | \"workspace\";",
    `      report_comment_type: "reporting" | "reviewer" | "internal";
      report_section_status: "pending" | "under_review" | "returned" | "resolved";
      report_section_type:
        | "executive_summary"
        | "financial_statements"
        | "ifrs_notes"
        | "management_letter"
        | "audit_findings"
        | "recommendations"
        | "appendices";
      reporting_package_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "returned"
        | "approved"
        | "archived";
      role_scope: "platform" | "organization" | "workspace";`,
  );
}

fs.writeFileSync(supabasePath, content);
console.log("supabase reporting types updated");
