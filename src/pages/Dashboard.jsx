import {
  FiHeart,
  FiLogIn,
  FiLogOut,
  FiMessageCircle,
  FiUsers,
} from 'react-icons/fi'
import SummaryCard from '../components/SummaryCard'
import ChartCard from '../components/ChartCard'
import DonutChart from '../components/DonutChart'
import BarChart from '../components/BarChart'
import { useDashboardData } from '../hooks/useDashboardData'

const iconMap = {
  FiLogOut,
  FiUsers,
  FiMessageCircle,
  FiLogIn,
  FiHeart,
}

const Dashboard = () => {
  const { data, loading, error } = useDashboardData()

  if (loading) {
    return <div className="card dashboard__state">جارٍ تحميل البيانات...</div>
  }

  if (error || !data) {
    return (
      <div className="card dashboard__state dashboard__state--error">
        تعذّر تحميل البيانات. يرجى المحاولة لاحقاً.
      </div>
    )
  }

  const cleanlinessTotal = data.cleanliness.data.reduce((acc, item) => acc + item.value, 0)

  return (
    <section className="dashboard">
      <div className="dashboard__summary-wrapper">
        <div className="dashboard__summary">
          {data.summaryCards.map((card) => {
            const Icon = iconMap[card.icon]
            return <SummaryCard key={card.id} {...card} icon={Icon} />
          })}
        </div>
      </div>

      <div className="dashboard__grid dashboard__grid--two">
        <ChartCard title="إتاحة الشقق" subtitle={`آخر تحديث: ${data.meta.lastUpdate}`}>
          <div className="chart-layout chart-layout--split">
            <div className="donut-wrapper">
              <DonutChart data={data.availability.data} innerRadius={72} outerRadius={108} />
              <div className="donut-wrapper__label">
                <span>{data.availability.totalLabel}</span>
                <strong>{data.availability.totalValue}</strong>
              </div>
            </div>
            <ul className="chart-legend">
              {data.availability.data.map((item) => (
                <li key={item.name}>
                  <span className="chart-legend__color" style={{ backgroundColor: item.color }} />
                  <div>
                    <span className="chart-legend__label">{item.name}</span>
                    <strong className="chart-legend__value">{item.value}</strong>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </ChartCard>

        <ChartCard title="إحصائيات الشقق" subtitle="مقارنة أسبوعية">
          <BarChart data={data.unitAnalytics.weekly} series={data.unitAnalytics.legend} />
        </ChartCard>
      </div>

      <div className="dashboard__grid">
        <ChartCard
          title="إحصائيات الحجوزات"
          subtitle={`إجمالي الحجوزات السنوية: ${data.bookingAnalytics.total}`}
        >
          <BarChart
            data={data.bookingAnalytics.monthly}
            series={[{ dataKey: 'value', label: 'الحجوزات', color: '#38bdf8' }]}
            barSize={26}
          />
        </ChartCard>
      </div>

      <div className="dashboard__grid dashboard__grid--two">
        <ChartCard
          title="حالة الحجوزات"
          subtitle={`إجمالي الحركات: ${data.bookingStatus.totalValue}`}
        >
          <div className="chart-layout chart-layout--compact">
            <div className="donut-wrapper">
              <DonutChart data={data.bookingStatus.data} innerRadius={64} outerRadius={98} />
              <div className="donut-wrapper__label">
                <span>{data.bookingStatus.totalLabel}</span>
                <strong>{data.bookingStatus.totalValue}</strong>
              </div>
            </div>
            <ul className="chart-legend chart-legend--stacked">
              {data.bookingStatus.data.map((item) => (
                <li key={item.name}>
                  <span className="chart-legend__color" style={{ backgroundColor: item.color }} />
                  <div>
                    <span className="chart-legend__label">{item.name}</span>
                    <strong className="chart-legend__value">{item.value}</strong>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </ChartCard>

        <ChartCard
          title="نظافة الشقق"
          subtitle={`إجمالي المتابعة: ${cleanlinessTotal}`}
        >
          <div className="chart-layout chart-layout--compact">
            <div className="donut-wrapper">
              <DonutChart data={data.cleanliness.data} innerRadius={64} outerRadius={98} />
              <div className="donut-wrapper__label">
                <span>{data.cleanliness.totalLabel}</span>
                <strong>{data.cleanliness.totalValue}</strong>
              </div>
            </div>
            <ul className="chart-legend chart-legend--stacked">
              {data.cleanliness.data.map((item) => (
                <li key={item.name}>
                  <span className="chart-legend__color" style={{ backgroundColor: item.color }} />
                  <div>
                    <span className="chart-legend__label">{item.name}</span>
                    <strong className="chart-legend__value">{item.value}</strong>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </ChartCard>
      </div>
    </section>
  )
}

export default Dashboard
