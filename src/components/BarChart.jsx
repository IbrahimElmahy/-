import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const tooltipStyle = {
  borderRadius: 18,
  border: '1px solid rgba(148, 163, 184, 0.18)',
  backgroundColor: '#ffffff',
  color: '#0f172a',
  boxShadow: '0 18px 35px -24px rgba(15, 23, 42, 0.4)',
  padding: '12px 16px',
  direction: 'rtl',
  textAlign: 'right',
}

const axisStyle = {
  fontSize: 12,
  fontFamily: 'inherit',
  fill: '#94a3b8',
}

const BarChart = ({ data, series, barSize = 24 }) => {
  const labelMap = series.reduce((acc, item) => {
    acc[item.dataKey] = item.label
    return acc
  }, {})

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RechartsBarChart data={data} barGap={10} barCategoryGap="20%">
        <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tickMargin={12} style={axisStyle} />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickMargin={12}
          style={axisStyle}
          allowDecimals={false}
        />
        <Tooltip
          formatter={(value, name) => [`${value}`, labelMap[name] ?? name]}
          contentStyle={tooltipStyle}
          wrapperStyle={{ direction: 'rtl' }}
        />
        {series.map((item) => (
          <Bar
            key={item.dataKey}
            dataKey={item.dataKey}
            fill={item.color}
            radius={[12, 12, 12, 12]}
            barSize={barSize}
            maxBarSize={36}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

export default BarChart
