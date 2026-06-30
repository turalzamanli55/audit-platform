import "server-only";

import type { AuthSession } from "@/types/auth";
import { getSupabaseAuthSession } from "./user";

export async function getServerSession(): Promise<AuthSession> {
  return getSupabaseAuthSession();
}
