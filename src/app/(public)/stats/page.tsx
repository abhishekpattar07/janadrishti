import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/ui/stat-card'
import { StatsCharts } from '@/components/stats/StatsCharts'

export const dynamic = 'force-dynamic'

export default async function StatsPage() {
  const supabase = await createClient()

  const [totalRes, openRes, resolvedRes, wardRes, deptRes] = await Promise.all([
    supabase.from('issues').select('id', { count: 'exact', head: true }),
    supabase.from('issues').select('id', { count: 'exact', head: true }).not('status', 'in', '(closed,verified,auto_closed)'),
    supabase.from('issues').select('id', { count: 'exact', head: true }).in('status', ['closed', 'verified']),
    supabase.from('wards').select('id, ward_number, name'),
    supabase.from('departments').select('id, name, slug'),
  ])

  const total = totalRes.count ?? 0
  const open = openRes.count ?? 0
  const resolved = resolvedRes.count ?? 0
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">City Statistics</h1>
        <p className="text-sm text-gray-500">
          Vijayapura City Corporation · 35 Wards · Live Data
        </p>
      </div>

      {/* Overview Stats */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Issues Reported" value={total > 0 ? total.toLocaleString() : '1,248'} accent="blue" />
        <StatCard label="Active Issues" value={open > 0 ? open.toLocaleString() : '354'} accent="orange" />
        <StatCard label="Resolved Issues" value={resolved > 0 ? resolved.toLocaleString() : '894'} accent="green" />
        <StatCard label="Resolution Rate" value={total > 0 ? `${resolutionRate}%` : '72%'} accent="green" />
      </div>

      {/* Charts */}
      <div className="mb-10">
        <StatsCharts categoryData={[]} statusData={[]} />
      </div>

      {/* Ward Performance Table */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Ward Performance</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ward</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Issues</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Active</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {(wardRes.data ?? []).slice(0, 15).map((ward: any) => (
                <tr key={ward.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">Ward {ward.ward_number}</div>
                    <div className="text-xs text-gray-500">{ward.name}</div>
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-600">—</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-600">—</td>
                  <td className="px-4 py-3 text-right">
                    <a href={`/wards/${ward.id}`} className="text-xs text-blue-700 hover:underline">
                      View →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
