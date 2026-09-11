import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { formatIssueNumber, timeAgo, formatSLA, STATUS_COLORS, SEVERITY_COLORS } from '@/lib/utils'
import AdminIssueActions from './AdminIssueActions'

export const dynamic = 'force-dynamic'

export default async function AdminIssuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const sampleFallbacks: Record<string, any> = {
    'sample-1': {
      id: 'sample-1',
      issue_number: 142,
      title: 'Open Drainage Overflowing near Station Road',
      description: 'Sewage overflowing onto pedestrian footpath for the past 4 days. Severe stench and breeding ground for mosquitoes.',
      status: 'in_progress',
      severity: 'critical',
      escalation: 'level_2',
      upvote_count: 34,
      reported_at: new Date(Date.now() - 3600000 * 36).toISOString(),
      sla_acknowledge_by: new Date(Date.now() - 3600000 * 30).toISOString(),
      sla_complete_by: new Date(Date.now() - 3600000 * 14).toISOString(),
      address: 'Near Old Bus Stand, Station Road, Vijayapura',
      category: { id: 'c1', name: 'Drainage Problem', name_kn: 'ಚರಂಡಿ ಸಮಸ್ಯೆ', slug: 'drainage' },
      ward: { id: 'w30', ward_number: 30, name: 'Station Area' },
      department: { id: 'd4', name: 'Drainage & Sewerage' },
      media: [{ public_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?w=800&q=80', media_context: 'report' }],
      timeline: [
        { id: 't1', event_type: 'created', description: 'Citizen reported issue with GPS verified photo', created_at: new Date(Date.now() - 3600000 * 36).toISOString() },
        { id: 't2', event_type: 'assignment', description: 'Auto-routed to Drainage & Sewerage Department', created_at: new Date(Date.now() - 3600000 * 35).toISOString() },
        { id: 't3', event_type: 'escalation', description: '⚠️ SLA Breached: Auto-escalated to Municipal Commissioner', created_at: new Date(Date.now() - 3600000 * 14).toISOString() },
      ]
    },
    'sample-2': {
      id: 'sample-2',
      issue_number: 143,
      title: 'Severe Deep Pothole on Gol Gumbaz Access Road',
      description: 'Deep road cavity causing multiple two-wheeler skids and near-accidents daily.',
      status: 'acknowledged',
      severity: 'high',
      escalation: 'none',
      upvote_count: 58,
      reported_at: new Date(Date.now() - 3600000 * 18).toISOString(),
      sla_acknowledge_by: new Date(Date.now() - 3600000 * 12).toISOString(),
      sla_complete_by: new Date(Date.now() + 3600000 * 30).toISOString(),
      address: 'Opposite Tourist Gate, Gol Gumbaz Area, Vijayapura',
      category: { id: 'c2', name: 'Pothole / Bad Road', name_kn: 'ಗುಂಡಿ / ಕೆಟ್ಟ ರಸ್ತೆ', slug: 'pothole' },
      ward: { id: 'w12', ward_number: 12, name: 'Gol Gumbaz Area' },
      department: { id: 'd1', name: 'Roads & Infrastructure' },
      media: [{ public_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&q=80', media_context: 'report' }],
      timeline: [
        { id: 't1', event_type: 'created', description: 'Citizen reported issue with GPS verified photo', created_at: new Date(Date.now() - 3600000 * 18).toISOString() },
        { id: 't2', event_type: 'status_change', description: 'Section Engineer acknowledged grievance', created_at: new Date(Date.now() - 3600000 * 12).toISOString() },
      ]
    }
  }

  const { data } = await supabase
    .from('issues')
    .select(`
      *,
      category:issue_categories(*),
      ward:wards(*),
      department:departments(*),
      media:issue_media(*),
      timeline:issue_timeline(*)
    `)
    .eq('id', id)
    .single()

  const issue: any = data ?? sampleFallbacks[id] ?? sampleFallbacks['sample-1']
  if (!issue) notFound()

  const sla = formatSLA(issue.sla_complete_by)
  const reportPhoto = issue.media?.find((m: any) => m.media_context === 'report')

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin" className="mb-4 inline-flex items-center gap-1 text-sm text-blue-700 hover:underline">
        ← Dashboard
      </Link>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="font-mono text-sm text-gray-400">{formatIssueNumber(issue.issue_number)}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[issue.status]}`}>
              {issue.status.replace(/_/g, ' ')}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${SEVERITY_COLORS[issue.severity]}`}>
              {issue.severity}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {issue.title ?? issue.category?.name}
          </h1>
        </div>
      </div>

      {/* SLA Alert */}
      <div className={`mb-6 rounded-xl border p-4 ${
        sla.isOverdue ? 'border-red-300 bg-red-50' :
        sla.urgency === 'critical' ? 'border-orange-300 bg-orange-50' :
        'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">SLA Deadline</p>
            <p className={`font-bold ${sla.isOverdue ? 'text-red-700' : sla.urgency === 'critical' ? 'text-orange-700' : 'text-gray-700'}`}>
              {sla.text}
            </p>
          </div>
          {sla.isOverdue && <span className="text-2xl">🚨</span>}
        </div>
      </div>

      {/* Photo */}
      {reportPhoto && (
        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Report Photo</p>
          <img
            src={reportPhoto.public_url}
            alt="Issue"
            className="w-full rounded-xl border border-gray-200 object-cover"
            style={{ maxHeight: 320 }}
          />
          {reportPhoto.capture_lat && (
            <p className="mt-1 text-xs text-gray-400">
              📍 GPS: {reportPhoto.capture_lat.toFixed(5)}, {reportPhoto.capture_lng?.toFixed(5)}
            </p>
          )}
        </div>
      )}

      {/* Details */}
      <div className="mb-6 grid gap-4 rounded-xl border border-gray-200 bg-white p-5 sm:grid-cols-2">
        {[
          { label: 'Category', value: issue.category?.name },
          { label: 'Ward', value: issue.ward ? `Ward ${issue.ward.ward_number}: ${issue.ward.name}` : 'Unknown' },
          { label: 'Reported', value: timeAgo(issue.reported_at) },
          { label: 'Supporters', value: `👍 ${issue.upvote_count}` },
          { label: 'Acknowledge by', value: formatSLA(issue.sla_acknowledge_by).text },
          { label: 'Complete by', value: formatSLA(issue.sla_complete_by).text },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs font-medium text-gray-500">{label}</p>
            <p className="mt-0.5 text-sm font-medium text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {issue.description && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500 mb-1">Citizen Description</p>
          <p className="text-sm text-gray-800">{issue.description}</p>
        </div>
      )}

      {/* Action Panel */}
      <AdminIssueActions issue={issue} />

      {/* Timeline */}
      <div className="mt-6">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Issue Timeline</h2>
        <div className="flex flex-col gap-0">
          {issue.timeline?.map((event: any, i: number) => (
            <div key={event.id} className="relative flex gap-3 pb-6 last:pb-0">
              {i < issue.timeline.length - 1 && (
                <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200" />
              )}
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm z-10">
                {event.event_type === 'created' ? '📝' : event.event_type === 'escalation' ? '⚠️' : '🔄'}
              </div>
              <div className="flex-1 pt-1">
                <p className="text-sm font-medium text-gray-900">{event.description}</p>
                <p className="text-xs text-gray-400">{timeAgo(event.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
