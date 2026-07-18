import Link from "next/link";

export default function Forbidden() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        403 — Forbidden
      </p>
      <h1 className="text-3xl font-semibold tracking-tight">Platform access restricted</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        This area is reserved for the Platform Owner. Your account does not have platform
        administration privileges.
      </p>
      <Link
        href="/"
        className="rounded-lg border border-border/60 px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
      >
        Return home
      </Link>
    </main>
  );
}
