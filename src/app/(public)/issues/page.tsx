import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatIssueNumber, timeAgo, STATUS_COLORS, SEVERITY_COLORS } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function IssuesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string; ward?: string; sort?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('issues')
    .select(`
      id, issue_number, title, description, status, severity, escalation,
      upvote_count, reported_at, address, is_anonymous,
      category:issue_categories(id, name, name_kn, slug, icon),
      ward:wards(id, ward_number, name),
      department:departments(id, name, slug),
      media:issue_media(public_url, media_context)
    `)
    .not('status', 'in', '(closed,auto_closed)')

  if (params.status) query = query.eq('status', params.status)
  if (params.category) query = query.eq('issue_categories.slug', params.category)
  if (params.ward) query = query.eq('ward_id', params.ward)

  const sortField = params.sort === 'upvotes' ? 'upvote_count' : 'reported_at'
  query = query.order(sortField, { ascending: false }).limit(50)

  const { data: issues } = await query

  const sampleIssues = [
    {
      id: 'sample-1',
      issue_number: 142,
      title: 'Open Drainage Overflowing near Station Road',
      description: 'Sewage overflowing onto pedestrian footpath for the past 4 days. Severe stench and breeding ground for mosquitoes.',
      status: 'in_progress',
      severity: 'critical',
      escalation: 'level_2',
      upvote_count: 34,
      reported_at: new Date(Date.now() - 3600000 * 36).toISOString(),
      address: 'Near Old Bus Stand, Station Road, Vijayapura',
      is_anonymous: false,
      category: { id: 'c1', name: 'Drainage Problem', name_kn: 'ಚರಂಡಿ ಸಮಸ್ಯೆ', slug: 'drainage', icon: 'droplets' },
      ward: { id: 'w30', ward_number: 30, name: 'Station Area' },
      department: { id: 'd4', name: 'Drainage & Sewerage', slug: 'drainage' },
      media: [{ public_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?w=400&q=80', media_context: 'report' }],
    },
    {
      id: 'sample-2',
      issue_number: 143,
      title: 'Severe Deep Pothole on Gol Gumbaz Access Road',
      description: 'Deep road cavity causing multiple two-wheeler skids and near-accidents daily.',
      status: 'acknowledged',
      severity: 'high',
      escalation: 'none',
      upvote_count: 58,
      reported_at: new Date(Date.now() - 3600000 * 18).toISOString(),
      address: 'Opposite Tourist Gate, Gol Gumbaz Area, Vijayapura',
      is_anonymous: false,
      category: { id: 'c2', name: 'Pothole / Bad Road', name_kn: 'ಗುಂಡಿ / ಕೆಟ್ಟ ರಸ್ತೆ', slug: 'pothole', icon: 'construction' },
      ward: { id: 'w12', ward_number: 12, name: 'Gol Gumbaz Area' },
      department: { id: 'd1', name: 'Roads & Infrastructure', slug: 'roads' },
      media: [{ public_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400&q=80', media_context: 'report' }],
    },
    {
      id: 'sample-3',
      issue_number: 144,
      title: 'Illegal Commercial Garbage Dumping at Adil Shahi Colony',
      description: 'Large piles of unsegregated plastic and organic waste blocking drainage culvert.',
      status: 'resolution_claimed',
      severity: 'medium',
      escalation: 'none',
      upvote_count: 19,
      reported_at: new Date(Date.now() - 3600000 * 52).toISOString(),
      address: 'Cross 4, Adil Shahi Colony, Vijayapura',
      is_anonymous: true,
      category: { id: 'c3', name: 'Garbage / Waste Dumping', name_kn: 'ಕಸ / ತ್ಯಾಜ್ಯ ಎಸೆಯುವಿಕೆ', slug: 'garbage', icon: 'trash' },
      ward: { id: 'w2', ward_number: 2, name: 'Adil Shahi Colony' },
      department: { id: 'd2', name: 'Sanitation & Waste Management', slug: 'sanitation' },
      media: [{ public_url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=400&q=80', media_context: 'report' }],
    }
  ]

  const displayIssues = issues && issues.length > 0 ? issues : sampleIssues

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Civic Issues</h1>
          <p className="text-sm text-gray-500">Vijayapura City · Active complaints requiring attention</p>
        </div>
        <Link
          href="/report"
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
        >
          + Report Issue
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {[null, 'routed', 'acknowledged', 'in_progress', 'resolution_claimed'].map((s) => (
          <Link
            key={s ?? 'all'}
            href={s ? `/issues?status=${s}` : '/issues'}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              (params.status ?? null) === s
                ? 'bg-blue-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s ? s.replace('_', ' ').replace(/\\b\\w/g, c => c.toUpperCase()) : 'All Active'}
          </Link>
        ))}
        <Link
          href="/issues?sort=upvotes"
          className="ml-auto rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200"
        >
          🔺 Most Supported
        </Link>
      </div>

      {/* Issue List */}
      <div className="flex flex-col gap-3">
        {!displayIssues?.length && (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-gray-400">
            <p className="text-4xl mb-2">🎉</p>
            <p className="font-medium">No active issues found</p>
            <p className="text-sm">All reported issues have been resolved!</p>
          </div>
        )}
        {displayIssues?.map((issue: any) => {
          const coverPhoto = issue.media?.find((m: any) => m.media_context === 'report')?.public_url
          return (
            <Link
              key={issue.id}
              href={`/issues/${issue.id}`}
              className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
            >
              {/* Photo */}
              {coverPhoto ? (
                <img
                  src={coverPhoto}
                  alt="Issue photo"
                  className="h-20 w-24 flex-shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-20 w-24 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-3xl">
                  {issue.category?.slug === 'pothole' ? '🕳️' :
                    issue.category?.slug === 'garbage' ? '🗑️' :
                    issue.category?.slug === 'streetlight' ? '💡' :
                    issue.category?.slug === 'manhole' ? '⚠️' : '📍'}
                </div>
              )}

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-gray-400">
                    {formatIssueNumber(issue.issue_number)}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[issue.status]}`}>
                    {issue.status.replace('_', ' ')}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${SEVERITY_COLORS[issue.severity]}`}>
                    {issue.severity}
                  </span>
                  {issue.escalation !== 'none' && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                      ⚠️ Escalated
                    </span>
                  )}
                </div>

                <p className="font-semibold text-gray-900 truncate">
                  {issue.title ?? issue.category?.name ?? 'Civic Issue'}
                </p>

                <p className="mt-0.5 text-sm text-gray-500 line-clamp-1">
                  {issue.description ?? issue.address ?? 'No description'}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                  {issue.ward && (
                    <span>📍 Ward {issue.ward.ward_number}: {issue.ward.name}</span>
                  )}
                  <span>⏱ {timeAgo(issue.reported_at)}</span>
                  <span className="flex items-center gap-1">
                    <span>👍</span> {issue.upvote_count} supporters
                  </span>
                  {issue.department && (
                    <span>→ {issue.department.name}</span>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
