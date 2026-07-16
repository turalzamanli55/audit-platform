import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter, requireRow } from "../base/repository-helpers";
import { NotFoundError } from "@/lib/errors";
import type { WorkingPaperSignOffRole } from "@/lib/fieldwork/working-paper-management";
import {
  unwrapSupabaseList,
  unwrapSupabaseMaybeSingle,
  unwrapSupabaseResult,
} from "@/utils/supabase-result";

export type WorkingPaper = Tables<"working_papers">;
export type WorkingPaperVersion = Tables<"working_paper_versions">;
export type WorkingPaperSignOff = Tables<"working_paper_sign_offs">;

export type CreateWorkingPaperVersionInput = {
  paper: WorkingPaper;
  versionNumber: number;
  changeSummary?: string | null;
};

export type RecordWorkingPaperSignOffInput = {
  paper: WorkingPaper;
  versionNumber: number;
  role: WorkingPaperSignOffRole;
  note?: string | null;
};

/**
 * Working paper version + sign-off governance
 * (PROJECT_BIBLE §13.2 Audit — Working Paper Management).
 */
export class WorkingPaperManagementRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async findWorkingPaperById(id: string): Promise<WorkingPaper | null> {
    const result = await applyActiveFilter(
      this.client.from("working_papers").select("*").eq("id", id),
    ).maybeSingle();

    return unwrapSupabaseMaybeSingle(result);
  }

  async requireWorkingPaperInWorkspace(
    id: string,
    workspaceId: string,
  ): Promise<WorkingPaper> {
    const paper = requireRow(await this.findWorkingPaperById(id), "WorkingPaper", id);
    if (paper.workspace_id !== workspaceId) {
      // Surface as not-found to avoid leaking cross-tenant existence.
      throw new NotFoundError("WorkingPaper not found", { id });
    }
    return paper;
  }

  async listVersions(workingPaperId: string): Promise<WorkingPaperVersion[]> {
    const result = await applyActiveFilter(
      this.client
        .from("working_paper_versions")
        .select("*")
        .eq("working_paper_id", workingPaperId),
    ).order("version_number", { ascending: false });

    return unwrapSupabaseList(result);
  }

  async createVersionSnapshot(
    input: CreateWorkingPaperVersionInput,
  ): Promise<WorkingPaperVersion> {
    const payload: TablesInsert<"working_paper_versions"> = {
      working_paper_id: input.paper.id,
      engagement_id: input.paper.engagement_id,
      organization_id: input.paper.organization_id,
      workspace_id: input.paper.workspace_id,
      version_number: input.versionNumber,
      title: input.paper.title,
      paper_status: input.paper.paper_status,
      content_notes: input.paper.content_notes,
      tickmarks: input.paper.tickmarks,
      change_summary: input.changeSummary ?? null,
    };

    const result = await this.client
      .from("working_paper_versions")
      .insert(payload)
      .select("*")
      .single();

    return unwrapSupabaseResult(result);
  }

  async listSignOffs(
    workingPaperId: string,
    versionNumber?: number,
  ): Promise<WorkingPaperSignOff[]> {
    let query = applyActiveFilter(
      this.client
        .from("working_paper_sign_offs")
        .select("*")
        .eq("working_paper_id", workingPaperId),
    );
    if (versionNumber !== undefined) {
      query = query.eq("version_number", versionNumber);
    }
    const result = await query.order("signed_at", { ascending: true });

    return unwrapSupabaseList(result);
  }

  async recordSignOff(input: RecordWorkingPaperSignOffInput): Promise<WorkingPaperSignOff> {
    const payload: TablesInsert<"working_paper_sign_offs"> = {
      working_paper_id: input.paper.id,
      engagement_id: input.paper.engagement_id,
      organization_id: input.paper.organization_id,
      workspace_id: input.paper.workspace_id,
      version_number: input.versionNumber,
      sign_off_role: input.role,
      signed_by: this.userId!,
      note: input.note ?? null,
    };

    const result = await this.client
      .from("working_paper_sign_offs")
      .insert(payload)
      .select("*")
      .single();

    return unwrapSupabaseResult(result);
  }
}
