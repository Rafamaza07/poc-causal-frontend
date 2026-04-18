import {
  RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer,
} from 'recharts'
import { getScoreRange } from '../../utils/constants'

const COLOR_MAP = {
  emerald: '#10b981',
  amber:   '#f59e0b',
  orange:  '#f97316',
  red:     '#ef4444',
}

export default function ScoreGauge({ score, size = 200 }) {
  const s = Math.min(Math.max(score ?? 0, 0), 100)
  const range = getScoreRange(s)
  const color = COLOR_MAP[range.color] || '#10b981'
  const data = [{ value: s }]

  return (
    <div className="flex flex-col items-center" style={{ width: size, height: size * 0.65 }}>
      <div className="relative w-full" style={{ height: size * 0.65 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="85%"
            innerRadius="60%"
            outerRadius="100%"
            startAngle={180}
            endAngle={0}
            data={data}
            barSize={14}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              background={{ fill: '#f3f4f6' }}
              dataKey="value"
              angleAxisId={0}
              fill={color}
              cornerRadius={7}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <span className="text-3xl font-bold text-gray-900 leading-none">{Math.round(s)}</span>
          <span className="text-xs text-gray-400 mt-0.5 tracking-wide">Score de riesgo</span>
        </div>
      </div>
      <span className={`text-xs font-bold tracking-widest mt-1 ${range.text}`}>
        {range.label.toUpperCase()}
      </span>
    </div>
  )
}
