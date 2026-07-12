/**
 * Optional LLM provider environment — never required for app boot.
 * Keys are server-only; never expose to the browser.
 */

export const LLM_ENV_KEYS = [
  "OPENAI_API_KEY",
  "ANTHROPIC_API_KEY",
  "GEMINI_API_KEY",
  "OPENROUTER_API_KEY",
  "AZURE_OPENAI_ENDPOINT",
  "AZURE_OPENAI_KEY",
  "AZURE_OPENAI_DEPLOYMENT",
  "LLM_DEFAULT_PROVIDER",
] as const;

export type LlmEnvKey = (typeof LLM_ENV_KEYS)[number];

export type LlmEnvSnapshot = {
  OPENAI_API_KEY: string | null;
  ANTHROPIC_API_KEY: string | null;
  GEMINI_API_KEY: string | null;
  OPENROUTER_API_KEY: string | null;
  AZURE_OPENAI_ENDPOINT: string | null;
  AZURE_OPENAI_KEY: string | null;
  AZURE_OPENAI_DEPLOYMENT: string | null;
  LLM_DEFAULT_PROVIDER: string | null;
};

function readOptional(key: string): string | null {
  const value = process.env[key];
  if (value === undefined || value.trim().length === 0) return null;
  return value.trim();
}

/** Safe presence flags — never includes secret values. */
export type LlmEnvPresence = {
  openai: boolean;
  anthropic: boolean;
  gemini: boolean;
  openrouter: boolean;
  azureOpenAi: boolean;
  defaultProvider: string | null;
};

export function readLlmEnv(): LlmEnvSnapshot {
  return {
    OPENAI_API_KEY: readOptional("OPENAI_API_KEY"),
    ANTHROPIC_API_KEY: readOptional("ANTHROPIC_API_KEY"),
    GEMINI_API_KEY: readOptional("GEMINI_API_KEY"),
    OPENROUTER_API_KEY: readOptional("OPENROUTER_API_KEY"),
    AZURE_OPENAI_ENDPOINT: readOptional("AZURE_OPENAI_ENDPOINT"),
    AZURE_OPENAI_KEY: readOptional("AZURE_OPENAI_KEY"),
    AZURE_OPENAI_DEPLOYMENT: readOptional("AZURE_OPENAI_DEPLOYMENT"),
    LLM_DEFAULT_PROVIDER: readOptional("LLM_DEFAULT_PROVIDER"),
  };
}

export function getLlmEnvPresence(env: LlmEnvSnapshot = readLlmEnv()): LlmEnvPresence {
  return {
    openai: Boolean(env.OPENAI_API_KEY),
    anthropic: Boolean(env.ANTHROPIC_API_KEY),
    gemini: Boolean(env.GEMINI_API_KEY),
    openrouter: Boolean(env.OPENROUTER_API_KEY),
    azureOpenAi: Boolean(
      env.AZURE_OPENAI_ENDPOINT && env.AZURE_OPENAI_KEY && env.AZURE_OPENAI_DEPLOYMENT,
    ),
    defaultProvider: env.LLM_DEFAULT_PROVIDER,
  };
}

export function maskSecret(value: string | null | undefined): string {
  if (!value) return "";
  if (value.length <= 8) return "********";
  return `${value.slice(0, 3)}…${value.slice(-2)}`;
}
