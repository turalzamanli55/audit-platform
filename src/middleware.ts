import { NextResponse, type NextRequest } from "next/server";
import { supportedLocales } from "@/i18n";
import { resolveLocale } from "@/i18n/resolve-locale";
import { siteConfig } from "@/config/site";
import {
  AUTH_ROUTES,
  classifyRoute,
  DASHBOARD_PATH,
  stripLocalePrefix,
} from "@/config/auth";
import { createMiddlewareClient } from "@/lib/supabase/middleware";
import { generateUuid } from "@/utils/uuid";

const LOCALE_PREFIX_PATTERN = new RegExp(`^/(${supportedLocales.join("|")})(/|$)`);

function shouldBypass(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldBypass(pathname)) {
    return NextResponse.next();
  }

  const cookieLocale = request.cookies.get(siteConfig.localeCookieName)?.value;
  const acceptLanguage = request.headers.get("accept-language");
  const pathnameLocale = pathname.split("/")[1];
  const locale = resolveLocale(pathnameLocale, cookieLocale, acceptLanguage);
  const hasLocalePrefix = LOCALE_PREFIX_PATTERN.test(pathname);

  if (!hasLocalePrefix) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    const redirect = NextResponse.redirect(url);
    redirect.cookies.set(siteConfig.localeCookieName, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    const { response, supabase } = await createMiddlewareClient(request, redirect);
    const authResponse = await enforceRouteAccess(request, response, supabase, locale, url.pathname);
    return applyTracingHeaders(authResponse, locale, url.pathname);
  }

  const { response, supabase } = await createMiddlewareClient(request);
  const authResponse = await enforceRouteAccess(request, response, supabase, locale, pathname);
  return applyTracingHeaders(authResponse, locale, pathname);
}

async function enforceRouteAccess(
  request: NextRequest,
  response: NextResponse,
  supabase: Awaited<ReturnType<typeof createMiddlewareClient>>["supabase"],
  locale: string,
  pathname: string,
) {
  const normalized = stripLocalePrefix(pathname);
  const access = classifyRoute(normalized);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (access === "protected" && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = `/${locale}${AUTH_ROUTES.login}`;
    return NextResponse.redirect(loginUrl);
  }

  if (access === "guest" && user && normalized !== AUTH_ROUTES.callback) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = `/${locale}${DASHBOARD_PATH}`;
    return NextResponse.redirect(dashboardUrl);
  }

  return response;
}

function applyTracingHeaders(response: NextResponse, locale: string, pathname: string) {
  const normalized = stripLocalePrefix(pathname);
  const access = classifyRoute(normalized);
  const correlationId =
    response.headers.get("x-correlation-id") ??
    response.headers.get("x-request-id") ??
    generateUuid();

  response.headers.set("x-locale", locale);
  response.headers.set("x-route-access", access);
  response.headers.set("x-correlation-id", correlationId);
  response.headers.set("x-request-id", correlationId);

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
