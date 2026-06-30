import { getPublicEnv, getServerEnv, type PublicEnv, type ServerEnv } from "@/lib/env";

export type SupabasePublicConfig = {
  url: string;
  anonKey: string;
};

export type SupabaseServerConfig = SupabasePublicConfig & {
  serviceRoleKey: string;
};

export function getSupabasePublicConfig(): SupabasePublicConfig {
  const env = getPublicEnv();
  return mapPublicConfig(env);
}

export function getSupabaseServerConfig(): SupabaseServerConfig {
  const env = getServerEnv();
  return {
    ...mapPublicConfig(env),
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

function mapPublicConfig(env: PublicEnv): SupabasePublicConfig {
  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

export type { PublicEnv, ServerEnv };
