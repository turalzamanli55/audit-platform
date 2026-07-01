import "server-only";

import { cache } from "react";
import type { AuthSession } from "@/types/auth";
import { getSupabaseAuthSession } from "./user";

export const getServerSession = cache(async (): Promise<AuthSession> => {
  return getSupabaseAuthSession();
});
