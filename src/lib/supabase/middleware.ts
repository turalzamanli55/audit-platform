import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "./config";
import type { Database } from "@/types/supabase";

export type MiddlewareSupabaseResult = {
  supabase: SupabaseClient<Database>;
  response: NextResponse;
};

/**
 * Creates a Supabase client bound to the incoming middleware request/response cycle.
 * Refreshes the auth session and propagates cookie updates on the response.
 */
export async function createMiddlewareClient(
  request: NextRequest,
  response?: NextResponse,
): Promise<MiddlewareSupabaseResult> {
  const { url, anonKey } = getSupabasePublicConfig();
  let supabaseResponse = response ?? NextResponse.next({ request });

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  await supabase.auth.getUser();

  return { supabase, response: supabaseResponse };
}

/**
 * Refreshes Supabase auth session on an existing middleware response.
 */
export async function refreshSupabaseSession(
  request: NextRequest,
  response: NextResponse,
): Promise<NextResponse> {
  const { response: refreshed } = await createMiddlewareClient(request, response);
  return refreshed;
}
