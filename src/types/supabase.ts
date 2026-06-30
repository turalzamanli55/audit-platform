/**
 * Supabase database type definitions.
 * Generated from Sprint 2B foundation migrations (20260630000001–20260630000003).
 * Regenerate with: npx supabase gen types typescript --project-id <ref>
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string;
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          deleted_by: string | null;
          id: string;
          ip_address: unknown | null;
          metadata: Json;
          organization_id: string | null;
          resource_id: string | null;
          resource_type: string;
          status: Database["public"]["Enums"]["record_status"];
          updated_at: string;
          updated_by: string | null;
          user_agent: string | null;
          user_id: string | null;
          version: number;
          workspace_id: string | null;
        };
        Insert: {
          action: string;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          id?: string;
          ip_address?: unknown | null;
          metadata?: Json;
          organization_id?: string | null;
          resource_id?: string | null;
          resource_type: string;
          status?: Database["public"]["Enums"]["record_status"];
          updated_at?: string;
          updated_by?: string | null;
          user_agent?: string | null;
          user_id?: string | null;
          version?: number;
          workspace_id?: string | null;
        };
        Update: {
          action?: string;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          id?: string;
          ip_address?: unknown | null;
          metadata?: Json;
          organization_id?: string | null;
          resource_id?: string | null;
          resource_type?: string;
          status?: Database["public"]["Enums"]["record_status"];
          updated_at?: string;
          updated_by?: string | null;
          user_agent?: string | null;
          user_id?: string | null;
          version?: number;
          workspace_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "audit_logs_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      companies: {
        Row: {
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          deleted_by: string | null;
          description: string | null;
          id: string;
          legal_name: string | null;
          name: string;
          organization_id: string;
          registration_number: string | null;
          status: Database["public"]["Enums"]["record_status"];
          updated_at: string;
          updated_by: string | null;
          version: number;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          description?: string | null;
          id?: string;
          legal_name?: string | null;
          name: string;
          organization_id: string;
          registration_number?: string | null;
          status?: Database["public"]["Enums"]["record_status"];
          updated_at?: string;
          updated_by?: string | null;
          version?: number;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          description?: string | null;
          id?: string;
          legal_name?: string | null;
          name?: string;
          organization_id?: string;
          registration_number?: string | null;
          status?: Database["public"]["Enums"]["record_status"];
          updated_at?: string;
          updated_by?: string | null;
          version?: number;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "companies_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "companies_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      company_settings: {
        Row: {
          company_id: string;
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          deleted_by: string | null;
          id: string;
          settings: Json;
          status: Database["public"]["Enums"]["record_status"];
          updated_at: string;
          updated_by: string | null;
          version: number;
        };
        Insert: {
          company_id: string;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          id?: string;
          settings?: Json;
          status?: Database["public"]["Enums"]["record_status"];
          updated_at?: string;
          updated_by?: string | null;
          version?: number;
        };
        Update: {
          company_id?: string;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          id?: string;
          settings?: Json;
          status?: Database["public"]["Enums"]["record_status"];
          updated_at?: string;
          updated_by?: string | null;
          version?: number;
        };
        Relationships: [
          {
            foreignKeyName: "company_settings_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: true;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
        ];
      };
      memberships: {
        Row: {
          company_id: string | null;
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          deleted_by: string | null;
          id: string;
          membership_scope: Database["public"]["Enums"]["membership_scope"];
          organization_id: string;
          role_id: string;
          status: Database["public"]["Enums"]["record_status"];
          updated_at: string;
          updated_by: string | null;
          user_id: string;
          version: number;
          workspace_id: string | null;
        };
        Insert: {
          company_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          id?: string;
          membership_scope: Database["public"]["Enums"]["membership_scope"];
          organization_id: string;
          role_id: string;
          status?: Database["public"]["Enums"]["record_status"];
          updated_at?: string;
          updated_by?: string | null;
          user_id: string;
          version?: number;
          workspace_id?: string | null;
        };
        Update: {
          company_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          id?: string;
          membership_scope?: Database["public"]["Enums"]["membership_scope"];
          organization_id?: string;
          role_id?: string;
          status?: Database["public"]["Enums"]["record_status"];
          updated_at?: string;
          updated_by?: string | null;
          user_id?: string;
          version?: number;
          workspace_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "memberships_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "memberships_role_id_fkey";
            columns: ["role_id"];
            isOneToOne: false;
            referencedRelation: "roles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "memberships_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      organization_settings: {
        Row: {
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          deleted_by: string | null;
          id: string;
          organization_id: string;
          settings: Json;
          status: Database["public"]["Enums"]["record_status"];
          updated_at: string;
          updated_by: string | null;
          version: number;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          id?: string;
          organization_id: string;
          settings?: Json;
          status?: Database["public"]["Enums"]["record_status"];
          updated_at?: string;
          updated_by?: string | null;
          version?: number;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          id?: string;
          organization_id?: string;
          settings?: Json;
          status?: Database["public"]["Enums"]["record_status"];
          updated_at?: string;
          updated_by?: string | null;
          version?: number;
        };
        Relationships: [
          {
            foreignKeyName: "organization_settings_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: true;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      organizations: {
        Row: {
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          deleted_by: string | null;
          description: string | null;
          id: string;
          legal_name: string | null;
          name: string;
          slug: string;
          status: Database["public"]["Enums"]["record_status"];
          updated_at: string;
          updated_by: string | null;
          version: number;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          description?: string | null;
          id?: string;
          legal_name?: string | null;
          name: string;
          slug: string;
          status?: Database["public"]["Enums"]["record_status"];
          updated_at?: string;
          updated_by?: string | null;
          version?: number;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          description?: string | null;
          id?: string;
          legal_name?: string | null;
          name?: string;
          slug?: string;
          status?: Database["public"]["Enums"]["record_status"];
          updated_at?: string;
          updated_by?: string | null;
          version?: number;
        };
        Relationships: [];
      };
      permissions: {
        Row: {
          code: string;
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          deleted_by: string | null;
          description: string | null;
          id: string;
          name: string;
          resource: string | null;
          scope: Database["public"]["Enums"]["permission_scope"];
          status: Database["public"]["Enums"]["record_status"];
          updated_at: string;
          updated_by: string | null;
          version: number;
        };
        Insert: {
          code: string;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          description?: string | null;
          id?: string;
          name: string;
          resource?: string | null;
          scope: Database["public"]["Enums"]["permission_scope"];
          status?: Database["public"]["Enums"]["record_status"];
          updated_at?: string;
          updated_by?: string | null;
          version?: number;
        };
        Update: {
          code?: string;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          resource?: string | null;
          scope?: Database["public"]["Enums"]["permission_scope"];
          status?: Database["public"]["Enums"]["record_status"];
          updated_at?: string;
          updated_by?: string | null;
          version?: number;
        };
        Relationships: [];
      };
      role_permissions: {
        Row: {
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          deleted_by: string | null;
          id: string;
          permission_id: string;
          role_id: string;
          status: Database["public"]["Enums"]["record_status"];
          updated_at: string;
          updated_by: string | null;
          version: number;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          id?: string;
          permission_id: string;
          role_id: string;
          status?: Database["public"]["Enums"]["record_status"];
          updated_at?: string;
          updated_by?: string | null;
          version?: number;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          id?: string;
          permission_id?: string;
          role_id?: string;
          status?: Database["public"]["Enums"]["record_status"];
          updated_at?: string;
          updated_by?: string | null;
          version?: number;
        };
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey";
            columns: ["permission_id"];
            isOneToOne: false;
            referencedRelation: "permissions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey";
            columns: ["role_id"];
            isOneToOne: false;
            referencedRelation: "roles";
            referencedColumns: ["id"];
          },
        ];
      };
      roles: {
        Row: {
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          deleted_by: string | null;
          description: string | null;
          id: string;
          is_system: boolean;
          name: string;
          organization_id: string | null;
          scope: Database["public"]["Enums"]["role_scope"];
          slug: string;
          status: Database["public"]["Enums"]["record_status"];
          updated_at: string;
          updated_by: string | null;
          version: number;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          description?: string | null;
          id?: string;
          is_system?: boolean;
          name: string;
          organization_id?: string | null;
          scope: Database["public"]["Enums"]["role_scope"];
          slug: string;
          status?: Database["public"]["Enums"]["record_status"];
          updated_at?: string;
          updated_by?: string | null;
          version?: number;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          description?: string | null;
          id?: string;
          is_system?: boolean;
          name?: string;
          organization_id?: string | null;
          scope?: Database["public"]["Enums"]["role_scope"];
          slug?: string;
          status?: Database["public"]["Enums"]["record_status"];
          updated_at?: string;
          updated_by?: string | null;
          version?: number;
        };
        Relationships: [
          {
            foreignKeyName: "roles_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      workspace_settings: {
        Row: {
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          deleted_by: string | null;
          id: string;
          settings: Json;
          status: Database["public"]["Enums"]["record_status"];
          updated_at: string;
          updated_by: string | null;
          version: number;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          id?: string;
          settings?: Json;
          status?: Database["public"]["Enums"]["record_status"];
          updated_at?: string;
          updated_by?: string | null;
          version?: number;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          id?: string;
          settings?: Json;
          status?: Database["public"]["Enums"]["record_status"];
          updated_at?: string;
          updated_by?: string | null;
          version?: number;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workspace_settings_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: true;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      workspaces: {
        Row: {
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          deleted_by: string | null;
          description: string | null;
          id: string;
          name: string;
          organization_id: string;
          slug: string;
          status: Database["public"]["Enums"]["record_status"];
          updated_at: string;
          updated_by: string | null;
          version: number;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          description?: string | null;
          id?: string;
          name: string;
          organization_id: string;
          slug: string;
          status?: Database["public"]["Enums"]["record_status"];
          updated_at?: string;
          updated_by?: string | null;
          version?: number;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          organization_id?: string;
          slug?: string;
          status?: Database["public"]["Enums"]["record_status"];
          updated_at?: string;
          updated_by?: string | null;
          version?: number;
        };
        Relationships: [
          {
            foreignKeyName: "workspaces_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      auth_user_id: { Args: Record<string, never>; Returns: string };
      default_company_settings: { Args: Record<string, never>; Returns: Json };
      default_organization_settings: { Args: Record<string, never>; Returns: Json };
      default_workspace_settings: { Args: Record<string, never>; Returns: Json };
      is_not_deleted: { Args: { row_deleted_at: string | null }; Returns: boolean };
      is_service_role: { Args: Record<string, never>; Returns: boolean };
      utc_now: { Args: Record<string, never>; Returns: string };
      user_belongs_to_organization: { Args: { target_organization_id: string }; Returns: boolean };
      user_belongs_to_workspace: { Args: { target_workspace_id: string }; Returns: boolean };
    };
    Enums: {
      membership_scope: "organization" | "workspace";
      permission_scope: "platform" | "organization" | "workspace" | "company";
      record_status: "active" | "inactive" | "archived" | "suspended";
      role_scope: "platform" | "organization" | "workspace";
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T];

export type SupabaseClientOptions = {
  schema?: string;
};
