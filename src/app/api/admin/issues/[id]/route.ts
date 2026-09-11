import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  const allowedRoles = ['official', 'dept_head', 'commissioner', 'admin']
  if (!profile || !allowedRoles.includes(profile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { action, assigned_to_id, note } = body

  const statusMap: Record<string, string> = {
    acknowledge: 'acknowledged',
    start_work: 'in_progress',
    claim_resolution: 'resolution_claimed',
  }

  const newStatus = statusMap[action]
  if (!newStatus) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  const updateData: Record<string, unknown> = { status: newStatus }
  if (assigned_to_id) updateData.assigned_to_id = assigned_to_id

  const { error } = await supabase
    .from('issues')
    .update(updateData)
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Log to timeline
  await supabase.from('issue_timeline').insert({
    issue_id: id,
    event_type: 'status_change',
    new_status: newStatus,
    actor_id: user.id,
    actor_role: profile.role,
    description: note ?? `Status updated to ${newStatus} by official`,
  })

  return NextResponse.json({ status: newStatus })
}
