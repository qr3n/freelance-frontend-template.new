export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  DASHBOARD_ANALYTICS: '/dashboard/analytics',
  DASHBOARD_PROFILE: '/dashboard/profile',
  DASHBOARD_CREATE: '/dashboard/create',
  DASHBOARD_BUSINESS: (id: string) => `/dashboard/business/${id}`,
  DASHBOARD_BUSINESS_TABLES: (id: string) => `/dashboard/business/${id}/tables`,
} as const;
