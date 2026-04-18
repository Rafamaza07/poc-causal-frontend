import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

const DEFAULT_COLORS = ['#3b76f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#f97316']

export default function DistributionPie({
  data = [],
  nameKey = 'name',
  valueKey = 'value',
  colors = DEFAULT_COLORS,
  height = 240,
  innerRadius = 50,
  className = '',
}) {
  return (
    <div className={className} style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey={valueKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={innerRadius + 32}
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 16px -4px rgba(0,0,0,0.1)', fontSize: 12 }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(val) => <span style={{ fontSize: 11, color: '#6b7280' }}>{val}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
