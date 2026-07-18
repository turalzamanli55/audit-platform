/**
 * Next.js instrumentation hook. Runs the development-only platform bootstrap on
 * first server start so a single Platform Owner is provisioned automatically.
 * Production is guarded inside the bootstrap runner.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { bootstrapPlatformOnStartup } = await import("@/lib/platform-bootstrap/startup");
    await bootstrapPlatformOnStartup();
  }
}
