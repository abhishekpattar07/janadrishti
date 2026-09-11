import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const [totalRes, openRes, resolvedRes, escalatedRes] = await Promise.all([
    supabase.from('issues').select('id', { count: 'exact', head: true }),
    supabase.from('issues').select('id', { count: 'exact', head: true })
      .not('status', 'in', '(closed,verified,auto_closed)'),
    supabase.from('issues').select('id', { count: 'exact', head: true })
      .in('status', ['closed', 'verified']),
    supabase.from('issues').select('id', { count: 'exact', head: true })
      .neq('escalation', 'none')
      .not('status', 'in', '(closed,verified,auto_closed)'),
  ])

  const total = totalRes.count ?? 0
  const open = openRes.count ?? 0
  const resolved = resolvedRes.count ?? 0
  const escalated = escalatedRes.count ?? 0
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0

  return NextResponse.json({
    total,
    open,
    resolved,
    escalated,
    resolutionRate,
  }, {
    headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' }
  })
}
