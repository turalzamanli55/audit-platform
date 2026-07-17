import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import { applyActiveFilter } from "../base/repository-helpers";
import { unwrapSupabaseList, unwrapSupabaseResult } from "@/utils/supabase-result";

export type IfrsNoteManagementLink = Tables<"ifrs_note_management_links">;

export class IfrsNoteManagementRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async listLinks(engagementId: string): Promise<IfrsNoteManagementLink[]> {
    const result = await applyActiveFilter(
      this.client
        .from("ifrs_note_management_links")
        .select("*")
        .eq("engagement_id", engagementId),
    );
    return unwrapSupabaseList(result);
  }

  async createLink(
    input: TablesInsert<"ifrs_note_management_links">,
  ): Promise<IfrsNoteManagementLink> {
    const result = await this.client
      .from("ifrs_note_management_links")
      .insert(input)
      .select("*")
      .single();
    return unwrapSupabaseResult(result);
  }
}
