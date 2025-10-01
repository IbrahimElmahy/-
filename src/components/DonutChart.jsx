import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const DonutChart = ({
  data,
  innerRadius = 68,
  outerRadius = 104,
  startAngle = 90,
  endAngle = -270,
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          paddingAngle={3}
          stroke="#fff"
          strokeWidth={2}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [`${value}`, name]}
          contentStyle={{
            borderRadius: 18,
            border: '1px solid rgba(148, 163, 184, 0.18)',
            background: '#ffffff',
            boxShadow: '0 18px 35px -24px rgba(15, 23, 42, 0.45)',
            direction: 'rtl',
          }}
          wrapperStyle={{ direction: 'rtl' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default DonutChart
