/**
 * Environment variable validation — fail fast on missing required configuration.
 * Service role key is server-only and never exposed to the browser bundle.
 */

export type PublicEnv = {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
};

export type ServerEnv = PublicEnv & {
  SUPABASE_SERVICE_ROLE_KEY: string;
};

/** Optional LLM keys — never required for application boot. */
export type LlmServerEnv = {
  OPENAI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  GEMINI_API_KEY?: string;
  OPENROUTER_API_KEY?: string;
  AZURE_OPENAI_ENDPOINT?: string;
  AZURE_OPENAI_KEY?: string;
  AZURE_OPENAI_DEPLOYMENT?: string;
  LLM_DEFAULT_PROVIDER?: string;
};

export type RuntimeEnv = {
  NODE_ENV: "development" | "production" | "test";
  VERCEL_ENV?: string;
};

const PUBLIC_ENV_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

const SERVER_ENV_KEYS = [...PUBLIC_ENV_KEYS, "SUPABASE_SERVICE_ROLE_KEY"] as const;

function readEnv(key: string): string | undefined {
  const value = process.env[key];
  if (value === undefined || value.trim().length === 0) return undefined;
  return value.trim();
}

function assertKeys(keys: readonly string[], scope: "public" | "server"): Record<string, string> {
  const missing: string[] = [];
  const values: Record<string, string> = {};

  for (const key of keys) {
    const value = readEnv(key);
    if (!value) {
      missing.push(key);
    } else {
      values[key] = value;
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `[env] Missing required ${scope} environment variable(s): ${missing.join(", ")}`,
    );
  }

  return values;
}

let cachedPublicEnv: PublicEnv | null = null;
let cachedServerEnv: ServerEnv | null = null;

export function getPublicEnv(): PublicEnv {
  if (cachedPublicEnv) return cachedPublicEnv;

  const values = assertKeys(PUBLIC_ENV_KEYS, "public");
  cachedPublicEnv = {
    NEXT_PUBLIC_SUPABASE_URL: values.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: values.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };

  return cachedPublicEnv;
}

export function getServerEnv(): ServerEnv {
  if (typeof window !== "undefined") {
    throw new Error("[env] getServerEnv() must not be called in the browser");
  }

  if (cachedServerEnv) return cachedServerEnv;

  const values = assertKeys(SERVER_ENV_KEYS, "server");
  cachedServerEnv = {
    NEXT_PUBLIC_SUPABASE_URL: values.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: values.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: values.SUPABASE_SERVICE_ROLE_KEY,
  };

  return cachedServerEnv;
}

export function getRuntimeEnv(): RuntimeEnv {
  const nodeEnv = process.env.NODE_ENV;
  return {
    NODE_ENV:
      nodeEnv === "production" || nodeEnv === "test" || nodeEnv === "development"
        ? nodeEnv
        : "development",
    VERCEL_ENV: process.env.VERCEL_ENV,
  };
}

export function isDevelopment(): boolean {
  return getRuntimeEnv().NODE_ENV === "development";
}

export function isProduction(): boolean {
  return getRuntimeEnv().NODE_ENV === "production";
}

export function validatePublicEnv(): PublicEnv {
  return getPublicEnv();
}

export function validateServerEnv(): ServerEnv {
  return getServerEnv();
}
