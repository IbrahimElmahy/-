import { dashboardMock } from '../data/mockDashboard'

/**
 * Placeholder service that mimics the backend response.
 * Replace the timeout + mock with a real fetch call when the API is ready.
 */
export const fetchDashboardMetrics = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(dashboardMock), 300)
  })
}
