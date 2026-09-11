import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { timeAgo, formatIssueNumber, STATUS_COLORS } from '@/lib/utils'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function WardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: ward } = await supabase
    .from('wards')
    .select('*')
    .eq('id', id)
    .single()

  if (!ward) notFound()

  const { data: issues } = await supabase
    .from('issues')
    .select(`
      id, issue_number, title, status, severity, upvote_count, reported_at,
      category:issue_categories(name, slug)
    `)
    .eq('ward_id', id)
    .not('status', 'in', '(closed,auto_closed)')
    .order('reported_at', { ascending: false })
    .limit(30)

  const { count: totalCount } = await supabase
    .from('issues')
    .select('id', { count: 'exact', head: true })
    .eq('ward_id', id)

  const { count: resolvedCount } = await supabase
    .from('issues')
    .select('id', { count: 'exact', head: true })
    .eq('ward_id', id)
    .in('status', ['closed', 'verified'])

  const resolutionRate = totalCount && totalCount > 0
    ? Math.round(((resolvedCount ?? 0) / totalCount) * 100)
    : 0

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/wards" className="mb-4 inline-flex items-center gap-1 text-sm text-blue-700 hover:underline">
        ← All Wards
      </Link>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Ward {ward.ward_number}</p>
          <h1 className="text-2xl font-bold text-gray-900">{ward.name}</h1>
          {ward.name_kn && <p className="text-gray-500">{ward.name_kn}</p>}
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-800">
          {ward.ward_number}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Total Issues', value: (totalCount ?? 0).toString(), color: 'text-blue-800' },
          { label: 'Active Issues', value: (issues?.length ?? 0).toString(), color: 'text-orange-700' },
          { label: 'Resolution Rate', value: `${resolutionRate}%`, color: resolutionRate >= 70 ? 'text-green-700' : 'text-orange-700' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm">
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {ward.corporator_name && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-xs font-medium text-gray-500">Ward Corporator</p>
          <p className="font-semibold text-gray-900">{ward.corporator_name}</p>
          {ward.corporator_phone && <p className="text-sm text-gray-500">{ward.corporator_phone}</p>}
        </div>
      )}

      {/* Issues */}
      <h2 className="mb-4 text-xl font-bold text-gray-900">Active Issues</h2>
      <div className="flex flex-col gap-3">
        {!issues?.length && (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-gray-400">
            <p className="text-4xl mb-2">🎉</p>
            <p>No active issues in Ward {ward.ward_number}</p>
          </div>
        )}
        {issues?.map((issue: any) => (
          <Link
            key={issue.id}
            href={`/issues/${issue.id}`}
            className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 hover:border-blue-300 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="font-mono text-xs text-gray-400">{formatIssueNumber(issue.issue_number)}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[issue.status]}`}>
                  {issue.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="font-medium text-gray-900 truncate">{issue.title ?? issue.category?.name}</p>
              <div className="mt-1 flex gap-3 text-xs text-gray-400">
                <span>{timeAgo(issue.reported_at)}</span>
                <span>👍 {issue.upvote_count}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
