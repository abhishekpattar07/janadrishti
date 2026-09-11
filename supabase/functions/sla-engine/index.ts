// ============================================
// JanaDrishti — SLA Engine + Auto-Escalation
// Runs as a Supabase Edge Function on a cron
// Deploy: supabase functions deploy sla-engine
// Schedule: every 15 minutes via pg_cron
// ============================================

// deno-lint-ignore-file no-explicit-any

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async (_req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  const now = new Date().toISOString()
  const results: string[] = []

  // ---- 1. Escalate L1: routed > sla_acknowledge_by ----
  const { data: unacknowledged, error: e1 } = await supabase
    .from('issues')
    .select('id, issue_number, category:issue_categories(escalation_l1_hours)')
    .eq('status', 'routed')
    .eq('escalation', 'none')
    .lt('sla_acknowledge_by', now)

  if (e1) results.push(`Error L1 query: ${e1.message}`)

  for (const issue of (unacknowledged ?? [])) {
    const { error } = await supabase
      .from('issues')
      .update({ escalation: 'level_1' })
      .eq('id', issue.id)

    if (!error) {
      await supabase.from('escalations').insert({
        issue_id: issue.id,
        level: 'level_1',
        triggered_by: 'system',
      })
      await supabase.from('issue_timeline').insert({
        issue_id: issue.id,
        event_type: 'escalation',
        new_status: 'routed',
        description: '⚠️ Auto-escalated to Department Head — SLA acknowledgment deadline breached',
      })
      results.push(`Escalated L1: JD-${String(issue.issue_number).padStart(5,'0')}`)
    }
  }

  // ---- 2. Escalate L2: acknowledged/in_progress > sla_begin_work_by (already L1) ----
  const { data: stalledL1 } = await supabase
    .from('issues')
    .select('id, issue_number')
    .in('status', ['acknowledged', 'in_progress'])
    .eq('escalation', 'level_1')
    .lt('sla_complete_by', now)

  for (const issue of (stalledL1 ?? [])) {
    const { error } = await supabase
      .from('issues')
      .update({ escalation: 'level_2' })
      .eq('id', issue.id)

    if (!error) {
      await supabase.from('escalations').insert({
        issue_id: issue.id,
        level: 'level_2',
        triggered_by: 'system',
      })
      await supabase.from('issue_timeline').insert({
        issue_id: issue.id,
        event_type: 'escalation',
        description: '🚨 Auto-escalated to Municipal Commissioner — SLA completion deadline breached',
      })
      results.push(`Escalated L2: JD-${String(issue.issue_number).padStart(5,'0')}`)
    }
  }

  // ---- 3. Escalate L3: L2 issues that are still open beyond 2x SLA ----
  const { data: stalledL2 } = await supabase
    .from('issues')
    .select('id, issue_number, sla_complete_by')
    .in('status', ['acknowledged', 'in_progress', 'routed'])
    .eq('escalation', 'level_2')

  for (const issue of (stalledL2 ?? [])) {
    if (!issue.sla_complete_by) continue
    const slaDate = new Date(issue.sla_complete_by)
    const slaDiff = new Date().getTime() - slaDate.getTime()
    const slaHours = slaDiff / 3600000

    // Escalate to DC if > 2x SLA overdue
    if (slaHours > (24 * 14)) { // 14 days overdue
      await supabase.from('issues').update({ escalation: 'level_3' }).eq('id', issue.id)
      await supabase.from('escalations').insert({
        issue_id: issue.id,
        level: 'level_3',
        triggered_by: 'system',
      })
      await supabase.from('issue_timeline').insert({
        issue_id: issue.id,
        event_type: 'escalation',
        description: '🆘 Auto-escalated to DC Office — Severely overdue (14+ days)',
      })
      results.push(`Escalated L3 (DC): JD-${String(issue.issue_number).padStart(5,'0')}`)
    }
  }

  // ---- 4. Auto-close: resolution_claimed > 72h with no citizen response ----
  const autoCloseThreshold = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()
  const { data: pendingVerify } = await supabase
    .from('issues')
    .select('id, issue_number')
    .eq('status', 'resolution_claimed')
    .lt('resolution_claimed_at', autoCloseThreshold)

  for (const issue of (pendingVerify ?? [])) {
    await supabase.from('issues').update({ status: 'auto_closed' }).eq('id', issue.id)
    await supabase.from('issue_timeline').insert({
      issue_id: issue.id,
      event_type: 'status_change',
      old_status: 'resolution_claimed',
      new_status: 'auto_closed',
      description: '✅ Auto-closed: No citizen dispute within 72 hours of resolution claim',
    })
    results.push(`Auto-closed: JD-${String(issue.issue_number).padStart(5,'0')}`)
  }

  const summary = {
    timestamp: now,
    actions: results,
    total: results.length,
  }

  console.log('SLA Engine run:', JSON.stringify(summary, null, 2))

  return new Response(JSON.stringify(summary), {
    headers: { 'Content-Type': 'application/json' },
  })
})
