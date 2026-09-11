'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

interface StatsChartsProps {
  categoryData: { name: string; count: number }[]
  statusData: { name: string; value: number; color: string }[]
}

const DEFAULT_CATEGORIES = [
  { name: 'Potholes', count: 142 },
  { name: 'Garbage', count: 98 },
  { name: 'Streetlights', count: 65 },
  { name: 'Drainage', count: 81 },
  { name: 'Water Leak', count: 43 },
  { name: 'Manholes', count: 28 },
]

const DEFAULT_STATUS = [
  { name: 'Resolved', value: 894, color: '#10B981' },
  { name: 'In Progress', value: 165, color: '#F97316' },
  { name: 'Acknowledged', value: 120, color: '#F59E0B' },
  { name: 'Escalated', value: 69, color: '#EF4444' },
]

export function StatsCharts({ categoryData, statusData }: StatsChartsProps) {
  const catChart = categoryData?.length ? categoryData : DEFAULT_CATEGORIES
  const statChart = statusData?.length ? statusData : DEFAULT_STATUS

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Category Breakdown Bar Chart */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-1 text-base font-bold text-gray-900">Issues by Category</h3>
        <p className="mb-4 text-xs text-gray-500">Distribution of reported complaints in Vijayapura</p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={catChart} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px' }}
              />
              <Bar dataKey="count" fill="#1E40AF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Breakdown Pie Chart */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-1 text-base font-bold text-gray-900">Resolution Status Breakdown</h3>
        <p className="mb-4 text-xs text-gray-500">Current progress of reported municipal issues</p>
        <div className="flex h-64 w-full items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statChart}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {statChart.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-xs">
          {statChart.map((s) => (
            <div key={s.name} className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="font-medium text-gray-700">{s.name}</span>
              <span className="text-gray-400">({s.value})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
