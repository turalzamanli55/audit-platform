import { NextResponse, type NextRequest } from "next/server";
import { supportedLocales } from "@/i18n";
import { resolveLocale } from "@/i18n/resolve-locale";
import { siteConfig } from "@/config/site";
import { classifyRoute, stripLocalePrefix } from "@/config/auth";

const LOCALE_PREFIX_PATTERN = new RegExp(`^/(${supportedLocales.join("|")})(/|$)`);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
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
    const response = NextResponse.redirect(url);
    response.cookies.set(siteConfig.localeCookieName, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  const normalized = stripLocalePrefix(pathname);
  const access = classifyRoute(normalized);

  const response = NextResponse.next();
  response.headers.set("x-locale", locale);
  response.headers.set("x-route-access", access);

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
