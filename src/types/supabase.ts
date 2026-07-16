export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          ip_address: unknown
          metadata: Json
          organization_id: string | null
          resource_id: string | null
          resource_type: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          user_agent: string | null
          user_id: string | null
          version: number
          workspace_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json
          organization_id?: string | null
          resource_id?: string | null
          resource_type: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          user_agent?: string | null
          user_id?: string | null
          version?: number
          workspace_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json
          organization_id?: string | null
          resource_id?: string | null
          resource_type?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          user_agent?: string | null
          user_id?: string | null
          version?: number
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_plans: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          audit_strategy: string | null
          checklist: Json
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          documents: Json
          engagement_id: string
          engagement_objectives: string | null
          financial_reporting_framework: string | null
          id: string
          materiality_status: Database["public"]["Enums"]["integration_readiness_status"]
          organization_id: string
          plan_version: number
          planning_notes: string | null
          planning_status: Database["public"]["Enums"]["planning_status"]
          return_notes: string | null
          returned_at: string | null
          returned_by: string | null
          revision_history: Json
          risk_status: Database["public"]["Enums"]["integration_readiness_status"]
          scope_of_audit: string | null
          status: Database["public"]["Enums"]["record_status"]
          submitted_at: string | null
          submitted_by: string | null
          team_planning: Json
          timeline: Json
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          audit_strategy?: string | null
          checklist?: Json
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          documents?: Json
          engagement_id: string
          engagement_objectives?: string | null
          financial_reporting_framework?: string | null
          id?: string
          materiality_status?: Database["public"]["Enums"]["integration_readiness_status"]
          organization_id: string
          plan_version?: number
          planning_notes?: string | null
          planning_status?: Database["public"]["Enums"]["planning_status"]
          return_notes?: string | null
          returned_at?: string | null
          returned_by?: string | null
          revision_history?: Json
          risk_status?: Database["public"]["Enums"]["integration_readiness_status"]
          scope_of_audit?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          team_planning?: Json
          timeline?: Json
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          audit_strategy?: string | null
          checklist?: Json
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          documents?: Json
          engagement_id?: string
          engagement_objectives?: string | null
          financial_reporting_framework?: string | null
          id?: string
          materiality_status?: Database["public"]["Enums"]["integration_readiness_status"]
          organization_id?: string
          plan_version?: number
          planning_notes?: string | null
          planning_status?: Database["public"]["Enums"]["planning_status"]
          return_notes?: string | null
          returned_at?: string | null
          returned_by?: string | null
          revision_history?: Json
          risk_status?: Database["public"]["Enums"]["integration_readiness_status"]
          scope_of_audit?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          team_planning?: Json
          timeline?: Json
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_plans_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_plans_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_plans_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_procedures: {
        Row: {
          assertion: string | null
          assigned_auditor_id: string | null
          audit_program_id: string
          clearance_notes: string | null
          cleared_at: string | null
          cleared_by: string | null
          completion_pct: number
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          due_date: string | null
          engagement_id: string
          fieldwork_package_id: string
          id: string
          organization_id: string
          procedure_group_id: string
          procedure_status: Database["public"]["Enums"]["procedure_status"]
          procedure_type: Database["public"]["Enums"]["procedure_type"]
          return_notes: string | null
          returned_at: string | null
          returned_by: string | null
          sort_order: number
          status: Database["public"]["Enums"]["record_status"]
          submitted_at: string | null
          submitted_by: string | null
          title: string
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          assertion?: string | null
          assigned_auditor_id?: string | null
          audit_program_id: string
          clearance_notes?: string | null
          cleared_at?: string | null
          cleared_by?: string | null
          completion_pct?: number
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          due_date?: string | null
          engagement_id: string
          fieldwork_package_id: string
          id?: string
          organization_id: string
          procedure_group_id: string
          procedure_status?: Database["public"]["Enums"]["procedure_status"]
          procedure_type?: Database["public"]["Enums"]["procedure_type"]
          return_notes?: string | null
          returned_at?: string | null
          returned_by?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          title: string
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          assertion?: string | null
          assigned_auditor_id?: string | null
          audit_program_id?: string
          clearance_notes?: string | null
          cleared_at?: string | null
          cleared_by?: string | null
          completion_pct?: number
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          due_date?: string | null
          engagement_id?: string
          fieldwork_package_id?: string
          id?: string
          organization_id?: string
          procedure_group_id?: string
          procedure_status?: Database["public"]["Enums"]["procedure_status"]
          procedure_type?: Database["public"]["Enums"]["procedure_type"]
          return_notes?: string | null
          returned_at?: string | null
          returned_by?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          title?: string
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_procedures_audit_program_id_fkey"
            columns: ["audit_program_id"]
            isOneToOne: false
            referencedRelation: "audit_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_procedures_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_procedures_fieldwork_package_id_fkey"
            columns: ["fieldwork_package_id"]
            isOneToOne: false
            referencedRelation: "fieldwork_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_procedures_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_procedures_procedure_group_id_fkey"
            columns: ["procedure_group_id"]
            isOneToOne: false
            referencedRelation: "procedure_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_procedures_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_programs: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          engagement_id: string
          fieldwork_package_id: string
          id: string
          organization_id: string
          program_status: Database["public"]["Enums"]["audit_program_status"]
          program_version: number
          status: Database["public"]["Enums"]["record_status"]
          title: string
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          engagement_id: string
          fieldwork_package_id: string
          id?: string
          organization_id: string
          program_status?: Database["public"]["Enums"]["audit_program_status"]
          program_version?: number
          status?: Database["public"]["Enums"]["record_status"]
          title: string
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          engagement_id?: string
          fieldwork_package_id?: string
          id?: string
          organization_id?: string
          program_status?: Database["public"]["Enums"]["audit_program_status"]
          program_version?: number
          status?: Database["public"]["Enums"]["record_status"]
          title?: string
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_programs_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_programs_fieldwork_package_id_fkey"
            columns: ["fieldwork_package_id"]
            isOneToOne: false
            referencedRelation: "fieldwork_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_programs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_programs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          id: string
          legal_name: string | null
          name: string
          organization_id: string
          registration_number: string | null
          slug: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          id?: string
          legal_name?: string | null
          name: string
          organization_id: string
          registration_number?: string | null
          slug: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          id?: string
          legal_name?: string | null
          name?: string
          organization_id?: string
          registration_number?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "companies_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      company_settings: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          settings: Json
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          settings?: Json
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          settings?: Json
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "company_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      completion_activity: {
        Row: {
          action: string
          completion_package_id: string
          created_at: string
          created_by: string | null
          engagement_id: string
          id: string
          metadata: Json
          organization_id: string
          summary: string | null
          workspace_id: string
        }
        Insert: {
          action: string
          completion_package_id: string
          created_at?: string
          created_by?: string | null
          engagement_id: string
          id?: string
          metadata?: Json
          organization_id: string
          summary?: string | null
          workspace_id: string
        }
        Update: {
          action?: string
          completion_package_id?: string
          created_at?: string
          created_by?: string | null
          engagement_id?: string
          id?: string
          metadata?: Json
          organization_id?: string
          summary?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "completion_activity_completion_package_id_fkey"
            columns: ["completion_package_id"]
            isOneToOne: false
            referencedRelation: "completion_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "completion_activity_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "completion_activity_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "completion_activity_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      completion_comments: {
        Row: {
          attachment_metadata: Json
          body: string
          comment_type: Database["public"]["Enums"]["completion_comment_type"]
          completion_item_id: string | null
          completion_package_id: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          id: string
          mentions: Json
          organization_id: string
          parent_comment_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          attachment_metadata?: Json
          body: string
          comment_type?: Database["public"]["Enums"]["completion_comment_type"]
          completion_item_id?: string | null
          completion_package_id: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          id?: string
          mentions?: Json
          organization_id: string
          parent_comment_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          attachment_metadata?: Json
          body?: string
          comment_type?: Database["public"]["Enums"]["completion_comment_type"]
          completion_item_id?: string | null
          completion_package_id?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          id?: string
          mentions?: Json
          organization_id?: string
          parent_comment_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "completion_comments_completion_item_id_fkey"
            columns: ["completion_item_id"]
            isOneToOne: false
            referencedRelation: "completion_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "completion_comments_completion_package_id_fkey"
            columns: ["completion_package_id"]
            isOneToOne: false
            referencedRelation: "completion_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "completion_comments_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "completion_comments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "completion_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "completion_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "completion_comments_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      completion_items: {
        Row: {
          assigned_reviewer_id: string | null
          completion_package_id: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          due_date: string | null
          engagement_id: string
          href: string | null
          id: string
          item_status: Database["public"]["Enums"]["completion_item_status"]
          item_type: Database["public"]["Enums"]["completion_item_type"]
          organization_id: string
          priority: string | null
          resolved_at: string | null
          resolved_by: string | null
          return_notes: string | null
          severity: string | null
          sort_order: number
          status: Database["public"]["Enums"]["record_status"]
          title: string
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          assigned_reviewer_id?: string | null
          completion_package_id: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          due_date?: string | null
          engagement_id: string
          href?: string | null
          id?: string
          item_status?: Database["public"]["Enums"]["completion_item_status"]
          item_type: Database["public"]["Enums"]["completion_item_type"]
          organization_id: string
          priority?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          return_notes?: string | null
          severity?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          title: string
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          assigned_reviewer_id?: string | null
          completion_package_id?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          due_date?: string | null
          engagement_id?: string
          href?: string | null
          id?: string
          item_status?: Database["public"]["Enums"]["completion_item_status"]
          item_type?: Database["public"]["Enums"]["completion_item_type"]
          organization_id?: string
          priority?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          return_notes?: string | null
          severity?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          title?: string
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "completion_items_completion_package_id_fkey"
            columns: ["completion_package_id"]
            isOneToOne: false
            referencedRelation: "completion_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "completion_items_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "completion_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "completion_items_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      completion_packages: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          audit_plan_id: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          id: string
          organization_id: string
          outstanding_count: number
          package_status: Database["public"]["Enums"]["completion_package_status"]
          package_version: number
          pending_count: number
          progress_pct: number
          resolved_count: number
          return_notes: string | null
          returned_at: string | null
          returned_by: string | null
          returned_count: number
          review_package_id: string | null
          status: Database["public"]["Enums"]["record_status"]
          submitted_at: string | null
          submitted_by: string | null
          summary_notes: string | null
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          audit_plan_id: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          id?: string
          organization_id: string
          outstanding_count?: number
          package_status?: Database["public"]["Enums"]["completion_package_status"]
          package_version?: number
          pending_count?: number
          progress_pct?: number
          resolved_count?: number
          return_notes?: string | null
          returned_at?: string | null
          returned_by?: string | null
          returned_count?: number
          review_package_id?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          summary_notes?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          audit_plan_id?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          id?: string
          organization_id?: string
          outstanding_count?: number
          package_status?: Database["public"]["Enums"]["completion_package_status"]
          package_version?: number
          pending_count?: number
          progress_pct?: number
          resolved_count?: number
          return_notes?: string | null
          returned_at?: string | null
          returned_by?: string | null
          returned_count?: number
          review_package_id?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          summary_notes?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "completion_packages_audit_plan_id_fkey"
            columns: ["audit_plan_id"]
            isOneToOne: false
            referencedRelation: "audit_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "completion_packages_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "completion_packages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "completion_packages_review_package_id_fkey"
            columns: ["review_package_id"]
            isOneToOne: false
            referencedRelation: "review_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "completion_packages_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      completion_versions: {
        Row: {
          change_summary: string | null
          completion_package_id: string
          created_at: string
          created_by: string | null
          engagement_id: string
          id: string
          organization_id: string
          snapshot: Json
          version_number: number
          workspace_id: string
        }
        Insert: {
          change_summary?: string | null
          completion_package_id: string
          created_at?: string
          created_by?: string | null
          engagement_id: string
          id?: string
          organization_id: string
          snapshot?: Json
          version_number: number
          workspace_id: string
        }
        Update: {
          change_summary?: string | null
          completion_package_id?: string
          created_at?: string
          created_by?: string | null
          engagement_id?: string
          id?: string
          organization_id?: string
          snapshot?: Json
          version_number?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "completion_versions_completion_package_id_fkey"
            columns: ["completion_package_id"]
            isOneToOne: false
            referencedRelation: "completion_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "completion_versions_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "completion_versions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "completion_versions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_activity: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          id: string
          metadata: Json
          organization_id: string
          status: Database["public"]["Enums"]["record_status"]
          summary: string | null
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          id?: string
          metadata?: Json
          organization_id: string
          status?: Database["public"]["Enums"]["record_status"]
          summary?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          id?: string
          metadata?: Json
          organization_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          summary?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "engagement_activity_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engagement_activity_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engagement_activity_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_lifecycle_events: {
        Row: {
          actor_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          from_status:
            | Database["public"]["Enums"]["engagement_lifecycle_status"]
            | null
          id: string
          metadata: Json
          organization_id: string
          reason: string | null
          status: Database["public"]["Enums"]["record_status"]
          to_status: Database["public"]["Enums"]["engagement_lifecycle_status"]
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          from_status?:
            | Database["public"]["Enums"]["engagement_lifecycle_status"]
            | null
          id?: string
          metadata?: Json
          organization_id: string
          reason?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          to_status: Database["public"]["Enums"]["engagement_lifecycle_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          from_status?:
            | Database["public"]["Enums"]["engagement_lifecycle_status"]
            | null
          id?: string
          metadata?: Json
          organization_id?: string
          reason?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          to_status?: Database["public"]["Enums"]["engagement_lifecycle_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "engagement_lifecycle_events_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engagement_lifecycle_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engagement_lifecycle_events_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_members: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          id: string
          member_role: Database["public"]["Enums"]["engagement_member_role"]
          organization_id: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          user_id: string
          version: number
          workspace_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          id?: string
          member_role?: Database["public"]["Enums"]["engagement_member_role"]
          organization_id: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          user_id: string
          version?: number
          workspace_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          id?: string
          member_role?: Database["public"]["Enums"]["engagement_member_role"]
          organization_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          user_id?: string
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "engagement_members_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engagement_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engagement_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      engagements: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          engagement_code: string | null
          engagement_type: Database["public"]["Enums"]["engagement_type"]
          id: string
          lifecycle_status: Database["public"]["Enums"]["engagement_lifecycle_status"]
          name: string
          notes: string | null
          organization_id: string
          period_end: string | null
          period_start: string | null
          planned_end: string | null
          planned_start: string | null
          reporting_framework: string
          slug: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          engagement_code?: string | null
          engagement_type?: Database["public"]["Enums"]["engagement_type"]
          id?: string
          lifecycle_status?: Database["public"]["Enums"]["engagement_lifecycle_status"]
          name: string
          notes?: string | null
          organization_id: string
          period_end?: string | null
          period_start?: string | null
          planned_end?: string | null
          planned_start?: string | null
          reporting_framework?: string
          slug: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          engagement_code?: string | null
          engagement_type?: Database["public"]["Enums"]["engagement_type"]
          id?: string
          lifecycle_status?: Database["public"]["Enums"]["engagement_lifecycle_status"]
          name?: string
          notes?: string | null
          organization_id?: string
          period_end?: string | null
          period_start?: string | null
          planned_end?: string | null
          planned_start?: string | null
          reporting_framework?: string
          slug?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "engagements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engagements_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engagements_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      fieldwork_activity: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          fieldwork_package_id: string
          id: string
          metadata: Json
          organization_id: string
          status: Database["public"]["Enums"]["record_status"]
          summary: string | null
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          fieldwork_package_id: string
          id?: string
          metadata?: Json
          organization_id: string
          status?: Database["public"]["Enums"]["record_status"]
          summary?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          fieldwork_package_id?: string
          id?: string
          metadata?: Json
          organization_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          summary?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fieldwork_activity_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fieldwork_activity_fieldwork_package_id_fkey"
            columns: ["fieldwork_package_id"]
            isOneToOne: false
            referencedRelation: "fieldwork_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fieldwork_activity_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fieldwork_activity_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      fieldwork_evidence: {
        Row: {
          audit_procedure_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          document_type: string
          engagement_id: string
          evidence_status: Database["public"]["Enums"]["fieldwork_evidence_status"]
          fieldwork_package_id: string
          file_size: number | null
          id: string
          metadata: Json
          mime_type: string | null
          name: string
          organization_id: string
          status: Database["public"]["Enums"]["record_status"]
          storage_bucket: string
          storage_path: string | null
          updated_at: string
          updated_by: string | null
          version: number
          working_paper_id: string | null
          workspace_id: string
        }
        Insert: {
          audit_procedure_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          document_type?: string
          engagement_id: string
          evidence_status?: Database["public"]["Enums"]["fieldwork_evidence_status"]
          fieldwork_package_id: string
          file_size?: number | null
          id?: string
          metadata?: Json
          mime_type?: string | null
          name: string
          organization_id: string
          status?: Database["public"]["Enums"]["record_status"]
          storage_bucket?: string
          storage_path?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          working_paper_id?: string | null
          workspace_id: string
        }
        Update: {
          audit_procedure_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          document_type?: string
          engagement_id?: string
          evidence_status?: Database["public"]["Enums"]["fieldwork_evidence_status"]
          fieldwork_package_id?: string
          file_size?: number | null
          id?: string
          metadata?: Json
          mime_type?: string | null
          name?: string
          organization_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          storage_bucket?: string
          storage_path?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          working_paper_id?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fieldwork_evidence_audit_procedure_id_fkey"
            columns: ["audit_procedure_id"]
            isOneToOne: false
            referencedRelation: "audit_procedures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fieldwork_evidence_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fieldwork_evidence_fieldwork_package_id_fkey"
            columns: ["fieldwork_package_id"]
            isOneToOne: false
            referencedRelation: "fieldwork_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fieldwork_evidence_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fieldwork_evidence_working_paper_id_fkey"
            columns: ["working_paper_id"]
            isOneToOne: false
            referencedRelation: "working_papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fieldwork_evidence_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      fieldwork_findings: {
        Row: {
          audit_procedure_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          engagement_id: string
          fieldwork_package_id: string
          finding_status: Database["public"]["Enums"]["fieldwork_finding_status"]
          id: string
          organization_id: string
          severity: string
          status: Database["public"]["Enums"]["record_status"]
          title: string
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          audit_procedure_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          engagement_id: string
          fieldwork_package_id: string
          finding_status?: Database["public"]["Enums"]["fieldwork_finding_status"]
          id?: string
          organization_id: string
          severity?: string
          status?: Database["public"]["Enums"]["record_status"]
          title: string
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          audit_procedure_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          engagement_id?: string
          fieldwork_package_id?: string
          finding_status?: Database["public"]["Enums"]["fieldwork_finding_status"]
          id?: string
          organization_id?: string
          severity?: string
          status?: Database["public"]["Enums"]["record_status"]
          title?: string
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fieldwork_findings_audit_procedure_id_fkey"
            columns: ["audit_procedure_id"]
            isOneToOne: false
            referencedRelation: "audit_procedures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fieldwork_findings_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fieldwork_findings_fieldwork_package_id_fkey"
            columns: ["fieldwork_package_id"]
            isOneToOne: false
            referencedRelation: "fieldwork_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fieldwork_findings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fieldwork_findings_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      fieldwork_notes: {
        Row: {
          audit_procedure_id: string | null
          author_id: string | null
          body: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          fieldwork_package_id: string
          id: string
          note_type: Database["public"]["Enums"]["fieldwork_note_type"]
          organization_id: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
          working_paper_id: string | null
          workspace_id: string
        }
        Insert: {
          audit_procedure_id?: string | null
          author_id?: string | null
          body: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          fieldwork_package_id: string
          id?: string
          note_type?: Database["public"]["Enums"]["fieldwork_note_type"]
          organization_id: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          working_paper_id?: string | null
          workspace_id: string
        }
        Update: {
          audit_procedure_id?: string | null
          author_id?: string | null
          body?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          fieldwork_package_id?: string
          id?: string
          note_type?: Database["public"]["Enums"]["fieldwork_note_type"]
          organization_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          working_paper_id?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fieldwork_notes_audit_procedure_id_fkey"
            columns: ["audit_procedure_id"]
            isOneToOne: false
            referencedRelation: "audit_procedures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fieldwork_notes_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fieldwork_notes_fieldwork_package_id_fkey"
            columns: ["fieldwork_package_id"]
            isOneToOne: false
            referencedRelation: "fieldwork_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fieldwork_notes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fieldwork_notes_working_paper_id_fkey"
            columns: ["working_paper_id"]
            isOneToOne: false
            referencedRelation: "working_papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fieldwork_notes_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      fieldwork_packages: {
        Row: {
          audit_plan_id: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          id: string
          organization_id: string
          package_status: Database["public"]["Enums"]["fieldwork_package_status"]
          program_version: number
          progress_pct: number
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          audit_plan_id: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          id?: string
          organization_id: string
          package_status?: Database["public"]["Enums"]["fieldwork_package_status"]
          program_version?: number
          progress_pct?: number
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          audit_plan_id?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          id?: string
          organization_id?: string
          package_status?: Database["public"]["Enums"]["fieldwork_package_status"]
          program_version?: number
          progress_pct?: number
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fieldwork_packages_audit_plan_id_fkey"
            columns: ["audit_plan_id"]
            isOneToOne: false
            referencedRelation: "audit_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fieldwork_packages_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fieldwork_packages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fieldwork_packages_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      fieldwork_tickmark_library: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          meaning: string
          organization_id: string
          sort_order: number
          status: Database["public"]["Enums"]["record_status"]
          symbol: string
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          meaning: string
          organization_id: string
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          symbol: string
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          meaning?: string
          organization_id?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          symbol?: string
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fieldwork_tickmark_library_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fieldwork_tickmark_library_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_statement_activity: {
        Row: {
          action: string
          created_at: string
          created_by: string | null
          engagement_id: string
          financial_statement_package_id: string
          id: string
          metadata: Json
          organization_id: string
          summary: string | null
          workspace_id: string
        }
        Insert: {
          action: string
          created_at?: string
          created_by?: string | null
          engagement_id: string
          financial_statement_package_id: string
          id?: string
          metadata?: Json
          organization_id: string
          summary?: string | null
          workspace_id: string
        }
        Update: {
          action?: string
          created_at?: string
          created_by?: string | null
          engagement_id?: string
          financial_statement_package_id?: string
          id?: string
          metadata?: Json
          organization_id?: string
          summary?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_statement_activity_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_activity_financial_statement_package_i_fkey"
            columns: ["financial_statement_package_id"]
            isOneToOne: false
            referencedRelation: "financial_statement_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_activity_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_activity_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_statement_comments: {
        Row: {
          attachment_metadata: Json
          body: string
          comment_type: Database["public"]["Enums"]["financial_statement_comment_type"]
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          financial_statement_package_id: string
          financial_statement_section_id: string | null
          id: string
          mentions: Json
          organization_id: string
          parent_comment_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          attachment_metadata?: Json
          body: string
          comment_type?: Database["public"]["Enums"]["financial_statement_comment_type"]
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          financial_statement_package_id: string
          financial_statement_section_id?: string | null
          id?: string
          mentions?: Json
          organization_id: string
          parent_comment_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          attachment_metadata?: Json
          body?: string
          comment_type?: Database["public"]["Enums"]["financial_statement_comment_type"]
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          financial_statement_package_id?: string
          financial_statement_section_id?: string | null
          id?: string
          mentions?: Json
          organization_id?: string
          parent_comment_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_statement_comments_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_comments_financial_statement_package_i_fkey"
            columns: ["financial_statement_package_id"]
            isOneToOne: false
            referencedRelation: "financial_statement_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_comments_financial_statement_section_i_fkey"
            columns: ["financial_statement_section_id"]
            isOneToOne: false
            referencedRelation: "financial_statement_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_comments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "financial_statement_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_comments_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_statement_exports: {
        Row: {
          change_summary: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          export_format: string | null
          export_status: Database["public"]["Enums"]["financial_statement_export_status"]
          financial_statement_package_id: string
          id: string
          organization_id: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          change_summary?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          export_format?: string | null
          export_status?: Database["public"]["Enums"]["financial_statement_export_status"]
          financial_statement_package_id: string
          id?: string
          organization_id: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          change_summary?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          export_format?: string | null
          export_status?: Database["public"]["Enums"]["financial_statement_export_status"]
          financial_statement_package_id?: string
          id?: string
          organization_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_statement_exports_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_exports_financial_statement_package_id_fkey"
            columns: ["financial_statement_package_id"]
            isOneToOne: false
            referencedRelation: "financial_statement_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_exports_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_exports_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_statement_layouts: {
        Row: {
          company_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string | null
          formatting_json: Json
          id: string
          is_system: boolean
          layout_code: string
          layout_mode: Database["public"]["Enums"]["fs_render_layout_mode"]
          layout_name: string
          metadata_json: Json
          organization_id: string
          standard: Database["public"]["Enums"]["fs_render_standard"]
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string | null
          formatting_json?: Json
          id?: string
          is_system?: boolean
          layout_code: string
          layout_mode?: Database["public"]["Enums"]["fs_render_layout_mode"]
          layout_name: string
          metadata_json?: Json
          organization_id: string
          standard?: Database["public"]["Enums"]["fs_render_standard"]
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string | null
          formatting_json?: Json
          id?: string
          is_system?: boolean
          layout_code?: string
          layout_mode?: Database["public"]["Enums"]["fs_render_layout_mode"]
          layout_name?: string
          metadata_json?: Json
          organization_id?: string
          standard?: Database["public"]["Enums"]["fs_render_standard"]
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_statement_layouts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_layouts_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_layouts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_layouts_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_statement_lines: {
        Row: {
          created_at: string
          created_by: string | null
          cross_ref: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          financial_statement_package_id: string
          financial_statement_section_id: string
          id: string
          is_mapped: boolean
          line_code: string
          line_kind: Database["public"]["Enums"]["financial_statement_line_kind"]
          line_label: string
          mapping_ref: string | null
          notes_link_ref: string | null
          organization_id: string
          parent_line_id: string | null
          sort_order: number
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          cross_ref?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          financial_statement_package_id: string
          financial_statement_section_id: string
          id?: string
          is_mapped?: boolean
          line_code: string
          line_kind?: Database["public"]["Enums"]["financial_statement_line_kind"]
          line_label: string
          mapping_ref?: string | null
          notes_link_ref?: string | null
          organization_id: string
          parent_line_id?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          cross_ref?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          financial_statement_package_id?: string
          financial_statement_section_id?: string
          id?: string
          is_mapped?: boolean
          line_code?: string
          line_kind?: Database["public"]["Enums"]["financial_statement_line_kind"]
          line_label?: string
          mapping_ref?: string | null
          notes_link_ref?: string | null
          organization_id?: string
          parent_line_id?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_statement_lines_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_lines_financial_statement_package_id_fkey"
            columns: ["financial_statement_package_id"]
            isOneToOne: false
            referencedRelation: "financial_statement_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_lines_financial_statement_section_id_fkey"
            columns: ["financial_statement_section_id"]
            isOneToOne: false
            referencedRelation: "financial_statement_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_lines_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_lines_parent_line_id_fkey"
            columns: ["parent_line_id"]
            isOneToOne: false
            referencedRelation: "financial_statement_lines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_lines_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_statement_mapping_history: {
        Row: {
          action: Database["public"]["Enums"]["fs_mapping_history_action"]
          actor_user_id: string | null
          created_at: string
          details_json: Json
          engagement_id: string
          entity_id: string | null
          entity_type: string | null
          id: string
          mapping_set_id: string
          organization_id: string
          summary: string
          workspace_id: string
        }
        Insert: {
          action: Database["public"]["Enums"]["fs_mapping_history_action"]
          actor_user_id?: string | null
          created_at?: string
          details_json?: Json
          engagement_id: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          mapping_set_id: string
          organization_id: string
          summary: string
          workspace_id: string
        }
        Update: {
          action?: Database["public"]["Enums"]["fs_mapping_history_action"]
          actor_user_id?: string | null
          created_at?: string
          details_json?: Json
          engagement_id?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          mapping_set_id?: string
          organization_id?: string
          summary?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_statement_mapping_history_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_mapping_history_mapping_set_id_fkey"
            columns: ["mapping_set_id"]
            isOneToOne: false
            referencedRelation: "financial_statement_mapping_sets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_mapping_history_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_mapping_history_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_statement_mapping_lines: {
        Row: {
          account_code: string
          account_name: string
          aggregation_method: Database["public"]["Enums"]["fs_aggregation_method"]
          classification: Database["public"]["Enums"]["fs_account_classification"]
          classification_confidence: number
          created_at: string
          created_by: string | null
          current_year_amount: number
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          hierarchy_level: number
          id: string
          is_calculated: boolean
          is_mapped: boolean
          is_orphan: boolean
          mapping_rule_id: string | null
          mapping_set_id: string
          metadata_json: Json
          multi_year_amounts: Json
          organization_id: string
          parent_line_code: string | null
          previous_year_amount: number | null
          sort_order: number
          statement_section: Database["public"]["Enums"]["fs_statement_section"]
          status: Database["public"]["Enums"]["record_status"]
          target_line_code: string | null
          target_line_label: string | null
          trial_balance_line_id: string | null
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          account_code: string
          account_name: string
          aggregation_method?: Database["public"]["Enums"]["fs_aggregation_method"]
          classification?: Database["public"]["Enums"]["fs_account_classification"]
          classification_confidence?: number
          created_at?: string
          created_by?: string | null
          current_year_amount?: number
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          hierarchy_level?: number
          id?: string
          is_calculated?: boolean
          is_mapped?: boolean
          is_orphan?: boolean
          mapping_rule_id?: string | null
          mapping_set_id: string
          metadata_json?: Json
          multi_year_amounts?: Json
          organization_id: string
          parent_line_code?: string | null
          previous_year_amount?: number | null
          sort_order?: number
          statement_section?: Database["public"]["Enums"]["fs_statement_section"]
          status?: Database["public"]["Enums"]["record_status"]
          target_line_code?: string | null
          target_line_label?: string | null
          trial_balance_line_id?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          account_code?: string
          account_name?: string
          aggregation_method?: Database["public"]["Enums"]["fs_aggregation_method"]
          classification?: Database["public"]["Enums"]["fs_account_classification"]
          classification_confidence?: number
          created_at?: string
          created_by?: string | null
          current_year_amount?: number
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          hierarchy_level?: number
          id?: string
          is_calculated?: boolean
          is_mapped?: boolean
          is_orphan?: boolean
          mapping_rule_id?: string | null
          mapping_set_id?: string
          metadata_json?: Json
          multi_year_amounts?: Json
          organization_id?: string
          parent_line_code?: string | null
          previous_year_amount?: number | null
          sort_order?: number
          statement_section?: Database["public"]["Enums"]["fs_statement_section"]
          status?: Database["public"]["Enums"]["record_status"]
          target_line_code?: string | null
          target_line_label?: string | null
          trial_balance_line_id?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_statement_mapping_lines_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_mapping_lines_mapping_rule_id_fkey"
            columns: ["mapping_rule_id"]
            isOneToOne: false
            referencedRelation: "financial_statement_mapping_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_mapping_lines_mapping_set_id_fkey"
            columns: ["mapping_set_id"]
            isOneToOne: false
            referencedRelation: "financial_statement_mapping_sets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_mapping_lines_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_mapping_lines_trial_balance_line_id_fkey"
            columns: ["trial_balance_line_id"]
            isOneToOne: false
            referencedRelation: "trial_balance_lines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_mapping_lines_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_statement_mapping_rules: {
        Row: {
          aggregation_method: Database["public"]["Enums"]["fs_aggregation_method"]
          allows_negative: boolean
          classification: Database["public"]["Enums"]["fs_account_classification"]
          condition_expression: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          formula_expression: string | null
          id: string
          is_active: boolean
          mapping_set_id: string
          metadata_json: Json
          organization_id: string
          rule_code: string
          rule_name: string
          rule_type: Database["public"]["Enums"]["fs_mapping_rule_type"]
          sort_order: number
          source_account_codes: string[]
          status: Database["public"]["Enums"]["record_status"]
          target_line_code: string
          target_section: Database["public"]["Enums"]["fs_statement_section"]
          updated_at: string
          updated_by: string | null
          version: number
          weight: number | null
          workspace_id: string
        }
        Insert: {
          aggregation_method?: Database["public"]["Enums"]["fs_aggregation_method"]
          allows_negative?: boolean
          classification?: Database["public"]["Enums"]["fs_account_classification"]
          condition_expression?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          formula_expression?: string | null
          id?: string
          is_active?: boolean
          mapping_set_id: string
          metadata_json?: Json
          organization_id: string
          rule_code: string
          rule_name: string
          rule_type?: Database["public"]["Enums"]["fs_mapping_rule_type"]
          sort_order?: number
          source_account_codes?: string[]
          status?: Database["public"]["Enums"]["record_status"]
          target_line_code: string
          target_section?: Database["public"]["Enums"]["fs_statement_section"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          weight?: number | null
          workspace_id: string
        }
        Update: {
          aggregation_method?: Database["public"]["Enums"]["fs_aggregation_method"]
          allows_negative?: boolean
          classification?: Database["public"]["Enums"]["fs_account_classification"]
          condition_expression?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          formula_expression?: string | null
          id?: string
          is_active?: boolean
          mapping_set_id?: string
          metadata_json?: Json
          organization_id?: string
          rule_code?: string
          rule_name?: string
          rule_type?: Database["public"]["Enums"]["fs_mapping_rule_type"]
          sort_order?: number
          source_account_codes?: string[]
          status?: Database["public"]["Enums"]["record_status"]
          target_line_code?: string
          target_section?: Database["public"]["Enums"]["fs_statement_section"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          weight?: number | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_statement_mapping_rules_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_mapping_rules_mapping_set_id_fkey"
            columns: ["mapping_set_id"]
            isOneToOne: false
            referencedRelation: "financial_statement_mapping_sets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_mapping_rules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_mapping_rules_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_statement_mapping_sets: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          archived_at: string | null
          archived_by: string | null
          company_id: string
          comparative_mode: Database["public"]["Enums"]["fs_comparative_period"]
          coverage_pct: number
          created_at: string
          created_by: string | null
          dataset_json: Json
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          engagement_id: string
          id: string
          mapped_account_count: number
          name: string
          organization_id: string
          published_at: string | null
          published_by: string | null
          set_status: Database["public"]["Enums"]["fs_mapping_set_status"]
          set_version: number
          standard: Database["public"]["Enums"]["fs_mapping_standard"]
          status: Database["public"]["Enums"]["record_status"]
          summary_json: Json
          trial_balance_package_id: string | null
          unmapped_account_count: number
          updated_at: string
          updated_by: string | null
          validated_at: string | null
          validated_by: string | null
          validation_error_count: number
          validation_json: Json
          validation_warning_count: number
          version: number
          version_count: number
          workspace_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          archived_at?: string | null
          archived_by?: string | null
          company_id: string
          comparative_mode?: Database["public"]["Enums"]["fs_comparative_period"]
          coverage_pct?: number
          created_at?: string
          created_by?: string | null
          dataset_json?: Json
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          engagement_id: string
          id?: string
          mapped_account_count?: number
          name: string
          organization_id: string
          published_at?: string | null
          published_by?: string | null
          set_status?: Database["public"]["Enums"]["fs_mapping_set_status"]
          set_version?: number
          standard?: Database["public"]["Enums"]["fs_mapping_standard"]
          status?: Database["public"]["Enums"]["record_status"]
          summary_json?: Json
          trial_balance_package_id?: string | null
          unmapped_account_count?: number
          updated_at?: string
          updated_by?: string | null
          validated_at?: string | null
          validated_by?: string | null
          validation_error_count?: number
          validation_json?: Json
          validation_warning_count?: number
          version?: number
          version_count?: number
          workspace_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          archived_at?: string | null
          archived_by?: string | null
          company_id?: string
          comparative_mode?: Database["public"]["Enums"]["fs_comparative_period"]
          coverage_pct?: number
          created_at?: string
          created_by?: string | null
          dataset_json?: Json
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          engagement_id?: string
          id?: string
          mapped_account_count?: number
          name?: string
          organization_id?: string
          published_at?: string | null
          published_by?: string | null
          set_status?: Database["public"]["Enums"]["fs_mapping_set_status"]
          set_version?: number
          standard?: Database["public"]["Enums"]["fs_mapping_standard"]
          status?: Database["public"]["Enums"]["record_status"]
          summary_json?: Json
          trial_balance_package_id?: string | null
          unmapped_account_count?: number
          updated_at?: string
          updated_by?: string | null
          validated_at?: string | null
          validated_by?: string | null
          validation_error_count?: number
          validation_json?: Json
          validation_warning_count?: number
          version?: number
          version_count?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_statement_mapping_sets_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_mapping_sets_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_mapping_sets_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_mapping_sets_trial_balance_package_id_fkey"
            columns: ["trial_balance_package_id"]
            isOneToOne: false
            referencedRelation: "trial_balance_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_mapping_sets_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_statement_mapping_versions: {
        Row: {
          archived_at: string | null
          archived_by: string | null
          change_summary: string | null
          created_at: string
          created_by: string | null
          engagement_id: string
          id: string
          mapping_set_id: string
          organization_id: string
          published_at: string | null
          published_by: string | null
          rolled_back_from_version: number | null
          snapshot_json: Json
          version_number: number
          version_status: Database["public"]["Enums"]["fs_mapping_version_status"]
          workspace_id: string
        }
        Insert: {
          archived_at?: string | null
          archived_by?: string | null
          change_summary?: string | null
          created_at?: string
          created_by?: string | null
          engagement_id: string
          id?: string
          mapping_set_id: string
          organization_id: string
          published_at?: string | null
          published_by?: string | null
          rolled_back_from_version?: number | null
          snapshot_json?: Json
          version_number: number
          version_status?: Database["public"]["Enums"]["fs_mapping_version_status"]
          workspace_id: string
        }
        Update: {
          archived_at?: string | null
          archived_by?: string | null
          change_summary?: string | null
          created_at?: string
          created_by?: string | null
          engagement_id?: string
          id?: string
          mapping_set_id?: string
          organization_id?: string
          published_at?: string | null
          published_by?: string | null
          rolled_back_from_version?: number | null
          snapshot_json?: Json
          version_number?: number
          version_status?: Database["public"]["Enums"]["fs_mapping_version_status"]
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_statement_mapping_versions_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_mapping_versions_mapping_set_id_fkey"
            columns: ["mapping_set_id"]
            isOneToOne: false
            referencedRelation: "financial_statement_mapping_sets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_mapping_versions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_mapping_versions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_statement_packages: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          audit_plan_id: string
          balance_check_status: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          id: string
          mapping_coverage_pct: number
          opinion_package_id: string | null
          organization_id: string
          package_status: Database["public"]["Enums"]["financial_statement_package_status"]
          package_version: number
          pending_count: number
          pending_sections_count: number
          prepared_at: string | null
          prepared_by: string | null
          progress_pct: number
          published_at: string | null
          published_by: string | null
          resolved_count: number
          return_notes: string | null
          returned_at: string | null
          returned_by: string | null
          returned_count: number
          status: Database["public"]["Enums"]["record_status"]
          submitted_at: string | null
          submitted_by: string | null
          summary_notes: string | null
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          audit_plan_id: string
          balance_check_status?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          id?: string
          mapping_coverage_pct?: number
          opinion_package_id?: string | null
          organization_id: string
          package_status?: Database["public"]["Enums"]["financial_statement_package_status"]
          package_version?: number
          pending_count?: number
          pending_sections_count?: number
          prepared_at?: string | null
          prepared_by?: string | null
          progress_pct?: number
          published_at?: string | null
          published_by?: string | null
          resolved_count?: number
          return_notes?: string | null
          returned_at?: string | null
          returned_by?: string | null
          returned_count?: number
          status?: Database["public"]["Enums"]["record_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          summary_notes?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          audit_plan_id?: string
          balance_check_status?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          id?: string
          mapping_coverage_pct?: number
          opinion_package_id?: string | null
          organization_id?: string
          package_status?: Database["public"]["Enums"]["financial_statement_package_status"]
          package_version?: number
          pending_count?: number
          pending_sections_count?: number
          prepared_at?: string | null
          prepared_by?: string | null
          progress_pct?: number
          published_at?: string | null
          published_by?: string | null
          resolved_count?: number
          return_notes?: string | null
          returned_at?: string | null
          returned_by?: string | null
          returned_count?: number
          status?: Database["public"]["Enums"]["record_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          summary_notes?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_statement_packages_audit_plan_id_fkey"
            columns: ["audit_plan_id"]
            isOneToOne: false
            referencedRelation: "audit_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_packages_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_packages_opinion_package_id_fkey"
            columns: ["opinion_package_id"]
            isOneToOne: false
            referencedRelation: "opinion_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_packages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_packages_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_statement_presentations: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          archived_at: string | null
          archived_by: string | null
          company_id: string
          comparative_mode: Database["public"]["Enums"]["fs_render_comparative_mode"]
          created_at: string
          created_by: string | null
          currency_code: string
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          engagement_id: string
          formatting_json: Json
          history_json: Json
          id: string
          layout_id: string | null
          layout_mode: Database["public"]["Enums"]["fs_render_layout_mode"]
          mapping_set_id: string | null
          name: string
          organization_id: string
          presentation_coverage_pct: number
          presentation_status: Database["public"]["Enums"]["fs_render_presentation_status"]
          presentation_version: number
          published_at: string | null
          published_by: string | null
          render_json: Json
          rendered_statement_count: number
          standard: Database["public"]["Enums"]["fs_render_standard"]
          status: Database["public"]["Enums"]["record_status"]
          summary_json: Json
          updated_at: string
          updated_by: string | null
          validated_at: string | null
          validated_by: string | null
          validation_error_count: number
          validation_json: Json
          validation_warning_count: number
          version: number
          version_count: number
          workspace_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          archived_at?: string | null
          archived_by?: string | null
          company_id: string
          comparative_mode?: Database["public"]["Enums"]["fs_render_comparative_mode"]
          created_at?: string
          created_by?: string | null
          currency_code?: string
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          engagement_id: string
          formatting_json?: Json
          history_json?: Json
          id?: string
          layout_id?: string | null
          layout_mode?: Database["public"]["Enums"]["fs_render_layout_mode"]
          mapping_set_id?: string | null
          name: string
          organization_id: string
          presentation_coverage_pct?: number
          presentation_status?: Database["public"]["Enums"]["fs_render_presentation_status"]
          presentation_version?: number
          published_at?: string | null
          published_by?: string | null
          render_json?: Json
          rendered_statement_count?: number
          standard?: Database["public"]["Enums"]["fs_render_standard"]
          status?: Database["public"]["Enums"]["record_status"]
          summary_json?: Json
          updated_at?: string
          updated_by?: string | null
          validated_at?: string | null
          validated_by?: string | null
          validation_error_count?: number
          validation_json?: Json
          validation_warning_count?: number
          version?: number
          version_count?: number
          workspace_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          archived_at?: string | null
          archived_by?: string | null
          company_id?: string
          comparative_mode?: Database["public"]["Enums"]["fs_render_comparative_mode"]
          created_at?: string
          created_by?: string | null
          currency_code?: string
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          engagement_id?: string
          formatting_json?: Json
          history_json?: Json
          id?: string
          layout_id?: string | null
          layout_mode?: Database["public"]["Enums"]["fs_render_layout_mode"]
          mapping_set_id?: string | null
          name?: string
          organization_id?: string
          presentation_coverage_pct?: number
          presentation_status?: Database["public"]["Enums"]["fs_render_presentation_status"]
          presentation_version?: number
          published_at?: string | null
          published_by?: string | null
          render_json?: Json
          rendered_statement_count?: number
          standard?: Database["public"]["Enums"]["fs_render_standard"]
          status?: Database["public"]["Enums"]["record_status"]
          summary_json?: Json
          updated_at?: string
          updated_by?: string | null
          validated_at?: string | null
          validated_by?: string | null
          validation_error_count?: number
          validation_json?: Json
          validation_warning_count?: number
          version?: number
          version_count?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_statement_presentations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_presentations_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_presentations_layout_id_fkey"
            columns: ["layout_id"]
            isOneToOne: false
            referencedRelation: "financial_statement_layouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_presentations_mapping_set_id_fkey"
            columns: ["mapping_set_id"]
            isOneToOne: false
            referencedRelation: "financial_statement_mapping_sets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_presentations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_presentations_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_statement_render_versions: {
        Row: {
          archived_at: string | null
          archived_by: string | null
          change_summary: string | null
          created_at: string
          created_by: string | null
          engagement_id: string
          id: string
          organization_id: string
          presentation_id: string
          published_at: string | null
          published_by: string | null
          rolled_back_from_version: number | null
          snapshot_json: Json
          version_number: number
          version_status: Database["public"]["Enums"]["fs_render_version_status"]
          workspace_id: string
        }
        Insert: {
          archived_at?: string | null
          archived_by?: string | null
          change_summary?: string | null
          created_at?: string
          created_by?: string | null
          engagement_id: string
          id?: string
          organization_id: string
          presentation_id: string
          published_at?: string | null
          published_by?: string | null
          rolled_back_from_version?: number | null
          snapshot_json?: Json
          version_number: number
          version_status?: Database["public"]["Enums"]["fs_render_version_status"]
          workspace_id: string
        }
        Update: {
          archived_at?: string | null
          archived_by?: string | null
          change_summary?: string | null
          created_at?: string
          created_by?: string | null
          engagement_id?: string
          id?: string
          organization_id?: string
          presentation_id?: string
          published_at?: string | null
          published_by?: string | null
          rolled_back_from_version?: number | null
          snapshot_json?: Json
          version_number?: number
          version_status?: Database["public"]["Enums"]["fs_render_version_status"]
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_statement_render_versions_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_render_versions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_render_versions_presentation_id_fkey"
            columns: ["presentation_id"]
            isOneToOne: false
            referencedRelation: "financial_statement_presentations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_render_versions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_statement_sections: {
        Row: {
          assigned_reviewer_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          due_date: string | null
          engagement_id: string
          financial_statement_package_id: string
          href: string | null
          id: string
          organization_id: string
          priority: string | null
          resolved_at: string | null
          resolved_by: string | null
          return_notes: string | null
          section_status: Database["public"]["Enums"]["financial_statement_section_status"]
          section_type: Database["public"]["Enums"]["financial_statement_section_type"]
          severity: string | null
          sort_order: number
          status: Database["public"]["Enums"]["record_status"]
          title: string
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          assigned_reviewer_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          due_date?: string | null
          engagement_id: string
          financial_statement_package_id: string
          href?: string | null
          id?: string
          organization_id: string
          priority?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          return_notes?: string | null
          section_status?: Database["public"]["Enums"]["financial_statement_section_status"]
          section_type: Database["public"]["Enums"]["financial_statement_section_type"]
          severity?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          title: string
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          assigned_reviewer_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          due_date?: string | null
          engagement_id?: string
          financial_statement_package_id?: string
          href?: string | null
          id?: string
          organization_id?: string
          priority?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          return_notes?: string | null
          section_status?: Database["public"]["Enums"]["financial_statement_section_status"]
          section_type?: Database["public"]["Enums"]["financial_statement_section_type"]
          severity?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          title?: string
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_statement_sections_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_sections_financial_statement_package_i_fkey"
            columns: ["financial_statement_package_id"]
            isOneToOne: false
            referencedRelation: "financial_statement_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_sections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_sections_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_statement_values: {
        Row: {
          amount: number | null
          created_at: string
          created_by: string | null
          currency_code: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          financial_statement_line_id: string
          financial_statement_package_id: string
          id: string
          is_comparative: boolean
          organization_id: string
          period_key: string
          source_ref: string | null
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          created_by?: string | null
          currency_code?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          financial_statement_line_id: string
          financial_statement_package_id: string
          id?: string
          is_comparative?: boolean
          organization_id: string
          period_key?: string
          source_ref?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          created_by?: string | null
          currency_code?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          financial_statement_line_id?: string
          financial_statement_package_id?: string
          id?: string
          is_comparative?: boolean
          organization_id?: string
          period_key?: string
          source_ref?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_statement_values_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_values_financial_statement_line_id_fkey"
            columns: ["financial_statement_line_id"]
            isOneToOne: false
            referencedRelation: "financial_statement_lines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_values_financial_statement_package_id_fkey"
            columns: ["financial_statement_package_id"]
            isOneToOne: false
            referencedRelation: "financial_statement_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_values_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_values_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_statement_versions: {
        Row: {
          change_summary: string | null
          created_at: string
          created_by: string | null
          engagement_id: string
          financial_statement_package_id: string
          id: string
          organization_id: string
          snapshot: Json
          version_number: number
          workspace_id: string
        }
        Insert: {
          change_summary?: string | null
          created_at?: string
          created_by?: string | null
          engagement_id: string
          financial_statement_package_id: string
          id?: string
          organization_id: string
          snapshot?: Json
          version_number: number
          workspace_id: string
        }
        Update: {
          change_summary?: string | null
          created_at?: string
          created_by?: string | null
          engagement_id?: string
          financial_statement_package_id?: string
          id?: string
          organization_id?: string
          snapshot?: Json
          version_number?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_statement_versions_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_versions_financial_statement_package_i_fkey"
            columns: ["financial_statement_package_id"]
            isOneToOne: false
            referencedRelation: "financial_statement_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_versions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_statement_versions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      ifrs_note_comments: {
        Row: {
          author_user_id: string | null
          body: string
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          id: string
          item_id: string | null
          organization_id: string
          package_id: string
          resolved_at: string | null
          resolved_by: string | null
          section_id: string | null
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          version: number
          workspace_id: string
        }
        Insert: {
          author_user_id?: string | null
          body: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          id?: string
          item_id?: string | null
          organization_id: string
          package_id: string
          resolved_at?: string | null
          resolved_by?: string | null
          section_id?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          version?: number
          workspace_id: string
        }
        Update: {
          author_user_id?: string | null
          body?: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          id?: string
          item_id?: string | null
          organization_id?: string
          package_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          section_id?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ifrs_note_comments_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ifrs_note_comments_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "ifrs_note_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ifrs_note_comments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ifrs_note_comments_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "ifrs_note_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ifrs_note_comments_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "ifrs_note_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ifrs_note_comments_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      ifrs_note_cross_references: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          disclosure_code: string | null
          engagement_id: string
          from_item_id: string | null
          from_section_id: string | null
          id: string
          metadata_json: Json
          organization_id: string
          package_id: string
          reference_label: string
          source_account_code: string | null
          statement_line_code: string | null
          status: Database["public"]["Enums"]["record_status"]
          to_section_id: string | null
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          disclosure_code?: string | null
          engagement_id: string
          from_item_id?: string | null
          from_section_id?: string | null
          id?: string
          metadata_json?: Json
          organization_id: string
          package_id: string
          reference_label: string
          source_account_code?: string | null
          statement_line_code?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          to_section_id?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          disclosure_code?: string | null
          engagement_id?: string
          from_item_id?: string | null
          from_section_id?: string | null
          id?: string
          metadata_json?: Json
          organization_id?: string
          package_id?: string
          reference_label?: string
          source_account_code?: string | null
          statement_line_code?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          to_section_id?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ifrs_note_cross_references_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ifrs_note_cross_references_from_item_id_fkey"
            columns: ["from_item_id"]
            isOneToOne: false
            referencedRelation: "ifrs_note_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ifrs_note_cross_references_from_section_id_fkey"
            columns: ["from_section_id"]
            isOneToOne: false
            referencedRelation: "ifrs_note_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ifrs_note_cross_references_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ifrs_note_cross_references_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "ifrs_note_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ifrs_note_cross_references_to_section_id_fkey"
            columns: ["to_section_id"]
            isOneToOne: false
            referencedRelation: "ifrs_note_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ifrs_note_cross_references_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      ifrs_note_history: {
        Row: {
          action: Database["public"]["Enums"]["ifrs_note_history_action"]
          actor_user_id: string | null
          created_at: string
          details_json: Json
          engagement_id: string
          entity_id: string | null
          entity_type: string | null
          id: string
          organization_id: string
          package_id: string
          summary: string
          workspace_id: string
        }
        Insert: {
          action: Database["public"]["Enums"]["ifrs_note_history_action"]
          actor_user_id?: string | null
          created_at?: string
          details_json?: Json
          engagement_id: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          organization_id: string
          package_id: string
          summary: string
          workspace_id: string
        }
        Update: {
          action?: Database["public"]["Enums"]["ifrs_note_history_action"]
          actor_user_id?: string | null
          created_at?: string
          details_json?: Json
          engagement_id?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          organization_id?: string
          package_id?: string
          summary?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ifrs_note_history_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ifrs_note_history_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ifrs_note_history_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "ifrs_note_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ifrs_note_history_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      ifrs_note_items: {
        Row: {
          body_text: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          id: string
          is_editable: boolean
          item_code: string
          item_kind: Database["public"]["Enums"]["ifrs_note_item_kind"]
          list_json: Json
          metadata_json: Json
          organization_id: string
          package_id: string
          section_id: string
          sort_order: number
          status: Database["public"]["Enums"]["record_status"]
          table_json: Json
          title: string | null
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          body_text?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          id?: string
          is_editable?: boolean
          item_code: string
          item_kind?: Database["public"]["Enums"]["ifrs_note_item_kind"]
          list_json?: Json
          metadata_json?: Json
          organization_id: string
          package_id: string
          section_id: string
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          table_json?: Json
          title?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          body_text?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          id?: string
          is_editable?: boolean
          item_code?: string
          item_kind?: Database["public"]["Enums"]["ifrs_note_item_kind"]
          list_json?: Json
          metadata_json?: Json
          organization_id?: string
          package_id?: string
          section_id?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          table_json?: Json
          title?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ifrs_note_items_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ifrs_note_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ifrs_note_items_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "ifrs_note_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ifrs_note_items_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "ifrs_note_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ifrs_note_items_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      ifrs_note_packages: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          archived_at: string | null
          archived_by: string | null
          company_id: string
          completed_note_count: number
          coverage_pct: number
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          engagement_id: string
          id: string
          mapping_set_id: string | null
          missing_note_count: number
          name: string
          organization_id: string
          package_status: Database["public"]["Enums"]["ifrs_note_package_status"]
          package_version: number
          published_at: string | null
          published_by: string | null
          required_note_count: number
          standard: Database["public"]["Enums"]["ifrs_note_standard"]
          status: Database["public"]["Enums"]["record_status"]
          structure_json: Json
          summary_json: Json
          updated_at: string
          updated_by: string | null
          validated_at: string | null
          validated_by: string | null
          validation_error_count: number
          validation_json: Json
          validation_warning_count: number
          version: number
          version_count: number
          workspace_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          archived_at?: string | null
          archived_by?: string | null
          company_id: string
          completed_note_count?: number
          coverage_pct?: number
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          engagement_id: string
          id?: string
          mapping_set_id?: string | null
          missing_note_count?: number
          name: string
          organization_id: string
          package_status?: Database["public"]["Enums"]["ifrs_note_package_status"]
          package_version?: number
          published_at?: string | null
          published_by?: string | null
          required_note_count?: number
          standard?: Database["public"]["Enums"]["ifrs_note_standard"]
          status?: Database["public"]["Enums"]["record_status"]
          structure_json?: Json
          summary_json?: Json
          updated_at?: string
          updated_by?: string | null
          validated_at?: string | null
          validated_by?: string | null
          validation_error_count?: number
          validation_json?: Json
          validation_warning_count?: number
          version?: number
          version_count?: number
          workspace_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          archived_at?: string | null
          archived_by?: string | null
          company_id?: string
          completed_note_count?: number
          coverage_pct?: number
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          engagement_id?: string
          id?: string
          mapping_set_id?: string | null
          missing_note_count?: number
          name?: string
          organization_id?: string
          package_status?: Database["public"]["Enums"]["ifrs_note_package_status"]
          package_version?: number
          published_at?: string | null
          published_by?: string | null
          required_note_count?: number
          standard?: Database["public"]["Enums"]["ifrs_note_standard"]
          status?: Database["public"]["Enums"]["record_status"]
          structure_json?: Json
          summary_json?: Json
          updated_at?: string
          updated_by?: string | null
          validated_at?: string | null
          validated_by?: string | null
          validation_error_count?: number
          validation_json?: Json
          validation_warning_count?: number
          version?: number
          version_count?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ifrs_note_packages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ifrs_note_packages_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ifrs_note_packages_mapping_set_id_fkey"
            columns: ["mapping_set_id"]
            isOneToOne: false
            referencedRelation: "financial_statement_mapping_sets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ifrs_note_packages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ifrs_note_packages_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      ifrs_note_sections: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          disclosure_kind: Database["public"]["Enums"]["ifrs_disclosure_kind"]
          engagement_id: string
          id: string
          is_applicable: boolean
          is_completed: boolean
          is_required: boolean
          metadata_json: Json
          note_code: string
          note_type: Database["public"]["Enums"]["ifrs_note_type"]
          organization_id: string
          package_id: string
          parent_section_id: string | null
          sort_order: number
          standard_ref: string | null
          status: Database["public"]["Enums"]["record_status"]
          title: string
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          disclosure_kind?: Database["public"]["Enums"]["ifrs_disclosure_kind"]
          engagement_id: string
          id?: string
          is_applicable?: boolean
          is_completed?: boolean
          is_required?: boolean
          metadata_json?: Json
          note_code: string
          note_type: Database["public"]["Enums"]["ifrs_note_type"]
          organization_id: string
          package_id: string
          parent_section_id?: string | null
          sort_order?: number
          standard_ref?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          title: string
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          disclosure_kind?: Database["public"]["Enums"]["ifrs_disclosure_kind"]
          engagement_id?: string
          id?: string
          is_applicable?: boolean
          is_completed?: boolean
          is_required?: boolean
          metadata_json?: Json
          note_code?: string
          note_type?: Database["public"]["Enums"]["ifrs_note_type"]
          organization_id?: string
          package_id?: string
          parent_section_id?: string | null
          sort_order?: number
          standard_ref?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          title?: string
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ifrs_note_sections_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ifrs_note_sections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ifrs_note_sections_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "ifrs_note_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ifrs_note_sections_parent_section_id_fkey"
            columns: ["parent_section_id"]
            isOneToOne: false
            referencedRelation: "ifrs_note_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ifrs_note_sections_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      ifrs_note_versions: {
        Row: {
          archived_at: string | null
          archived_by: string | null
          change_summary: string | null
          created_at: string
          created_by: string | null
          engagement_id: string
          id: string
          organization_id: string
          package_id: string
          published_at: string | null
          published_by: string | null
          rolled_back_from_version: number | null
          snapshot_json: Json
          version_number: number
          version_status: Database["public"]["Enums"]["ifrs_note_version_status"]
          workspace_id: string
        }
        Insert: {
          archived_at?: string | null
          archived_by?: string | null
          change_summary?: string | null
          created_at?: string
          created_by?: string | null
          engagement_id: string
          id?: string
          organization_id: string
          package_id: string
          published_at?: string | null
          published_by?: string | null
          rolled_back_from_version?: number | null
          snapshot_json?: Json
          version_number: number
          version_status?: Database["public"]["Enums"]["ifrs_note_version_status"]
          workspace_id: string
        }
        Update: {
          archived_at?: string | null
          archived_by?: string | null
          change_summary?: string | null
          created_at?: string
          created_by?: string | null
          engagement_id?: string
          id?: string
          organization_id?: string
          package_id?: string
          published_at?: string | null
          published_by?: string | null
          rolled_back_from_version?: number | null
          snapshot_json?: Json
          version_number?: number
          version_status?: Database["public"]["Enums"]["ifrs_note_version_status"]
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ifrs_note_versions_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ifrs_note_versions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ifrs_note_versions_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "ifrs_note_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ifrs_note_versions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_sheet_lines: {
        Row: {
          account_code: string
          account_name: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          difference: number
          engagement_id: string
          explanation: string | null
          id: string
          lead_sheet_id: string
          organization_id: string
          reported_amount: number
          status: Database["public"]["Enums"]["record_status"]
          tested_amount: number
          trial_balance_line_id: string | null
          updated_at: string
          updated_by: string | null
          version: number
          working_paper_id: string | null
          workspace_id: string
        }
        Insert: {
          account_code: string
          account_name: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          difference?: number
          engagement_id: string
          explanation?: string | null
          id?: string
          lead_sheet_id: string
          organization_id: string
          reported_amount?: number
          status?: Database["public"]["Enums"]["record_status"]
          tested_amount?: number
          trial_balance_line_id?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          working_paper_id?: string | null
          workspace_id: string
        }
        Update: {
          account_code?: string
          account_name?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          difference?: number
          engagement_id?: string
          explanation?: string | null
          id?: string
          lead_sheet_id?: string
          organization_id?: string
          reported_amount?: number
          status?: Database["public"]["Enums"]["record_status"]
          tested_amount?: number
          trial_balance_line_id?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          working_paper_id?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_sheet_lines_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_sheet_lines_lead_sheet_id_fkey"
            columns: ["lead_sheet_id"]
            isOneToOne: false
            referencedRelation: "lead_sheets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_sheet_lines_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_sheet_lines_trial_balance_line_id_fkey"
            columns: ["trial_balance_line_id"]
            isOneToOne: false
            referencedRelation: "trial_balance_lines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_sheet_lines_working_paper_id_fkey"
            columns: ["working_paper_id"]
            isOneToOne: false
            referencedRelation: "working_papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_sheet_lines_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_sheets: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          fs_area: string
          id: string
          name: string
          organization_id: string
          reconciliation_note: string | null
          sheet_status: string
          status: Database["public"]["Enums"]["record_status"]
          total_reported: number
          total_tested: number
          trial_balance_package_id: string
          unreconciled_difference: number
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          fs_area: string
          id?: string
          name: string
          organization_id: string
          reconciliation_note?: string | null
          sheet_status?: string
          status?: Database["public"]["Enums"]["record_status"]
          total_reported?: number
          total_tested?: number
          trial_balance_package_id: string
          unreconciled_difference?: number
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          fs_area?: string
          id?: string
          name?: string
          organization_id?: string
          reconciliation_note?: string | null
          sheet_status?: string
          status?: Database["public"]["Enums"]["record_status"]
          total_reported?: number
          total_tested?: number
          trial_balance_package_id?: string
          unreconciled_difference?: number
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_sheets_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_sheets_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_sheets_trial_balance_package_id_fkey"
            columns: ["trial_balance_package_id"]
            isOneToOne: false
            referencedRelation: "trial_balance_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_sheets_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      materiality_activity: {
        Row: {
          action: string
          created_at: string
          created_by: string | null
          engagement_id: string
          id: string
          materiality_package_id: string
          metadata: Json
          organization_id: string
          summary: string | null
          workspace_id: string
        }
        Insert: {
          action: string
          created_at?: string
          created_by?: string | null
          engagement_id: string
          id?: string
          materiality_package_id: string
          metadata?: Json
          organization_id: string
          summary?: string | null
          workspace_id: string
        }
        Update: {
          action?: string
          created_at?: string
          created_by?: string | null
          engagement_id?: string
          id?: string
          materiality_package_id?: string
          metadata?: Json
          organization_id?: string
          summary?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "materiality_activity_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materiality_activity_materiality_package_id_fkey"
            columns: ["materiality_package_id"]
            isOneToOne: false
            referencedRelation: "materiality_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materiality_activity_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materiality_activity_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      materiality_benchmarks: {
        Row: {
          benchmark_amount: number
          benchmark_label: string | null
          benchmark_type: Database["public"]["Enums"]["materiality_benchmark_type"]
          calculated_materiality: number | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          id: string
          is_selected: boolean
          materiality_package_id: string
          organization_id: string
          percentage: number
          rationale: string | null
          sort_order: number
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          benchmark_amount: number
          benchmark_label?: string | null
          benchmark_type: Database["public"]["Enums"]["materiality_benchmark_type"]
          calculated_materiality?: number | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          id?: string
          is_selected?: boolean
          materiality_package_id: string
          organization_id: string
          percentage: number
          rationale?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          benchmark_amount?: number
          benchmark_label?: string | null
          benchmark_type?: Database["public"]["Enums"]["materiality_benchmark_type"]
          calculated_materiality?: number | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          id?: string
          is_selected?: boolean
          materiality_package_id?: string
          organization_id?: string
          percentage?: number
          rationale?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "materiality_benchmarks_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materiality_benchmarks_materiality_package_id_fkey"
            columns: ["materiality_package_id"]
            isOneToOne: false
            referencedRelation: "materiality_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materiality_benchmarks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materiality_benchmarks_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      materiality_calculations: {
        Row: {
          benchmark_id: string | null
          calculation_type: Database["public"]["Enums"]["materiality_calculation_type"]
          created_at: string
          created_by: string | null
          engagement_id: string
          explanation: string | null
          formula: string | null
          id: string
          input_amount: number | null
          is_manual_override: boolean
          materiality_package_id: string
          organization_id: string
          percentage: number | null
          result_amount: number | null
          workspace_id: string
        }
        Insert: {
          benchmark_id?: string | null
          calculation_type: Database["public"]["Enums"]["materiality_calculation_type"]
          created_at?: string
          created_by?: string | null
          engagement_id: string
          explanation?: string | null
          formula?: string | null
          id?: string
          input_amount?: number | null
          is_manual_override?: boolean
          materiality_package_id: string
          organization_id: string
          percentage?: number | null
          result_amount?: number | null
          workspace_id: string
        }
        Update: {
          benchmark_id?: string | null
          calculation_type?: Database["public"]["Enums"]["materiality_calculation_type"]
          created_at?: string
          created_by?: string | null
          engagement_id?: string
          explanation?: string | null
          formula?: string | null
          id?: string
          input_amount?: number | null
          is_manual_override?: boolean
          materiality_package_id?: string
          organization_id?: string
          percentage?: number | null
          result_amount?: number | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "materiality_calculations_benchmark_id_fkey"
            columns: ["benchmark_id"]
            isOneToOne: false
            referencedRelation: "materiality_benchmarks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materiality_calculations_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materiality_calculations_materiality_package_id_fkey"
            columns: ["materiality_package_id"]
            isOneToOne: false
            referencedRelation: "materiality_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materiality_calculations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materiality_calculations_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      materiality_comments: {
        Row: {
          body: string
          comment_type: Database["public"]["Enums"]["materiality_comment_type"]
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          id: string
          materiality_package_id: string
          organization_id: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          body: string
          comment_type?: Database["public"]["Enums"]["materiality_comment_type"]
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          id?: string
          materiality_package_id: string
          organization_id: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          body?: string
          comment_type?: Database["public"]["Enums"]["materiality_comment_type"]
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          id?: string
          materiality_package_id?: string
          organization_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "materiality_comments_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materiality_comments_materiality_package_id_fkey"
            columns: ["materiality_package_id"]
            isOneToOne: false
            referencedRelation: "materiality_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materiality_comments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materiality_comments_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      materiality_packages: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          audit_plan_id: string
          basis_notes: string | null
          created_at: string
          created_by: string | null
          currency_code: string
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          id: string
          organization_id: string
          overall_materiality: number | null
          package_status: Database["public"]["Enums"]["materiality_package_status"]
          package_version: number
          performance_materiality: number | null
          performance_materiality_pct: number | null
          progress_pct: number
          return_notes: string | null
          returned_at: string | null
          returned_by: string | null
          selected_benchmark_id: string | null
          specific_materiality: Json
          status: Database["public"]["Enums"]["record_status"]
          submitted_at: string | null
          submitted_by: string | null
          trivial_threshold: number | null
          trivial_threshold_pct: number | null
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          audit_plan_id: string
          basis_notes?: string | null
          created_at?: string
          created_by?: string | null
          currency_code?: string
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          id?: string
          organization_id: string
          overall_materiality?: number | null
          package_status?: Database["public"]["Enums"]["materiality_package_status"]
          package_version?: number
          performance_materiality?: number | null
          performance_materiality_pct?: number | null
          progress_pct?: number
          return_notes?: string | null
          returned_at?: string | null
          returned_by?: string | null
          selected_benchmark_id?: string | null
          specific_materiality?: Json
          status?: Database["public"]["Enums"]["record_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          trivial_threshold?: number | null
          trivial_threshold_pct?: number | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          audit_plan_id?: string
          basis_notes?: string | null
          created_at?: string
          created_by?: string | null
          currency_code?: string
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          id?: string
          organization_id?: string
          overall_materiality?: number | null
          package_status?: Database["public"]["Enums"]["materiality_package_status"]
          package_version?: number
          performance_materiality?: number | null
          performance_materiality_pct?: number | null
          progress_pct?: number
          return_notes?: string | null
          returned_at?: string | null
          returned_by?: string | null
          selected_benchmark_id?: string | null
          specific_materiality?: Json
          status?: Database["public"]["Enums"]["record_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          trivial_threshold?: number | null
          trivial_threshold_pct?: number | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "materiality_packages_audit_plan_id_fkey"
            columns: ["audit_plan_id"]
            isOneToOne: false
            referencedRelation: "audit_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materiality_packages_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materiality_packages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materiality_packages_selected_benchmark_fkey"
            columns: ["selected_benchmark_id"]
            isOneToOne: false
            referencedRelation: "materiality_benchmarks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materiality_packages_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      materiality_versions: {
        Row: {
          change_summary: string | null
          created_at: string
          created_by: string | null
          engagement_id: string
          id: string
          materiality_package_id: string
          organization_id: string
          snapshot: Json
          version_number: number
          workspace_id: string
        }
        Insert: {
          change_summary?: string | null
          created_at?: string
          created_by?: string | null
          engagement_id: string
          id?: string
          materiality_package_id: string
          organization_id: string
          snapshot?: Json
          version_number: number
          workspace_id: string
        }
        Update: {
          change_summary?: string | null
          created_at?: string
          created_by?: string | null
          engagement_id?: string
          id?: string
          materiality_package_id?: string
          organization_id?: string
          snapshot?: Json
          version_number?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "materiality_versions_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materiality_versions_materiality_package_id_fkey"
            columns: ["materiality_package_id"]
            isOneToOne: false
            referencedRelation: "materiality_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materiality_versions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materiality_versions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          company_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          membership_scope: Database["public"]["Enums"]["membership_scope"]
          organization_id: string
          role_id: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          user_id: string
          version: number
          workspace_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          membership_scope: Database["public"]["Enums"]["membership_scope"]
          organization_id: string
          role_id: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          user_id: string
          version?: number
          workspace_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          membership_scope?: Database["public"]["Enums"]["membership_scope"]
          organization_id?: string
          role_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          user_id?: string
          version?: number
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memberships_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      opinion_activity: {
        Row: {
          action: string
          created_at: string
          created_by: string | null
          engagement_id: string
          id: string
          metadata: Json
          opinion_package_id: string
          organization_id: string
          summary: string | null
          workspace_id: string
        }
        Insert: {
          action: string
          created_at?: string
          created_by?: string | null
          engagement_id: string
          id?: string
          metadata?: Json
          opinion_package_id: string
          organization_id: string
          summary?: string | null
          workspace_id: string
        }
        Update: {
          action?: string
          created_at?: string
          created_by?: string | null
          engagement_id?: string
          id?: string
          metadata?: Json
          opinion_package_id?: string
          organization_id?: string
          summary?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opinion_activity_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opinion_activity_opinion_package_id_fkey"
            columns: ["opinion_package_id"]
            isOneToOne: false
            referencedRelation: "opinion_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opinion_activity_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opinion_activity_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      opinion_comments: {
        Row: {
          attachment_metadata: Json
          body: string
          comment_type: Database["public"]["Enums"]["opinion_comment_type"]
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          id: string
          mentions: Json
          opinion_package_id: string
          opinion_section_id: string | null
          organization_id: string
          parent_comment_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          attachment_metadata?: Json
          body: string
          comment_type?: Database["public"]["Enums"]["opinion_comment_type"]
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          id?: string
          mentions?: Json
          opinion_package_id: string
          opinion_section_id?: string | null
          organization_id: string
          parent_comment_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          attachment_metadata?: Json
          body?: string
          comment_type?: Database["public"]["Enums"]["opinion_comment_type"]
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          id?: string
          mentions?: Json
          opinion_package_id?: string
          opinion_section_id?: string | null
          organization_id?: string
          parent_comment_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opinion_comments_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opinion_comments_opinion_package_id_fkey"
            columns: ["opinion_package_id"]
            isOneToOne: false
            referencedRelation: "opinion_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opinion_comments_opinion_section_id_fkey"
            columns: ["opinion_section_id"]
            isOneToOne: false
            referencedRelation: "opinion_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opinion_comments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opinion_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "opinion_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opinion_comments_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      opinion_packages: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          audit_plan_id: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          id: string
          opinion_type: Database["public"]["Enums"]["opinion_type"] | null
          organization_id: string
          package_status: Database["public"]["Enums"]["opinion_package_status"]
          package_version: number
          pending_count: number
          pending_sections_count: number
          progress_pct: number
          reporting_package_id: string | null
          resolved_count: number
          return_notes: string | null
          returned_at: string | null
          returned_by: string | null
          returned_count: number
          status: Database["public"]["Enums"]["record_status"]
          submitted_at: string | null
          submitted_by: string | null
          summary_notes: string | null
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          audit_plan_id: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          id?: string
          opinion_type?: Database["public"]["Enums"]["opinion_type"] | null
          organization_id: string
          package_status?: Database["public"]["Enums"]["opinion_package_status"]
          package_version?: number
          pending_count?: number
          pending_sections_count?: number
          progress_pct?: number
          reporting_package_id?: string | null
          resolved_count?: number
          return_notes?: string | null
          returned_at?: string | null
          returned_by?: string | null
          returned_count?: number
          status?: Database["public"]["Enums"]["record_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          summary_notes?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          audit_plan_id?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          id?: string
          opinion_type?: Database["public"]["Enums"]["opinion_type"] | null
          organization_id?: string
          package_status?: Database["public"]["Enums"]["opinion_package_status"]
          package_version?: number
          pending_count?: number
          pending_sections_count?: number
          progress_pct?: number
          reporting_package_id?: string | null
          resolved_count?: number
          return_notes?: string | null
          returned_at?: string | null
          returned_by?: string | null
          returned_count?: number
          status?: Database["public"]["Enums"]["record_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          summary_notes?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opinion_packages_audit_plan_id_fkey"
            columns: ["audit_plan_id"]
            isOneToOne: false
            referencedRelation: "audit_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opinion_packages_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opinion_packages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opinion_packages_reporting_package_id_fkey"
            columns: ["reporting_package_id"]
            isOneToOne: false
            referencedRelation: "reporting_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opinion_packages_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      opinion_sections: {
        Row: {
          assigned_reviewer_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          due_date: string | null
          engagement_id: string
          href: string | null
          id: string
          opinion_package_id: string
          organization_id: string
          priority: string | null
          resolved_at: string | null
          resolved_by: string | null
          return_notes: string | null
          section_status: Database["public"]["Enums"]["opinion_section_status"]
          section_type: Database["public"]["Enums"]["opinion_section_type"]
          severity: string | null
          sort_order: number
          status: Database["public"]["Enums"]["record_status"]
          title: string
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          assigned_reviewer_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          due_date?: string | null
          engagement_id: string
          href?: string | null
          id?: string
          opinion_package_id: string
          organization_id: string
          priority?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          return_notes?: string | null
          section_status?: Database["public"]["Enums"]["opinion_section_status"]
          section_type: Database["public"]["Enums"]["opinion_section_type"]
          severity?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          title: string
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          assigned_reviewer_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          due_date?: string | null
          engagement_id?: string
          href?: string | null
          id?: string
          opinion_package_id?: string
          organization_id?: string
          priority?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          return_notes?: string | null
          section_status?: Database["public"]["Enums"]["opinion_section_status"]
          section_type?: Database["public"]["Enums"]["opinion_section_type"]
          severity?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          title?: string
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opinion_sections_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opinion_sections_opinion_package_id_fkey"
            columns: ["opinion_package_id"]
            isOneToOne: false
            referencedRelation: "opinion_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opinion_sections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opinion_sections_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      opinion_versions: {
        Row: {
          change_summary: string | null
          created_at: string
          created_by: string | null
          engagement_id: string
          id: string
          opinion_package_id: string
          organization_id: string
          snapshot: Json
          version_number: number
          workspace_id: string
        }
        Insert: {
          change_summary?: string | null
          created_at?: string
          created_by?: string | null
          engagement_id: string
          id?: string
          opinion_package_id: string
          organization_id: string
          snapshot?: Json
          version_number: number
          workspace_id: string
        }
        Update: {
          change_summary?: string | null
          created_at?: string
          created_by?: string | null
          engagement_id?: string
          id?: string
          opinion_package_id?: string
          organization_id?: string
          snapshot?: Json
          version_number?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opinion_versions_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opinion_versions_opinion_package_id_fkey"
            columns: ["opinion_package_id"]
            isOneToOne: false
            referencedRelation: "opinion_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opinion_versions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opinion_versions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_settings: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          organization_id: string
          settings: Json
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          organization_id: string
          settings?: Json
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          organization_id?: string
          settings?: Json
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "organization_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          id: string
          legal_name: string | null
          name: string
          slug: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          id?: string
          legal_name?: string | null
          name: string
          slug: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          id?: string
          legal_name?: string | null
          name?: string
          slug?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Relationships: []
      }
      permissions: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          id: string
          module: string | null
          name: string
          resource: string | null
          scope: Database["public"]["Enums"]["permission_scope"]
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          id?: string
          module?: string | null
          name: string
          resource?: string | null
          scope?: Database["public"]["Enums"]["permission_scope"]
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          id?: string
          module?: string | null
          name?: string
          resource?: string | null
          scope?: Database["public"]["Enums"]["permission_scope"]
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Relationships: []
      }
      planning_activity: {
        Row: {
          action: string
          actor_id: string | null
          audit_plan_id: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          id: string
          metadata: Json
          organization_id: string
          status: Database["public"]["Enums"]["record_status"]
          summary: string | null
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          audit_plan_id: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          id?: string
          metadata?: Json
          organization_id: string
          status?: Database["public"]["Enums"]["record_status"]
          summary?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          audit_plan_id?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          id?: string
          metadata?: Json
          organization_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          summary?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "planning_activity_audit_plan_id_fkey"
            columns: ["audit_plan_id"]
            isOneToOne: false
            referencedRelation: "audit_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planning_activity_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planning_activity_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planning_activity_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      planning_comments: {
        Row: {
          audit_plan_id: string
          author_id: string | null
          body: string
          comment_type: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          id: string
          organization_id: string
          resolved_at: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          audit_plan_id: string
          author_id?: string | null
          body: string
          comment_type?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          id?: string
          organization_id: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          audit_plan_id?: string
          author_id?: string | null
          body?: string
          comment_type?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          id?: string
          organization_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "planning_comments_audit_plan_id_fkey"
            columns: ["audit_plan_id"]
            isOneToOne: false
            referencedRelation: "audit_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planning_comments_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planning_comments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planning_comments_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      procedure_groups: {
        Row: {
          audit_program_id: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          engagement_id: string
          fieldwork_package_id: string
          id: string
          name: string
          organization_id: string
          progress_pct: number
          sort_order: number
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          audit_program_id: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          engagement_id: string
          fieldwork_package_id: string
          id?: string
          name: string
          organization_id: string
          progress_pct?: number
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          audit_program_id?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          engagement_id?: string
          fieldwork_package_id?: string
          id?: string
          name?: string
          organization_id?: string
          progress_pct?: number
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "procedure_groups_audit_program_id_fkey"
            columns: ["audit_program_id"]
            isOneToOne: false
            referencedRelation: "audit_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "procedure_groups_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "procedure_groups_fieldwork_package_id_fkey"
            columns: ["fieldwork_package_id"]
            isOneToOne: false
            referencedRelation: "fieldwork_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "procedure_groups_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "procedure_groups_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      report_activity: {
        Row: {
          action: string
          created_at: string
          created_by: string | null
          engagement_id: string
          id: string
          metadata: Json
          organization_id: string
          reporting_package_id: string
          summary: string | null
          workspace_id: string
        }
        Insert: {
          action: string
          created_at?: string
          created_by?: string | null
          engagement_id: string
          id?: string
          metadata?: Json
          organization_id: string
          reporting_package_id: string
          summary?: string | null
          workspace_id: string
        }
        Update: {
          action?: string
          created_at?: string
          created_by?: string | null
          engagement_id?: string
          id?: string
          metadata?: Json
          organization_id?: string
          reporting_package_id?: string
          summary?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_activity_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_activity_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_activity_reporting_package_id_fkey"
            columns: ["reporting_package_id"]
            isOneToOne: false
            referencedRelation: "reporting_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_activity_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      report_comments: {
        Row: {
          attachment_metadata: Json
          body: string
          comment_type: Database["public"]["Enums"]["report_comment_type"]
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          id: string
          mentions: Json
          organization_id: string
          parent_comment_id: string | null
          report_section_id: string | null
          reporting_package_id: string
          resolved_at: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          attachment_metadata?: Json
          body: string
          comment_type?: Database["public"]["Enums"]["report_comment_type"]
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          id?: string
          mentions?: Json
          organization_id: string
          parent_comment_id?: string | null
          report_section_id?: string | null
          reporting_package_id: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          attachment_metadata?: Json
          body?: string
          comment_type?: Database["public"]["Enums"]["report_comment_type"]
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          id?: string
          mentions?: Json
          organization_id?: string
          parent_comment_id?: string | null
          report_section_id?: string | null
          reporting_package_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_comments_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_comments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "report_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_comments_report_section_id_fkey"
            columns: ["report_section_id"]
            isOneToOne: false
            referencedRelation: "report_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_comments_reporting_package_id_fkey"
            columns: ["reporting_package_id"]
            isOneToOne: false
            referencedRelation: "reporting_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_comments_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      report_sections: {
        Row: {
          assigned_reviewer_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          due_date: string | null
          engagement_id: string
          href: string | null
          id: string
          organization_id: string
          priority: string | null
          reporting_package_id: string
          resolved_at: string | null
          resolved_by: string | null
          return_notes: string | null
          section_status: Database["public"]["Enums"]["report_section_status"]
          section_type: Database["public"]["Enums"]["report_section_type"]
          severity: string | null
          sort_order: number
          status: Database["public"]["Enums"]["record_status"]
          title: string
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          assigned_reviewer_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          due_date?: string | null
          engagement_id: string
          href?: string | null
          id?: string
          organization_id: string
          priority?: string | null
          reporting_package_id: string
          resolved_at?: string | null
          resolved_by?: string | null
          return_notes?: string | null
          section_status?: Database["public"]["Enums"]["report_section_status"]
          section_type: Database["public"]["Enums"]["report_section_type"]
          severity?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          title: string
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          assigned_reviewer_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          due_date?: string | null
          engagement_id?: string
          href?: string | null
          id?: string
          organization_id?: string
          priority?: string | null
          reporting_package_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          return_notes?: string | null
          section_status?: Database["public"]["Enums"]["report_section_status"]
          section_type?: Database["public"]["Enums"]["report_section_type"]
          severity?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          title?: string
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_sections_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_sections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_sections_reporting_package_id_fkey"
            columns: ["reporting_package_id"]
            isOneToOne: false
            referencedRelation: "reporting_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_sections_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      report_versions: {
        Row: {
          change_summary: string | null
          created_at: string
          created_by: string | null
          engagement_id: string
          id: string
          organization_id: string
          reporting_package_id: string
          snapshot: Json
          version_number: number
          workspace_id: string
        }
        Insert: {
          change_summary?: string | null
          created_at?: string
          created_by?: string | null
          engagement_id: string
          id?: string
          organization_id: string
          reporting_package_id: string
          snapshot?: Json
          version_number: number
          workspace_id: string
        }
        Update: {
          change_summary?: string | null
          created_at?: string
          created_by?: string | null
          engagement_id?: string
          id?: string
          organization_id?: string
          reporting_package_id?: string
          snapshot?: Json
          version_number?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_versions_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_versions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_versions_reporting_package_id_fkey"
            columns: ["reporting_package_id"]
            isOneToOne: false
            referencedRelation: "reporting_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_versions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      reporting_packages: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          audit_plan_id: string
          completion_package_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          id: string
          organization_id: string
          package_status: Database["public"]["Enums"]["reporting_package_status"]
          package_version: number
          pending_count: number
          pending_sections_count: number
          progress_pct: number
          resolved_count: number
          return_notes: string | null
          returned_at: string | null
          returned_by: string | null
          returned_count: number
          status: Database["public"]["Enums"]["record_status"]
          submitted_at: string | null
          submitted_by: string | null
          summary_notes: string | null
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          audit_plan_id: string
          completion_package_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          id?: string
          organization_id: string
          package_status?: Database["public"]["Enums"]["reporting_package_status"]
          package_version?: number
          pending_count?: number
          pending_sections_count?: number
          progress_pct?: number
          resolved_count?: number
          return_notes?: string | null
          returned_at?: string | null
          returned_by?: string | null
          returned_count?: number
          status?: Database["public"]["Enums"]["record_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          summary_notes?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          audit_plan_id?: string
          completion_package_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          id?: string
          organization_id?: string
          package_status?: Database["public"]["Enums"]["reporting_package_status"]
          package_version?: number
          pending_count?: number
          pending_sections_count?: number
          progress_pct?: number
          resolved_count?: number
          return_notes?: string | null
          returned_at?: string | null
          returned_by?: string | null
          returned_count?: number
          status?: Database["public"]["Enums"]["record_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          summary_notes?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reporting_packages_audit_plan_id_fkey"
            columns: ["audit_plan_id"]
            isOneToOne: false
            referencedRelation: "audit_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reporting_packages_completion_package_id_fkey"
            columns: ["completion_package_id"]
            isOneToOne: false
            referencedRelation: "completion_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reporting_packages_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reporting_packages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reporting_packages_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      review_activity: {
        Row: {
          action: string
          created_at: string
          created_by: string | null
          engagement_id: string
          id: string
          metadata: Json
          organization_id: string
          review_package_id: string
          summary: string | null
          workspace_id: string
        }
        Insert: {
          action: string
          created_at?: string
          created_by?: string | null
          engagement_id: string
          id?: string
          metadata?: Json
          organization_id: string
          review_package_id: string
          summary?: string | null
          workspace_id: string
        }
        Update: {
          action?: string
          created_at?: string
          created_by?: string | null
          engagement_id?: string
          id?: string
          metadata?: Json
          organization_id?: string
          review_package_id?: string
          summary?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_activity_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_activity_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_activity_review_package_id_fkey"
            columns: ["review_package_id"]
            isOneToOne: false
            referencedRelation: "review_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_activity_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      review_comments: {
        Row: {
          attachment_metadata: Json
          body: string
          comment_type: Database["public"]["Enums"]["review_comment_type"]
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          id: string
          mentions: Json
          organization_id: string
          parent_comment_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          review_item_id: string | null
          review_package_id: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          attachment_metadata?: Json
          body: string
          comment_type?: Database["public"]["Enums"]["review_comment_type"]
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          id?: string
          mentions?: Json
          organization_id: string
          parent_comment_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          review_item_id?: string | null
          review_package_id: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          attachment_metadata?: Json
          body?: string
          comment_type?: Database["public"]["Enums"]["review_comment_type"]
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          id?: string
          mentions?: Json
          organization_id?: string
          parent_comment_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          review_item_id?: string | null
          review_package_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_comments_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_comments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "review_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_comments_review_item_id_fkey"
            columns: ["review_item_id"]
            isOneToOne: false
            referencedRelation: "review_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_comments_review_package_id_fkey"
            columns: ["review_package_id"]
            isOneToOne: false
            referencedRelation: "review_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_comments_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      review_items: {
        Row: {
          assigned_reviewer_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          due_date: string | null
          engagement_id: string
          href: string | null
          id: string
          item_status: Database["public"]["Enums"]["review_item_status"]
          organization_id: string
          priority: string | null
          resolved_at: string | null
          resolved_by: string | null
          return_notes: string | null
          review_package_id: string
          severity: string | null
          sort_order: number
          source_entity_id: string
          source_entity_type: string
          source_module: Database["public"]["Enums"]["review_source_module"]
          status: Database["public"]["Enums"]["record_status"]
          title: string
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          assigned_reviewer_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          due_date?: string | null
          engagement_id: string
          href?: string | null
          id?: string
          item_status?: Database["public"]["Enums"]["review_item_status"]
          organization_id: string
          priority?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          return_notes?: string | null
          review_package_id: string
          severity?: string | null
          sort_order?: number
          source_entity_id: string
          source_entity_type: string
          source_module: Database["public"]["Enums"]["review_source_module"]
          status?: Database["public"]["Enums"]["record_status"]
          title: string
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          assigned_reviewer_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          due_date?: string | null
          engagement_id?: string
          href?: string | null
          id?: string
          item_status?: Database["public"]["Enums"]["review_item_status"]
          organization_id?: string
          priority?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          return_notes?: string | null
          review_package_id?: string
          severity?: string | null
          sort_order?: number
          source_entity_id?: string
          source_entity_type?: string
          source_module?: Database["public"]["Enums"]["review_source_module"]
          status?: Database["public"]["Enums"]["record_status"]
          title?: string
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_items_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_items_review_package_id_fkey"
            columns: ["review_package_id"]
            isOneToOne: false
            referencedRelation: "review_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_items_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      review_packages: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          audit_plan_id: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          fieldwork_package_id: string | null
          id: string
          open_findings_count: number
          organization_id: string
          package_status: Database["public"]["Enums"]["review_package_status"]
          package_version: number
          pending_count: number
          progress_pct: number
          resolved_count: number
          return_notes: string | null
          returned_at: string | null
          returned_by: string | null
          returned_count: number
          status: Database["public"]["Enums"]["record_status"]
          submitted_at: string | null
          submitted_by: string | null
          summary_notes: string | null
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          audit_plan_id: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          fieldwork_package_id?: string | null
          id?: string
          open_findings_count?: number
          organization_id: string
          package_status?: Database["public"]["Enums"]["review_package_status"]
          package_version?: number
          pending_count?: number
          progress_pct?: number
          resolved_count?: number
          return_notes?: string | null
          returned_at?: string | null
          returned_by?: string | null
          returned_count?: number
          status?: Database["public"]["Enums"]["record_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          summary_notes?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          audit_plan_id?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          fieldwork_package_id?: string | null
          id?: string
          open_findings_count?: number
          organization_id?: string
          package_status?: Database["public"]["Enums"]["review_package_status"]
          package_version?: number
          pending_count?: number
          progress_pct?: number
          resolved_count?: number
          return_notes?: string | null
          returned_at?: string | null
          returned_by?: string | null
          returned_count?: number
          status?: Database["public"]["Enums"]["record_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          summary_notes?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_packages_audit_plan_id_fkey"
            columns: ["audit_plan_id"]
            isOneToOne: false
            referencedRelation: "audit_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_packages_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_packages_fieldwork_package_id_fkey"
            columns: ["fieldwork_package_id"]
            isOneToOne: false
            referencedRelation: "fieldwork_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_packages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_packages_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      review_versions: {
        Row: {
          change_summary: string | null
          created_at: string
          created_by: string | null
          engagement_id: string
          id: string
          organization_id: string
          review_package_id: string
          snapshot: Json
          version_number: number
          workspace_id: string
        }
        Insert: {
          change_summary?: string | null
          created_at?: string
          created_by?: string | null
          engagement_id: string
          id?: string
          organization_id: string
          review_package_id: string
          snapshot?: Json
          version_number: number
          workspace_id: string
        }
        Update: {
          change_summary?: string | null
          created_at?: string
          created_by?: string | null
          engagement_id?: string
          id?: string
          organization_id?: string
          review_package_id?: string
          snapshot?: Json
          version_number?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_versions_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_versions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_versions_review_package_id_fkey"
            columns: ["review_package_id"]
            isOneToOne: false
            referencedRelation: "review_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_versions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_activity: {
        Row: {
          action: string
          created_at: string
          created_by: string | null
          engagement_id: string
          id: string
          metadata: Json
          organization_id: string
          risk_assessment_id: string
          summary: string | null
          workspace_id: string
        }
        Insert: {
          action: string
          created_at?: string
          created_by?: string | null
          engagement_id: string
          id?: string
          metadata?: Json
          organization_id: string
          risk_assessment_id: string
          summary?: string | null
          workspace_id: string
        }
        Update: {
          action?: string
          created_at?: string
          created_by?: string | null
          engagement_id?: string
          id?: string
          metadata?: Json
          organization_id?: string
          risk_assessment_id?: string
          summary?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_activity_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_activity_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_activity_risk_assessment_id_fkey"
            columns: ["risk_assessment_id"]
            isOneToOne: false
            referencedRelation: "risk_assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_activity_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_assertion_ratings: {
        Row: {
          account_name: string
          assertion: Database["public"]["Enums"]["assertion_type"]
          composite_rating:
            | Database["public"]["Enums"]["risk_rating_level"]
            | null
          control_rating:
            | Database["public"]["Enums"]["risk_rating_level"]
            | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          id: string
          inherent_rating:
            | Database["public"]["Enums"]["risk_rating_level"]
            | null
          is_significant: boolean
          organization_id: string
          rationale: string | null
          risk_assessment_id: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          account_name: string
          assertion: Database["public"]["Enums"]["assertion_type"]
          composite_rating?:
            | Database["public"]["Enums"]["risk_rating_level"]
            | null
          control_rating?:
            | Database["public"]["Enums"]["risk_rating_level"]
            | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          id?: string
          inherent_rating?:
            | Database["public"]["Enums"]["risk_rating_level"]
            | null
          is_significant?: boolean
          organization_id: string
          rationale?: string | null
          risk_assessment_id: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          account_name?: string
          assertion?: Database["public"]["Enums"]["assertion_type"]
          composite_rating?:
            | Database["public"]["Enums"]["risk_rating_level"]
            | null
          control_rating?:
            | Database["public"]["Enums"]["risk_rating_level"]
            | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          id?: string
          inherent_rating?:
            | Database["public"]["Enums"]["risk_rating_level"]
            | null
          is_significant?: boolean
          organization_id?: string
          rationale?: string | null
          risk_assessment_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_assertion_ratings_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_assertion_ratings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_assertion_ratings_risk_assessment_id_fkey"
            columns: ["risk_assessment_id"]
            isOneToOne: false
            referencedRelation: "risk_assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_assertion_ratings_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_assessments: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          assessment_status: Database["public"]["Enums"]["risk_assessment_status"]
          assessment_version: number
          audit_plan_id: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          id: string
          organization_id: string
          progress_pct: number
          return_notes: string | null
          returned_at: string | null
          returned_by: string | null
          significant_risks_acknowledged_at: string | null
          significant_risks_acknowledged_by: string | null
          status: Database["public"]["Enums"]["record_status"]
          submitted_at: string | null
          submitted_by: string | null
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          assessment_status?: Database["public"]["Enums"]["risk_assessment_status"]
          assessment_version?: number
          audit_plan_id: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          id?: string
          organization_id: string
          progress_pct?: number
          return_notes?: string | null
          returned_at?: string | null
          returned_by?: string | null
          significant_risks_acknowledged_at?: string | null
          significant_risks_acknowledged_by?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          assessment_status?: Database["public"]["Enums"]["risk_assessment_status"]
          assessment_version?: number
          audit_plan_id?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          id?: string
          organization_id?: string
          progress_pct?: number
          return_notes?: string | null
          returned_at?: string | null
          returned_by?: string | null
          significant_risks_acknowledged_at?: string | null
          significant_risks_acknowledged_by?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_assessments_audit_plan_id_fkey"
            columns: ["audit_plan_id"]
            isOneToOne: false
            referencedRelation: "audit_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_assessments_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_assessments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_assessments_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_categories: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          engagement_id: string
          id: string
          name: string
          organization_id: string
          risk_assessment_id: string
          sort_order: number
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          engagement_id: string
          id?: string
          name: string
          organization_id: string
          risk_assessment_id: string
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          engagement_id?: string
          id?: string
          name?: string
          organization_id?: string
          risk_assessment_id?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_categories_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_categories_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_categories_risk_assessment_id_fkey"
            columns: ["risk_assessment_id"]
            isOneToOne: false
            referencedRelation: "risk_assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_categories_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_notes: {
        Row: {
          body: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          id: string
          note_type: Database["public"]["Enums"]["risk_note_type"]
          organization_id: string
          risk_assessment_id: string
          risk_register_item_id: string | null
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          body: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          id?: string
          note_type?: Database["public"]["Enums"]["risk_note_type"]
          organization_id: string
          risk_assessment_id: string
          risk_register_item_id?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          body?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          id?: string
          note_type?: Database["public"]["Enums"]["risk_note_type"]
          organization_id?: string
          risk_assessment_id?: string
          risk_register_item_id?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_notes_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_notes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_notes_risk_assessment_id_fkey"
            columns: ["risk_assessment_id"]
            isOneToOne: false
            referencedRelation: "risk_assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_notes_risk_register_item_id_fkey"
            columns: ["risk_register_item_id"]
            isOneToOne: false
            referencedRelation: "risk_register_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_notes_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_procedure_links: {
        Row: {
          audit_procedure_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          id: string
          organization_id: string
          procedure_reference: string | null
          risk_assessment_id: string
          risk_register_item_id: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          audit_procedure_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          id?: string
          organization_id: string
          procedure_reference?: string | null
          risk_assessment_id: string
          risk_register_item_id: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          audit_procedure_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          id?: string
          organization_id?: string
          procedure_reference?: string | null
          risk_assessment_id?: string
          risk_register_item_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_procedure_links_audit_procedure_id_fkey"
            columns: ["audit_procedure_id"]
            isOneToOne: false
            referencedRelation: "audit_procedures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_procedure_links_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_procedure_links_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_procedure_links_risk_assessment_id_fkey"
            columns: ["risk_assessment_id"]
            isOneToOne: false
            referencedRelation: "risk_assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_procedure_links_risk_register_item_id_fkey"
            columns: ["risk_register_item_id"]
            isOneToOne: false
            referencedRelation: "risk_register_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_procedure_links_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_register_items: {
        Row: {
          account_name: string | null
          audit_area: string | null
          control_rating:
            | Database["public"]["Enums"]["risk_rating_level"]
            | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          detection_rating:
            | Database["public"]["Enums"]["risk_rating_level"]
            | null
          engagement_id: string
          id: string
          impact: Database["public"]["Enums"]["risk_impact"] | null
          inherent_rating:
            | Database["public"]["Enums"]["risk_rating_level"]
            | null
          is_significant: boolean
          likelihood: Database["public"]["Enums"]["risk_likelihood"] | null
          linked_assertion: Database["public"]["Enums"]["assertion_type"] | null
          organization_id: string
          owner_id: string | null
          rationale: string | null
          residual_rating:
            | Database["public"]["Enums"]["risk_rating_level"]
            | null
          risk_assessment_id: string
          risk_category_id: string | null
          risk_type: Database["public"]["Enums"]["risk_type"]
          sort_order: number
          status: Database["public"]["Enums"]["record_status"]
          title: string
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          account_name?: string | null
          audit_area?: string | null
          control_rating?:
            | Database["public"]["Enums"]["risk_rating_level"]
            | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          detection_rating?:
            | Database["public"]["Enums"]["risk_rating_level"]
            | null
          engagement_id: string
          id?: string
          impact?: Database["public"]["Enums"]["risk_impact"] | null
          inherent_rating?:
            | Database["public"]["Enums"]["risk_rating_level"]
            | null
          is_significant?: boolean
          likelihood?: Database["public"]["Enums"]["risk_likelihood"] | null
          linked_assertion?:
            | Database["public"]["Enums"]["assertion_type"]
            | null
          organization_id: string
          owner_id?: string | null
          rationale?: string | null
          residual_rating?:
            | Database["public"]["Enums"]["risk_rating_level"]
            | null
          risk_assessment_id: string
          risk_category_id?: string | null
          risk_type: Database["public"]["Enums"]["risk_type"]
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          title: string
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          account_name?: string | null
          audit_area?: string | null
          control_rating?:
            | Database["public"]["Enums"]["risk_rating_level"]
            | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          detection_rating?:
            | Database["public"]["Enums"]["risk_rating_level"]
            | null
          engagement_id?: string
          id?: string
          impact?: Database["public"]["Enums"]["risk_impact"] | null
          inherent_rating?:
            | Database["public"]["Enums"]["risk_rating_level"]
            | null
          is_significant?: boolean
          likelihood?: Database["public"]["Enums"]["risk_likelihood"] | null
          linked_assertion?:
            | Database["public"]["Enums"]["assertion_type"]
            | null
          organization_id?: string
          owner_id?: string | null
          rationale?: string | null
          residual_rating?:
            | Database["public"]["Enums"]["risk_rating_level"]
            | null
          risk_assessment_id?: string
          risk_category_id?: string | null
          risk_type?: Database["public"]["Enums"]["risk_type"]
          sort_order?: number
          status?: Database["public"]["Enums"]["record_status"]
          title?: string
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_register_items_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_register_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_register_items_risk_assessment_id_fkey"
            columns: ["risk_assessment_id"]
            isOneToOne: false
            referencedRelation: "risk_assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_register_items_risk_category_id_fkey"
            columns: ["risk_category_id"]
            isOneToOne: false
            referencedRelation: "risk_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_register_items_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_responses: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string
          engagement_id: string
          id: string
          organization_id: string
          response_type: Database["public"]["Enums"]["risk_response_type"]
          risk_assessment_id: string
          risk_register_item_id: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description: string
          engagement_id: string
          id?: string
          organization_id: string
          response_type: Database["public"]["Enums"]["risk_response_type"]
          risk_assessment_id: string
          risk_register_item_id: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string
          engagement_id?: string
          id?: string
          organization_id?: string
          response_type?: Database["public"]["Enums"]["risk_response_type"]
          risk_assessment_id?: string
          risk_register_item_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_responses_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_responses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_responses_risk_assessment_id_fkey"
            columns: ["risk_assessment_id"]
            isOneToOne: false
            referencedRelation: "risk_assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_responses_risk_register_item_id_fkey"
            columns: ["risk_register_item_id"]
            isOneToOne: false
            referencedRelation: "risk_register_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_responses_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          permission_id: string
          role_id: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          permission_id: string
          role_id: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          permission_id?: string
          role_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          id: string
          is_system: boolean
          name: string
          organization_id: string | null
          scope: Database["public"]["Enums"]["role_scope"]
          slug: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          id?: string
          is_system?: boolean
          name: string
          organization_id?: string | null
          scope: Database["public"]["Enums"]["role_scope"]
          slug: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          id?: string
          is_system?: boolean
          name?: string
          organization_id?: string | null
          scope?: Database["public"]["Enums"]["role_scope"]
          slug?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      trial_balance_activity: {
        Row: {
          action: string
          company_id: string
          created_at: string
          created_by: string | null
          engagement_id: string
          id: string
          metadata: Json
          organization_id: string
          package_id: string
          summary: string | null
          workspace_id: string
        }
        Insert: {
          action: string
          company_id: string
          created_at?: string
          created_by?: string | null
          engagement_id: string
          id?: string
          metadata?: Json
          organization_id: string
          package_id: string
          summary?: string | null
          workspace_id: string
        }
        Update: {
          action?: string
          company_id?: string
          created_at?: string
          created_by?: string | null
          engagement_id?: string
          id?: string
          metadata?: Json
          organization_id?: string
          package_id?: string
          summary?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trial_balance_activity_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_balance_activity_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_balance_activity_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_balance_activity_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "trial_balance_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_balance_activity_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      trial_balance_adjustments: {
        Row: {
          adjustment_status: Database["public"]["Enums"]["trial_balance_adjustment_status"]
          adjustment_type: Database["public"]["Enums"]["trial_balance_adjustment_type"]
          amount: number
          approved_at: string | null
          approved_by: string | null
          company_id: string
          created_at: string
          created_by: string | null
          credit_line_id: string | null
          currency_code: string | null
          debit_line_id: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string
          engagement_id: string
          id: string
          organization_id: string
          package_id: string
          posted_at: string | null
          posted_by: string | null
          preserves_source: boolean
          reason: string | null
          reference_code: string | null
          rejected_at: string | null
          rejected_by: string | null
          rejection_notes: string | null
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          adjustment_status?: Database["public"]["Enums"]["trial_balance_adjustment_status"]
          adjustment_type?: Database["public"]["Enums"]["trial_balance_adjustment_type"]
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          company_id: string
          created_at?: string
          created_by?: string | null
          credit_line_id?: string | null
          currency_code?: string | null
          debit_line_id?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description: string
          engagement_id: string
          id?: string
          organization_id: string
          package_id: string
          posted_at?: string | null
          posted_by?: string | null
          preserves_source?: boolean
          reason?: string | null
          reference_code?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_notes?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          adjustment_status?: Database["public"]["Enums"]["trial_balance_adjustment_status"]
          adjustment_type?: Database["public"]["Enums"]["trial_balance_adjustment_type"]
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          credit_line_id?: string | null
          currency_code?: string | null
          debit_line_id?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string
          engagement_id?: string
          id?: string
          organization_id?: string
          package_id?: string
          posted_at?: string | null
          posted_by?: string | null
          preserves_source?: boolean
          reason?: string | null
          reference_code?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_notes?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trial_balance_adjustments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_balance_adjustments_credit_line_id_fkey"
            columns: ["credit_line_id"]
            isOneToOne: false
            referencedRelation: "trial_balance_lines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_balance_adjustments_debit_line_id_fkey"
            columns: ["debit_line_id"]
            isOneToOne: false
            referencedRelation: "trial_balance_lines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_balance_adjustments_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_balance_adjustments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_balance_adjustments_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "trial_balance_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_balance_adjustments_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      trial_balance_lines: {
        Row: {
          account_code: string
          account_level: number
          account_name: string
          account_type: Database["public"]["Enums"]["trial_balance_account_type"]
          adjusted_closing_balance: number
          category: string | null
          classification_confidence: number
          closing_balance: number
          closing_credit: number
          closing_debit: number
          company_id: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          exchange_rate: number
          fs_statement: Database["public"]["Enums"]["trial_balance_fs_statement"]
          functional_amount: number
          fx_gain_loss: number
          id: string
          is_adjusted: boolean
          is_mapped: boolean
          is_material: boolean
          is_orphan: boolean
          lead_schedule: Database["public"]["Enums"]["trial_balance_lead_schedule"]
          metadata_json: Json
          movement_credit: number
          movement_debit: number
          opening_credit: number
          opening_debit: number
          organization_id: string
          original_currency: string | null
          package_id: string
          parent_line_id: string | null
          presentation_amount: number | null
          sort_order: number
          source_row_number: number | null
          status: Database["public"]["Enums"]["record_status"]
          subcategory: string | null
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          account_code: string
          account_level?: number
          account_name: string
          account_type?: Database["public"]["Enums"]["trial_balance_account_type"]
          adjusted_closing_balance?: number
          category?: string | null
          classification_confidence?: number
          closing_balance?: number
          closing_credit?: number
          closing_debit?: number
          company_id: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          exchange_rate?: number
          fs_statement?: Database["public"]["Enums"]["trial_balance_fs_statement"]
          functional_amount?: number
          fx_gain_loss?: number
          id?: string
          is_adjusted?: boolean
          is_mapped?: boolean
          is_material?: boolean
          is_orphan?: boolean
          lead_schedule?: Database["public"]["Enums"]["trial_balance_lead_schedule"]
          metadata_json?: Json
          movement_credit?: number
          movement_debit?: number
          opening_credit?: number
          opening_debit?: number
          organization_id: string
          original_currency?: string | null
          package_id: string
          parent_line_id?: string | null
          presentation_amount?: number | null
          sort_order?: number
          source_row_number?: number | null
          status?: Database["public"]["Enums"]["record_status"]
          subcategory?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          account_code?: string
          account_level?: number
          account_name?: string
          account_type?: Database["public"]["Enums"]["trial_balance_account_type"]
          adjusted_closing_balance?: number
          category?: string | null
          classification_confidence?: number
          closing_balance?: number
          closing_credit?: number
          closing_debit?: number
          company_id?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          exchange_rate?: number
          fs_statement?: Database["public"]["Enums"]["trial_balance_fs_statement"]
          functional_amount?: number
          fx_gain_loss?: number
          id?: string
          is_adjusted?: boolean
          is_mapped?: boolean
          is_material?: boolean
          is_orphan?: boolean
          lead_schedule?: Database["public"]["Enums"]["trial_balance_lead_schedule"]
          metadata_json?: Json
          movement_credit?: number
          movement_debit?: number
          opening_credit?: number
          opening_debit?: number
          organization_id?: string
          original_currency?: string | null
          package_id?: string
          parent_line_id?: string | null
          presentation_amount?: number | null
          sort_order?: number
          source_row_number?: number | null
          status?: Database["public"]["Enums"]["record_status"]
          subcategory?: string | null
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trial_balance_lines_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_balance_lines_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_balance_lines_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_balance_lines_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "trial_balance_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_balance_lines_parent_line_id_fkey"
            columns: ["parent_line_id"]
            isOneToOne: false
            referencedRelation: "trial_balance_lines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_balance_lines_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      trial_balance_mappings: {
        Row: {
          confidence: number
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          framework: Database["public"]["Enums"]["trial_balance_mapping_framework"]
          id: string
          is_manual: boolean
          line_id: string
          mapping_code: string | null
          mapping_label: string | null
          organization_id: string
          package_id: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          confidence?: number
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          framework?: Database["public"]["Enums"]["trial_balance_mapping_framework"]
          id?: string
          is_manual?: boolean
          line_id: string
          mapping_code?: string | null
          mapping_label?: string | null
          organization_id: string
          package_id: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          confidence?: number
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          framework?: Database["public"]["Enums"]["trial_balance_mapping_framework"]
          id?: string
          is_manual?: boolean
          line_id?: string
          mapping_code?: string | null
          mapping_label?: string | null
          organization_id?: string
          package_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trial_balance_mappings_line_id_fkey"
            columns: ["line_id"]
            isOneToOne: false
            referencedRelation: "trial_balance_lines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_balance_mappings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_balance_mappings_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "trial_balance_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_balance_mappings_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      trial_balance_packages: {
        Row: {
          account_count: number
          adjustment_count: number
          approved_at: string | null
          approved_by: string | null
          company_id: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          error_count: number
          fiscal_year: number
          functional_currency: string
          id: string
          import_session_id: string | null
          is_balanced: boolean
          locked_at: string | null
          locked_by: string | null
          mapped_count: number
          organization_id: string
          out_of_balance_amount: number
          package_status: Database["public"]["Enums"]["trial_balance_package_status"]
          package_version: number
          period_label: string
          period_type: Database["public"]["Enums"]["trial_balance_period_type"]
          presentation_currency: string | null
          return_notes: string | null
          returned_at: string | null
          returned_by: string | null
          rolled_forward_from_id: string | null
          status: Database["public"]["Enums"]["record_status"]
          submitted_at: string | null
          submitted_by: string | null
          summary_json: Json
          unmapped_count: number
          updated_at: string
          updated_by: string | null
          validation_json: Json
          version: number
          warning_count: number
          workspace_id: string
        }
        Insert: {
          account_count?: number
          adjustment_count?: number
          approved_at?: string | null
          approved_by?: string | null
          company_id: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          error_count?: number
          fiscal_year: number
          functional_currency?: string
          id?: string
          import_session_id?: string | null
          is_balanced?: boolean
          locked_at?: string | null
          locked_by?: string | null
          mapped_count?: number
          organization_id: string
          out_of_balance_amount?: number
          package_status?: Database["public"]["Enums"]["trial_balance_package_status"]
          package_version?: number
          period_label?: string
          period_type?: Database["public"]["Enums"]["trial_balance_period_type"]
          presentation_currency?: string | null
          return_notes?: string | null
          returned_at?: string | null
          returned_by?: string | null
          rolled_forward_from_id?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          summary_json?: Json
          unmapped_count?: number
          updated_at?: string
          updated_by?: string | null
          validation_json?: Json
          version?: number
          warning_count?: number
          workspace_id: string
        }
        Update: {
          account_count?: number
          adjustment_count?: number
          approved_at?: string | null
          approved_by?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          error_count?: number
          fiscal_year?: number
          functional_currency?: string
          id?: string
          import_session_id?: string | null
          is_balanced?: boolean
          locked_at?: string | null
          locked_by?: string | null
          mapped_count?: number
          organization_id?: string
          out_of_balance_amount?: number
          package_status?: Database["public"]["Enums"]["trial_balance_package_status"]
          package_version?: number
          period_label?: string
          period_type?: Database["public"]["Enums"]["trial_balance_period_type"]
          presentation_currency?: string | null
          return_notes?: string | null
          returned_at?: string | null
          returned_by?: string | null
          rolled_forward_from_id?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          summary_json?: Json
          unmapped_count?: number
          updated_at?: string
          updated_by?: string | null
          validation_json?: Json
          version?: number
          warning_count?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trial_balance_packages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_balance_packages_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_balance_packages_import_session_id_fkey"
            columns: ["import_session_id"]
            isOneToOne: false
            referencedRelation: "uaie_import_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_balance_packages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_balance_packages_rolled_forward_from_id_fkey"
            columns: ["rolled_forward_from_id"]
            isOneToOne: false
            referencedRelation: "trial_balance_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_balance_packages_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      trial_balance_periods: {
        Row: {
          created_at: string
          end_date: string | null
          fiscal_year: number
          id: string
          is_comparative: boolean
          organization_id: string
          package_id: string
          period_label: string
          period_type: Database["public"]["Enums"]["trial_balance_period_type"]
          sort_order: number
          start_date: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          fiscal_year: number
          id?: string
          is_comparative?: boolean
          organization_id: string
          package_id: string
          period_label: string
          period_type: Database["public"]["Enums"]["trial_balance_period_type"]
          sort_order?: number
          start_date?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          fiscal_year?: number
          id?: string
          is_comparative?: boolean
          organization_id?: string
          package_id?: string
          period_label?: string
          period_type?: Database["public"]["Enums"]["trial_balance_period_type"]
          sort_order?: number
          start_date?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trial_balance_periods_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_balance_periods_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "trial_balance_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_balance_periods_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      trial_balance_versions: {
        Row: {
          change_summary: string
          created_at: string
          created_by: string | null
          diff_json: Json
          id: string
          organization_id: string
          package_id: string
          snapshot_json: Json
          version_number: number
          workspace_id: string
        }
        Insert: {
          change_summary: string
          created_at?: string
          created_by?: string | null
          diff_json?: Json
          id?: string
          organization_id: string
          package_id: string
          snapshot_json?: Json
          version_number: number
          workspace_id: string
        }
        Update: {
          change_summary?: string
          created_at?: string
          created_by?: string | null
          diff_json?: Json
          id?: string
          organization_id?: string
          package_id?: string
          snapshot_json?: Json
          version_number?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trial_balance_versions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_balance_versions_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "trial_balance_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_balance_versions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      uaie_column_mappings: {
        Row: {
          canonical_field: Database["public"]["Enums"]["uaie_canonical_field"]
          company_id: string
          confidence: number
          created_at: string
          id: string
          import_session_id: string
          is_manual: boolean
          organization_id: string
          source_column_index: number
          source_header: string | null
          updated_at: string
          workspace_id: string
        }
        Insert: {
          canonical_field?: Database["public"]["Enums"]["uaie_canonical_field"]
          company_id: string
          confidence?: number
          created_at?: string
          id?: string
          import_session_id: string
          is_manual?: boolean
          organization_id: string
          source_column_index: number
          source_header?: string | null
          updated_at?: string
          workspace_id: string
        }
        Update: {
          canonical_field?: Database["public"]["Enums"]["uaie_canonical_field"]
          company_id?: string
          confidence?: number
          created_at?: string
          id?: string
          import_session_id?: string
          is_manual?: boolean
          organization_id?: string
          source_column_index?: number
          source_header?: string | null
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "uaie_column_mappings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_column_mappings_import_session_id_fkey"
            columns: ["import_session_id"]
            isOneToOne: false
            referencedRelation: "uaie_import_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_column_mappings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_column_mappings_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      uaie_dictionary_entries: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          canonical_field: Database["public"]["Enums"]["uaie_canonical_field"]
          company_id: string | null
          confidence: number
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          detected_erp: Database["public"]["Enums"]["uaie_erp_system"] | null
          entry_status: Database["public"]["Enums"]["uaie_dictionary_status"]
          id: string
          language_code: string | null
          merged_into_id: string | null
          normalized_value: string
          occurrences: number
          organization_id: string
          raw_value: string
          source: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          canonical_field: Database["public"]["Enums"]["uaie_canonical_field"]
          company_id?: string | null
          confidence?: number
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          detected_erp?: Database["public"]["Enums"]["uaie_erp_system"] | null
          entry_status?: Database["public"]["Enums"]["uaie_dictionary_status"]
          id?: string
          language_code?: string | null
          merged_into_id?: string | null
          normalized_value: string
          occurrences?: number
          organization_id: string
          raw_value: string
          source?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          canonical_field?: Database["public"]["Enums"]["uaie_canonical_field"]
          company_id?: string | null
          confidence?: number
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          detected_erp?: Database["public"]["Enums"]["uaie_erp_system"] | null
          entry_status?: Database["public"]["Enums"]["uaie_dictionary_status"]
          id?: string
          language_code?: string | null
          merged_into_id?: string | null
          normalized_value?: string
          occurrences?: number
          organization_id?: string
          raw_value?: string
          source?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "uaie_dictionary_entries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_dictionary_entries_merged_into_id_fkey"
            columns: ["merged_into_id"]
            isOneToOne: false
            referencedRelation: "uaie_dictionary_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_dictionary_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_dictionary_entries_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      uaie_fingerprints: {
        Row: {
          company_id: string | null
          confidence: number
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          detected_erp: Database["public"]["Enums"]["uaie_erp_system"]
          erp_hash: string | null
          header_hash: string | null
          id: string
          import_session_id: string | null
          layout_hash: string | null
          learning_score: number
          metadata_json: Json
          organization_id: string
          similarity_json: Json
          status: Database["public"]["Enums"]["record_status"]
          template_version: number
          updated_at: string
          updated_by: string | null
          version: number
          workbook_hash: string | null
          workspace_id: string
        }
        Insert: {
          company_id?: string | null
          confidence?: number
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          detected_erp?: Database["public"]["Enums"]["uaie_erp_system"]
          erp_hash?: string | null
          header_hash?: string | null
          id?: string
          import_session_id?: string | null
          layout_hash?: string | null
          learning_score?: number
          metadata_json?: Json
          organization_id: string
          similarity_json?: Json
          status?: Database["public"]["Enums"]["record_status"]
          template_version?: number
          updated_at?: string
          updated_by?: string | null
          version?: number
          workbook_hash?: string | null
          workspace_id: string
        }
        Update: {
          company_id?: string | null
          confidence?: number
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          detected_erp?: Database["public"]["Enums"]["uaie_erp_system"]
          erp_hash?: string | null
          header_hash?: string | null
          id?: string
          import_session_id?: string | null
          layout_hash?: string | null
          learning_score?: number
          metadata_json?: Json
          organization_id?: string
          similarity_json?: Json
          status?: Database["public"]["Enums"]["record_status"]
          template_version?: number
          updated_at?: string
          updated_by?: string | null
          version?: number
          workbook_hash?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "uaie_fingerprints_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_fingerprints_import_session_id_fkey"
            columns: ["import_session_id"]
            isOneToOne: false
            referencedRelation: "uaie_import_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_fingerprints_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_fingerprints_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      uaie_import_activity: {
        Row: {
          action: string
          company_id: string
          created_at: string
          created_by: string | null
          id: string
          import_session_id: string
          metadata: Json
          organization_id: string
          summary: string | null
          workspace_id: string
        }
        Insert: {
          action: string
          company_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          import_session_id: string
          metadata?: Json
          organization_id: string
          summary?: string | null
          workspace_id: string
        }
        Update: {
          action?: string
          company_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          import_session_id?: string
          metadata?: Json
          organization_id?: string
          summary?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "uaie_import_activity_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_import_activity_import_session_id_fkey"
            columns: ["import_session_id"]
            isOneToOne: false
            referencedRelation: "uaie_import_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_import_activity_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_import_activity_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      uaie_import_sessions: {
        Row: {
          company_id: string
          completed_at: string | null
          created_at: string
          created_by: string | null
          currency_confidence: number
          data_type: Database["public"]["Enums"]["uaie_data_type"]
          deleted_at: string | null
          deleted_by: string | null
          detected_currency: string | null
          detected_erp: Database["public"]["Enums"]["uaie_erp_system"]
          detected_language: string | null
          detection_json: Json
          engagement_id: string | null
          erp_confidence: number
          error_message: string | null
          header_hash: string | null
          health_json: Json
          id: string
          import_status: Database["public"]["Enums"]["uaie_import_status"]
          is_active: boolean
          language_confidence: number
          layout_fingerprint: string | null
          mapping_json: Json
          mapping_profile_id: string | null
          organization_id: string
          overall_confidence: number
          processing_ms: number | null
          selected_sheet_name: string | null
          sheet_confidence: number
          source_byte_size: number | null
          source_filename: string
          source_mime_type: string | null
          source_sha256: string | null
          source_storage_path: string | null
          started_at: string
          status: Database["public"]["Enums"]["record_status"]
          summary_json: Json
          updated_at: string
          updated_by: string | null
          validation_json: Json
          version: number
          version_number: number
          workbook_hash: string | null
          workspace_id: string
        }
        Insert: {
          company_id: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          currency_confidence?: number
          data_type?: Database["public"]["Enums"]["uaie_data_type"]
          deleted_at?: string | null
          deleted_by?: string | null
          detected_currency?: string | null
          detected_erp?: Database["public"]["Enums"]["uaie_erp_system"]
          detected_language?: string | null
          detection_json?: Json
          engagement_id?: string | null
          erp_confidence?: number
          error_message?: string | null
          header_hash?: string | null
          health_json?: Json
          id?: string
          import_status?: Database["public"]["Enums"]["uaie_import_status"]
          is_active?: boolean
          language_confidence?: number
          layout_fingerprint?: string | null
          mapping_json?: Json
          mapping_profile_id?: string | null
          organization_id: string
          overall_confidence?: number
          processing_ms?: number | null
          selected_sheet_name?: string | null
          sheet_confidence?: number
          source_byte_size?: number | null
          source_filename: string
          source_mime_type?: string | null
          source_sha256?: string | null
          source_storage_path?: string | null
          started_at?: string
          status?: Database["public"]["Enums"]["record_status"]
          summary_json?: Json
          updated_at?: string
          updated_by?: string | null
          validation_json?: Json
          version?: number
          version_number?: number
          workbook_hash?: string | null
          workspace_id: string
        }
        Update: {
          company_id?: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          currency_confidence?: number
          data_type?: Database["public"]["Enums"]["uaie_data_type"]
          deleted_at?: string | null
          deleted_by?: string | null
          detected_currency?: string | null
          detected_erp?: Database["public"]["Enums"]["uaie_erp_system"]
          detected_language?: string | null
          detection_json?: Json
          engagement_id?: string | null
          erp_confidence?: number
          error_message?: string | null
          header_hash?: string | null
          health_json?: Json
          id?: string
          import_status?: Database["public"]["Enums"]["uaie_import_status"]
          is_active?: boolean
          language_confidence?: number
          layout_fingerprint?: string | null
          mapping_json?: Json
          mapping_profile_id?: string | null
          organization_id?: string
          overall_confidence?: number
          processing_ms?: number | null
          selected_sheet_name?: string | null
          sheet_confidence?: number
          source_byte_size?: number | null
          source_filename?: string
          source_mime_type?: string | null
          source_sha256?: string | null
          source_storage_path?: string | null
          started_at?: string
          status?: Database["public"]["Enums"]["record_status"]
          summary_json?: Json
          updated_at?: string
          updated_by?: string | null
          validation_json?: Json
          version?: number
          version_number?: number
          workbook_hash?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "uaie_import_sessions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_import_sessions_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_import_sessions_mapping_profile_id_fkey"
            columns: ["mapping_profile_id"]
            isOneToOne: false
            referencedRelation: "uaie_mapping_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_import_sessions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_import_sessions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      uaie_intelligence_audit: {
        Row: {
          action_code: string
          actor_user_id: string | null
          after_json: Json | null
          before_json: Json | null
          company_id: string | null
          created_at: string
          id: string
          organization_id: string
          resource_id: string | null
          resource_type: string
          summary: string
          workspace_id: string
        }
        Insert: {
          action_code: string
          actor_user_id?: string | null
          after_json?: Json | null
          before_json?: Json | null
          company_id?: string | null
          created_at?: string
          id?: string
          organization_id: string
          resource_id?: string | null
          resource_type: string
          summary: string
          workspace_id: string
        }
        Update: {
          action_code?: string
          actor_user_id?: string | null
          after_json?: Json | null
          before_json?: Json | null
          company_id?: string | null
          created_at?: string
          id?: string
          organization_id?: string
          resource_id?: string | null
          resource_type?: string
          summary?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "uaie_intelligence_audit_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_intelligence_audit_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_intelligence_audit_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      uaie_learning_events: {
        Row: {
          actor_user_id: string | null
          company_id: string | null
          created_at: string
          event_type: Database["public"]["Enums"]["uaie_learning_event_type"]
          id: string
          import_session_id: string | null
          metadata_json: Json
          organization_id: string
          summary: string
          workspace_id: string
        }
        Insert: {
          actor_user_id?: string | null
          company_id?: string | null
          created_at?: string
          event_type: Database["public"]["Enums"]["uaie_learning_event_type"]
          id?: string
          import_session_id?: string | null
          metadata_json?: Json
          organization_id: string
          summary: string
          workspace_id: string
        }
        Update: {
          actor_user_id?: string | null
          company_id?: string | null
          created_at?: string
          event_type?: Database["public"]["Enums"]["uaie_learning_event_type"]
          id?: string
          import_session_id?: string | null
          metadata_json?: Json
          organization_id?: string
          summary?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "uaie_learning_events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_learning_events_import_session_id_fkey"
            columns: ["import_session_id"]
            isOneToOne: false
            referencedRelation: "uaie_import_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_learning_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_learning_events_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      uaie_mapping_profiles: {
        Row: {
          company_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          detected_erp: Database["public"]["Enums"]["uaie_erp_system"]
          header_hash: string | null
          id: string
          last_used_at: string | null
          layout_fingerprint: string | null
          mapping_json: Json
          organization_id: string
          profile_name: string
          status: Database["public"]["Enums"]["record_status"]
          success_count: number
          updated_at: string
          updated_by: string | null
          version: number
          workbook_hash: string | null
          workspace_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          detected_erp?: Database["public"]["Enums"]["uaie_erp_system"]
          header_hash?: string | null
          id?: string
          last_used_at?: string | null
          layout_fingerprint?: string | null
          mapping_json?: Json
          organization_id: string
          profile_name: string
          status?: Database["public"]["Enums"]["record_status"]
          success_count?: number
          updated_at?: string
          updated_by?: string | null
          version?: number
          workbook_hash?: string | null
          workspace_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          detected_erp?: Database["public"]["Enums"]["uaie_erp_system"]
          header_hash?: string | null
          id?: string
          last_used_at?: string | null
          layout_fingerprint?: string | null
          mapping_json?: Json
          organization_id?: string
          profile_name?: string
          status?: Database["public"]["Enums"]["record_status"]
          success_count?: number
          updated_at?: string
          updated_by?: string | null
          version?: number
          workbook_hash?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "uaie_mapping_profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_mapping_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_mapping_profiles_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      uaie_normalized_rows: {
        Row: {
          account_code: string | null
          account_name: string | null
          balance: number | null
          company_id: string
          cost_center: string | null
          created_at: string
          credit: number | null
          currency_code: string | null
          debit: number | null
          department: string | null
          id: string
          import_session_id: string
          is_valid: boolean
          organization_id: string
          row_number: number
          source_ref: string | null
          workspace_id: string
        }
        Insert: {
          account_code?: string | null
          account_name?: string | null
          balance?: number | null
          company_id: string
          cost_center?: string | null
          created_at?: string
          credit?: number | null
          currency_code?: string | null
          debit?: number | null
          department?: string | null
          id?: string
          import_session_id: string
          is_valid?: boolean
          organization_id: string
          row_number: number
          source_ref?: string | null
          workspace_id: string
        }
        Update: {
          account_code?: string | null
          account_name?: string | null
          balance?: number | null
          company_id?: string
          cost_center?: string | null
          created_at?: string
          credit?: number | null
          currency_code?: string | null
          debit?: number | null
          department?: string | null
          id?: string
          import_session_id?: string
          is_valid?: boolean
          organization_id?: string
          row_number?: number
          source_ref?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "uaie_normalized_rows_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_normalized_rows_import_session_id_fkey"
            columns: ["import_session_id"]
            isOneToOne: false
            referencedRelation: "uaie_import_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_normalized_rows_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_normalized_rows_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      uaie_sheet_scans: {
        Row: {
          column_count: number
          company_id: string
          created_at: string
          headers_json: Json
          id: string
          import_session_id: string
          is_selected: boolean
          organization_id: string
          preview_json: Json
          row_count: number
          score: number
          sheet_index: number
          sheet_name: string
          workspace_id: string
        }
        Insert: {
          column_count?: number
          company_id: string
          created_at?: string
          headers_json?: Json
          id?: string
          import_session_id: string
          is_selected?: boolean
          organization_id: string
          preview_json?: Json
          row_count?: number
          score?: number
          sheet_index?: number
          sheet_name: string
          workspace_id: string
        }
        Update: {
          column_count?: number
          company_id?: string
          created_at?: string
          headers_json?: Json
          id?: string
          import_session_id?: string
          is_selected?: boolean
          organization_id?: string
          preview_json?: Json
          row_count?: number
          score?: number
          sheet_index?: number
          sheet_name?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "uaie_sheet_scans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_sheet_scans_import_session_id_fkey"
            columns: ["import_session_id"]
            isOneToOne: false
            referencedRelation: "uaie_import_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_sheet_scans_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_sheet_scans_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      uaie_unknown_headers: {
        Row: {
          company_id: string | null
          confidence: number
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          detected_erp: Database["public"]["Enums"]["uaie_erp_system"] | null
          dictionary_entry_id: string | null
          first_seen_at: string
          id: string
          language_code: string | null
          last_seen_at: string
          last_session_id: string | null
          normalized_value: string
          occurrences: number
          organization_id: string
          raw_value: string
          status: Database["public"]["Enums"]["record_status"]
          suggested_field:
            | Database["public"]["Enums"]["uaie_canonical_field"]
            | null
          unknown_status: Database["public"]["Enums"]["uaie_unknown_status"]
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          company_id?: string | null
          confidence?: number
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          detected_erp?: Database["public"]["Enums"]["uaie_erp_system"] | null
          dictionary_entry_id?: string | null
          first_seen_at?: string
          id?: string
          language_code?: string | null
          last_seen_at?: string
          last_session_id?: string | null
          normalized_value: string
          occurrences?: number
          organization_id: string
          raw_value: string
          status?: Database["public"]["Enums"]["record_status"]
          suggested_field?:
            | Database["public"]["Enums"]["uaie_canonical_field"]
            | null
          unknown_status?: Database["public"]["Enums"]["uaie_unknown_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          company_id?: string | null
          confidence?: number
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          detected_erp?: Database["public"]["Enums"]["uaie_erp_system"] | null
          dictionary_entry_id?: string | null
          first_seen_at?: string
          id?: string
          language_code?: string | null
          last_seen_at?: string
          last_session_id?: string | null
          normalized_value?: string
          occurrences?: number
          organization_id?: string
          raw_value?: string
          status?: Database["public"]["Enums"]["record_status"]
          suggested_field?:
            | Database["public"]["Enums"]["uaie_canonical_field"]
            | null
          unknown_status?: Database["public"]["Enums"]["uaie_unknown_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "uaie_unknown_headers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_unknown_headers_dictionary_entry_id_fkey"
            columns: ["dictionary_entry_id"]
            isOneToOne: false
            referencedRelation: "uaie_dictionary_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_unknown_headers_last_session_id_fkey"
            columns: ["last_session_id"]
            isOneToOne: false
            referencedRelation: "uaie_import_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_unknown_headers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_unknown_headers_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      uaie_validation_issues: {
        Row: {
          account_code: string | null
          column_index: number | null
          company_id: string
          created_at: string
          id: string
          import_session_id: string
          issue_code: string
          message: string
          metadata: Json
          organization_id: string
          row_number: number | null
          severity: Database["public"]["Enums"]["uaie_issue_severity"]
          workspace_id: string
        }
        Insert: {
          account_code?: string | null
          column_index?: number | null
          company_id: string
          created_at?: string
          id?: string
          import_session_id: string
          issue_code: string
          message: string
          metadata?: Json
          organization_id: string
          row_number?: number | null
          severity?: Database["public"]["Enums"]["uaie_issue_severity"]
          workspace_id: string
        }
        Update: {
          account_code?: string | null
          column_index?: number | null
          company_id?: string
          created_at?: string
          id?: string
          import_session_id?: string
          issue_code?: string
          message?: string
          metadata?: Json
          organization_id?: string
          row_number?: number | null
          severity?: Database["public"]["Enums"]["uaie_issue_severity"]
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "uaie_validation_issues_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_validation_issues_import_session_id_fkey"
            columns: ["import_session_id"]
            isOneToOne: false
            referencedRelation: "uaie_import_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_validation_issues_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uaie_validation_issues_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      working_paper_sign_offs: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          id: string
          note: string | null
          organization_id: string
          sign_off_role: string
          signed_at: string
          signed_by: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
          version_number: number
          working_paper_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          id?: string
          note?: string | null
          organization_id: string
          sign_off_role: string
          signed_at?: string
          signed_by: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          version_number: number
          working_paper_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          id?: string
          note?: string | null
          organization_id?: string
          sign_off_role?: string
          signed_at?: string
          signed_by?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          version_number?: number
          working_paper_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "working_paper_sign_offs_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "working_paper_sign_offs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "working_paper_sign_offs_working_paper_id_fkey"
            columns: ["working_paper_id"]
            isOneToOne: false
            referencedRelation: "working_papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "working_paper_sign_offs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      working_paper_versions: {
        Row: {
          change_summary: string | null
          content_notes: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          id: string
          organization_id: string
          paper_status: Database["public"]["Enums"]["working_paper_status"]
          status: Database["public"]["Enums"]["record_status"]
          tickmarks: Json
          title: string
          updated_at: string
          updated_by: string | null
          version: number
          version_number: number
          working_paper_id: string
          workspace_id: string
        }
        Insert: {
          change_summary?: string | null
          content_notes?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          id?: string
          organization_id: string
          paper_status: Database["public"]["Enums"]["working_paper_status"]
          status?: Database["public"]["Enums"]["record_status"]
          tickmarks?: Json
          title: string
          updated_at?: string
          updated_by?: string | null
          version?: number
          version_number: number
          working_paper_id: string
          workspace_id: string
        }
        Update: {
          change_summary?: string | null
          content_notes?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          id?: string
          organization_id?: string
          paper_status?: Database["public"]["Enums"]["working_paper_status"]
          status?: Database["public"]["Enums"]["record_status"]
          tickmarks?: Json
          title?: string
          updated_at?: string
          updated_by?: string | null
          version?: number
          version_number?: number
          working_paper_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "working_paper_versions_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "working_paper_versions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "working_paper_versions_working_paper_id_fkey"
            columns: ["working_paper_id"]
            isOneToOne: false
            referencedRelation: "working_papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "working_paper_versions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      working_papers: {
        Row: {
          assigned_auditor_id: string | null
          audit_procedure_id: string
          clearance_notes: string | null
          cleared_at: string | null
          cleared_by: string | null
          content_notes: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          engagement_id: string
          fieldwork_package_id: string
          id: string
          organization_id: string
          paper_status: Database["public"]["Enums"]["working_paper_status"]
          reference_code: string | null
          return_notes: string | null
          returned_at: string | null
          returned_by: string | null
          status: Database["public"]["Enums"]["record_status"]
          submitted_at: string | null
          submitted_by: string | null
          tickmarks: Json
          title: string
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          assigned_auditor_id?: string | null
          audit_procedure_id: string
          clearance_notes?: string | null
          cleared_at?: string | null
          cleared_by?: string | null
          content_notes?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id: string
          fieldwork_package_id: string
          id?: string
          organization_id: string
          paper_status?: Database["public"]["Enums"]["working_paper_status"]
          reference_code?: string | null
          return_notes?: string | null
          returned_at?: string | null
          returned_by?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          tickmarks?: Json
          title: string
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          assigned_auditor_id?: string | null
          audit_procedure_id?: string
          clearance_notes?: string | null
          cleared_at?: string | null
          cleared_by?: string | null
          content_notes?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engagement_id?: string
          fieldwork_package_id?: string
          id?: string
          organization_id?: string
          paper_status?: Database["public"]["Enums"]["working_paper_status"]
          reference_code?: string | null
          return_notes?: string | null
          returned_at?: string | null
          returned_by?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          tickmarks?: Json
          title?: string
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "working_papers_audit_procedure_id_fkey"
            columns: ["audit_procedure_id"]
            isOneToOne: false
            referencedRelation: "audit_procedures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "working_papers_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "working_papers_fieldwork_package_id_fkey"
            columns: ["fieldwork_package_id"]
            isOneToOne: false
            referencedRelation: "fieldwork_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "working_papers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "working_papers_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_settings: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          settings: Json
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
          workspace_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          settings?: Json
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          settings?: Json
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_settings_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: true
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          id: string
          name: string
          organization_id: string
          slug: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          version: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          id?: string
          name: string
          organization_id: string
          slug: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          id?: string
          name?: string
          organization_id?: string
          slug?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "workspaces_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auth_user_id: { Args: never; Returns: string }
      current_organization_id: { Args: never; Returns: string }
      current_user_id: { Args: never; Returns: string }
      current_workspace_id: { Args: never; Returns: string }
      default_company_settings: { Args: never; Returns: Json }
      default_organization_settings: { Args: never; Returns: Json }
      default_workspace_settings: { Args: never; Returns: Json }
      has_permission: { Args: { permission_code: string }; Returns: boolean }
      has_workspace_permission: {
        Args: { permission_code: string; target_workspace_id: string }
        Returns: boolean
      }
      is_active_record: {
        Args: { row_deleted_at: string; row_status?: string }
        Returns: boolean
      }
      is_nonempty_text: { Args: { value: string }; Returns: boolean }
      is_not_deleted: { Args: { row_deleted_at: string }; Returns: boolean }
      is_organization_member: {
        Args: { target_organization_id: string }
        Returns: boolean
      }
      is_service_role: { Args: never; Returns: boolean }
      is_valid_uuid: { Args: { value: string }; Returns: boolean }
      is_workspace_member: {
        Args: { target_workspace_id: string }
        Returns: boolean
      }
      jsonb_is_object: { Args: { value: Json }; Returns: boolean }
      jsonb_merge: { Args: { base: Json; patch: Json }; Returns: Json }
      policy_workspace_read: {
        Args: { target_workspace_id: string }
        Returns: boolean
      }
      policy_workspace_write: {
        Args: { target_workspace_id: string }
        Returns: boolean
      }
      simple_search_vector: { Args: { value: string }; Returns: unknown }
      storage_object_belongs_to_workspace: {
        Args: { object_name: string; target_workspace_id: string }
        Returns: boolean
      }
      user_belongs_to_organization: {
        Args: { target_organization_id: string }
        Returns: boolean
      }
      user_belongs_to_workspace: {
        Args: { target_workspace_id: string }
        Returns: boolean
      }
      user_can_access_audit_plan: {
        Args: { target_audit_plan_id: string }
        Returns: boolean
      }
      user_can_access_completion_package: {
        Args: { target_completion_package_id: string }
        Returns: boolean
      }
      user_can_access_engagement: {
        Args: { target_engagement_id: string }
        Returns: boolean
      }
      user_can_access_fieldwork_package: {
        Args: { target_fieldwork_package_id: string }
        Returns: boolean
      }
      user_can_access_financial_statement_package: {
        Args: { target_financial_statement_package_id: string }
        Returns: boolean
      }
      user_can_access_materiality_package: {
        Args: { target_materiality_package_id: string }
        Returns: boolean
      }
      user_can_access_opinion_package: {
        Args: { target_opinion_package_id: string }
        Returns: boolean
      }
      user_can_access_organization: {
        Args: { target_organization_id: string }
        Returns: boolean
      }
      user_can_access_reporting_package: {
        Args: { target_reporting_package_id: string }
        Returns: boolean
      }
      user_can_access_review_package: {
        Args: { target_review_package_id: string }
        Returns: boolean
      }
      user_can_access_risk_assessment: {
        Args: { target_risk_assessment_id: string }
        Returns: boolean
      }
      user_can_access_trial_balance_package: {
        Args: { target_package_id: string }
        Returns: boolean
      }
      user_can_access_uaie_session: {
        Args: { target_session_id: string }
        Returns: boolean
      }
      user_can_access_workspace: {
        Args: { target_workspace_id: string }
        Returns: boolean
      }
      user_organization_ids: { Args: never; Returns: string[] }
      user_workspace_ids: { Args: never; Returns: string[] }
      utc_now: { Args: never; Returns: string }
    }
    Enums: {
      assertion_type:
        | "existence"
        | "completeness"
        | "accuracy"
        | "cutoff"
        | "classification"
        | "presentation"
      audit_program_status:
        | "draft"
        | "approved"
        | "in_execution"
        | "substantially_complete"
        | "superseded"
      completion_comment_type: "completion" | "reviewer" | "internal"
      completion_item_status:
        | "pending"
        | "under_review"
        | "returned"
        | "resolved"
      completion_item_type:
        | "checklist"
        | "outstanding_item"
        | "management_letter"
        | "subsequent_events"
        | "going_concern"
        | "representation_letter"
        | "final_analytics"
      completion_package_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "returned"
        | "approved"
        | "archived"
      engagement_lifecycle_status:
        | "draft"
        | "planning"
        | "fieldwork"
        | "review"
        | "completed"
        | "closed"
      engagement_member_role:
        | "engagement_partner"
        | "engagement_manager"
        | "senior"
        | "staff"
        | "reviewer"
        | "observer"
      engagement_type:
        | "statutory_audit"
        | "review"
        | "agreed_upon_procedures"
        | "advisory"
        | "other"
      fieldwork_evidence_status:
        | "pending"
        | "recorded"
        | "verified"
        | "archived"
      fieldwork_finding_status: "open" | "in_review" | "resolved" | "closed"
      fieldwork_note_type: "auditor" | "review" | "internal" | "clearance"
      fieldwork_package_status:
        | "not_started"
        | "in_progress"
        | "substantially_complete"
        | "archived"
      financial_statement_comment_type:
        | "financial_statement"
        | "reviewer"
        | "internal"
      financial_statement_export_status:
        | "pending"
        | "ready"
        | "blocked"
        | "archived"
      financial_statement_line_kind:
        | "header"
        | "line"
        | "subtotal"
        | "total"
        | "spacer"
      financial_statement_package_status:
        | "draft"
        | "prepared"
        | "submitted"
        | "under_review"
        | "returned"
        | "approved"
        | "published"
        | "archived"
      financial_statement_section_status:
        | "pending"
        | "under_review"
        | "returned"
        | "resolved"
      financial_statement_section_type:
        | "balance_sheet"
        | "income_statement"
        | "cash_flow_statement"
        | "changes_in_equity"
        | "notes_links"
        | "cross_references"
      fs_account_classification:
        | "assets"
        | "current_assets"
        | "non_current_assets"
        | "liabilities"
        | "current_liabilities"
        | "non_current_liabilities"
        | "equity"
        | "revenue"
        | "cost_of_sales"
        | "operating_expenses"
        | "finance_costs"
        | "tax"
        | "oci"
        | "cash_flow"
        | "unclassified"
      fs_aggregation_method:
        | "sum"
        | "subtract"
        | "average"
        | "ratio"
        | "running_total"
        | "weighted"
        | "formula"
      fs_comparative_period: "current_year" | "previous_year" | "multi_year"
      fs_mapping_history_action:
        | "created"
        | "updated"
        | "validated"
        | "approved"
        | "published"
        | "archived"
        | "rolled_back"
        | "rule_added"
        | "rule_updated"
        | "rule_removed"
        | "line_mapped"
        | "line_unmapped"
        | "classified"
        | "aggregated"
        | "dataset_built"
      fs_mapping_rule_type:
        | "one_to_one"
        | "many_to_one"
        | "one_to_many"
        | "formula"
        | "calculated"
        | "conditional"
      fs_mapping_set_status:
        | "draft"
        | "validated"
        | "approved"
        | "published"
        | "archived"
      fs_mapping_standard: "ifrs" | "sme_ifrs" | "local_gaap" | "custom"
      fs_mapping_version_status: "draft" | "published" | "archived"
      fs_render_comparative_mode:
        | "current_period"
        | "previous_period"
        | "multi_year"
      fs_render_history_action:
        | "created"
        | "updated"
        | "validated"
        | "approved"
        | "published"
        | "archived"
        | "rolled_back"
        | "layout_changed"
        | "presentation_changed"
        | "rendered"
        | "revalidated"
      fs_render_layout_mode:
        | "collapsed"
        | "expanded"
        | "tree"
        | "grouped"
        | "flat"
      fs_render_line_style:
        | "normal"
        | "subtotal"
        | "total"
        | "double_total"
        | "bold"
        | "hidden"
        | "calculated"
        | "reference"
        | "cross_reference"
      fs_render_presentation_status:
        | "draft"
        | "validated"
        | "approved"
        | "published"
        | "archived"
      fs_render_standard: "ifrs" | "sme_ifrs" | "local_gaap" | "custom"
      fs_render_statement_type:
        | "statement_of_financial_position"
        | "statement_of_profit_or_loss"
        | "statement_of_comprehensive_income"
        | "statement_of_changes_in_equity"
        | "statement_of_cash_flows"
      fs_render_version_status: "draft" | "published" | "archived"
      fs_statement_section:
        | "statement_of_financial_position"
        | "statement_of_profit_or_loss"
        | "statement_of_comprehensive_income"
        | "statement_of_changes_in_equity"
        | "statement_of_cash_flows"
        | "other"
      ifrs_disclosure_kind: "mandatory" | "conditional" | "optional" | "custom"
      ifrs_note_history_action:
        | "created"
        | "updated"
        | "validated"
        | "submitted_review"
        | "manager_approved"
        | "partner_approved"
        | "approved"
        | "published"
        | "archived"
        | "rolled_back"
        | "comment_added"
        | "section_added"
        | "item_updated"
        | "cross_reference_added"
        | "rebuilt"
      ifrs_note_item_kind:
        | "section"
        | "subsection"
        | "paragraph"
        | "table"
        | "list"
        | "cross_reference"
        | "attachment"
      ifrs_note_package_status:
        | "draft"
        | "validated"
        | "in_review"
        | "manager_review"
        | "partner_review"
        | "approved"
        | "published"
        | "archived"
      ifrs_note_standard: "ifrs" | "ias" | "ifric" | "sic" | "sme_ifrs"
      ifrs_note_type:
        | "accounting_policies"
        | "judgements"
        | "estimates"
        | "property_plant_equipment"
        | "intangible_assets"
        | "inventories"
        | "receivables"
        | "cash"
        | "borrowings"
        | "leases"
        | "revenue"
        | "expenses"
        | "tax"
        | "deferred_tax"
        | "employee_benefits"
        | "share_capital"
        | "financial_instruments"
        | "related_parties"
        | "events_after_reporting_period"
        | "going_concern"
        | "commitments"
        | "contingencies"
        | "segment_reporting"
        | "other_notes"
      ifrs_note_version_status:
        | "draft"
        | "in_review"
        | "approved"
        | "published"
        | "archived"
      integration_readiness_status:
        | "not_configured"
        | "placeholder"
        | "integrated"
      materiality_benchmark_type:
        | "revenue"
        | "profit_before_tax"
        | "ebitda"
        | "total_assets"
        | "equity"
        | "expenses"
        | "manual"
      materiality_calculation_type:
        | "overall"
        | "performance"
        | "specific"
        | "trivial"
      materiality_comment_type: "review" | "internal"
      materiality_package_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "returned"
        | "approved"
        | "archived"
      membership_scope: "organization" | "workspace"
      opinion_comment_type: "opinion" | "reviewer" | "internal"
      opinion_package_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "returned"
        | "approved"
        | "archived"
      opinion_section_status:
        | "pending"
        | "under_review"
        | "returned"
        | "resolved"
      opinion_section_type:
        | "opinion_type"
        | "basis_for_opinion"
        | "key_audit_matters"
        | "emphasis_of_matter"
        | "other_information"
        | "responsibilities"
        | "signature"
      opinion_type: "unqualified" | "qualified" | "adverse" | "disclaimer"
      permission_scope: "platform" | "organization" | "workspace" | "company"
      planning_status:
        | "not_started"
        | "in_progress"
        | "pending_review"
        | "returned"
        | "approved"
        | "superseded"
      procedure_status:
        | "not_started"
        | "in_progress"
        | "pending_evidence"
        | "submitted_for_review"
        | "review_in_progress"
        | "returned"
        | "review_cleared"
        | "complete"
        | "blocked"
        | "deferred"
      procedure_type:
        | "test_of_controls"
        | "substantive"
        | "analytical"
        | "sampling"
        | "inquiry"
        | "observation"
        | "inspection"
        | "reperformance"
      record_status: "active" | "inactive" | "archived" | "suspended"
      report_comment_type: "reporting" | "reviewer" | "internal"
      report_section_status:
        | "pending"
        | "under_review"
        | "returned"
        | "resolved"
      report_section_type:
        | "executive_summary"
        | "financial_statements"
        | "ifrs_notes"
        | "management_letter"
        | "audit_findings"
        | "recommendations"
        | "appendices"
      reporting_package_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "returned"
        | "approved"
        | "archived"
      review_comment_type: "review" | "reviewer" | "internal"
      review_item_status: "pending" | "under_review" | "returned" | "resolved"
      review_package_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "returned"
        | "approved"
        | "archived"
      review_source_module:
        | "planning"
        | "materiality"
        | "risk_assessment"
        | "fieldwork"
      risk_assessment_status:
        | "not_started"
        | "in_progress"
        | "submitted"
        | "under_review"
        | "approved"
        | "archived"
      risk_impact: "low" | "moderate" | "high"
      risk_likelihood: "low" | "moderate" | "high"
      risk_note_type: "review" | "internal"
      risk_rating_level: "low" | "moderate" | "high" | "significant"
      risk_response_type:
        | "accept"
        | "reduce"
        | "transfer"
        | "avoid"
        | "substantive_procedures"
        | "test_of_controls"
      risk_type:
        | "inherent"
        | "control"
        | "detection"
        | "fraud"
        | "it"
        | "compliance"
        | "financial_statement"
        | "assertion"
        | "significant"
      role_scope: "platform" | "organization" | "workspace"
      trial_balance_account_type:
        | "asset"
        | "liability"
        | "equity"
        | "revenue"
        | "expense"
        | "other_income"
        | "other_expense"
        | "oci"
        | "unknown"
      trial_balance_adjustment_status:
        | "draft"
        | "proposed"
        | "approved"
        | "rejected"
        | "posted"
        | "reversed"
      trial_balance_adjustment_type:
        | "adjustment"
        | "journal_entry"
        | "reclassification"
        | "correction"
        | "audit_entry"
        | "proposed"
        | "approved_entry"
        | "rejected_entry"
      trial_balance_fs_statement:
        | "statement_of_financial_position"
        | "statement_of_profit_or_loss"
        | "oci"
        | "cash_flow"
        | "equity"
        | "notes"
        | "unmapped"
      trial_balance_lead_schedule:
        | "cash"
        | "receivables"
        | "inventory"
        | "ppe"
        | "payables"
        | "loans"
        | "revenue"
        | "expenses"
        | "equity"
        | "other"
        | "unmapped"
      trial_balance_mapping_framework:
        | "ifrs"
        | "ias"
        | "local_gaap"
        | "company"
        | "ai_future"
      trial_balance_package_status:
        | "draft"
        | "validated"
        | "submitted"
        | "under_review"
        | "returned"
        | "approved"
        | "locked"
        | "archived"
      trial_balance_period_type:
        | "opening"
        | "current"
        | "closing"
        | "monthly"
        | "quarterly"
        | "yearly"
        | "comparative"
        | "prior_year"
      uaie_canonical_field:
        | "account_code"
        | "account_name"
        | "debit"
        | "credit"
        | "balance"
        | "currency"
        | "department"
        | "cost_center"
        | "ignore"
      uaie_data_type:
        | "trial_balance"
        | "general_ledger"
        | "chart_of_accounts"
        | "supporting_schedule"
        | "unknown"
      uaie_dictionary_status:
        | "pending"
        | "approved"
        | "rejected"
        | "merged"
        | "disabled"
        | "deleted"
      uaie_erp_system:
        | "sap"
        | "sap_business_one"
        | "oracle"
        | "oracle_netsuite"
        | "microsoft_dynamics"
        | "dynamics_365"
        | "1c"
        | "logo"
        | "netsis"
        | "mikro"
        | "quickbooks"
        | "xero"
        | "sage"
        | "zoho_books"
        | "odoo"
        | "manual_excel"
        | "unknown"
      uaie_import_status:
        | "uploaded"
        | "scanning"
        | "mapping_required"
        | "mapped"
        | "validating"
        | "validated"
        | "staged"
        | "failed"
        | "cancelled"
        | "superseded"
        | "archived"
      uaie_issue_severity: "info" | "warning" | "error" | "blocking"
      uaie_learning_event_type:
        | "mapping_approved"
        | "mapping_rejected"
        | "header_learned"
        | "unknown_approved"
        | "unknown_rejected"
        | "unknown_ignored"
        | "dictionary_merged"
        | "dictionary_disabled"
        | "dictionary_restored"
        | "fingerprint_recorded"
        | "template_promoted"
        | "template_rolled_back"
        | "erp_detected"
        | "import_staged"
        | "admin_export"
        | "admin_import"
      uaie_unknown_status:
        | "open"
        | "suggested"
        | "approved"
        | "rejected"
        | "ignored"
        | "merged"
      working_paper_status:
        | "draft"
        | "in_progress"
        | "submitted"
        | "under_review"
        | "returned"
        | "cleared"
        | "complete"
        | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      assertion_type: [
        "existence",
        "completeness",
        "accuracy",
        "cutoff",
        "classification",
        "presentation",
      ],
      audit_program_status: [
        "draft",
        "approved",
        "in_execution",
        "substantially_complete",
        "superseded",
      ],
      completion_comment_type: ["completion", "reviewer", "internal"],
      completion_item_status: [
        "pending",
        "under_review",
        "returned",
        "resolved",
      ],
      completion_item_type: [
        "checklist",
        "outstanding_item",
        "management_letter",
        "subsequent_events",
        "going_concern",
        "representation_letter",
        "final_analytics",
      ],
      completion_package_status: [
        "draft",
        "submitted",
        "under_review",
        "returned",
        "approved",
        "archived",
      ],
      engagement_lifecycle_status: [
        "draft",
        "planning",
        "fieldwork",
        "review",
        "completed",
        "closed",
      ],
      engagement_member_role: [
        "engagement_partner",
        "engagement_manager",
        "senior",
        "staff",
        "reviewer",
        "observer",
      ],
      engagement_type: [
        "statutory_audit",
        "review",
        "agreed_upon_procedures",
        "advisory",
        "other",
      ],
      fieldwork_evidence_status: [
        "pending",
        "recorded",
        "verified",
        "archived",
      ],
      fieldwork_finding_status: ["open", "in_review", "resolved", "closed"],
      fieldwork_note_type: ["auditor", "review", "internal", "clearance"],
      fieldwork_package_status: [
        "not_started",
        "in_progress",
        "substantially_complete",
        "archived",
      ],
      financial_statement_comment_type: [
        "financial_statement",
        "reviewer",
        "internal",
      ],
      financial_statement_export_status: [
        "pending",
        "ready",
        "blocked",
        "archived",
      ],
      financial_statement_line_kind: [
        "header",
        "line",
        "subtotal",
        "total",
        "spacer",
      ],
      financial_statement_package_status: [
        "draft",
        "prepared",
        "submitted",
        "under_review",
        "returned",
        "approved",
        "published",
        "archived",
      ],
      financial_statement_section_status: [
        "pending",
        "under_review",
        "returned",
        "resolved",
      ],
      financial_statement_section_type: [
        "balance_sheet",
        "income_statement",
        "cash_flow_statement",
        "changes_in_equity",
        "notes_links",
        "cross_references",
      ],
      fs_account_classification: [
        "assets",
        "current_assets",
        "non_current_assets",
        "liabilities",
        "current_liabilities",
        "non_current_liabilities",
        "equity",
        "revenue",
        "cost_of_sales",
        "operating_expenses",
        "finance_costs",
        "tax",
        "oci",
        "cash_flow",
        "unclassified",
      ],
      fs_aggregation_method: [
        "sum",
        "subtract",
        "average",
        "ratio",
        "running_total",
        "weighted",
        "formula",
      ],
      fs_comparative_period: ["current_year", "previous_year", "multi_year"],
      fs_mapping_history_action: [
        "created",
        "updated",
        "validated",
        "approved",
        "published",
        "archived",
        "rolled_back",
        "rule_added",
        "rule_updated",
        "rule_removed",
        "line_mapped",
        "line_unmapped",
        "classified",
        "aggregated",
        "dataset_built",
      ],
      fs_mapping_rule_type: [
        "one_to_one",
        "many_to_one",
        "one_to_many",
        "formula",
        "calculated",
        "conditional",
      ],
      fs_mapping_set_status: [
        "draft",
        "validated",
        "approved",
        "published",
        "archived",
      ],
      fs_mapping_standard: ["ifrs", "sme_ifrs", "local_gaap", "custom"],
      fs_mapping_version_status: ["draft", "published", "archived"],
      fs_render_comparative_mode: [
        "current_period",
        "previous_period",
        "multi_year",
      ],
      fs_render_history_action: [
        "created",
        "updated",
        "validated",
        "approved",
        "published",
        "archived",
        "rolled_back",
        "layout_changed",
        "presentation_changed",
        "rendered",
        "revalidated",
      ],
      fs_render_layout_mode: [
        "collapsed",
        "expanded",
        "tree",
        "grouped",
        "flat",
      ],
      fs_render_line_style: [
        "normal",
        "subtotal",
        "total",
        "double_total",
        "bold",
        "hidden",
        "calculated",
        "reference",
        "cross_reference",
      ],
      fs_render_presentation_status: [
        "draft",
        "validated",
        "approved",
        "published",
        "archived",
      ],
      fs_render_standard: ["ifrs", "sme_ifrs", "local_gaap", "custom"],
      fs_render_statement_type: [
        "statement_of_financial_position",
        "statement_of_profit_or_loss",
        "statement_of_comprehensive_income",
        "statement_of_changes_in_equity",
        "statement_of_cash_flows",
      ],
      fs_render_version_status: ["draft", "published", "archived"],
      fs_statement_section: [
        "statement_of_financial_position",
        "statement_of_profit_or_loss",
        "statement_of_comprehensive_income",
        "statement_of_changes_in_equity",
        "statement_of_cash_flows",
        "other",
      ],
      ifrs_disclosure_kind: ["mandatory", "conditional", "optional", "custom"],
      ifrs_note_history_action: [
        "created",
        "updated",
        "validated",
        "submitted_review",
        "manager_approved",
        "partner_approved",
        "approved",
        "published",
        "archived",
        "rolled_back",
        "comment_added",
        "section_added",
        "item_updated",
        "cross_reference_added",
        "rebuilt",
      ],
      ifrs_note_item_kind: [
        "section",
        "subsection",
        "paragraph",
        "table",
        "list",
        "cross_reference",
        "attachment",
      ],
      ifrs_note_package_status: [
        "draft",
        "validated",
        "in_review",
        "manager_review",
        "partner_review",
        "approved",
        "published",
        "archived",
      ],
      ifrs_note_standard: ["ifrs", "ias", "ifric", "sic", "sme_ifrs"],
      ifrs_note_type: [
        "accounting_policies",
        "judgements",
        "estimates",
        "property_plant_equipment",
        "intangible_assets",
        "inventories",
        "receivables",
        "cash",
        "borrowings",
        "leases",
        "revenue",
        "expenses",
        "tax",
        "deferred_tax",
        "employee_benefits",
        "share_capital",
        "financial_instruments",
        "related_parties",
        "events_after_reporting_period",
        "going_concern",
        "commitments",
        "contingencies",
        "segment_reporting",
        "other_notes",
      ],
      ifrs_note_version_status: [
        "draft",
        "in_review",
        "approved",
        "published",
        "archived",
      ],
      integration_readiness_status: [
        "not_configured",
        "placeholder",
        "integrated",
      ],
      materiality_benchmark_type: [
        "revenue",
        "profit_before_tax",
        "ebitda",
        "total_assets",
        "equity",
        "expenses",
        "manual",
      ],
      materiality_calculation_type: [
        "overall",
        "performance",
        "specific",
        "trivial",
      ],
      materiality_comment_type: ["review", "internal"],
      materiality_package_status: [
        "draft",
        "submitted",
        "under_review",
        "returned",
        "approved",
        "archived",
      ],
      membership_scope: ["organization", "workspace"],
      opinion_comment_type: ["opinion", "reviewer", "internal"],
      opinion_package_status: [
        "draft",
        "submitted",
        "under_review",
        "returned",
        "approved",
        "archived",
      ],
      opinion_section_status: [
        "pending",
        "under_review",
        "returned",
        "resolved",
      ],
      opinion_section_type: [
        "opinion_type",
        "basis_for_opinion",
        "key_audit_matters",
        "emphasis_of_matter",
        "other_information",
        "responsibilities",
        "signature",
      ],
      opinion_type: ["unqualified", "qualified", "adverse", "disclaimer"],
      permission_scope: ["platform", "organization", "workspace", "company"],
      planning_status: [
        "not_started",
        "in_progress",
        "pending_review",
        "returned",
        "approved",
        "superseded",
      ],
      procedure_status: [
        "not_started",
        "in_progress",
        "pending_evidence",
        "submitted_for_review",
        "review_in_progress",
        "returned",
        "review_cleared",
        "complete",
        "blocked",
        "deferred",
      ],
      procedure_type: [
        "test_of_controls",
        "substantive",
        "analytical",
        "sampling",
        "inquiry",
        "observation",
        "inspection",
        "reperformance",
      ],
      record_status: ["active", "inactive", "archived", "suspended"],
      report_comment_type: ["reporting", "reviewer", "internal"],
      report_section_status: [
        "pending",
        "under_review",
        "returned",
        "resolved",
      ],
      report_section_type: [
        "executive_summary",
        "financial_statements",
        "ifrs_notes",
        "management_letter",
        "audit_findings",
        "recommendations",
        "appendices",
      ],
      reporting_package_status: [
        "draft",
        "submitted",
        "under_review",
        "returned",
        "approved",
        "archived",
      ],
      review_comment_type: ["review", "reviewer", "internal"],
      review_item_status: ["pending", "under_review", "returned", "resolved"],
      review_package_status: [
        "draft",
        "submitted",
        "under_review",
        "returned",
        "approved",
        "archived",
      ],
      review_source_module: [
        "planning",
        "materiality",
        "risk_assessment",
        "fieldwork",
      ],
      risk_assessment_status: [
        "not_started",
        "in_progress",
        "submitted",
        "under_review",
        "approved",
        "archived",
      ],
      risk_impact: ["low", "moderate", "high"],
      risk_likelihood: ["low", "moderate", "high"],
      risk_note_type: ["review", "internal"],
      risk_rating_level: ["low", "moderate", "high", "significant"],
      risk_response_type: [
        "accept",
        "reduce",
        "transfer",
        "avoid",
        "substantive_procedures",
        "test_of_controls",
      ],
      risk_type: [
        "inherent",
        "control",
        "detection",
        "fraud",
        "it",
        "compliance",
        "financial_statement",
        "assertion",
        "significant",
      ],
      role_scope: ["platform", "organization", "workspace"],
      trial_balance_account_type: [
        "asset",
        "liability",
        "equity",
        "revenue",
        "expense",
        "other_income",
        "other_expense",
        "oci",
        "unknown",
      ],
      trial_balance_adjustment_status: [
        "draft",
        "proposed",
        "approved",
        "rejected",
        "posted",
        "reversed",
      ],
      trial_balance_adjustment_type: [
        "adjustment",
        "journal_entry",
        "reclassification",
        "correction",
        "audit_entry",
        "proposed",
        "approved_entry",
        "rejected_entry",
      ],
      trial_balance_fs_statement: [
        "statement_of_financial_position",
        "statement_of_profit_or_loss",
        "oci",
        "cash_flow",
        "equity",
        "notes",
        "unmapped",
      ],
      trial_balance_lead_schedule: [
        "cash",
        "receivables",
        "inventory",
        "ppe",
        "payables",
        "loans",
        "revenue",
        "expenses",
        "equity",
        "other",
        "unmapped",
      ],
      trial_balance_mapping_framework: [
        "ifrs",
        "ias",
        "local_gaap",
        "company",
        "ai_future",
      ],
      trial_balance_package_status: [
        "draft",
        "validated",
        "submitted",
        "under_review",
        "returned",
        "approved",
        "locked",
        "archived",
      ],
      trial_balance_period_type: [
        "opening",
        "current",
        "closing",
        "monthly",
        "quarterly",
        "yearly",
        "comparative",
        "prior_year",
      ],
      uaie_canonical_field: [
        "account_code",
        "account_name",
        "debit",
        "credit",
        "balance",
        "currency",
        "department",
        "cost_center",
        "ignore",
      ],
      uaie_data_type: [
        "trial_balance",
        "general_ledger",
        "chart_of_accounts",
        "supporting_schedule",
        "unknown",
      ],
      uaie_dictionary_status: [
        "pending",
        "approved",
        "rejected",
        "merged",
        "disabled",
        "deleted",
      ],
      uaie_erp_system: [
        "sap",
        "sap_business_one",
        "oracle",
        "oracle_netsuite",
        "microsoft_dynamics",
        "dynamics_365",
        "1c",
        "logo",
        "netsis",
        "mikro",
        "quickbooks",
        "xero",
        "sage",
        "zoho_books",
        "odoo",
        "manual_excel",
        "unknown",
      ],
      uaie_import_status: [
        "uploaded",
        "scanning",
        "mapping_required",
        "mapped",
        "validating",
        "validated",
        "staged",
        "failed",
        "cancelled",
        "superseded",
        "archived",
      ],
      uaie_issue_severity: ["info", "warning", "error", "blocking"],
      uaie_learning_event_type: [
        "mapping_approved",
        "mapping_rejected",
        "header_learned",
        "unknown_approved",
        "unknown_rejected",
        "unknown_ignored",
        "dictionary_merged",
        "dictionary_disabled",
        "dictionary_restored",
        "fingerprint_recorded",
        "template_promoted",
        "template_rolled_back",
        "erp_detected",
        "import_staged",
        "admin_export",
        "admin_import",
      ],
      uaie_unknown_status: [
        "open",
        "suggested",
        "approved",
        "rejected",
        "ignored",
        "merged",
      ],
      working_paper_status: [
        "draft",
        "in_progress",
        "submitted",
        "under_review",
        "returned",
        "cleared",
        "complete",
        "archived",
      ],
    },
  },
} as const
