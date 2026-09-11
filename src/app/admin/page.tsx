import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatIssueNumber, timeAgo, formatSLA, STATUS_COLORS, SEVERITY_COLORS } from '@/lib/utils'
import { StatCard } from '@/components/ui/stat-card'

export const dynamic = 'force-dynamic'

interface AdminPageProps {
  searchParams: Promise<{ dept?: string; role?: string }>
}

const DEPARTMENTS = [
  { slug: 'all', name: 'All Departments (ಎಲ್ಲ ಇಲಾಖೆಗಳು)', icon: '🏛️' },
  { slug: 'roads', name: 'Roads & Infrastructure (ರಸ್ತೆ)', icon: '🚧' },
  { slug: 'sanitation', name: 'Sanitation & Waste (ನೈರ್ಮಲ್ಯ)', icon: '🧹' },
  { slug: 'drainage', name: 'Drainage & Sewerage (ಚರಂಡಿ)', icon: '💧' },
  { slug: 'streetlights', name: 'Streetlights & Electrical (ವಿದ್ಯುತ್)', icon: '💡' },
]

export default async function AdminDashboard({ searchParams }: AdminPageProps) {
  const { dept = 'all' } = await searchParams
  const supabase = await createClient()

  // Sample official issues segmented by department
  const officialMockIssues = [
    {
      id: 'sample-1',
      issue_number: 142,
      title: 'Open Drainage Overflowing near Station Road',
      status: 'in_progress',
      severity: 'critical',
      escalation: 'level_2',
      dept_slug: 'drainage',
      dept_name: 'Drainage & Sewerage',
      reported_at: new Date(Date.now() - 3600000 * 36).toISOString(),
      sla_complete_by: new Date(Date.now() - 3600000 * 14).toISOString(),
      ward: { ward_number: 30, name: 'Station Area' },
      address: 'Near Old Bus Stand, Station Road',
    },
    {
      id: 'sample-2',
      issue_number: 143,
      title: 'Severe Deep Pothole on Gol Gumbaz Access Road',
      status: 'acknowledged',
      severity: 'high',
      escalation: 'none',
      dept_slug: 'roads',
      dept_name: 'Roads & Infrastructure',
      reported_at: new Date(Date.now() - 3600000 * 18).toISOString(),
      sla_complete_by: new Date(Date.now() + 3600000 * 30).toISOString(),
      ward: { ward_number: 12, name: 'Gol Gumbaz Area' },
      address: 'Opposite Tourist Gate, Gol Gumbaz Area',
    },
    {
      id: 'sample-3',
      issue_number: 144,
      title: 'Illegal Commercial Garbage Dumping at Adil Shahi Colony',
      status: 'resolution_claimed',
      severity: 'medium',
      escalation: 'none',
      dept_slug: 'sanitation',
      dept_name: 'Sanitation & Waste Management',
      reported_at: new Date(Date.now() - 3600000 * 52).toISOString(),
      sla_complete_by: new Date(Date.now() - 3600000 * 4).toISOString(),
      ward: { ward_number: 2, name: 'Adil Shahi Colony' },
      address: 'Cross 4, Adil Shahi Colony',
    },
    {
      id: 'sample-4',
      issue_number: 145,
      title: 'Damaged Pedestrian Footpath & Broken Slabs',
      status: 'routed',
      severity: 'medium',
      escalation: 'none',
      dept_slug: 'roads',
      dept_name: 'Roads & Infrastructure',
      reported_at: new Date(Date.now() - 3600000 * 6).toISOString(),
      sla_complete_by: new Date(Date.now() + 3600000 * 160).toISOString(),
      ward: { ward_number: 11, name: 'Gandhi Chowk' },
      address: 'Near Main Market Road',
    },
    {
      id: 'sample-5',
      issue_number: 146,
      title: 'High Mast Streetlight Failure at Dharmanath Circle',
      status: 'routed',
      severity: 'high',
      escalation: 'none',
      dept_slug: 'streetlights',
      dept_name: 'Streetlights & Electrical',
      reported_at: new Date(Date.now() - 3600000 * 10).toISOString(),
      sla_complete_by: new Date(Date.now() + 3600000 * 14).toISOString(),
      ward: { ward_number: 10, name: 'Dharmanath Circle' },
      address: 'Dharmanath Circle Intersection',
    }
  ]

  // Filter issues based on active department tab
  const filteredIssues = dept === 'all'
    ? officialMockIssues
    : officialMockIssues.filter((i) => i.dept_slug === dept)

  const overdueCount = filteredIssues.filter((i) => {
    const sla = formatSLA(i.sla_complete_by)
    return sla.isOverdue
  }).length

  const escalatedCount = filteredIssues.filter((i) => i.escalation !== 'none').length

  return (
    <div className="space-y-6">
      {/* Header with District Context */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🏢</span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Departmental Grievance Redressal Queue
            </h1>
          </div>
          <p className="text-sm text-slate-500">
            Vijayapura City Corporation · Role-Based Official Redressal & SLA Countdown Center
          </p>
        </div>

        {/* Current Officer Status Pill */}
        <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs shrink-0">
          <div className="h-9 w-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
            👷
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">
              {dept === 'all' ? 'City Commissioner Mode' : `${DEPARTMENTS.find(d => d.slug === dept)?.name.split(' ')[0]} Section Engineer`}
            </p>
            <p className="text-[11px] text-slate-500">Karnataka Sakaala Act Active</p>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Assigned Complaints" value={filteredIssues.length} accent="blue" />
        <StatCard label="SLA Overdue" value={overdueCount} accent={overdueCount > 0 ? 'red' : 'green'} />
        <StatCard label="Escalated to DC / Commissioner" value={escalatedCount} accent={escalatedCount > 0 ? 'orange' : 'green'} />
        <StatCard label="Active Jurisdiction" value={dept === 'all' ? 'All 35 Wards' : 'Assigned Dept'} accent="blue" />
      </div>

      {/* Department Selector Tabs */}
      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
          Filter by Municipal Department (ಇಲಾಖೆಯ ಪ್ರಕಾರ ವೀಕ್ಷಿಸಿ):
        </label>
        <div className="flex flex-wrap gap-2">
          {DEPARTMENTS.map((d) => {
            const active = dept === d.slug
            const count = d.slug === 'all' 
              ? officialMockIssues.length 
              : officialMockIssues.filter((i) => i.dept_slug === d.slug).length

            return (
              <Link
                key={d.slug}
                href={`/admin?dept=${d.slug}`}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                  active
                    ? 'bg-blue-900 text-white shadow-sm ring-2 ring-blue-900/30'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{d.icon}</span>
                <span>{d.name.split(' ')[0]}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] ${active ? 'bg-blue-800 text-blue-100' : 'bg-slate-100 text-slate-600'}`}>
                  {count}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Overdue Warning Alert */}
      {overdueCount > 0 && (
        <div className="rounded-2xl border-l-4 border-red-500 bg-red-50 p-4 text-red-900 shadow-xs flex items-start gap-3">
          <span className="text-2xl">🚨</span>
          <div>
            <p className="font-bold text-sm">
              Critical Warning: {overdueCount} complaint{overdueCount > 1 ? 's have' : ' has'} breached the statutory SLA deadline!
            </p>
            <p className="text-xs text-red-700 mt-0.5">
              These issues have been automatically escalated to the Municipal Commissioner and Deputy Commissioner&apos;s Office. Immediate action required.
            </p>
          </div>
        </div>
      )}

      {/* Issues Queue Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50/50">
          <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
            Official Work Queue ({filteredIssues.length})
          </h2>
          <span className="text-xs text-slate-500">
            Click &quot;Action &amp; Redress&quot; to progress complaints through the accountability pipeline
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredIssues.map((issue) => {
            const sla = formatSLA(issue.sla_complete_by)
            return (
              <div
                key={issue.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 hover:bg-slate-50/80 transition-colors"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {formatIssueNumber(issue.issue_number)}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_COLORS[issue.status]}`}>
                      {issue.status.replace(/_/g, ' ')}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${SEVERITY_COLORS[issue.severity]}`}>
                      {issue.severity.toUpperCase()}
                    </span>
                    {issue.escalation !== 'none' && (
                      <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-extrabold text-red-700 animate-pulse">
                        ⚠️ Escalated to {issue.escalation === 'level_2' ? 'Municipal Commissioner' : 'DC Office'}
                      </span>
                    )}
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 font-medium">
                      🏛️ {issue.dept_name}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">
                    {issue.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span>📍 Ward {issue.ward.ward_number}: {issue.ward.name}</span>
                    <span>• {issue.address}</span>
                    <span>• Reported {timeAgo(issue.reported_at)}</span>
                    <span className={`font-bold ${sla.isOverdue ? 'text-red-600' : 'text-slate-600'}`}>
                      ⏱ {sla.text}
                    </span>
                  </div>
                </div>

                {/* Officer Action Button */}
                <div className="shrink-0 flex items-center gap-2">
                  <Link
                    href={`/admin/issues/${issue.id}`}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-800 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-900 transition-colors"
                  >
                    <span>⚡ Action &amp; Redress</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
