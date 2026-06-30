import "server-only";

import { cookies } from "next/headers";
import type { SessionUser } from "@/types/auth";
import type { RepositoryContext } from "@/types/context";
import { createServerClient } from "@/lib/supabase/server";
import { siteConfig } from "@/config/site";
import { UserRepository } from "@/repositories/user/user-repository";
import { mapSupabaseUserToSessionUser } from "./mapper";

function createUserRepositoryContext(userId: string | null): RepositoryContext {
  return {
    userId,
    tenant: {
      organization: { organizationId: null, isResolved: false },
      workspace: { workspaceId: null, isResolved: false },
      company: { companyId: null, isResolved: false },
      permissions: { permissions: [], isResolved: false },
      roles: { roles: [], isResolved: false },
    },
  };
}

export async function readTenantPreferences(locale = "az") {
  const cookieStore = await cookies();
  return {
    organizationId: cookieStore.get(siteConfig.organizationCookieName)?.value ?? null,
    workspaceId: cookieStore.get(siteConfig.workspaceCookieName)?.value ?? null,
    locale,
  };
}

export async function resolveAuthenticatedUser(locale = "az"): Promise<SessionUser | null> {
  const supabase = await createServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  const preferences = await readTenantPreferences(locale);
  const repository = new UserRepository(supabase, createUserRepositoryContext(user.id));

  try {
    return await repository.resolveSessionUser(user, preferences);
  } catch {
    return mapSupabaseUserToSessionUser(user, { locale });
  }
}
