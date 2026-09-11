import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIp } from '@/lib/security'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(request)
  const { id } = await params

  // 1. Rate Limit Upvotes: Max 30 upvotes per 10 minutes per IP to prevent vote manipulation bots
  const rateResult = checkRateLimit(`upvote:${ip}`, 30, 10 * 60 * 1000)
  if (!rateResult.allowed) {
    return NextResponse.json(
      { error: 'Upvote rate limit exceeded. Please wait a few minutes before supporting more issues.' },
      { status: 429, headers: { 'Retry-After': String(rateResult.resetSeconds) } }
    )
  }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if already upvoted
  const { data: existing } = await supabase
    .from('upvotes')
    .select('id')
    .eq('issue_id', id)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    // Remove upvote (toggle)
    await supabase.from('upvotes').delete()
      .eq('issue_id', id).eq('user_id', user.id)
    return NextResponse.json({ action: 'removed' })
  }

  // Add upvote
  const { error } = await supabase.from('upvotes').insert({
    issue_id: id,
    user_id: user.id,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ action: 'added' })
}

