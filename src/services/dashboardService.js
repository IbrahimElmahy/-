import { dashboardMock } from '../data/mockDashboard'

/**
 * خدمة تجريبية تحاكي استجابة الواجهة الخلفية.
 * عند توفر واجهة برمجية حقيقية يمكن استبدال المؤقت والبيانات الوهمية بطلب فعلي.
 */
export const fetchDashboardMetrics = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(dashboardMock), 300)
  })
}
