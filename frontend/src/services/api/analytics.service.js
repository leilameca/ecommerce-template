import { apiRequest, buildQueryString } from "./client";

export function getSalesAnalytics(params = {}) {
  return apiRequest(`/analytics/sales${buildQueryString(params)}`);
}
