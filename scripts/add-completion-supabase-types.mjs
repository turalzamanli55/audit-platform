import fs from "fs";

const supabasePath = "src/types/supabase.ts";
let content = fs.readFileSync(supabasePath, "utf8");

const enums = `
      completion_comment_type: "completion" | "reviewer" | "internal";
      completion_item_status: "pending" | "under_review" | "returned" | "resolved";
      completion_item_type:
        | "checklist"
        | "outstanding_item"
        | "management_letter"
        | "subsequent_events"
        | "going_concern"
        | "representation_letter"
        | "final_analytics";
      completion_package_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "returned"
        | "approved"
        | "archived";`;

if (!content.includes("completion_package_status")) {
  content = content.replace(
    "      companies: {",
    `${enums}
      companies: {`,
  );
  // wrong - enums go in Enums section not Tables
}

// Fix: add to Enums section
if (!content.includes("completion_package_status:")) {
  content = content.replace(
    "      review_source_module:",
    `      completion_comment_type: "completion" | "reviewer" | "internal";
      completion_item_status: "pending" | "under_review" | "returned" | "resolved";
      completion_item_type:
        | "checklist"
        | "outstanding_item"
        | "management_letter"
        | "subsequent_events"
        | "going_concern"
        | "representation_letter"
        | "final_analytics";
      completion_package_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "returned"
        | "approved"
        | "archived";
      review_source_module:`,
  );
}

const tables = `
      completion_activity: {
        Row: {
          action: string;
          completion_package_id: string;
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
          completion_package_id: string;
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
          completion_package_id?: string;
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
      };
      completion_comments: {
        Row: {
          attachment_metadata: Json;
          body: string;
          comment_type: Database["public"]["Enums"]["completion_comment_type"];
          completion_item_id: string | null;
          completion_package_id: string;
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
          comment_type?: Database["public"]["Enums"]["completion_comment_type"];
          completion_item_id?: string | null;
          completion_package_id: string;
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
          comment_type?: Database["public"]["Enums"]["completion_comment_type"];
          completion_item_id?: string | null;
          completion_package_id?: string;
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
      completion_items: {
        Row: {
          assigned_reviewer_id: string | null;
          completion_package_id: string;
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          deleted_by: string | null;
          description: string | null;
          due_date: string | null;
          engagement_id: string;
          href: string | null;
          id: string;
          item_status: Database["public"]["Enums"]["completion_item_status"];
          item_type: Database["public"]["Enums"]["completion_item_type"];
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
          completion_package_id: string;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          description?: string | null;
          due_date?: string | null;
          engagement_id: string;
          href?: string | null;
          id?: string;
          item_status?: Database["public"]["Enums"]["completion_item_status"];
          item_type: Database["public"]["Enums"]["completion_item_type"];
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
          completion_package_id?: string;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          description?: string | null;
          due_date?: string | null;
          engagement_id?: string;
          href?: string | null;
          id?: string;
          item_status?: Database["public"]["Enums"]["completion_item_status"];
          item_type?: Database["public"]["Enums"]["completion_item_type"];
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
      completion_packages: {
        Row: {
          approved_at: string | null;
          approved_by: string | null;
          audit_plan_id: string;
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          deleted_by: string | null;
          engagement_id: string;
          id: string;
          organization_id: string;
          outstanding_count: number;
          package_status: Database["public"]["Enums"]["completion_package_status"];
          package_version: number;
          pending_count: number;
          progress_pct: number;
          resolved_count: number;
          return_notes: string | null;
          returned_at: string | null;
          returned_by: string | null;
          returned_count: number;
          review_package_id: string | null;
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
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          engagement_id: string;
          id?: string;
          organization_id: string;
          outstanding_count?: number;
          package_status?: Database["public"]["Enums"]["completion_package_status"];
          package_version?: number;
          pending_count?: number;
          progress_pct?: number;
          resolved_count?: number;
          return_notes?: string | null;
          returned_at?: string | null;
          returned_by?: string | null;
          returned_count?: number;
          review_package_id?: string | null;
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
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          engagement_id?: string;
          id?: string;
          organization_id?: string;
          outstanding_count?: number;
          package_status?: Database["public"]["Enums"]["completion_package_status"];
          package_version?: number;
          pending_count?: number;
          progress_pct?: number;
          resolved_count?: number;
          return_notes?: string | null;
          returned_at?: string | null;
          returned_by?: string | null;
          returned_count?: number;
          review_package_id?: string | null;
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
      completion_versions: {
        Row: {
          change_summary: string | null;
          completion_package_id: string;
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
          completion_package_id: string;
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
          completion_package_id?: string;
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
      };`;

if (!content.includes("completion_packages:")) {
  content = content.replace("      companies: {", `${tables}
      companies: {`);
}

fs.writeFileSync(supabasePath, content);
console.log("supabase types updated");
