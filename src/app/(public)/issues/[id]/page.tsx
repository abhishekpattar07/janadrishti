import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatIssueNumber, timeAgo, formatSLA, STATUS_COLORS, SEVERITY_COLORS, ESCALATION_COLORS } from '@/lib/utils'
import Link from 'next/link'
import { UpvoteButton } from '@/components/issues/UpvoteButton'
import { BeforeAfterSlider } from '@/components/issues/BeforeAfterSlider'
import { GrievanceReceiptModal } from '@/components/issues/GrievanceReceiptModal'

export const dynamic = 'force-dynamic'

export default async function IssueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

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
      sla_complete_by: new Date(Date.now() - 3600000 * 14).toISOString(),
      address: 'Near Old Bus Stand, Station Road, Vijayapura',
      is_anonymous: false,
      category: { id: 'c1', name: 'Drainage Problem', name_kn: 'ಚರಂಡಿ ಸಮಸ್ಯೆ', slug: 'drainage' },
      ward: { id: 'w30', ward_number: 30, name: 'Station Area' },
      department: { id: 'd4', name: 'Drainage & Sewerage' },
      media: [{ public_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?w=800&q=80', media_context: 'report', capture_lat: 16.832, capture_lng: 75.714 }],
      timeline: [
        { id: 't1', event_type: 'created', description: 'Citizen reported issue with GPS verified photo', created_at: new Date(Date.now() - 3600000 * 36).toISOString() },
        { id: 't2', event_type: 'assignment', description: 'Auto-routed to Drainage & Sewerage Department', created_at: new Date(Date.now() - 3600000 * 35).toISOString() },
        { id: 't3', event_type: 'escalation', description: '⚠️ SLA Breached: Auto-escalated to Municipal Commissioner', created_at: new Date(Date.now() - 3600000 * 14).toISOString() },
      ]
    },
    'sample-2': {
      id: 'sample-2',
      issue_number: 139,
      title: 'Deep Pothole on Gandhi Chowk Main Road',
      description: 'Dangerous pothole 2 feet wide causing traffic congestion and two-wheeler accidents near Gandhi Chowk.',
      status: 'verified',
      severity: 'high',
      escalation: 'none',
      upvote_count: 58,
      reported_at: new Date(Date.now() - 3600000 * 72).toISOString(),
      sla_complete_by: new Date(Date.now() - 3600000 * 24).toISOString(),
      address: 'Gandhi Chowk, Ward 11, Vijayapura',
      is_anonymous: false,
      category: { id: 'c2', name: 'Pothole / Bad Road', name_kn: 'ಗುಂಡಿ / ಕೆಟ್ಟ ರಸ್ತೆ', slug: 'pothole' },
      ward: { id: 'w11', ward_number: 11, name: 'Gandhi Chowk' },
      department: { id: 'd1', name: 'Roads & Infrastructure' },
      media: [
        { public_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&q=80', media_context: 'report', capture_lat: 16.828, capture_lng: 75.710 },
        { public_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80', media_context: 'resolution', capture_lat: 16.828, capture_lng: 75.710 }
      ],
      timeline: [
        { id: 't1', event_type: 'created', description: 'Citizen reported defect with GPS watermark', created_at: new Date(Date.now() - 3600000 * 72).toISOString() },
        { id: 't2', event_type: 'status_change', description: 'Roads Department engineer acknowledged and deployed asphalt crew', created_at: new Date(Date.now() - 3600000 * 48).toISOString() },
        { id: 't3', event_type: 'status_change', description: 'Pothole patched with bituminous mix; resolution claimed with GPS photo', created_at: new Date(Date.now() - 3600000 * 24).toISOString() },
        { id: 't4', event_type: 'status_change', description: 'Verified and approved by citizen reporter', created_at: new Date(Date.now() - 3600000 * 6).toISOString() },
      ]
    },
    'sample-3': {
      id: 'sample-3',
      issue_number: 144,
      title: 'Illegal Commercial Garbage Dumping at Adil Shahi Colony',
      description: 'Large piles of unsegregated plastic and organic waste blocking drainage culvert.',
      status: 'resolution_claimed',
      severity: 'medium',
      escalation: 'none',
      upvote_count: 19,
      reported_at: new Date(Date.now() - 3600000 * 52).toISOString(),
      sla_complete_by: new Date(Date.now() + 3600000 * 20).toISOString(),
      address: 'Cross 4, Adil Shahi Colony, Vijayapura',
      is_anonymous: true,
      category: { id: 'c3', name: 'Garbage / Waste Dumping', name_kn: 'ಕಸ / ತ್ಯಾಜ್ಯ ಎಸೆಯುವಿಕೆ', slug: 'garbage' },
      ward: { id: 'w2', ward_number: 2, name: 'Adil Shahi Colony' },
      department: { id: 'd2', name: 'Sanitation & Waste Management' },
      media: [
        { public_url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&q=80', media_context: 'report', capture_lat: 16.834, capture_lng: 75.719 },
        { public_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80', media_context: 'resolution', capture_lat: 16.834, capture_lng: 75.719 }
      ],
      timeline: [
        { id: 't1', event_type: 'created', description: 'Citizen reported garbage dumping', created_at: new Date(Date.now() - 3600000 * 52).toISOString() },
        { id: 't2', event_type: 'status_change', description: 'Sanitation Department dispatched cleanup tipper truck', created_at: new Date(Date.now() - 3600000 * 28).toISOString() },
        { id: 't3', event_type: 'status_change', description: 'Debris cleared and sanitized; resolution proof submitted', created_at: new Date(Date.now() - 3600000 * 4).toISOString() },
      ]
    }
  }

  const issue: any = data ?? sampleFallbacks[id] ?? sampleFallbacks['sample-1']
  if (!issue) notFound()

  const reportPhotos: any[] = issue.media?.filter((m: any) => m.media_context === 'report') || []
  const reportPhoto = reportPhotos[0]
  const resolutionPhoto = issue.media?.find((m: any) => m.media_context === 'resolution')
  const sla = formatSLA(issue.sla_complete_by)

  const TIMELINE_ICONS: Record<string, string> = {
    created: '📝',
    status_change: '🔄',
    escalation: '⚠️',
    assignment: '👤',
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Back */}
      <Link href="/issues" className="mb-4 inline-flex items-center gap-1 text-sm text-blue-700 hover:underline">
        ← All Issues
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm text-gray-400">{formatIssueNumber(issue.issue_number)}</span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[issue.status]}`}>
            {issue.status.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${SEVERITY_COLORS[issue.severity]}`}>
            {issue.severity.toUpperCase()}
          </span>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {issue.title ?? issue.category?.name ?? 'Civic Issue'}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Official Sakaala ID: <span className="font-mono font-bold text-blue-900">JD-2026-VIJ-{String(issue.issue_number).padStart(5, '0')}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <GrievanceReceiptModal issue={issue} />
            <UpvoteButton issueId={issue.id} initialCount={issue.upvote_count ?? 0} />
          </div>
        </div>
        {issue.description && (
          <p className="mt-3 text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-200">
            {issue.description}
          </p>
        )}
      </div>

      {/* Escalation Banner */}
      {issue.escalation !== 'none' && (
        <div className={`mb-4 rounded-xl border p-4 ${ESCALATION_COLORS[issue.escalation]}`}>
          <p className="font-semibold">
            ⚠️ {issue.escalation === 'level_1' ? 'Escalated to Department Head' :
              issue.escalation === 'level_2' ? 'Escalated to Municipal Commissioner' :
              "Escalated to Deputy Commissioner's Office"}
          </p>
          <p className="text-sm mt-0.5">This issue has been automatically escalated due to SLA breach.</p>
        </div>
      )}

      {/* SLA Status */}
      <div className={`mb-6 rounded-xl border p-4 ${
        sla.isOverdue ? 'border-red-300 bg-red-50' :
        sla.urgency === 'critical' ? 'border-orange-300 bg-orange-50' :
        'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Resolution Deadline (Sakaala Act)</p>
            <p className={`mt-0.5 font-bold ${
              sla.isOverdue ? 'text-red-700' :
              sla.urgency === 'critical' ? 'text-orange-700' : 'text-gray-700'
            }`}>
              {sla.text}
            </p>
          </div>
          {sla.isOverdue && <span className="text-2xl">🚨</span>}
        </div>
      </div>

      {/* Interactive Before & After Resolution Slider */}
      {reportPhoto && resolutionPhoto && (
        <div className="mb-6">
          <BeforeAfterSlider
            beforeImage={reportPhoto.public_url}
            afterImage={resolutionPhoto.public_url}
          />
        </div>
      )}

      {/* Photos Grid: Supports Multiple Report Photos */}
      <div className="mb-6 space-y-4">
        {reportPhotos.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Report Photo Evidence ({reportPhotos.length} photo{reportPhotos.length > 1 ? 's' : ''})
            </p>
            <div className={`grid gap-4 ${reportPhotos.length > 1 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
              {reportPhotos.map((photo: any, idx: number) => (
                <div key={photo.id || idx} className="overflow-hidden rounded-xl border border-gray-200 bg-slate-50 shadow-2xs">
                  <img
                    src={photo.public_url}
                    alt={`Defect photo ${idx + 1}`}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-2 bg-white flex items-center justify-between text-[11px] font-mono text-slate-500 border-t border-gray-100">
                    <span className="font-semibold text-slate-700">Photo {idx + 1}</span>
                    {photo.capture_lat && (
                      <span>📍 {photo.capture_lat.toFixed(4)}, {photo.capture_lng?.toFixed(4)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {resolutionPhoto && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">Official Resolution Proof</p>
            <div className="overflow-hidden rounded-xl border border-emerald-200 shadow-xs max-w-md">
              <img
                src={resolutionPhoto.public_url}
                alt="Resolution photo"
                className="w-full object-cover max-h-72"
              />
              <div className="p-2.5 bg-emerald-50 text-xs text-emerald-700 font-medium border-t border-emerald-100">
                ✓ Geo-tagged official repair evidence
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div className="mb-6 grid gap-4 rounded-xl border border-gray-200 bg-white p-5 sm:grid-cols-2">
        {[
          { label: 'Category', value: issue.category?.name },
          { label: 'Ward', value: issue.ward ? `Ward ${issue.ward.ward_number}: ${issue.ward.name}` : 'Unknown' },
          { label: 'Department', value: issue.department?.name ?? 'Unassigned' },
          { label: 'Reported', value: timeAgo(issue.reported_at) },
          { label: 'Supporters', value: `👍 ${issue.upvote_count}` },
          { label: 'Location', value: issue.address ?? 'See map' },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs font-medium text-gray-500">{label}</p>
            <p className="mt-0.5 text-sm font-medium text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Verify CTA */}
      {issue.status === 'resolution_claimed' && (
        <div className="mb-6 rounded-xl border-2 border-blue-300 bg-blue-50 p-5">
          <h3 className="font-bold text-blue-900">✅ Resolution Claimed — Your Verification Needed</h3>
          <p className="mt-1 text-sm text-blue-700">
            The department says this issue is fixed. Please check and confirm.
          </p>
          <Link
            href={`/verify/${issue.id}`}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-800 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-900"
          >
            Verify Resolution →
          </Link>
        </div>
      )}

      {/* Timeline */}
      <div className="mb-6">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Timeline</h2>
        <div className="relative flex flex-col gap-0">
          {issue.timeline?.map((event: any, i: number) => (
            <div key={event.id} className="relative flex gap-3 pb-6 last:pb-0">
              {i < issue.timeline.length - 1 && (
                <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200" />
              )}
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm z-10">
                {TIMELINE_ICONS[event.event_type] ?? '🔵'}
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
