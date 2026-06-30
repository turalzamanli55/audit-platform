"use server";

import { headers } from "next/headers";
import { createServerClient } from "@/lib/supabase/server";
import { createAuthenticatedAction } from "@/lib/actions/authenticated-action";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";

export const signOutAction = createAuthenticatedAction<Record<string, never>, { success: true }>(
  { module: "auth.sign-out" },
  async (_input, context) => {
    const supabase = await createServerClient();
    await supabase.auth.signOut();

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.LOGOUT,
      resourceType: "user",
      resourceId: context.userId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
    });

    return { success: true };
  },
);
