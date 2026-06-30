import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";

export abstract class BaseRepository {
  protected readonly client: SupabaseClient<Database>;

  protected constructor(client: SupabaseClient<Database>) {
    this.client = client;
  }
}

export abstract class AuthenticatedRepository extends BaseRepository {
  protected readonly context: RepositoryContext;

  protected constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client);
    this.context = context;
  }

  protected get userId(): string | null {
    return this.context.userId;
  }

  protected get organizationId(): string | null {
    return this.context.tenant.organization.organizationId;
  }
}
