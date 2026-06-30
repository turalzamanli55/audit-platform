import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { DASHBOARD_PATH, ONBOARDING_PATH } from "@/config/auth";
import { getTenantBootstrap } from "@/lib/auth/tenant-bootstrap";
import { resolveSafeInternalRedirect } from "@/lib/auth/safe-redirect";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ locale: string }> },
) {
  const { locale } = await context.params;
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextParam = requestUrl.searchParams.get("next");

  if (code) {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(new URL(`/${locale}/login?error=auth_callback`, request.url));
    }
  }

  const safeNext = resolveSafeInternalRedirect(nextParam, locale, requestUrl.origin);
  if (safeNext) {
    return NextResponse.redirect(new URL(safeNext, request.url));
  }

  const bootstrap = await getTenantBootstrap();
  const destination = bootstrap?.hasOrganization ? DASHBOARD_PATH : ONBOARDING_PATH;
  return NextResponse.redirect(new URL(`/${locale}${destination}`, request.url));
}
