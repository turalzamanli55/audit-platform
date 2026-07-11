export { siteConfig } from "./site";
export {
  AUTH_ROUTES,
  PROTECTED_PREFIX,
  PUBLIC_PATHS,
  GUEST_PATHS,
  classifyRoute,
  stripLocalePrefix,
  isAuthRoute,
  isProtectedRoute,
  type RouteAccess,
} from "./auth";
export { responsiveStrategy } from "./responsive";
export {
  defaultDashboardNavItems,
  coerceDashboardNavItems,
  COMPANIES_PATH,
  COMPANIES_NEW_PATH,
  ENGAGEMENTS_PATH,
  ENGAGEMENTS_NEW_PATH,
  IMPORT_INTELLIGENCE_PATH,
  type DashboardNavItem,
} from "./dashboard-navigation";
