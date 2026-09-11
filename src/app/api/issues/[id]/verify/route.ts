import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import {
  checkRateLimit,
  getClientIp,
  sanitizeInput,
  validateCoordinates,
} from '@/lib/security'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(request)
  const { id } = await params

  // 1. Rate Limit Verification Submissions (Max 15 per 15 minutes per IP)
  const rateResult = checkRateLimit(`verify:${ip}`, 15, 15 * 60 * 1000)
  if (!rateResult.allowed) {
    return NextResponse.json(
      { error: 'Verification submission limit reached. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateResult.resetSeconds) } }
    )
  }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { is_verified, comment, verification_lat, verification_lng } = body

  // 2. Input Sanitization & Coordinate Validation
  const cleanedComment = comment ? sanitizeInput(comment, 1000) : null
  const coords = validateCoordinates(verification_lat, verification_lng)
  const safeLat = coords.valid ? coords.lat : null
  const safeLng = coords.valid ? coords.lng : null

  // Verify the user is the original reporter
  const { data: issue } = await supabase
    .from('issues')
    .select('reporter_id, status')
    .eq('id', id)
    .single()

  if (!issue) {
    return NextResponse.json({ error: 'Issue not found' }, { status: 404 })
  }

  if (issue.reporter_id !== user.id) {
    return NextResponse.json({ error: 'Only the original reporter can verify' }, { status: 403 })
  }

  if (issue.status !== 'resolution_claimed') {
    return NextResponse.json({ error: 'Issue is not awaiting verification' }, { status: 400 })
  }

  // Record verification
  const { error: verifyError } = await supabase.from('verifications').insert({
    issue_id: id,
    verifier_id: user.id,
    is_verified: Boolean(is_verified),
    comment: cleanedComment,
    verification_lat: safeLat,
    verification_lng: safeLng,
  })

  if (verifyError) {
    return NextResponse.json({ error: verifyError.message }, { status: 500 })
  }

  // Update issue status
  const newStatus = is_verified ? 'verified' : 'disputed'
  const { error: updateError } = await supabase
    .from('issues')
    .update({ status: newStatus })
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // Log to timeline
  await supabase.from('issue_timeline').insert({
    issue_id: id,
    event_type: 'status_change',
    old_status: 'resolution_claimed',
    new_status: newStatus,
    actor_id: user.id,
    actor_role: 'citizen',
    description: is_verified
      ? 'Citizen confirmed: issue is resolved ✅'
      : `Citizen disputed: issue not resolved ❌ ${comment ? `— "${comment}"` : ''}`,
  })

  return NextResponse.json({ status: newStatus })
}
